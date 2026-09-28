import { FaWhatsapp, FaArrowDown, FaStar } from 'react-icons/fa';
import { useStore } from '../store/StoreContext';
import { midia } from '../lib/utils';
import { useParallax, useSeguirMouse } from '../hooks/animacoes';
import Numero from './Numero';

const HeroBanner = () => {
  const { config, produtosVisiveis, categorias } = useStore();
  const novidades = produtosVisiveis.filter((p) => p.novoLancamento).length;

  const arara = useParallax(0.05);
  const monograma = useParallax(0.09);
  const cartao = useSeguirMouse(14);

  const palavras = config.frase.trim().split(' ');
  const inicioFrase = palavras.slice(0, -2).join(' ');
  const fimFrase = palavras.slice(-2).join(' ');

  const numeros = [
    { valor: produtosVisiveis.length, rotulo: 'peças no catálogo' },
    { valor: categorias.length, rotulo: 'categorias' },
    { valor: 100, sufixo: '%', rotulo: 'atendimento humano' },
  ];

  const irParaCatalogo = () =>
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="inicio"
      className="grao relative w-full overflow-hidden bg-gradient-to-br from-cream via-sand to-blush/60 pt-10 pb-16 md:pt-14 md:pb-24"
    >
      <div className="absolute -top-32 -left-20 w-80 h-80 rounded-full bg-blush/45 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-rose/10 blur-3xl pointer-events-none" />

      {/* monograma ao fundo, com parallax */}
      <span
        ref={monograma}
        aria-hidden="true"
        className="hidden lg:block absolute -left-24 top-[62%] -translate-y-1/2 font-display italic text-[26rem] leading-none text-ink/[0.028] select-none pointer-events-none"
      >
        RL
      </span>

      {/* arara de roupas, deslizando mais devagar que a página */}
      <div
        ref={arara}
        className="absolute bottom-0 -right-[26%] md:-right-[6%] lg:right-[-3%] w-[118%] md:w-[58%] lg:w-[52%] z-0 pointer-events-none opacity-40 md:opacity-100"
      >
        <img
          src={midia('arara-roupas.png')}
          alt="Arara de roupas da RL Store"
          className="w-full h-auto object-contain drop-shadow-2xl md:scale-105 lg:scale-110 origin-bottom-right"
        />
      </div>

      <div className="absolute inset-0 z-[1] md:hidden pointer-events-none bg-gradient-to-t from-sand via-sand/75 to-sand/35" />

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 relative z-10">
        <div className="w-full md:w-[58%] lg:w-[52%] flex flex-col items-center md:items-start text-center md:text-left">
          <span className="inline-flex items-center gap-2.5 text-[10px] font-bold tracking-[0.24em] uppercase text-rosedark bg-cream/90 border border-line px-4 py-2 rounded-full mb-8 sombra-suave animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-rose animate-pulse" />
            {novidades > 0 ? `${novidades} novidades essa semana` : 'Curadoria da semana'}
          </span>

          <img
            src={midia('logo.png')}
            alt={config.nomeLoja}
            className="hidden md:block w-40 lg:w-48 mb-6 drop-shadow-sm animate-fade-up delay-1"
          />

          {/* título sobe linha por linha, como uma cortina */}
          <h1 className="font-display text-ink mb-6 leading-[0.98] text-[3.25rem] md:text-[4rem] lg:text-[5rem]">
            <span className="linha-mascara">
              <span style={{ '--atraso': '120ms' }}>{inicioFrase}</span>
            </span>
            <span className="linha-mascara">
              <span className="italic font-normal text-rose" style={{ '--atraso': '260ms' }}>
                {fimFrase}
              </span>
            </span>
          </h1>

          <p className="text-body text-base md:text-lg mb-9 leading-relaxed max-w-md text-pretty animate-fade-up delay-4">
            {config.subtitulo}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto animate-fade-up delay-5">
            <button
              onClick={irParaCatalogo}
              className="brilho group inline-flex items-center justify-center gap-3 px-9 py-4 bg-ink text-cream rounded-full text-[11px] font-bold tracking-[0.16em] uppercase hover:bg-rosedark transition-all duration-500 sombra-alta hover:-translate-y-1"
            >
              Ver catálogo
              <FaArrowDown className="text-[11px] group-hover:translate-y-1 transition-transform duration-500" />
            </button>
            <a
              href={`https://wa.me/${config.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-cream/90 border border-line text-ink rounded-full text-[11px] font-bold tracking-[0.16em] uppercase hover:border-rose hover:-translate-y-1 transition-all duration-500"
            >
              <FaWhatsapp className="text-base text-[#25D366] group-hover:animate-balancar" />
              Falar conosco
            </a>
          </div>

          <div className="mt-12 flex items-stretch gap-6 md:gap-8 animate-fade-up delay-6">
            {numeros.map((item, i) => (
              <div key={item.rotulo} className="flex items-stretch gap-6 md:gap-8">
                {i > 0 && <span className="w-px bg-line" />}
                <div className="text-center md:text-left">
                  <p className="font-display text-3xl text-ink leading-none mb-1.5">
                    <Numero valor={item.valor} sufixo={item.sufixo || ''} />
                  </p>
                  <p className="text-[10px] tracking-[0.16em] uppercase text-muted max-w-[90px]">
                    {item.rotulo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* cartãozinho que flutua e ainda acompanha o mouse */}
      <div className="hidden lg:block absolute bottom-32 right-[15%] z-10 animate-flutuar">
        <div
          ref={cartao}
          className="flex items-center gap-3.5 bg-cream/95 border border-line rounded-2xl px-5 py-4 sombra-flutuante transition-transform duration-300 ease-out"
          style={{ transform: 'translate3d(var(--mx, 0px), var(--my, 0px), 0)' }}
        >
          <div className="w-11 h-11 rounded-full bg-blush/60 flex items-center justify-center text-rose">
            <FaStar />
          </div>
          <div>
            <p className="text-[11px] font-bold text-ink tracking-wide">Curadoria RL Store</p>
            <p className="text-[11px] text-muted">Cada peça escolhida a dedo</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
