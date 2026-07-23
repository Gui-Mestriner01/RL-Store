import React from 'react';
import { FaTruck, FaHeart, FaShoppingBag } from 'react-icons/fa';

const BenefitsBar = () => {
  return (
    <section className="bg-[#fdfbfb] py-12 border-t border-b border-[#dfcbc9]/30">
      <div className="max-w-[1200px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          
          {/* Benefício 1: Entrega Local */}
          <div className="flex flex-col items-center text-center gap-3 group">
            <div className="w-14 h-14 rounded-full bg-[#f4ebe9] flex items-center justify-center text-[#a88a87] text-2xl group-hover:bg-[#dfcbc9] group-hover:text-white transition-colors">
              <FaTruck />
            </div>
            <h3 className="font-sans font-bold text-[#3d2c2c] tracking-wider text-sm mt-2">ENTREGA LOCAL RÁPIDA</h3>
            <p className="text-[#5a4a42] text-sm leading-relaxed px-4">
              Levamos o seu look até você! Entregas ágeis e exclusivas para a nossa cidade.
            </p>
          </div>

          {/* Benefício 2: Atendimento */}
          <div className="flex flex-col items-center text-center gap-3 group">
            <div className="w-14 h-14 rounded-full bg-[#f4ebe9] flex items-center justify-center text-[#a88a87] text-2xl group-hover:bg-[#dfcbc9] group-hover:text-white transition-colors">
              <FaHeart />
            </div>
            <h3 className="font-sans font-bold text-[#3d2c2c] tracking-wider text-sm mt-2">ATENDIMENTO VIP</h3>
            <p className="text-[#5a4a42] text-sm leading-relaxed px-4">
              Dúvidas sobre tamanho ou tecido? Te ajudamos a escolher a peça perfeita pelo WhatsApp.
            </p>
          </div>

          {/* Benefício 3: Curadoria */}
          <div className="flex flex-col items-center text-center gap-3 group">
            <div className="w-14 h-14 rounded-full bg-[#f4ebe9] flex items-center justify-center text-[#a88a87] text-2xl group-hover:bg-[#dfcbc9] group-hover:text-white transition-colors">
              <FaShoppingBag />
            </div>
            <h3 className="font-sans font-bold text-[#3d2c2c] tracking-wider text-sm mt-2">CURADORIA PREMIUM</h3>
            <p className="text-[#5a4a42] text-sm leading-relaxed px-4">
              Peças escolhidas a dedo com extremo cuidado, focando em qualidade, conforto e estilo.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BenefitsBar;