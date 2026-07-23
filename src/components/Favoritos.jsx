import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal'; 
// Importe o seu banco de dados aqui (ajuste o caminho se precisar)
import { produtosDaLoja } from '../produtos';

const Favoritos = () => {
  const [roupasSalvas, setRoupasSalvas] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Lê a memória que o coração gravou
    const savedFavorites = localStorage.getItem('rl_favorites');
    
    if (savedFavorites) {
      const favoriteIds = JSON.parse(savedFavorites);
      
      // Filtra as roupas para mostrar SÓ as favoritadas
      const roupasFiltradas = produtosDaLoja.filter(produto => favoriteIds.includes(produto.id));
      setRoupasSalvas(roupasFiltradas);
    }
  }, []); // Roda toda vez que a tela de favoritos é aberta

  return (
    <section className="px-8 md:px-16 py-12 max-w-[1200px] mx-auto min-h-[60vh]">
      
      <h2 className="text-3xl font-serif text-[#3d2c2c] mb-8 text-center">
        Meus <span className="italic text-[#a88a87]">Favoritos</span>
      </h2>

      {roupasSalvas.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-12 gap-4">
          <div className="text-5xl text-[#dfcbc9] mb-2">♡</div>
          <h3 className="text-[#3d2c2c] font-sans font-semibold text-lg">Nenhuma peça salva ainda.</h3>
          <p className="text-[#5a4a42] font-sans text-sm max-w-sm">
            Navegue pelo catálogo e clique no coração para guardar os looks que você mais amou!
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {roupasSalvas.map((product) => (
            <div key={product.id} className="w-full max-w-[260px]">
              <ProductCard 
                product={product} 
                onClick={() => setSelectedProduct(product)} 
              />
            </div>
          ))}
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

export default Favoritos;