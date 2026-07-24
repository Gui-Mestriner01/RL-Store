import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal'; 

// 🚨 ATENÇÃO AQUI: Se o seu arquivo produtos.js estiver dentro de uma pasta "data", 
// mude a linha abaixo para: import { produtosDaLoja } from '../data/produtos';
// Se ele estiver solto junto com o App.jsx, mantenha '../produtos'
import { produtosDaLoja } from '../produtos';

const Favoritos = () => {
  const [roupasSalvas, setRoupasSalvas] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const carregarFavoritos = () => {
      const savedFavorites = localStorage.getItem('rl_favorites');
      
      // Checa se a memória tem algo salvo E se o arquivo de produtos foi encontrado
      if (savedFavorites && produtosDaLoja) {
        const favoriteIds = JSON.parse(savedFavorites);
        
        const roupasFiltradas = produtosDaLoja.filter(produto => {
          if (!produto.id) return false; 
          // Converte tudo para texto (String) para garantir que 1 e "1" sejam a mesma coisa
          return favoriteIds.map(String).includes(String(produto.id));
        });
        
        setRoupasSalvas(roupasFiltradas);
      } else if (!produtosDaLoja) {
        console.error("ERRO: O arquivo Favoritos.jsx não conseguiu encontrar o produtos.js. Verifique o caminho da importação!");
      }
    };

    carregarFavoritos();
    
    // Deixa a tela "vigiando" a memória para atualizar sozinha se você favoritar algo novo
    window.addEventListener('storage', carregarFavoritos);
    return () => window.removeEventListener('storage', carregarFavoritos);
  }, []);

  return (
    <section className="px-8 md:px-16 py-12 max-w-[1200px] mx-auto min-h-[60vh]">
      
      <h2 className="text-3xl font-serif text-[#3d2c2c] mb-8 text-center mt-4">
        Meus <span className="italic text-[#a88a87]">Favoritos</span>
      </h2>

      {roupasSalvas.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-12 gap-4">
          <div className="text-6xl text-[#dfcbc9] mb-2">♡</div>
          <h3 className="text-[#3d2c2c] font-sans font-semibold text-lg">Sua lista está vazia.</h3>
          <p className="text-[#5a4a42] font-sans text-sm max-w-sm px-4">
            Volte ao catálogo, clique no coração das peças que você mais amar e elas aparecerão aqui!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {roupasSalvas.map((product) => (
            <div key={product.id} className="w-full max-w-[280px]">
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