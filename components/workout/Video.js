import { YouTubeEmbed } from "@next/third-parties/google";
import { getQueryValue } from '@/utils/utils';

const VideoContainer = ({ video }) => {
  if (!video) return null;

  const name = video.name || video.type?.name || '';
  const rawLink = video.link || video.type?.link || '';
  const link = typeof rawLink === 'string' ? rawLink.trim() : '';

  const videoId = getQueryValue(link);

  // If neither a valid YouTube video nor an external video link exists, skip
  if (!videoId && !link) return null;

  return (
    <div className="flex flex-col shrink-0">
      {name && <p className="text-xs font-bold mb-1">{name.toUpperCase()}</p>}
      {videoId ? (
        <YouTubeEmbed videoid={videoId} width={400} />
      ) : (
        <video
          controls
          playsInline
          preload="metadata"
          className="w-[400px] aspect-video rounded-md bg-black object-contain"
        >
          <source src={encodeURI(link)} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default VideoContainer;
