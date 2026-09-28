import { FaSearch } from 'react-icons/fa';
import ProductCard from './ProductCard';

const ProductGrid = ({ produtos, onSelecionar, aoLimpar }) => {
  if (!produtos.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 gap-4 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-cream border border-line flex items-center justify-center text-rose text-xl mb-1">
          <FaSearch />
        </div>
        <h3 className="text-ink font-display text-2xl">Nada por aqui ainda</h3>
        <p className="text-body text-sm max-w-sm leading-relaxed text-pretty">
          Não encontramos peças com esses filtros. Tente outra categoria ou fale
          com a gente no WhatsApp — pode ser que tenhamos algo reservado.
        </p>
        <button
          onClick={aoLimpar}
          className="mt-2 px-8 py-3.5 rounded-full border border-line bg-cream text-ink text-[10px] font-bold tracking-[0.18em] uppercase hover:bg-ink hover:text-cream hover:border-ink transition-all"
        >
          Limpar filtros
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
      {produtos.map((produto) => (
        <ProductCard
          key={produto.id}
          product={produto}
          onClick={() => onSelecionar(produto)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
