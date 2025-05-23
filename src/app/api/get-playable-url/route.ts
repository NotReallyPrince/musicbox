import { Innertube } from 'youtubei.js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const youtube = await Innertube.create()
  let data = []
  
  for (let id of body.ids || []) {
    const info = await youtube.getBasicInfo(id)
    const format = info.chooseFormat({ type: 'audio', quality: 'best' })
    data.push({
      id,
      url: format?.decipher(youtube.session.player),
      metadata: info,
    })
  }
  
  return NextResponse.json({ data })
}