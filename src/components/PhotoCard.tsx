import React from 'react';

interface Photo {
  id: string;
  name: string;
  url: string;
}

interface PhotoCardProps {
  photo: Photo;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo }) => {
  return (
    <div className="w-full h-full bg-black rounded-3xl text-white relative overflow-hidden border border-white/20 shadow-2xl aspect-[3/4]">
      <img
        src={photo.url}
        alt={photo.name}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      <div className="relative z-10 flex flex-col h-full p-6 justify-end">
        <h3 className="text-xl font-bold tracking-wider [text-shadow:0_2px_4px_rgba(0,0,0,0.7)]">
          {photo.name}
        </h3>
      </div>
    </div>
  );
};

export default PhotoCard;
