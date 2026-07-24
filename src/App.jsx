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
  // 1. Criamos um "controle remoto" para abrir e fechar a janela de favoritos no PC
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  
  // 2. Criamos o "controle remoto" do filtro de categorias (começa sempre mostrando 'TODOS')
  const [selectedCategory, setSelectedCategory] = useState('TODOS');

  return (
    <div className="min-h-screen bg-[#f3eae8] font-sans text-[#4a3b32] pb-20 md:pb-0 relative">
      
      <div className="bg-gradient-to-b from-[#dfcbc9] to-[#f3eae8]">
        <Header onOpenFavorites={() => setShowFavoritesModal(true)} />
        
        <div className={`${activeTab === 'home' ? 'block' : 'hidden'} md:block`}>
          <HeroBanner />
        </div>
      </div>

      {/* Entregamos o controle remoto da categoria para o Filtro e para a Grade de Roupas */}
      <div className={`${(activeTab === 'home' || activeTab === 'catalog') ? 'block' : 'hidden'} md:block`}>
        <CategoryFilter activeCategory={selectedCategory} setActiveCategory={setSelectedCategory} />
        <ProductGrid activeCategory={selectedCategory} />
      </div>

      {/* FAVORITOS NO CELULAR: Continua igual, aparecendo como uma aba */}
      {activeTab === 'favorites' && (
        <div className="md:hidden animate-fade-in">
          <Favoritos />
        </div>
      )}

      {/* FAVORITOS NO COMPUTADOR: Agora é um Pop-up / Modal lindão! */}
      {showFavoritesModal && (
        <div className="hidden md:flex fixed inset-0 z-[100] bg-[#3d2c2c]/60 backdrop-blur-sm items-center justify-center p-6 animate-fade-in">
          
          {/* Caixa Branca do Modal */}
          <div className="bg-[#f3eae8] w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-y-auto relative shadow-2xl border border-[#dfcbc9]/50">
            
            {/* Botão de Fechar */}
            <button 
              onClick={() => setShowFavoritesModal(false)}
              className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-white rounded-full text-[#3d2c2c] shadow-md hover:bg-[#dfcbc9] hover:text-white transition-all z-50 text-xl font-bold"
            >
              ✕
            </button>
            
            {/* Colocamos o mesmo componente Favoritos aqui dentro! */}
            <div className="pt-2 pb-8">
              <Favoritos />
            </div>

          </div>
          
        </div>
      )}
      
      <div className={`${activeTab === 'home' ? 'block' : 'hidden'} md:block`}>
        <BenefitsBar />
        <InstagramFeed />
      </div>
      
      {/* Ajuste: O rodapé agora também aparece na aba de Favoritos no celular */}
      <div className={`${(activeTab === 'home' || activeTab === 'favorites') ? 'block' : 'hidden'} md:block pb-24 md:pb-0`}>
        <Footer />
      </div>
      
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
    </div>
  );
}

export default App;