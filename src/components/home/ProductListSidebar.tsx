import React from 'react';
import { useShopping } from '../../contexts/ShoppingContext';
import { ArrowLeft } from 'lucide-react';
import ProductListCard from '../ProductListCard';
import { Product } from '../../contexts/ShoppingContext';

const ProductListSidebar: React.FC = () => {
  const { products, currentCategory, selectedProduct, smoothProductChange } = useShopping();

  const categoryProducts = products.filter(
    (p: Product) => p.category === currentCategory
  );

  if (!selectedProduct) {
    return null; // Or a loading state
  }

  return (
    <div className="col-span-3">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
        <div className="flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4 text-white/60" />
          <span className="text-white/80 text-sm font-medium">
            All {currentCategory.toLowerCase()}
          </span>
        </div>

        <div className="space-y-4">
          {categoryProducts.slice(0, 7).map((product) => (
            <ProductListCard
              key={product.id}
              product={product}
              isSelected={selectedProduct.id === product.id}
              onClick={() => smoothProductChange(product)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductListSidebar;
