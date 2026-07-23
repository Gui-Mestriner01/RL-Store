import React, { useState } from 'react'; 
import ProductCard from './ProductCard';
import ProductModal from './ProductModal'; 

import { produtosDaLoja } from '../produtos';

const ProductGrid = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    // OLHA O id="catalogo" ADICIONADO AQUI NESTA LINHA:
    <section id="catalogo" className="px-8 md:px-16 py-12 max-w-[1200px] mx-auto">
      
      <div className="flex flex-wrap justify-center gap-8 md:gap-12">
        {produtosDaLoja.map((product) => (
          <div key={product.id} className="w-full max-w-[260px]">
            <ProductCard 
              product={product} 
              onClick={() => setSelectedProduct(product)} 
            />
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-16">
        <button className="px-8 py-3 bg-[#a88a87] text-white rounded-full font-bold tracking-wide hover:bg-[#9c6662] transition-colors shadow-md font-sans">
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