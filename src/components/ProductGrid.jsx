import React, { useState } from 'react'; 
import ProductCard from './ProductCard';
import ProductModal from './ProductModal'; 

import { produtosDaLoja } from '../produtos';

// 1. O componente agora recebe a categoria que o botão mandou (activeCategory)
const ProductGrid = ({ activeCategory = 'TODOS' }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 2. O Cérebro do Filtro: 
  // Se for 'TODOS', mostra a loja inteira. Se não, filtra só a categoria clicada!
  const roupasFiltradas = activeCategory === 'TODOS' 
    ? produtosDaLoja 
    : produtosDaLoja.filter(product => 
        // Convertendo tudo para minúsculo para garantir que "BLUSAS" ache "blusas"
        product.categoria?.toLowerCase() === activeCategory.toLowerCase()
      );

  return (
    <section id="catalogo" className="px-8 md:px-16 py-12 max-w-[1200px] mx-auto">
      
      {/* 3. Se tiver roupas nessa categoria, desenha a grade normalmente */}
      {roupasFiltradas.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {roupasFiltradas.map((product) => (
            <div key={product.id} className="w-full max-w-[260px]">
              <ProductCard 
                product={product} 
                onClick={() => setSelectedProduct(product)} 
              />
            </div>
          ))}
        </div>
      ) : (
        // MENSAGEM ELEGANTE SE A CATEGORIA ESTIVER VAZIA:
        <div className="flex flex-col items-center justify-center text-center py-20 gap-4 animate-fade-in">
          <div className="text-5xl text-[#dfcbc9] mb-2">✧</div>
          <h3 className="text-[#3d2c2c] font-sans font-semibold text-lg">Novidades em breve!</h3>
          <p className="text-[#5a4a42] font-sans text-sm max-w-sm px-4">
            Ainda estamos separando peças exclusivas para esta categoria. Fique de olho!
          </p>
        </div>
      )}
      
      {/* O botão "Ver mais" só aparece se tiver peças na tela */}
      {roupasFiltradas.length > 0 && (
        <div className="flex justify-center mt-16">
          <button className="px-8 py-3 bg-[#a88a87] text-white rounded-full font-bold tracking-wide hover:bg-[#9c6662] transition-colors shadow-md font-sans">
            VER MAIS PRODUTOS
          </button>
        </div>
      )}

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