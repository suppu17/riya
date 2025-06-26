import React from 'react';
import CategoryCard from '../CategoryCard';
import { Grid } from 'lucide-react';

const CategoriesPage: React.FC = () => {
  const categories = [
    { name: 'Neural Tech', image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg', count: 15 },
    { name: 'Smart Audio', image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg', count: 24 },
    { name: 'Wearables', image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg', count: 18 },
    { name: 'Home AI', image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg', count: 12 },
    { name: 'Photography', image: 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg', count: 8 },
    { name: 'Gaming', image: 'https://images.pexels.com/photos/7207120/pexels-photo-7207120.jpeg', count: 22 },
    { name: 'Mobility', image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg', count: 14 },
    { name: 'Health Tech', image: 'https://images.pexels.com/photos/7207120/pexels-photo-7207120.jpeg', count: 19 }
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Grid className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">All Categories</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;