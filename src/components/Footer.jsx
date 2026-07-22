import React from 'react';
import { FaCcVisa, FaCcMastercard, FaBarcode } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#bca8a6] pt-16 pb-6 mt-16 text-[#3d2c2c]">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16">
        
        {/* Grade de Informações do Rodapé */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Coluna 1: Logo */}
          <div className="flex flex-col items-start text-[#fcfaf9]">
            <span className="text-5xl font-serif tracking-widest drop-shadow-sm mb-[-5px]">RL</span>
            <span className="text-sm font-light tracking-[0.3em] uppercase">Store</span>
          </div>

          {/* Coluna 2: Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-[#3d2c2c]">Links</h4>
            <ul className="flex flex-col gap-2 text-sm text-[#5a4a42]">
              <li><a href="#inicio" className="hover:text-[#fcfaf9] transition-colors">Início</a></li>
              <li><a href="#catalogo" className="hover:text-[#fcfaf9] transition-colors">Catálogo</a></li>
              <li><a href="#sobre" className="hover:text-[#fcfaf9] transition-colors">Sobre Nós</a></li>
              <li><a href="#contato" className="hover:text-[#fcfaf9] transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Coluna 3: Atendimento */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-[#3d2c2c]">Atendimento</h4>
            <ul className="flex flex-col gap-2 text-sm text-[#5a4a42]">
              <li>(11) 99999-9999</li>
              <li>contato@rlmodastore.com.br</li>
              <li>Seg a Sex: 09h às 18h</li>
            </ul>
          </div>

          {/* Coluna 4: Formas de Pagamento */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-[#3d2c2c]">Formas de Pagamento</h4>
            <div className="flex gap-3 text-3xl text-[#5a4a42]">
              <FaCcVisa className="hover:text-[#fcfaf9] transition-colors cursor-pointer" />
              <FaCcMastercard className="hover:text-[#fcfaf9] transition-colors cursor-pointer" />
              {/* O PIX e Elo não têm ícones nativos perfeitos no react-icons/fa, então criamos selos com texto */}
              <div className="border border-[#5a4a42] rounded-md px-1 flex items-center justify-center text-[10px] font-bold hover:text-[#fcfaf9] hover:border-[#fcfaf9] transition-colors cursor-pointer">PIX</div>
              <div className="border border-[#5a4a42] rounded-md px-1 flex items-center justify-center text-[10px] font-bold hover:text-[#fcfaf9] hover:border-[#fcfaf9] transition-colors cursor-pointer">elo</div>
              <FaBarcode className="hover:text-[#fcfaf9] transition-colors cursor-pointer" />
            </div>
          </div>

        </div>

        {/* Linha Divisória */}
        <div className="w-full h-px bg-[#a88a87]/40 mb-6"></div>

        {/* Barra Inferior: Direitos e Sua Assinatura */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs font-medium">
          <p className="text-[#5a4a42] mb-3 md:mb-0">
            © 2026 RL STORE - Todos os direitos reservados.
          </p>
          
          {/* Sua marca d'água elegante aqui */}
          <a 
            href="#" 
            target="_blank" 
            rel="noreferrer" 
            className="text-[#3d2c2c] opacity-40 hover:opacity-100 transition-opacity duration-300"
          >
            Desenvolvido por <span className="font-bold">Guilherme Mestriner</span>
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;