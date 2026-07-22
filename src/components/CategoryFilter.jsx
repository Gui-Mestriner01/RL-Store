import React, { useState } from 'react';

const CategoryFilter = () => {
  // Lista de categorias (copiado do seu design)
  const categories = ['Todos', 'Vestidos', 'Blusas', 'Calças', 'Conjuntos', 'Outros'];
  
  // Estado para controlar qual categoria está selecionada
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  return (
    <section className="px-8 md:px-16 py-12 max-w-[1400px] mx-auto text-center">
      {/* Título da Seção */}
      <div className="flex flex-col items-center justify-center text-[#7a5c58] mb-12">
        <span className="text-3xl font-serif tracking-wide drop-shadow-sm">Catálogo</span>
        <div className="w-20 h-0.5 bg-[#dfcbc9] mt-2"></div> {/* Linha decorativa sutil */}
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-xs font-semibold tracking-wide text-[#3d2c2c] bg-white p-3 rounded-full shadow-md max-w-xl mx-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2.5 rounded-full uppercase transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-[#b57b77] text-white shadow-lg' // Estilo selecionado
                : 'bg-transparent text-[#7a5c58] hover:bg-[#dfcbc9]/30 hover:text-[#3d2c2c]' // Estilo não selecionado
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryFilter;