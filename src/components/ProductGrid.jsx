import React, { useState } from 'react'; 
import ProductCard from './ProductCard';
import ProductModal from './ProductModal'; 

import { produtosDaLoja } from '../produtos';

const ProductGrid = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <section className="px-8 md:px-16 py-8 max-w-[1100px] mx-auto">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-12">
        {/* 2. Agora o map varre a sua lista nova "produtosDaLoja" */}
        {produtosDaLoja.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onClick={() => setSelectedProduct(product)} 
          />
        ))}
      </div>
      
      <div className="flex justify-center mt-16">
        <button className="px-8 py-3 bg-[#a88a87] text-white rounded-full font-medium tracking-wide hover:bg-[#9c6662] transition-colors shadow-md">
          VER MAIS PRODUTOS
        </button>
      </div>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

    </section>
  );
};

export default ProductGrid;