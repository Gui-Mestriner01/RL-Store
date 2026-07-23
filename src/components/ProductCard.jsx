import React from 'react';
import { FaRegHeart } from 'react-icons/fa';

// Adicionamos o onClick aqui dentro das chaves
const ProductCard = ({ product, onClick }) => {
  return (
    // Colocamos o onClick na div principal
    <div className="group cursor-pointer" onClick={onClick}>
      
      <div className="relative overflow-hidden rounded-md mb-3 aspect-[4/5] bg-[#e8dad9]">
        {/* Aqui mudamos para imagens[0] e nome */}
        <img 
          src={product.imagens ? product.imagens[0] : ""} 
          alt={product.nome} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex justify-between items-start">
        <div>
          {/* Aqui mudamos para nome e preco */}
          <h3 className="text-[#5a4a42] text-sm font-medium mb-1">{product.nome}</h3>
          <p className="text-[#9c6662] font-semibold">{product.preco}</p>
        </div>
        
        {/* Paramos a propagação do clique no coração para ele não abrir o modal se a pessoa só quiser favoritar */}
        <button 
          className="text-[#a88a87] hover:text-[#9c6662] transition-colors mt-1"
          onClick={(e) => e.stopPropagation()} 
        >
          <FaRegHeart className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;