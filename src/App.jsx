import React, { useState } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import BenefitsBar from './components/BenefitsBar';
import InstagramFeed from './components/InstagramFeed';
import Footer from './components/Footer';
// Importe a barra inferior que criamos no passo anterior
import BottomNav from './components/BottomNav'; 

function App() {
  // Estado para controlar qual aba o celular está vendo (Início, Catálogo ou Favoritos)
  const [activeTab, setActiveTab] = useState('home');

  return (
    // Adicionamos pb-20 no celular para o conteúdo não ficar escondido atrás da barra inferior
    <div className="min-h-screen bg-[#f3eae8] font-sans text-[#4a3b32] pb-20 md:pb-0">
      
      <div className="bg-gradient-to-b from-[#dfcbc9] to-[#f3eae8]">
        <Header />
        {/* No mobile, só mostra o Banner se estiver na aba "home". No PC (md:block), mostra sempre. */}
        <div className={`${activeTab === 'home' ? 'block' : 'hidden'} md:block`}>
          <HeroBanner />
        </div>
      </div>

      {/* Grid de Produtos: Aparece na "home" e no "catalog" no mobile. No PC, mostra sempre. */}
      <div className={`${(activeTab === 'home' || activeTab === 'catalog') ? 'block' : 'hidden'} md:block`}>
        <CategoryFilter />
        <ProductGrid />
      </div>

      {/* Tela de Favoritos: Exclusiva do mobile, só aparece quando a aba for clicada */}
      {activeTab === 'favorites' && (
        <div className="md:hidden p-4 min-h-[50vh] animate-fade-in">
          <h2 className="text-2xl font-serif text-center mt-6 mb-6 text-[#3d2c2c]">Meus Favoritos</h2>
          <p className="text-center text-[#8c736e]">Sua lista de peças favoritas aparecerá aqui.</p>
        </div>
      )}
      
      {/* Benefícios e Instagram: Só na "home" do mobile. No PC, mostra sempre. */}
      <div className={`${activeTab === 'home' ? 'block' : 'hidden'} md:block`}>
        <BenefitsBar />
        <InstagramFeed />
      </div>
      
      {/* Footer: Vamos ocultar no mobile para não brigar com a BottomNav, mas exibir no PC */}
      <div className="hidden md:block">
        <Footer />
      </div>
      
      {/* A nossa Barra Inferior de Navegação - ela mesma já tem a classe md:hidden por dentro */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
    </div>
  );
}

export default App;