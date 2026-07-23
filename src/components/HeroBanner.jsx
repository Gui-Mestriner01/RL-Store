import React from 'react';

const HeroBanner = () => {
  // A altura foi levemente reduzida para aproximar a seção de baixo
  return (
    // OLHA O id="inicio" AQUI NESSA LINHA DE BAIXO:
    <section id="inicio" className="relative w-full pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden bg-gradient-to-r from-[#fcfaf9] to-[#f4ebe9]">
      
      <div className="absolute bottom-0 -right-[15%] md:-right-[5%] lg:right-[-2%] w-[90%] md:w-[65%] lg:w-[55%] z-0 pointer-events-none">
        <img 
          src="/arara-roupas.png" 
          alt="Arara de roupas RL Store" 
          className="w-full h-auto object-contain drop-shadow-2xl scale-110 lg:scale-[1.15] origin-bottom-right"
        />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-16 relative z-10 flex flex-col md:flex-row items-center">
        
        <div className="w-full md:w-3/5 flex flex-col items-center md:items-start text-center md:text-left">
          
          <img 
            src="/logo.png" 
            alt="RL Store" 
            className="w-48 md:w-56 lg:w-64 mb-8 drop-shadow-sm" 
          />
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-semibold tracking-tight text-[#3d2c2c] mb-6 leading-tight">
            Estilo que <br />
            <span className="italic font-light text-[#a88a87]">te representa</span>
          </h1>
          
          <p className="font-sans text-[#5a4a42] text-base md:text-lg mb-10 leading-relaxed max-w-md md:max-w-sm lg:max-w-md">
            Peças selecionadas para realçar sua beleza e confiança todos os dias.
          </p>
          
          <button className="px-10 py-4 bg-[#a88a87] text-white rounded-full font-bold tracking-wider hover:bg-[#9c6662] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 font-sans">
            VER CATÁLOGO
          </button>
        </div>

      </div>
    </section>
  );
};

export default HeroBanner;