import React from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

interface PostCardProps {
  post: {
    id: string;
    username: string;
    avatar: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    caption: string;
    likes: number;
    comments: number;
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg my-4 overflow-hidden">
      <div className="p-4 flex items-center">
        <img src={post.avatar} alt={`${post.username}'s avatar`} className="w-10 h-10 rounded-full mr-4" />
        <span className="font-semibold text-white">{post.username}</span>
      </div>

      <div>
        {post.mediaType === 'image' ? (
          <img src={post.mediaUrl} alt="Post content" className="w-full" />
        ) : (
          <VideoPlayer src={post.mediaUrl} />
        )}
      </div>

      <div className="p-4 text-white">
        <div className="flex items-center space-x-4 mb-2">
          <button aria-label="Like post" className="flex items-center space-x-2 hover:text-red-500 transition-colors">
            <Heart className="w-6 h-6" />
            <span>{post.likes}</span>
          </button>
          <button aria-label="Comment on post" className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
            <MessageCircle className="w-6 h-6" />
            <span>{post.comments}</span>
          </button>
          <button aria-label="Share post" className="hover:text-green-400 transition-colors">
            <Share2 className="w-6 h-6" />
          </button>
        </div>

        <div>
          <p className="text-gray-300">
            <span className="font-semibold text-white">{post.username}</span> {post.caption}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
