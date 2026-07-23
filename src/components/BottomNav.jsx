import React from 'react';
import { FaHome, FaThLarge, FaHeart, FaWhatsapp } from 'react-icons/fa';

const BottomNav = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#dfcbc9] z-50 md:hidden flex justify-around items-center py-3 px-2 shadow-2xl">
      
      <button 
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-[#3d2c2c] font-bold' : 'text-[#8c736e]'}`}
      >
        <FaHome className="text-xl" />
        <span className="text-[10px] uppercase tracking-wider">Início</span>
      </button>

      <button 
        onClick={() => setActiveTab('catalog')}
        className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'catalog' ? 'text-[#3d2c2c] font-bold' : 'text-[#8c736e]'}`}
      >
        <FaThLarge className="text-xl" />
        <span className="text-[10px] uppercase tracking-wider">Catálogo</span>
      </button>

      <button 
        onClick={() => setActiveTab('favorites')}
        className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'favorites' ? 'text-[#3d2c2c] font-bold' : 'text-[#8c736e]'}`}
      >
        <FaHeart className="text-xl" />
        <span className="text-[10px] uppercase tracking-wider">Favoritos</span>
      </button>

      <a 
        href="https://wa.me/5511999999999" 
        target="_blank" 
        rel="noreferrer"
        className="flex flex-col items-center gap-1 text-[#25D366] font-medium"
      >
        <FaWhatsapp className="text-xl" />
        <span className="text-[10px] uppercase tracking-wider">WhatsApp</span>
      </a>

    </nav>
  );
};

export default BottomNav;