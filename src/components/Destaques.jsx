import { useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import { useStore } from '../store/StoreContext';
import { formatarPreco } from '../lib/utils';

const Destaques = ({ onSelecionar }) => {
  const { produtosVisiveis } = useStore();
  const trilho = useRef(null);

  const destaques = produtosVisiveis.filter((p) => p.destaque && !p.esgotado);
  if (destaques.length < 2) return null;

  const rolar = (delta) =>
    trilho.current?.scrollBy({ left: delta * 320, behavior: 'smooth' });

  return (
    <section className="py-16 md:py-20 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-5 md:px-8">
        <div className="flex items-end justify-between gap-6 mb-8" data-revelar>
          <div>
            <p className="eyebrow mb-3">Seleção especial</p>
            <h2 className="font-display text-ink text-[2rem] md:text-[2.6rem] leading-tight">
              As <span className="italic text-rose">queridinhas</span> da loja
            </h2>
          </div>

          <div className="hidden md:flex gap-2 shrink-0">
            <button
              onClick={() => rolar(-1)}
              aria-label="Anterior"
              className="w-11 h-11 rounded-full border border-line bg-cream text-ink flex items-center justify-center hover:bg-ink hover:text-cream transition-colors"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            <button
              onClick={() => rolar(1)}
              aria-label="Próximo"
              className="w-11 h-11 rounded-full border border-line bg-cream text-ink flex items-center justify-center hover:bg-ink hover:text-cream transition-colors"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={trilho}
        className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory px-5 md:px-8 pb-2 max-w-[1280px] mx-auto"
      >
        {destaques.map((produto) => (
          <button
            key={produto.id}
            onClick={() => onSelecionar(produto)}
            data-revelar
            className="group relative shrink-0 snap-start w-[76vw] sm:w-[46vw] lg:w-[360px] aspect-[4/5] rounded-[1.75rem] overflow-hidden text-left sombra-suave hover:sombra-alta transition-shadow duration-500"
          >
            <img
              src={produto.imagens[0]}
              alt={produto.nome}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/5" />
            <span className="absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-ink/10" />

            <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
              <p className="text-[9px] tracking-[0.22em] uppercase text-cream/70 mb-2">
                {produto.categoria}
              </p>
              <h3 className="font-display text-2xl leading-tight mb-2">{produto.nome}</h3>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[15px] font-semibold">{formatarPreco(produto.preco)}</span>
                <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] uppercase opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-400">
                  Ver peça <FaArrowRight className="text-[10px]" />
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Destaques;
