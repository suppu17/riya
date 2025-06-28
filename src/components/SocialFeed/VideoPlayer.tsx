import React from 'react';

interface VideoPlayerProps {
  src: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  return (
    <video controls src={src} className="w-full">
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
