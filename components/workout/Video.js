import { YouTubeEmbed } from "@next/third-parties/google";
import { getQueryValue, createVideoArray } from '@/utils/utils';

const VideoContainer = ({video}) => {
  return (
    <div  className="flex flex-col">
      <p className="text-xs font-bold">{video.name.toUpperCase()}</p>
      <YouTubeEmbed videoid={getQueryValue(video.link)} width={400} />
    </div>
)
}

export default VideoContainer
