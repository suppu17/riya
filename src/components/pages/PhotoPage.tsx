import React from 'react';
import PhotoCard from '../PhotoCard';
import { Plus } from 'lucide-react';

const photos = [
  { id: '1', name: 'Model 1', url: 'https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/Model_1.png' },
  { id: '2', name: 'Model 2', url: 'https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/Model_2.png' },
  { id: '3', name: 'Model 3', url: 'https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/Model_3.png' },
  { id: '4', name: 'Model 4', url: 'https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/Model_4.png' },
  { id: '5', name: 'Model 5', url: 'https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/Model_5.png' },
  { id: '6', name: 'Model 6', url: 'https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/Model_6.png' },
  { id: '7', name: 'Model 7', url: 'https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/Model_7.png' },
  { id: '8', name: 'Model 8', url: 'https://assetsimagesai.s3.us-east-1.amazonaws.com/model_pics/Model_8.png' },
];

const PhotoPage: React.FC = () => {
  const handleUploadClick = () => {
    // TODO: Implement S3 upload functionality
    alert('Upload functionality to be implemented.');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-wider">Photo Gallery</h1>
        <button 
          onClick={handleUploadClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-300">
          <Plus className="mr-2 h-5 w-5" />
          Upload Photo
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map(photo => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </div>
    </div>
  );
};

export default PhotoPage;
