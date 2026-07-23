import React from 'react';
// Precisamos importar os ícones do pacote react-icons
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    // OLHA O id="contato" AQUI: É para cá que a tela vai descer!
    <footer id="contato" className="bg-[#fcfaf9] border-t border-[#dfcbc9]/40 pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-6 md:px-16">
        
        {/* GRID DIVIDIDO EM 3 COLUNAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 border-b border-[#dfcbc9]/60 pb-12">
          
          {/* Coluna 1: A Marca */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <img 
              src="/logo.png" 
              alt="RL Store" 
              className="h-20 mb-4 object-contain" 
            />
            <p className="text-[#5a4a42] text-sm leading-relaxed max-w-xs font-sans">
              Estilo que te representa. Peças selecionadas a dedo para realçar a sua beleza e confiança todos os dias.
            </p>
          </div>

          {/* Coluna 2: Menu Rápido */}
          <div className="flex flex-col items-center md:items-start">
              <h4 className="text-[#3d2c2c] font-sans font-bold tracking-widest mb-6 text-sm">MENU RÁPIDO</h4>
              <nav className="flex flex-col gap-3 text-sm">
                <a href="#inicio" className="font-sans text-[#5a4a42] hover:text-[#a88a87] transition-colors">Início</a>
                <a href="#catalogo" className="font-sans text-[#5a4a42] hover:text-[#a88a87] transition-colors">Catálogo</a>
              </nav>
          </div>

          {/* Coluna 3: Contatos Diretos */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-[#3d2c2c] font-sans font-bold tracking-widest mb-6 text-sm">FALE CONOSCO</h4>
            <div className="flex flex-col gap-4 text-sm text-[#5a4a42]">
              
              <a href="https://wa.me/5511972276750" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#a88a87] transition-colors group">
                <span className="p-2 bg-[#f4ebe9] rounded-full group-hover:bg-[#dfcbc9] transition-colors">
                  <FaWhatsapp className="text-lg text-[#3d2c2c]" />
                </span>
                <span className="font-sans font-medium">(11) 97227-6750</span>
              </a>
              
              <a href="https://www.instagram.com/rl.modastore/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#a88a87] transition-colors group">
                <span className="p-2 bg-[#f4ebe9] rounded-full group-hover:bg-[#dfcbc9] transition-colors">
                  <FaInstagram className="text-lg text-[#3d2c2c]" />
                </span>
                <span className="font-sans font-medium">@rl.modastore</span>
              </a>

            </div>
          </div>

        </div>

        {/* DIREITOS AUTORAIS */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-[#9c6662] font-sans gap-4">
          <p>&copy; 2026 RL Store. Todos os direitos reservados.</p>
          <p>Desenvolvido com dedicação por Guilherme Mestriner.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;