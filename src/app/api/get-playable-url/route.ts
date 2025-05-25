import { Innertube } from 'youtubei.js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const youtube = await Innertube.create();
    const data = [];

    for (let id of body.ids || []) {
      try {
        const info = await youtube.getBasicInfo(id);
        const format = info.chooseFormat({ type: 'audio', quality: 'best' });
        const url = format?.decipher(youtube.session.player);
        if (!url) {
          throw new Error(`Failed to decipher URL for video ID: ${id}`);
        }
        data.push({
          id,
          url,
          metadata: info,
        });
      } catch (error) {
        console.error(`Error processing video ID ${id}:`, error);
        data.push({
          id,
          error: `Failed to retrieve playable URL: ${error.message}`,
        });
      }
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}