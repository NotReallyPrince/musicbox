import { Innertube } from 'youtubei.js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const youtube = await Innertube.create({
    location: 'VN'
  })
  const results = await youtube.music.getExplore()
  return NextResponse.json(results)
}