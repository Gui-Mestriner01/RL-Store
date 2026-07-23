import React, { useState } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import BenefitsBar from './components/BenefitsBar';
import InstagramFeed from './components/InstagramFeed';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav'; 
import Favoritos from './components/Favoritos';

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

      {/* Grid de Produtos focado em conversão! */}
      <div className={`${(activeTab === 'home' || activeTab === 'catalog') ? 'block' : 'hidden'} md:block`}>
        <CategoryFilter />
        <ProductGrid />
      </div>

      {/* Tela de Favoritos inteligente */}
      {activeTab === 'favorites' && (
        <div className="md:hidden animate-fade-in">
          <Favoritos />
        </div>
      )}
      
      <div className={`${activeTab === 'home' ? 'block' : 'hidden'} md:block`}>
        <BenefitsBar />
        <InstagramFeed />
      </div>
      
      <div className="hidden md:block">
        <Footer />
      </div>
      
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
    </div>
  );
}

export default App;