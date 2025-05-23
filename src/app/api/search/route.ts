import { Innertube } from 'youtubei.js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const youtube = await Innertube.create()
  const results = await youtube.search(body.query)
  return NextResponse.json(results)
}