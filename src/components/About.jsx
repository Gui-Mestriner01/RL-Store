import React from 'react';

const About = () => {
  return (
    // OLHA O id="sobre-nos" AQUI:
    <section id="sobre-nos" className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 md:px-16 flex flex-col md:flex-row items-center gap-12 lg:gap-20">
        
        {/* LADO ESQUERDO: A Foto das Donas */}
        <div className="w-full md:w-1/2 relative">
          <div className="absolute top-4 -left-4 w-full h-full border-2 border-[#dfcbc9] rounded-t-full rounded-b-md z-0"></div>
          
          <img 
            src="/donas.jpg" 
            alt="Livia Garces e Rebeca Venturin" 
            className="w-full aspect-[4/5] object-cover rounded-t-full rounded-b-md relative z-10 shadow-lg"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/600x750?text=Foto+Livia+e+Rebeca' }}
          />
        </div>

        {/* LADO DIREITO: A História */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          
          <h2 className="text-4xl lg:text-5xl font-serif text-[#3d2c2c] mb-2">
            Muito Prazer, <br />
            <span className="italic text-[#a88a87]">somos a RL Store.</span>
          </h2>
          
          <div className="w-16 h-1 bg-[#dfcbc9] mb-8"></div>
          
          <p className="text-[#5a4a42] text-base md:text-lg mb-6 leading-relaxed">
            A RL Store nasceu do sonho de <strong className="text-[#3d2c2c]">Livia Garces</strong> e <strong className="text-[#3d2c2c]">Rebeca Venturin</strong> de vestir mulheres reais, que buscam se sentir lindas, confiantes e únicas em qualquer ocasião.
          </p>
          
          <p className="text-[#5a4a42] text-base md:text-lg mb-8 leading-relaxed">
            Mais do que vender roupas, nossa curadoria é feita com olhar clínico, amor e extrema atenção aos detalhes. Cada peça que chega até você foi escolhida a dedo para realçar a sua beleza e representar o seu estilo todos os dias.
          </p>

          <div className="flex gap-4 items-center">
            <span className="font-serif italic text-xl text-[#9c6662]">Livia</span>
            <span className="w-1.5 h-1.5 bg-[#dfcbc9] rounded-full"></span>
            <span className="font-serif italic text-xl text-[#9c6662]">Rebeca</span>
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;