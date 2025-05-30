import { Innertube } from 'youtubei.js'
import { NextResponse } from 'next/server'
import { formatTime } from "@/utils/player.utils"

export async function POST(request: Request) {
  const body = await request.json()
  const youtube = await Innertube.create()
  const data = await youtube.getBasicInfo(body.id)
  
  const track: YouTubeTrack = {
    id: data.basic_info.id!,
    author: {
      name: data.basic_info.author || "",
      id: data.basic_info.channel_id! || "",
    },
    title: {
      text: data.basic_info.title!
    },
    duration: {
      seconds: data.basic_info.duration || 0,
      text: formatTime(data.basic_info.duration || 0)
    },
    published: {
      text: data.basic_info.author!,
    },
    short_view_count: {
      text: (data.basic_info.view_count || 0).toString(),
    },
    thumbnails: data.basic_info.thumbnail || [],
    view_count: {
      text: (data.basic_info.view_count || 0).toString(),
    },
  }
  
  return NextResponse.json({ data: track })
}