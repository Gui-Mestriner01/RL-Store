import React from 'react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="w-full bg-[#f4ebe9] border-b border-[#dfcbc9]/40 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LOGO (Mantendo o tamanho grande e imponente) */}
        <div className="flex items-center">
          <a href="#inicio"> {/* Clicar na logo volta pro início */}
            <img 
              src="/logo.png" 
              alt="RL Store" 
              className="h-20 md:h-24 w-auto object-contain drop-shadow-sm transition-transform hover:scale-105" 
            />
          </a>
        </div>

        {/* LINKS DE NAVEGAÇÃO (MUDANÇA AQUI NOS href) */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#inicio" className="text-xs font-sans font-semibold tracking-widest text-[#3d2c2c] hover:text-[#a88a87] transition-colors">INÍCIO</a>
          
          {/* Aponta para o ID 'catalogo' */}
          <a href="#catalogo" className="text-xs font-sans font-semibold tracking-widest text-[#3d2c2c] hover:text-[#a88a87] transition-colors">CATÁLOGO</a>
          
          {/* Aponta para o ID 'sobre-nos' */}
          <a href="#sobre-nos" className="text-xs font-sans font-semibold tracking-widest text-[#3d2c2c] hover:text-[#a88a87] transition-colors">SOBRE NÓS</a>
          
          {/* Aponta para o ID 'contato' (que geralmente fica no rodapé) */}
          <a href="#contato" className="text-xs font-sans font-semibold tracking-widest text-[#3d2c2c] hover:text-[#a88a87] transition-colors">CONTATO</a>
        </nav>

        {/* ÍCONES SOCIAIS (Mantendo grandes) */}
        <div className="flex items-center gap-5 text-[#3d2c2c]">
          <a href="https://wa.me/5511972276750" target="_blank" rel="noopener noreferrer" className="p-1 hover:text-[#a88a87] hover:scale-110 transition-all duration-300 text-2xl">
            <FaWhatsapp />
          </a>
          <a href="https://www.instagram.com/rl.modastore/" target="_blank" rel="noopener noreferrer" className="p-1 hover:text-[#a88a87] hover:scale-110 transition-all duration-300 text-2xl">
            <FaInstagram />
          </a>
        </div>

      </div>
    </header>
  );
};

export default Header;