# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.17.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Next.js"

# Next.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Add retry function for network-dependent commands
SHELL ["/bin/bash", "-c"]
RUN echo 'retry_command() { \
    local retries=3; \
    local count=0; \
    until command "$@" || [ $count -eq $retries ]; do \
        echo "Command failed, attempt $((count+1)) of $retries"; \
        count=$((count+1)); \
        sleep $((count*2)); \
    done; \
    [ $count -lt $retries ]; \
}' >> /usr/local/bin/retry_command \
    && chmod +x /usr/local/bin/retry_command

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python-is-python3

# Install node modules with retry mechanism
COPY --link package.json yarn.lock ./
RUN source /usr/local/bin/retry_command && \
    retry_command "command yarn install --frozen-lockfile --production=false --network-timeout 100000"

# Copy application code
COPY --link . .

# Build application with retry mechanism
RUN source /usr/local/bin/retry_command && \
    retry_command "command yarn run build"

# Remove development dependencies with retry mechanism
RUN source /usr/local/bin/retry_command && \
    retry_command "command yarn install --production=true --network-timeout 100000"

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Add healthcheck using full path to curl
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD /usr/bin/curl -f http://localhost:3000/ || exit 1

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "yarn", "run", "start" ]