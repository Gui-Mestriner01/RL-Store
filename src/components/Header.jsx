import React, { useState } from 'react';
// Adicionamos os ícones FaBars (hambúrguer) e FaTimes (X)
import { FaWhatsapp, FaInstagram, FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  // Estado que controla se o menu do celular está aberto ou fechado
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center px-8 md:px-16 py-6 bg-transparent relative">
      
      {/* Área da Logo */}
      <a href="#inicio" className="flex flex-col items-center justify-center z-50 relative">
        <img src="/logo.png" alt="RL Store Logo" className="h-20 md:h-24 object-contain hover:scale-105 transition-transform" />
      </a>

      {/* Menu Desktop (Some no celular) */}
      <nav className="hidden md:flex gap-10 text-sm font-semibold tracking-wide text-[#3d2c2c]">
        <a href="#inicio" className="hover:opacity-70 transition-opacity">INÍCIO</a>
        <a href="#catalogo" className="hover:opacity-70 transition-opacity">CATÁLOGO</a>
        <a href="#sobre" className="hover:opacity-70 transition-opacity">SOBRE NÓS</a>
        <a href="#contato" className="hover:opacity-70 transition-opacity">CONTATO</a>
      </nav>

      {/* Ícones Sociais Desktop (Somem no celular) */}
      <div className="hidden md:flex gap-5 text-xl text-[#3d2c2c]">
        <a href="#" className="hover:opacity-70 transition-opacity">
          <FaWhatsapp />
        </a>
        <a href="https://www.instagram.com/rl.modastore/" target="_blank" rel="noreferrer" className="hover:opacity-70 transition-opacity">
          <FaInstagram />
        </a>
      </div>

      {/* Botão do Menu Mobile (Aparece só no celular) */}
      <button 
        className="md:hidden text-2xl text-[#3d2c2c] z-50 relative"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Tela do Menu Mobile (Só aparece quando o botão é clicado) */}
      {isMenuOpen && (
        <div className="absolute top-0 left-0 w-full h-screen bg-[#f3eae8] flex flex-col items-center justify-center gap-8 z-40 md:hidden animate-fade-in">
          
          <nav className="flex flex-col gap-6 text-xl font-serif tracking-wide text-[#3d2c2c] text-center">
            {/* O onClick={...} faz o menu fechar sozinho após a pessoa clicar em um link */}
            <a href="#inicio" onClick={() => setIsMenuOpen(false)} className="hover:text-[#a88a87]">INÍCIO</a>
            <a href="#catalogo" onClick={() => setIsMenuOpen(false)} className="hover:text-[#a88a87]">CATÁLOGO</a>
            <a href="#sobre" onClick={() => setIsMenuOpen(false)} className="hover:text-[#a88a87]">SOBRE NÓS</a>
            <a href="#contato" onClick={() => setIsMenuOpen(false)} className="hover:text-[#a88a87]">CONTATO</a>
          </nav>
          
          <div className="flex gap-8 text-3xl text-[#3d2c2c] mt-8">
            <a href="#"><FaWhatsapp /></a>
            <a href="https://www.instagram.com/rl.modastore/" target="_blank" rel="noreferrer"><FaInstagram /></a>
          </div>
          
        </div>
      )}
      
    </header>
  );
};

export default Header;