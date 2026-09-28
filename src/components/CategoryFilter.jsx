import { FaSlidersH } from 'react-icons/fa';
import { useStore } from '../store/StoreContext';
import TituloSecao from './TituloSecao';

const ORDENACOES = [
  { valor: 'destaque', rotulo: 'Destaques' },
  { valor: 'recentes', rotulo: 'Novidades' },
  { valor: 'menor', rotulo: 'Menor preço' },
  { valor: 'maior', rotulo: 'Maior preço' },
  { valor: 'az', rotulo: 'Nome (A–Z)' },
];

const CategoryFilter = ({
  categoriaAtiva,
  setCategoriaAtiva,
  ordenacao,
  setOrdenacao,
  total,
  busca,
}) => {
  const { categorias, produtosVisiveis } = useStore();
  const lista = ['Todos', ...categorias];

  const contar = (categoria) =>
    categoria === 'Todos'
      ? produtosVisiveis.length
      : produtosVisiveis.filter(
          (p) => p.categoria.toLowerCase() === categoria.toLowerCase()
        ).length;

  return (
    <div className="pt-16 md:pt-20">
      <TituloSecao
        eyebrow="Coleção atual"
        titulo="Nosso"
        destaque="catálogo"
        texto="Peças reais, em estoque agora. Toque em qualquer uma para ver fotos, tamanhos e cores."
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-10">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
          {lista.map((categoria) => {
            const ativa = categoriaAtiva.toLowerCase() === categoria.toLowerCase();
            const quantidade = contar(categoria);
            return (
              <button
                key={categoria}
                onClick={() => setCategoriaAtiva(categoria)}
                className={`shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-bold tracking-[0.16em] uppercase transition-all duration-300 border ${
                  ativa
                    ? 'bg-ink text-cream border-ink sombra-suave'
                    : quantidade === 0
                      ? 'bg-cream/50 border-line/60 text-muted/60 hover:border-rose'
                      : 'bg-cream border-line text-body hover:border-rose hover:text-ink'
                }`}
              >
                {categoria}
                <span className={ativa ? 'text-cream/50' : 'text-muted/70'}>{quantidade}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0">
          <span className="text-[11px] text-muted tracking-wide">
            {total} {total === 1 ? 'peça encontrada' : 'peças encontradas'}
            {busca ? ` para “${busca}”` : ''}
          </span>
          <label className="flex items-center gap-2 bg-cream border border-line rounded-full pl-4 py-2.5 cursor-pointer hover:border-rose transition-colors">
            <FaSlidersH className="text-muted text-[11px]" />
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
              aria-label="Ordenar peças"
              className="select-custom bg-transparent text-[11px] font-semibold text-ink outline-none cursor-pointer"
            >
              {ORDENACOES.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.rotulo}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
