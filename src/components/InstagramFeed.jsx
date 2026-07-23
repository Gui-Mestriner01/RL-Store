import React from 'react';
import { FaInstagram } from 'react-icons/fa';

const InstagramFeed = () => {
  // Array com o nome das fotos que você vai colocar na pasta public.
  // Se quiser, pode colar links direto da internet aqui também!
  const instaPhotos = [
    "/insta1.jpg", 
    "/insta2.jpg", 
    "/insta3.jpg", 
    "/insta4.jpg"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 md:px-16">
        
        {/* Título da Seção */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-[#3d2c2c] mb-3">
            Siga <span className="italic text-[#a88a87]">@rl.modastore</span>
          </h2>
          <p className="text-[#5a4a42] text-base max-w-md">
            Acompanhe as novidades, bastidores e looks inspiradores diariamente no nosso perfil.
          </p>
        </div>

        {/* Grade de Fotos (Formato Quadrado igual ao Insta) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {instaPhotos.map((photo, index) => (
            <a 
              key={index} 
              href="https://www.instagram.com/rl.modastore/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative group aspect-square overflow-hidden rounded-md bg-[#f4ebe9]"
            >
              <img 
                src={photo} 
                alt={`Postagem do Instagram ${index + 1}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                // O onError abaixo garante que, se você ainda não tiver posto a foto na pasta public, 
                // ele carrega um quadrado cinza temporário para o site não quebrar.
                onError={(e) => { e.target.src = `https://via.placeholder.com/400x400?text=Foto+Insta+${index + 1}` }}
              />
              
              {/* Filtro escuro com o ícone do Insta que aparece ao passar o mouse (efeito premium!) */}
              <div className="absolute inset-0 bg-[#3d2c2c]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <FaInstagram className="text-white text-4xl" />
              </div>
            </a>
          ))}
        </div>

        {/* Botão para ir para o Perfil */}
        <div className="flex justify-center mt-12">
          <a 
            href="https://www.instagram.com/rl.modastore/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-3 border-2 border-[#a88a87] text-[#a88a87] rounded-full font-bold tracking-wide hover:bg-[#a88a87] hover:text-white transition-all text-sm font-sans"
          >
            <FaInstagram className="text-xl" />
            IR PARA O PERFIL
          </a>
        </div>

      </div>
    </section>
  );
};

export default InstagramFeed;