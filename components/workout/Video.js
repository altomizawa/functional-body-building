import { YouTubeEmbed } from "@next/third-parties/google";
import { getQueryValue } from '@/utils/utils';

const VideoContainer = ({ video }) => {
  if (!video) return null;

  const name = video.name || video.type?.name || '';
  const link = video.link || video.type?.link || '';
  const videoId = getQueryValue(link);

  if (!videoId) return null;

  return (
    <div className="flex flex-col">
      {name && <p className="text-xs font-bold">{name.toUpperCase()}</p>}
      <YouTubeEmbed videoid={videoId} width={400} />
    </div>
  );
};

export default VideoContainer;
