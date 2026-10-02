import { useMemo, useState } from 'react';
import {
  FaPlus,
  FaSearch,
  FaPen,
  FaTrashAlt,
  FaBoxOpen,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaCheck,
  FaTimes,
  FaTags,
  FaEyeSlash,
  FaBolt,
  FaCloudUploadAlt,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { useStore } from '../store/StoreContext';
import { formatarPreco, parsePreco } from '../lib/utils';
import Numero from '../components/Numero';

const Switch = ({ ativo, onClick, rotulo }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2.5 group"
    aria-pressed={ativo}
    aria-label={`${rotulo}: ${ativo ? 'ligado' : 'desligado'}`}
    title={rotulo}
  >
    <span className="switch" data-on={ativo} />
    {/* o rótulo fica sempre visível: no celular não existe hover para
        descobrir qual chave é qual */}
    <span
      className={`text-[11px] font-medium transition-colors whitespace-nowrap ${
        ativo ? 'text-ink' : 'text-muted group-hover:text-body'
      }`}
    >
      {rotulo}
    </span>
  </button>
);

const CartaoMetrica = ({ icone, rotulo, valor, destaque, largo }) => (
  <div
    data-revelar
    className={`subir bg-cream border border-line rounded-2xl p-5 sombra-suave hover:sombra-alta ${
      largo ? 'col-span-2 lg:col-span-1' : ''
    }`}
  >
    <div className="flex items-center gap-2.5 mb-3">
      <span
        className={`w-8 h-8 rounded-lg flex items-center justify-center text-[13px] ${
          destaque ? 'bg-ink text-cream' : 'bg-sand text-rose'
        }`}
      >
        {icone}
      </span>
      <p className="text-[10px] tracking-[0.14em] uppercase text-muted">{rotulo}</p>
    </div>
    <p className="font-display text-[1.9rem] text-ink leading-none">{valor}</p>
  </div>
);

const FILTROS = [
  { id: 'todas', rotulo: 'Todas' },
  { id: 'novidades', rotulo: 'Novidades' },
  { id: 'esgotadas', rotulo: 'Esgotadas' },
  { id: 'ocultas', rotulo: 'Ocultas' },
];

const PainelProdutos = ({ onNovo, onEditar, onPublicar }) => {
  const {
    produtos,
    categorias,
    alteracoesNaoPublicadas,
    espaco,
    alternarCampo,
    removerProduto,
    atualizarProduto,
    moverProduto,
  } = useStore();

  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('todas');
  const [categoria, setCategoria] = useState('todas');
  const [confirmando, setConfirmando] = useState(null);
  const [editandoPreco, setEditandoPreco] = useState(null);
  const [precoTemp, setPrecoTemp] = useState('');

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return produtos.filter((p) => {
      if (termo && !`${p.nome} ${p.categoria}`.toLowerCase().includes(termo)) return false;
      if (categoria !== 'todas' && p.categoria !== categoria) return false;
      if (filtro === 'esgotadas') return p.esgotado;
      if (filtro === 'ocultas') return !p.ativo;
      if (filtro === 'novidades') return p.novoLancamento;
      return true;
    });
  }, [produtos, busca, filtro, categoria]);

  const stats = useMemo(
    () => ({
      total: produtos.length,
      esgotadas: produtos.filter((p) => p.esgotado).length,
      novidades: produtos.filter((p) => p.novoLancamento).length,
    }),
    [produtos]
  );

  const salvarPreco = (id) => {
    atualizarProduto(id, { preco: parsePreco(precoTemp) });
    setEditandoPreco(null);
  };

  return (
    <div className="animate-fade-in">
      <header className="flex flex-wrap items-end justify-between gap-4 mb-7">
        <div>
          <p className="eyebrow mb-2">Catálogo</p>
          <h1 className="font-display text-[2.25rem] text-ink leading-none">Suas peças</h1>
          <p className="text-body text-sm mt-2">
            Cadastre, edite preços e controle o que aparece na loja.
          </p>
        </div>
        <button
          onClick={onNovo}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-ink text-cream rounded-xl text-[11px] font-bold tracking-[0.14em] uppercase hover:bg-rosedark transition-colors sombra-alta"
        >
          <FaPlus className="text-[11px]" /> Nova peça
        </button>
      </header>

      {espaco.porcentagem > 70 && (
        <button
          onClick={onPublicar}
          className="w-full text-left flex items-start gap-3.5 bg-red-50 border border-red-200 rounded-2xl p-4 mb-3 hover:border-red-400 transition-colors"
        >
          <FaExclamationTriangle className="text-red-600 shrink-0 mt-0.5" />
          <span className="flex-1">
            <span className="block text-[13px] font-semibold text-ink">
              A memória do navegador está em {Math.round(espaco.porcentagem)}%
            </span>
            <span className="block text-[12px] text-body mt-0.5">
              Publique o catálogo e apague peças antigas — perto de 100% os cadastros
              novos são recusados.
            </span>
          </span>
        </button>
      )}

      {alteracoesNaoPublicadas && (
        <button
          onClick={onPublicar}
          className="w-full text-left flex items-start gap-3.5 bg-blush/40 border border-rose/40 rounded-2xl p-4 mb-5 hover:border-rose transition-colors group"
        >
          <FaCloudUploadAlt className="text-rose shrink-0 mt-0.5" />
          <span className="flex-1">
            <span className="block text-[13px] font-semibold text-ink">
              Suas alterações ainda não estão no site
            </span>
            <span className="block text-[12px] text-body mt-0.5">
              Clique aqui para publicar e deixar o catálogo igual para quem acessa.
            </span>
          </span>
          <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-rosedark group-hover:translate-x-0.5 transition-transform shrink-0 mt-1">
            Publicar
          </span>
        </button>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-7">
        <CartaoMetrica icone={<FaTags />} rotulo="No catálogo" valor={<Numero valor={stats.total} />} destaque />
        <CartaoMetrica icone={<FaBoxOpen />} rotulo="Esgotadas" valor={<Numero valor={stats.esgotadas} />} />
        <CartaoMetrica icone={<FaBolt />} rotulo="Novidades" valor={<Numero valor={stats.novidades} />} largo />
      </div>

      {/* filtros */}
      <div className="bg-cream border border-line rounded-2xl p-3 mb-5 flex flex-col lg:flex-row gap-3">
        <div className="flex-1 flex items-center gap-3 bg-sand border border-line rounded-xl px-4">
          <FaSearch className="text-muted text-xs" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar peça por nome ou categoria..."
            className="flex-1 bg-transparent py-3 outline-none text-sm text-ink placeholder:text-muted/70"
          />
          {busca && (
            <button onClick={() => setBusca('')} aria-label="Limpar busca" className="text-muted hover:text-ink">
              <FaTimes className="text-xs" />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className={`shrink-0 px-4 py-2.5 rounded-xl text-[11px] font-bold tracking-[0.1em] uppercase border transition-all ${
                filtro === f.id
                  ? 'bg-ink text-cream border-ink'
                  : 'bg-sand border-line text-body hover:border-rose'
              }`}
            >
              {f.rotulo}
            </button>
          ))}

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            aria-label="Filtrar por categoria"
            className="select-custom shrink-0 bg-sand border border-line rounded-xl px-4 py-2.5 text-[11px] font-semibold text-ink outline-none cursor-pointer"
          >
            <option value="todas">Categoria: todas</option>
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* lista */}
      {lista.length === 0 ? (
        <div className="bg-cream border border-dashed border-line rounded-2xl py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-sand border border-line flex items-center justify-center text-rose mx-auto mb-5">
            <FaBoxOpen />
          </div>
          <h3 className="font-display text-2xl text-ink mb-2">Nenhuma peça por aqui</h3>
          <p className="text-sm text-body mb-7">
            Ajuste a busca ou cadastre uma peça nova no catálogo.
          </p>
          <button
            onClick={onNovo}
            className="px-7 py-3.5 bg-ink text-cream rounded-xl text-[11px] font-bold tracking-[0.14em] uppercase hover:bg-rosedark transition-colors"
          >
            Adicionar peça
          </button>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {lista.map((produto) => (
            <li
              key={produto.id}
              data-revelar
              className={`group bg-cream border rounded-2xl p-3 flex flex-col lg:flex-row lg:items-center gap-4 transition-all sombra-suave hover:sombra-alta ${
                produto.ativo ? 'border-line' : 'border-dashed border-muted/40 opacity-75'
              }`}
            >
              <div className="flex gap-4 flex-1 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={produto.imagens[0]}
                    alt={produto.nome}
                    className="w-16 h-20 object-cover rounded-xl bg-sand"
                  />
                  {!produto.ativo && (
                    <span className="absolute inset-0 rounded-xl bg-ink/50 flex items-center justify-center text-cream">
                      <FaEyeSlash className="text-xs" />
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    {produto.esgotado && (
                      <span className="bg-ink text-cream text-[9px] font-bold tracking-[0.12em] uppercase px-2 py-0.5 rounded-full">
                        Esgotada
                      </span>
                    )}
                    {produto.novoLancamento && (
                      <span className="bg-blush/60 text-rosedark text-[9px] font-bold tracking-[0.12em] uppercase px-2 py-0.5 rounded-full">
                        Novo
                      </span>
                    )}
                    {produto.destaque && (
                      <span className="bg-rose text-white text-[9px] font-bold tracking-[0.12em] uppercase px-2 py-0.5 rounded-full">
                        Destaque
                      </span>
                    )}
                  </div>

                  <h3 className="text-ink font-medium leading-snug truncate">{produto.nome}</h3>
                  <p className="text-[11px] text-muted mt-0.5 truncate">
                    {produto.categoria} · {produto.tamanhos.join(', ')} ·{' '}
                    {produto.imagens.length} foto{produto.imagens.length > 1 ? 's' : ''}
                  </p>

                  <div className="mt-2">
                    {editandoPreco === produto.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          autoFocus
                          value={precoTemp}
                          onChange={(e) => setPrecoTemp(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') salvarPreco(produto.id);
                            if (e.key === 'Escape') setEditandoPreco(null);
                          }}
                          className="w-28 px-3 py-1.5 rounded-lg border border-rose bg-white text-sm outline-none"
                        />
                        <button
                          onClick={() => salvarPreco(produto.id)}
                          className="w-8 h-8 rounded-lg bg-ink text-cream flex items-center justify-center"
                          aria-label="Salvar preço"
                        >
                          <FaCheck className="text-[10px]" />
                        </button>
                        <button
                          onClick={() => setEditandoPreco(null)}
                          className="w-8 h-8 rounded-lg border border-line text-muted flex items-center justify-center"
                          aria-label="Cancelar"
                        >
                          <FaTimes className="text-[10px]" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditandoPreco(produto.id);
                          setPrecoTemp(String(produto.preco).replace('.', ','));
                        }}
                        title="Clique para editar o preço"
                        className="inline-flex items-center gap-2 text-ink font-semibold hover:text-rose transition-colors"
                      >
                        {formatarPreco(produto.preco)}
                        <FaPen className="text-[9px] text-muted" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* controles */}
              <div className="flex items-center justify-between lg:justify-end gap-5 lg:gap-7 shrink-0 border-t lg:border-t-0 border-line pt-3 lg:pt-0">
                <div className="flex flex-col gap-2">
                  <Switch
                    ativo={produto.esgotado}
                    onClick={() => alternarCampo(produto.id, 'esgotado')}
                    rotulo="Esgotada"
                  />
                  <Switch
                    ativo={produto.ativo}
                    onClick={() => alternarCampo(produto.id, 'ativo')}
                    rotulo="Na loja"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moverProduto(produto.id, -1)}
                      title="Subir na vitrine"
                      className="w-8 h-7 rounded-lg border border-line bg-sand text-muted hover:text-ink hover:border-rose flex items-center justify-center"
                    >
                      <FaArrowUp className="text-[9px]" />
                    </button>
                    <button
                      onClick={() => moverProduto(produto.id, 1)}
                      title="Descer na vitrine"
                      className="w-8 h-7 rounded-lg border border-line bg-sand text-muted hover:text-ink hover:border-rose flex items-center justify-center"
                    >
                      <FaArrowDown className="text-[9px]" />
                    </button>
                  </div>

                  <button
                    onClick={() => alternarCampo(produto.id, 'destaque')}
                    title="Colocar em destaque"
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                      produto.destaque
                        ? 'bg-rose text-white border-rose'
                        : 'bg-sand border-line text-muted hover:text-rose hover:border-rose'
                    }`}
                  >
                    <FaStar className="text-xs" />
                  </button>

                  <button
                    onClick={() => onEditar(produto)}
                    title="Editar peça"
                    className="w-10 h-10 rounded-xl bg-ink text-cream flex items-center justify-center hover:bg-rosedark transition-colors"
                  >
                    <FaPen className="text-xs" />
                  </button>

                  {confirmando === produto.id ? (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          removerProduto(produto.id);
                          setConfirmando(null);
                        }}
                        className="h-10 px-3.5 rounded-xl bg-red-600 text-white text-[10px] font-bold tracking-wide"
                      >
                        EXCLUIR
                      </button>
                      <button
                        onClick={() => setConfirmando(null)}
                        className="w-10 h-10 rounded-xl border border-line bg-sand text-muted flex items-center justify-center"
                        aria-label="Cancelar exclusão"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmando(produto.id)}
                      title="Excluir peça"
                      className="w-10 h-10 rounded-xl border border-line bg-sand text-muted hover:text-red-600 hover:border-red-200 flex items-center justify-center transition-colors"
                    >
                      <FaTrashAlt className="text-xs" />
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PainelProdutos;
