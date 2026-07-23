import React, { useState } from 'react';
// Importamos os dois corações: o vazado (FaRegHeart) e o preenchido (FaHeart)
import { FaRegHeart, FaHeart } from 'react-icons/fa';

const ProductCard = ({ product, onClick }) => {
  // 1. Memória inteligente: Verifica se a roupa já estava salva no navegador
  const [isFavorite, setIsFavorite] = useState(() => {
    const savedFavorites = localStorage.getItem('rl_favorites');
    if (savedFavorites) {
      const favoritesArray = JSON.parse(savedFavorites);
      return favoritesArray.includes(product.id);
    }
    return false;
  });

  // 2. Ação de clicar no coração
  const toggleFavorite = (e) => {
    e.stopPropagation(); // Trava o clique para não abrir o modal de detalhes da roupa
    
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);

    // Salva ou remove do localStorage (para não perder ao dar F5)
    const savedFavorites = localStorage.getItem('rl_favorites');
    let favoritesArray = savedFavorites ? JSON.parse(savedFavorites) : [];

    if (newFavoriteState) {
      favoritesArray.push(product.id);
    } else {
      favoritesArray = favoritesArray.filter(id => id !== product.id);
    }
    
    localStorage.setItem('rl_favorites', JSON.stringify(favoritesArray));
  };

  return (
    <div className="group flex flex-col gap-4 cursor-pointer" onClick={onClick}>
      
      {/* CAIXA DA IMAGEM (Agora usando a sua lógica de product.imagens[0]) */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#f4ebe9] shadow-sm border border-[#dfcbc9]/30">
        <img 
          src={product.imagens && product.imagens.length > 0 ? product.imagens[0] : ""} 
          alt={product.nome} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* BOTÃO DO CORAÇÃO FLUTUANTE E FUNCIONAL */}
        <button 
          onClick={toggleFavorite}
          className={`absolute top-3 right-3 p-2.5 backdrop-blur-md rounded-full transition-all shadow-sm
            ${isFavorite 
              ? 'bg-white text-red-500 scale-110' // Ficou salvo: Coração vermelho preenchido
              : 'bg-white/70 text-[#a88a87] hover:bg-white hover:text-red-400' // Normal: Fundo transparente
            }
          `}
        >
          {isFavorite ? <FaHeart className="text-sm" /> : <FaRegHeart className="text-sm" />}
        </button>
      </div>

      {/* TEXTOS CENTRALIZADOS */}
      <div className="flex flex-col items-center text-center px-2">
        <h3 className="text-sm md:text-base font-sans font-semibold text-[#3d2c2c] mb-1 line-clamp-2">
          {product.nome}
        </h3>
        <p className="text-md font-bold text-[#9c6662]">
          {product.preco}
        </p>
      </div>

    </div>
  );
};

export default ProductCard;