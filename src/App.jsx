import { useMemo, useRef, useState } from 'react';
import { FaWhatsapp, FaArrowUp } from 'react-icons/fa';

import Header from './components/Header';
import BarraProgresso from './components/BarraProgresso';
import HeroBanner from './components/HeroBanner';
import Destaques from './components/Destaques';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import Manifesto from './components/Manifesto';
import BenefitsBar from './components/BenefitsBar';
import ComoFunciona from './components/ComoFunciona';
import InstagramFeed from './components/InstagramFeed';
import FaixaCTA from './components/FaixaCTA';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import Cortina from './components/Cortina';
import SacolaDrawer from './components/SacolaDrawer';
import FavoritosDrawer from './components/FavoritosDrawer';

import { useStore } from './store/StoreContext';
import { useRevelar, useTituloAoSair } from './hooks/animacoes';
import { useHashRoute } from './hooks/useHashRoute';

const POR_PAGINA = 8;

const normalizar = (t = '') =>
  t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function App() {
  const { produtosVisiveis, config } = useStore();

  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('Todos');
  const [ordenacao, setOrdenacao] = useState('destaque');
  const [visiveis, setVisiveis] = useState(POR_PAGINA);
  const [sacolaAberta, setSacolaAberta] = useState(false);
  const [favoritosAbertos, setFavoritosAbertos] = useState(false);

  // Cada peça tem endereço próprio (#/peca/slug). Assim dá para mandar o link
  // de uma peça no WhatsApp e o botão voltar do celular fecha o modal.
  const [rota, navegar] = useHashRoute();
  const abertoPorDentro = useRef(false);

  const slugAberto = rota.startsWith('/peca/')
    ? decodeURIComponent(rota.slice('/peca/'.length))
    : null;

  const produtoAberto = useMemo(
    () => (slugAberto ? produtosVisiveis.find((p) => p.slug === slugAberto) || null : null),
    [slugAberto, produtosVisiveis]
  );

  const abrirProduto = (produto) => {
    if (!produto) return;
    abertoPorDentro.current = true;
    navegar(`/peca/${produto.slug}`, { semRolar: true });
  };

  const fecharProduto = () => {
    if (abertoPorDentro.current) {
      abertoPorDentro.current = false;
      window.history.back();
    } else {
      navegar('/', { semRolar: true });
    }
  };

  // reanima sempre que a vitrine muda (filtro, busca, "ver mais")
  useRevelar(`${categoria}|${busca}|${ordenacao}|${visiveis}`);
  useTituloAoSair(`${config.nomeLoja} — a gente te espera ♡`);

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
      <Cortina />
      <BarraProgresso />

      <Header
        busca={busca}
        setBusca={(v) => {
          setBusca(v);
          setVisiveis(POR_PAGINA);
        }}
        onAbrirFavoritos={() => {
          setSacolaAberta(false);
          setFavoritosAbertos(true);
        }}
        onAbrirSacola={() => {
          setFavoritosAbertos(false);
          setSacolaAberta(true);
        }}
        onAbrirBusca={() => {
          setSacolaAberta(false);
          setFavoritosAbertos(false);
        }}
      />

      <HeroBanner />

      <Destaques onSelecionar={abrirProduto} />

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
            onSelecionar={abrirProduto}
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

      <Manifesto />
      <BenefitsBar />
      <ComoFunciona />
      <InstagramFeed />
      <FaixaCTA />
      <Footer />

      <BottomNav
        onAbrirFavoritos={() => {
          setSacolaAberta(false);
          setFavoritosAbertos(true);
        }}
        onAbrirSacola={() => {
          setFavoritosAbertos(false);
          setSacolaAberta(true);
        }}
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
        <ProductModal key={produtoAberto.id} product={produtoAberto} onClose={fecharProduto} />
      )}
      <SacolaDrawer aberto={sacolaAberta} onClose={() => setSacolaAberta(false)} />
      <FavoritosDrawer
        aberto={favoritosAbertos}
        onClose={() => setFavoritosAbertos(false)}
        onAbrirProduto={abrirProduto}
      />
    </div>
  );
}

export default App;
