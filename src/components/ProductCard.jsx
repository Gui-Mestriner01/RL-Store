import { useState } from 'react';
import { FaRegHeart, FaHeart, FaShoppingBag } from 'react-icons/fa';
import { useStore } from '../store/StoreContext';
import { formatarPreco } from '../lib/utils';

const ProductCard = ({ product, onClick }) => {
  const { ehFavorito, alternarFavorito, adicionarNaSacola } = useStore();
  const [carregou, setCarregou] = useState(false);
  const favorito = ehFavorito(product.id);

  const capa = product.imagens[0] || '';
  const verso = product.imagens[1] || capa;

  const desconto =
    product.precoAntigo && product.precoAntigo > product.preco
      ? Math.round((1 - product.preco / product.precoAntigo) * 100)
      : 0;

  const adicionarRapido = (e) => {
    e.stopPropagation();
    adicionarNaSacola(product, {
      tamanho: product.tamanhos[0],
      cor: product.cores[0]?.nome,
    });
  };

  return (
    <article data-revelar className="group flex flex-col">
      <div
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        aria-label={`Ver detalhes de ${product.nome}`}
        className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-blush/30 cursor-pointer sombra-suave group-hover:sombra-alta transition-shadow duration-500"
      >
        {!carregou && <div className="absolute inset-0 skeleton" />}

        <img
          src={capa}
          alt={product.nome}
          loading="lazy"
          onLoad={() => setCarregou(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-[800ms] group-hover:opacity-0 group-hover:scale-105 ${
            product.esgotado ? 'grayscale-[65%]' : ''
          }`}
        />
        <img
          src={verso}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover opacity-0 scale-105 transition-all duration-[800ms] group-hover:opacity-100 group-hover:scale-100 ${
            product.esgotado ? 'grayscale-[65%]' : ''
          }`}
        />

        {/* borda interna fininha, dá acabamento */}
        <span className="absolute inset-0 rounded-[1.5rem] ring-1 ring-inset ring-ink/5 pointer-events-none" />

        {/* selos */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start">
          {product.esgotado && (
            <span className="bg-ink/90 text-cream text-[9px] font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full backdrop-blur-sm">
              Esgotado
            </span>
          )}
          {!product.esgotado && desconto > 0 && (
            <span className="bg-rose text-white text-[9px] font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full">
              −{desconto}%
            </span>
          )}
          {!product.esgotado && product.novoLancamento && (
            <span className="bg-cream/95 text-ink text-[9px] font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full backdrop-blur-sm">
              Novo
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            alternarFavorito(product.id);
          }}
          aria-label={favorito ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
          className={`absolute top-3.5 right-3.5 w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 ${
            favorito
              ? 'bg-cream text-rose scale-105 sombra-suave'
              : 'bg-cream/75 text-muted hover:bg-cream hover:text-rose md:opacity-0 md:group-hover:opacity-100'
          }`}
        >
          {favorito ? <FaHeart className="text-[13px] animate-pop" /> : <FaRegHeart className="text-[13px]" />}
        </button>

        {!product.esgotado && (
          <button
            onClick={adicionarRapido}
            className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-center gap-2 py-3 rounded-full bg-cream/95 text-ink text-[10px] font-bold tracking-[0.16em] uppercase opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 hover:bg-ink hover:text-cream sombra-alta"
          >
            <FaShoppingBag className="text-[11px]" /> Adicionar
          </button>
        )}

        {product.esgotado && (
          <div className="absolute inset-0 bg-cream/20 flex items-center justify-center">
            <span className="text-ink text-[10px] font-bold tracking-[0.22em] uppercase bg-cream/95 px-5 py-2.5 rounded-full">
              Indisponível
            </span>
          </div>
        )}
      </div>

      <div className="pt-4 px-0.5">
        <p className="text-[9px] tracking-[0.2em] uppercase text-muted mb-1.5">
          {product.categoria}
        </p>

        <h3
          onClick={onClick}
          className="text-[15px] font-medium text-ink leading-snug line-clamp-2 cursor-pointer group-hover:text-rosedark transition-colors"
        >
          {product.nome}
        </h3>

        <div className="flex items-end justify-between gap-2 mt-2.5">
          <div className="flex items-baseline gap-2">
            {desconto > 0 && (
              <span className="text-[11px] text-muted line-through">
                {formatarPreco(product.precoAntigo)}
              </span>
            )}
            <span className="text-[15px] font-semibold text-ink">
              {formatarPreco(product.preco)}
            </span>
          </div>

          {product.cores.length > 0 && (
            <div className="flex items-center gap-1 pb-0.5">
              {product.cores.slice(0, 4).map((cor) => (
                <span
                  key={cor.nome}
                  title={cor.nome}
                  className="w-3 h-3 rounded-full ring-1 ring-inset ring-ink/15"
                  style={{ backgroundColor: cor.hex }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
