import { useMemo, useState } from 'react';
import { FaWhatsapp, FaArrowUp } from 'react-icons/fa';

import Header from './components/Header';
import BarraProgresso from './components/BarraProgresso';
import HeroBanner from './components/HeroBanner';
import Destaques from './components/Destaques';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import BenefitsBar from './components/BenefitsBar';
import ComoFunciona from './components/ComoFunciona';
import InstagramFeed from './components/InstagramFeed';
import FaixaCTA from './components/FaixaCTA';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import SacolaDrawer from './components/SacolaDrawer';
import FavoritosDrawer from './components/FavoritosDrawer';

import { useStore } from './store/StoreContext';
import { useRevelar } from './hooks/useHashRoute';

const POR_PAGINA = 8;

const normalizar = (t = '') =>
  t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function App() {
  const { produtosVisiveis, config } = useStore();

  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('Todos');
  const [ordenacao, setOrdenacao] = useState('destaque');
  const [visiveis, setVisiveis] = useState(POR_PAGINA);
  const [produtoAberto, setProdutoAberto] = useState(null);
  const [sacolaAberta, setSacolaAberta] = useState(false);
  const [favoritosAbertos, setFavoritosAbertos] = useState(false);

  useRevelar();

  const filtrados = useMemo(() => {
    const termo = normalizar(busca.trim());

    const lista = produtosVisiveis.filter((p) => {
      const baterCategoria =
        categoria === 'Todos' || normalizar(p.categoria) === normalizar(categoria);

      if (!baterCategoria) return false;
      if (!termo) return true;

      const alvo = normalizar(
        [p.nome, p.categoria, p.descricao, ...p.cores.map((c) => c.nome)].join(' ')
      );
      return alvo.includes(termo);
    });

    const ordenadores = {
      destaque: (a, b) =>
        Number(a.esgotado) - Number(b.esgotado) ||
        Number(b.destaque) - Number(a.destaque) ||
        Number(b.novoLancamento) - Number(a.novoLancamento),
      recentes: (a, b) =>
        Number(b.novoLancamento) - Number(a.novoLancamento) ||
        String(b.criadoEm).localeCompare(String(a.criadoEm)),
      menor: (a, b) => a.preco - b.preco,
      maior: (a, b) => b.preco - a.preco,
      az: (a, b) => a.nome.localeCompare(b.nome, 'pt-BR'),
    };

    return [...lista].sort(ordenadores[ordenacao] || ordenadores.destaque);
  }, [produtosVisiveis, busca, categoria, ordenacao]);

  const mostrar = filtrados.slice(0, visiveis);

  const limparFiltros = () => {
    setBusca('');
    setCategoria('Todos');
    setVisiveis(POR_PAGINA);
  };

  const aoTrocarCategoria = (nova) => {
    setCategoria(nova);
    setVisiveis(POR_PAGINA);
  };

  return (
    <div className="min-h-screen bg-sand text-body pb-20 md:pb-0">
      <BarraProgresso />

      <Header
        busca={busca}
        setBusca={(v) => {
          setBusca(v);
          setVisiveis(POR_PAGINA);
        }}
        onAbrirFavoritos={() => setFavoritosAbertos(true)}
        onAbrirSacola={() => setSacolaAberta(true)}
      />

      <HeroBanner />

      <Destaques onSelecionar={setProdutoAberto} />

      <main id="catalogo" className="px-5 md:px-8 max-w-[1280px] mx-auto">
        <CategoryFilter
          categoriaAtiva={categoria}
          setCategoriaAtiva={aoTrocarCategoria}
          ordenacao={ordenacao}
          setOrdenacao={setOrdenacao}
          total={filtrados.length}
          busca={busca}
        />

        <div className="pb-20">
          <ProductGrid
            produtos={mostrar}
            onSelecionar={setProdutoAberto}
            aoLimpar={limparFiltros}
          />

          {visiveis < filtrados.length && (
            <div className="flex flex-col items-center gap-4 mt-16">
              <div className="h-px w-full max-w-xs bg-line" />
              <button
                onClick={() => setVisiveis((v) => v + POR_PAGINA)}
                className="px-10 py-4 bg-cream border border-line text-ink rounded-full text-[10px] font-bold tracking-[0.18em] uppercase hover:bg-ink hover:text-cream hover:border-ink transition-all sombra-suave"
              >
                Ver mais peças ({filtrados.length - visiveis})
              </button>
            </div>
          )}
        </div>
      </main>

      <BenefitsBar />
      <ComoFunciona />
      <InstagramFeed />
      <FaixaCTA />
      <Footer />

      <BottomNav
        onAbrirFavoritos={() => setFavoritosAbertos(true)}
        onAbrirSacola={() => setSacolaAberta(true)}
      />

      {/* Botões flutuantes (desktop) */}
      <div className="hidden md:flex flex-col gap-3 fixed bottom-8 right-8 z-[70]">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Voltar ao topo"
          className="w-11 h-11 rounded-full bg-cream border border-line text-ink flex items-center justify-center sombra-alta hover:bg-ink hover:text-cream transition-all"
        >
          <FaArrowUp className="text-xs" />
        </button>
        <a
          href={`https://wa.me/${config.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center sombra-flutuante hover:scale-105 transition-transform"
        >
          <FaWhatsapp className="text-2xl" />
        </a>
      </div>

      {produtoAberto && (
        <ProductModal
          key={produtoAberto.id}
          product={produtoAberto}
          onClose={() => setProdutoAberto(null)}
        />
      )}
      <SacolaDrawer aberto={sacolaAberta} onClose={() => setSacolaAberta(false)} />
      <FavoritosDrawer
        aberto={favoritosAbertos}
        onClose={() => setFavoritosAbertos(false)}
        onAbrirProduto={setProdutoAberto}
      />
    </div>
  );
}

export default App;
