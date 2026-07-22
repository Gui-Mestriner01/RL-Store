import React, { useState } from 'react'; // Importamos o useState
import ProductCard from './ProductCard';
import ProductModal from './ProductModal'; // Importamos o Modal

// Sua lista de produtos
const products = [
  { id: 1, name: 'Vestido Midi Floral', price: 'R$ 189,90', category: 'Vestidos', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'Blusa Manga Bufante', price: 'R$ 129,90', category: 'Blusas', image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=400&q=80' },
  { id: 3, name: 'Calça Alfaiatada', price: 'R$ 199,90', category: 'Calças', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=400&q=80' },
  { id: 4, name: 'Conjunto Linho', price: 'R$ 229,90', category: 'Conjuntos', image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=400&q=80' },
];

const ProductGrid = () => {
  // Estado que guarda qual roupa está selecionada (começa vazio, ou seja, sem modal)
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <section className="px-8 md:px-16 py-8 max-w-[1100px] mx-auto">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-12">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            // Quando clicar, salvamos o produto no estado
            onClick={() => setSelectedProduct(product)} 
          />
        ))}
      </div>
      
      <div className="flex justify-center mt-16">
        <button className="px-8 py-3 bg-[#a88a87] text-white rounded-full font-medium tracking-wide hover:bg-[#9c6662] transition-colors shadow-md">
          VER MAIS PRODUTOS
        </button>
      </div>

      {/* Se tiver algum produto selecionado, mostra o Modal! */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          // Quando clicar no X do modal, limpamos o estado para ele sumir
          onClose={() => setSelectedProduct(null)} 
        />
      )}

    </section>
  );
};

export default ProductGrid;