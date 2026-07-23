import React, { useState } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import BenefitsBar from './components/BenefitsBar';
import InstagramFeed from './components/InstagramFeed';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav'; 
import Favoritos from './components/Favoritos'; // <-- IMPORTANTE ESTAR AQUI

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-[#f3eae8] font-sans text-[#4a3b32] pb-20 md:pb-0">
      
      <div className="bg-gradient-to-b from-[#dfcbc9] to-[#f3eae8]">
        <Header />
        <div className={`${activeTab === 'home' ? 'block' : 'hidden'} md:block`}>
          <HeroBanner />
        </div>
      </div>

      <div className={`${(activeTab === 'home' || activeTab === 'catalog') ? 'block' : 'hidden'} md:block`}>
        <CategoryFilter />
        <ProductGrid />
      </div>

      {/* MÁGICA DOS FAVORITOS: Trocamos o texto fixo pelo componente de verdade! */}
      {activeTab === 'favorites' && (
        <div className="md:hidden animate-fade-in">
          <Favoritos />
        </div>
      )}
      
      {/* INSTAGRAM E BENEFÍCIOS: Removi o "hidden" para aparecer no mobile! */}
      <div className={`${activeTab === 'home' ? 'block' : 'hidden'} md:block`}>
        <BenefitsBar />
        <InstagramFeed />
      </div>
      
      {/* FOOTER: Removi o "hidden" e adicionei pb-24 para o menu debaixo não tampar o texto! */}
      <div className={`${activeTab === 'home' ? 'block' : 'hidden'} md:block pb-24 md:pb-0`}>
        <Footer />
      </div>
      
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
    </div>
  );
}

export default App;