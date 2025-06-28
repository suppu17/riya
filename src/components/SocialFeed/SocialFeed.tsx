import React from 'react';
import PostCard from './PostCard';

export interface Post {
  id: string;
  username: string;
  avatar: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string;
  likes: number;
  comments: number;
}

interface SocialFeedProps {
  posts: Post[];
}

const SocialFeed: React.FC<SocialFeedProps> = ({ posts }) => {
  return (
    <div className="w-full max-w-lg mx-auto py-4 h-[70vh] overflow-y-auto">
      {posts.length > 0 ? (
        posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <div className="text-center text-gray-400 py-20">
          <p>No posts yet. Be the first to share!</p>
        </div>
      )}
    </div>
  );
};

export default SocialFeed;
