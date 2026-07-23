import React from 'react';

const CategoryFilter = () => {
  // Categorias da sua loja
  const categories = ['TODOS', 'VESTIDOS', 'BLUSAS', 'CALÇAS', 'CONJUNTOS', 'OUTROS'];
  
  // Por enquanto vamos deixar 'TODOS' como ativo fixo só para ver o visual
  const activeCategory = 'TODOS';

  return (
    <section className="py-10 px-4 max-w-4xl mx-auto flex flex-col items-center animate-fade-in">
      
      {/* Título elegante */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-serif text-[#3d2c2c] mb-3">Catálogo</h2>
        <div className="h-[2px] w-16 bg-[#dfcbc9] mx-auto rounded-full"></div>
      </div>

      {/* Container dos botões de filtro (sem o fundo branco gigante) */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-5 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold tracking-wider uppercase transition-all duration-300 ${
              activeCategory === category
                ? 'bg-[#a88a87] text-white shadow-md scale-105' // Visual do botão selecionado
                : 'bg-transparent border-2 border-[#dfcbc9]/50 text-[#8c736e] hover:border-[#a88a87] hover:text-[#5a4a42]' // Visual dos inativos
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