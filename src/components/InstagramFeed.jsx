import React from 'react';
import { FaInstagram } from 'react-icons/fa';

const InstagramFeed = () => {
  const instaPhotos = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=300&q=80"
  ];

  return (
    <section className="px-8 md:px-16 py-16 max-w-[1400px] mx-auto">
      <div className="bg-[#dfcbc9]/40 rounded-[2rem] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-sm border border-[#dfcbc9]/60">
        
        {/* Chamada para Ação */}
        <div className="flex items-center gap-6 lg:w-1/3 w-full">
          <a 
            href="https://www.instagram.com/rl.modastore/" 
            target="_blank" 
            rel="noreferrer"
            className="text-6xl text-[#a88a87] p-4 bg-white rounded-full shadow-sm hover:scale-105 transition-transform"
          >
            <FaInstagram />
          </a>
          <div>
            <h3 className="text-2xl font-serif text-[#3d2c2c] mb-1">Siga nosso Instagram</h3>
            <a 
              href="https://www.instagram.com/rl.modastore/" 
              target="_blank" 
              rel="noreferrer"
              className="text-[#9c6662] font-medium text-sm mb-2 hover:underline"
            >
              @rl.modastore
            </a>
            <p className="text-[#5a4a42] text-sm mt-1">Novidades, inspirações e promoções exclusivas todos os dias!</p>
          </div>
        </div>

        {/* Grade de Fotos Atualizada - Sem barra de rolagem e fotos 100% quadradas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:w-2/3 w-full">
          {instaPhotos.map((photo, index) => (
            <img 
              key={index} 
              src={photo} 
              alt={`Instagram post ${index + 1}`} 
              className="w-full aspect-square object-cover rounded-2xl shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer" 
            />
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default InstagramFeed;