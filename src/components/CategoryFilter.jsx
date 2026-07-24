import React from 'react';

// Agora o componente recebe o estado (activeCategory) e a função de clique (setActiveCategory)
const CategoryFilter = ({ activeCategory, setActiveCategory }) => {
  const categories = ['TODOS', 'VESTIDOS', 'BLUSAS', 'CALÇAS', 'CONJUNTOS', 'OUTROS'];

  return (
    <section id="catalogo" className="py-10 px-4 max-w-4xl mx-auto flex flex-col items-center animate-fade-in">
      
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-serif text-[#3d2c2c] mb-3">Catálogo</h2>
        <div className="h-[2px] w-16 bg-[#dfcbc9] mx-auto rounded-full"></div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)} // Adicionamos o clique aqui!
            className={`px-5 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold tracking-wider uppercase transition-all duration-300 ${
              activeCategory === category
                ? 'bg-[#a88a87] text-white shadow-md scale-105'
                : 'bg-transparent border-2 border-[#dfcbc9]/50 text-[#8c736e] hover:border-[#a88a87] hover:text-[#5a4a42]'
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