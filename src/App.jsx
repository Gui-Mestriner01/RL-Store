import React from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import BenefitsBar from './components/BenefitsBar';
import InstagramFeed from './components/InstagramFeed';
import Footer from './components/Footer'; // Importando o Footer

function App() {
  return (
    <div className="min-h-screen bg-[#f3eae8] font-sans text-[#4a3b32]">
      
      <div className="bg-gradient-to-b from-[#dfcbc9] to-[#f3eae8]">
        <Header />
        <HeroBanner />
      </div>

      <CategoryFilter />
      <ProductGrid />
      
      <BenefitsBar />
      <InstagramFeed />
      
      {/* Rodapé adicionado aqui */}
      <Footer />
      
    </div>
  );
}

export default App;