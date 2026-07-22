import React from 'react';

const HeroBanner = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-12 md:py-20 max-w-[1400px] mx-auto">
      
      {/* Lado Esquerdo - Textos e Botão */}
      <div className="w-full md:w-1/2 flex flex-col items-start gap-6 z-10">
        
        {/* Logo Grande (Simulando o desenho da imagem) */}
        <div className="flex flex-col items-center justify-center text-[#f7f3f2] mb-2 opacity-90">
          {/* Aqui futuramente vai a imagem real da logo da sua cliente */}
          <span className="text-7xl font-serif tracking-widest drop-shadow-md">RL</span>
          <span className="text-sm font-light tracking-[0.3em] uppercase">Store</span>
        </div>
        
        {/* Título Principal */}
        <h1 className="text-5xl md:text-6xl text-[#3d2c2c] font-serif leading-tight">
          Estilo que <br />
          <span className="italic font-light text-[#7a5c58]">te representa</span>
        </h1>
        
        {/* Subtítulo */}
        <p className="text-[#5a4a42] text-lg max-w-sm mt-2">
          Peças selecionadas para realçar sua beleza e confiança todos os dias.
        </p>
        
        {/* Botão */}
        <button className="mt-4 px-10 py-3 bg-[#b57b77] text-white rounded-full font-medium tracking-wide hover:bg-[#9c6662] transition-colors shadow-lg">
          VER CATÁLOGO
        </button>
      </div>

      {/* Lado Direito - Imagem dos Cabides */}
      <div className="w-full md:w-1/2 mt-16 md:mt-0 relative">
        {/* Efeito de brilho sutil atrás da imagem */}
        <div className="absolute inset-0 bg-[#f7f3f2] rounded-full blur-3xl opacity-40 -z-10 transform translate-x-10 translate-y-10"></div>
        
        {/* Imagem (Estou usando uma imagem provisória bonita do Unsplash até você colocar a foto real sem fundo) */}
        <img 
          src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
          alt="Roupas elegantes no cabideiro" 
          className="w-full h-[500px] object-cover rounded-[40px] shadow-2xl rounded-tr-none rounded-bl-none border-4 border-white/20"
        />
      </div>

    </section>
  );
};

export default HeroBanner;