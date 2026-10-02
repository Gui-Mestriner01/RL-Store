import { useState } from 'react';
import { FaRegHeart, FaHeart, FaShoppingBag } from 'react-icons/fa';
import { useStore } from '../store/StoreContext';
import { formatarPreco } from '../lib/utils';

const ProductCard = ({ product, onClick }) => {
  const { ehFavorito, alternarFavorito, adicionarNaSacola } = useStore();
  const [carregou, setCarregou] = useState(false);
  const [batendo, setBatendo] = useState(false);
  const favorito = ehFavorito(product.id);

  const capa = product.imagens[0] || '';
  const verso = product.imagens[1] || capa;

  const desconto =
    product.precoAntigo && product.precoAntigo > product.preco
      ? Math.round((1 - product.preco / product.precoAntigo) * 100)
      : 0;

  // Com mais de uma cor ou tamanho, quem escolhe é a cliente: abre o detalhe.
  const precisaEscolher = product.cores.length > 1 || product.tamanhos.length > 1;

  const adicionarRapido = (e) => {
    e.stopPropagation();
    if (precisaEscolher) {
      onClick();
      return;
    }
    adicionarNaSacola(product, {
      tamanho: product.tamanhos[0],
      cor: product.cores[0]?.nome,
    });
  };

  const favoritar = (e) => {
    e.stopPropagation();
    if (!favorito) {
      setBatendo(true);
      setTimeout(() => setBatendo(false), 600);
    }
    alternarFavorito(product.id);
  };

  return (
    <article data-revelar className="group flex flex-col">
      <div
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        aria-label={`Ver detalhes de ${product.nome}`}
        className="subir relative aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-blush/30 cursor-pointer sombra-suave group-hover:sombra-alta"
      >
        {!carregou && <div className="absolute inset-0 skeleton" />}

        <img
          src={capa}
          alt={product.nome}
          loading="lazy"
          onLoad={() => setCarregou(true)}
          className={`absolute inset-0 w-full h-full object-cover group-hover:opacity-0 group-hover:scale-[1.07] ${
            carregou ? 'foto-pronta' : 'foto-entrando'
          } ${product.esgotado ? 'grayscale-[65%]' : ''}`}
          style={{ transitionDuration: '900ms' }}
        />
        <img
          src={verso}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover opacity-0 scale-105 transition-all duration-[900ms] ease-out group-hover:opacity-100 group-hover:scale-100 ${
            product.esgotado ? 'grayscale-[65%]' : ''
          }`}
        />

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
          onClick={favoritar}
          aria-label={favorito ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
          className={`absolute top-3.5 right-3.5 w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-400 ${
            batendo ? 'anel-coracao' : ''
          } ${
            favorito
              ? 'bg-cream text-rose scale-105 sombra-suave'
              : 'bg-cream/75 text-muted hover:bg-cream hover:text-rose hover:scale-110 md:opacity-0 md:group-hover:opacity-100'
          }`}
        >
          {favorito ? <FaHeart className="text-[13px] animate-pop" /> : <FaRegHeart className="text-[13px]" />}
        </button>

        {!product.esgotado && (
          <button
            onClick={adicionarRapido}
            className="brilho absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-center gap-2 py-3 rounded-full bg-cream/95 text-ink text-[10px] font-bold tracking-[0.16em] uppercase opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out hover:bg-ink hover:text-cream sombra-alta"
          >
            <FaShoppingBag className="text-[11px]" /> {precisaEscolher ? 'Escolher' : 'Adicionar'}
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
          className="text-[15px] font-medium text-ink leading-snug line-clamp-2 cursor-pointer group-hover:text-rosedark transition-colors duration-300"
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
              {product.cores.slice(0, 4).map((cor, i) => (
                <span
                  key={cor.nome}
                  title={cor.nome}
                  className="w-3 h-3 rounded-full ring-1 ring-inset ring-ink/15 transition-transform duration-300 group-hover:scale-125"
                  style={{ backgroundColor: cor.hex, transitionDelay: `${i * 40}ms` }}
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
