import { useEffect, useState } from 'react';
import {
  FaWhatsapp,
  FaInstagram,
  FaHeart,
  FaShoppingBag,
  FaSearch,
  FaTimes,
} from 'react-icons/fa';
import { useStore } from '../store/StoreContext';
import { midia } from '../lib/utils';

const montarRecados = (cidade) => [
  `Entrega em ${cidade}`,
  'Atendimento pelo WhatsApp todos os dias',
  'Peças selecionadas a dedo',
  'Novidades toda semana',
];

const AcaoIcone = ({ rotulo, onClick, href, children, contador = 0, escuro }) => {
  const classe = `relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
    escuro
      ? 'text-cream hover:bg-cream/15'
      : 'text-ink hover:bg-blush/60 hover:-translate-y-0.5'
  }`;
  const conteudo = (
    <>
      {children}
      {contador > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-rose text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center animate-pop ring-2 ring-cream">
          {contador}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={rotulo} className={classe}>
        {conteudo}
      </a>
    );
  }
  return (
    <button onClick={onClick} aria-label={rotulo} className={classe}>
      {conteudo}
    </button>
  );
};

const Header = ({ onAbrirFavoritos, onAbrirSacola, onAbrirBusca, busca, setBusca }) => {
  const { config, favoritos, qtdSacola } = useStore();
  const RECADOS = montarRecados(config.cidade);
  const [encolhido, setEncolhido] = useState(false);
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [secao, setSecao] = useState('inicio');

  useEffect(() => {
    const aoRolar = () => {
      setEncolhido(window.scrollY > 60);
      const catalogo = document.getElementById('catalogo');
      const contato = document.getElementById('contato');
      const y = window.scrollY + 200;
      if (contato && y >= contato.offsetTop) setSecao('contato');
      else if (catalogo && y >= catalogo.offsetTop) setSecao('catalogo');
      else setSecao('inicio');
    };
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  const irPara = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const LINKS = [
    { id: 'inicio', rotulo: 'Início' },
    { id: 'catalogo', rotulo: 'Catálogo' },
    { id: 'como-funciona', rotulo: 'Como funciona' },
    { id: 'contato', rotulo: 'Contato' },
  ];

  return (
    <header className="w-full sticky top-0 z-50">
      {/* faixa de recados em movimento */}
      <div className="bg-ink text-cream/90 overflow-hidden py-2">
        <div className="marquee gap-10">
          {[0, 1].map((bloco) => (
            <div key={bloco} className="flex gap-10 pr-10" aria-hidden={bloco === 1}>
              {RECADOS.map((recado) => (
                <span
                  key={recado}
                  className="text-[10px] tracking-[0.28em] uppercase whitespace-nowrap flex items-center gap-10"
                >
                  {recado}
                  <span className="text-rose">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="glass border-b border-line">
        <div
          className={`max-w-[1280px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4 transition-all duration-300 ${
            encolhido ? 'py-1.5' : 'py-2.5'
          }`}
        >
          <a href="#/" className="flex items-center shrink-0" aria-label={config.nomeLoja}>
            <img
              src={midia("logo.png")}
              alt={config.nomeLoja}
              className={`w-auto object-contain transition-all duration-500 ${
                encolhido ? 'h-11 md:h-12' : 'h-14 md:h-[68px]'
              }`}
            />
          </a>

          <nav className="hidden md:flex items-center gap-9">
            {LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => irPara(link.id)}
                data-ativo={secao === link.id}
                className={`link-sub text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors ${
                  secao === link.id ? 'text-ink' : 'text-body hover:text-ink'
                }`}
              >
                {link.rotulo}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-0.5 md:gap-1">
            <AcaoIcone
              rotulo={buscaAberta ? 'Fechar busca' : 'Buscar peças'}
              onClick={() => {
                const abrindo = !buscaAberta;
                setBuscaAberta(abrindo);
                // abrindo a busca, as gavetas saem da frente
                if (abrindo) onAbrirBusca?.();
              }}
            >
              {buscaAberta ? <FaTimes /> : <FaSearch className="text-[15px]" />}
            </AcaoIcone>

            <AcaoIcone
              rotulo="Meus favoritos"
              onClick={() => {
                setBuscaAberta(false);
                onAbrirFavoritos();
              }}
              contador={favoritos.length}
            >
              <FaHeart className="text-[15px]" />
            </AcaoIcone>

            <AcaoIcone
              rotulo="Minha sacola"
              onClick={() => {
                setBuscaAberta(false);
                onAbrirSacola();
              }}
              contador={qtdSacola}
            >
              <FaShoppingBag className="text-[15px]" />
            </AcaoIcone>

            <span className="hidden md:block w-px h-6 bg-line mx-2" />

            <div className="hidden md:flex items-center gap-0.5">
              <AcaoIcone rotulo="Instagram" href={`https://www.instagram.com/${config.instagram}/`}>
                <FaInstagram className="text-[15px]" />
              </AcaoIcone>
              <a
                href={`https://wa.me/${config.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1.5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-[11px] font-bold tracking-[0.14em] uppercase hover:bg-rosedark transition-colors"
              >
                <FaWhatsapp className="text-sm" /> Falar
              </a>
            </div>
          </div>
        </div>

        {buscaAberta && (
          <div className="border-t border-line bg-cream/95 animate-fade-in">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-4 flex items-center gap-3">
              <FaSearch className="text-rose text-sm" />
              <input
                autoFocus
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Busque por nome, categoria ou cor..."
                className="flex-1 bg-transparent outline-none text-ink placeholder:text-muted/70 py-1 text-[15px]"
              />
              {busca && (
                <button
                  onClick={() => setBusca('')}
                  className="text-[10px] tracking-[0.16em] uppercase text-muted hover:text-ink transition-colors"
                >
                  limpar
                </button>
              )}
              <button
                onClick={() => setBuscaAberta(false)}
                aria-label="Fechar busca"
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-ink hover:bg-blush/50 transition-colors"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
