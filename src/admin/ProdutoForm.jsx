import { useRef, useState } from 'react';
import {
  FaTimes,
  FaPlus,
  FaTrashAlt,
  FaImages,
  FaStar,
  FaSpinner,
  FaArrowLeft,
  FaArrowRight,
  FaEye,
} from 'react-icons/fa';
import { useStore } from '../store/StoreContext';
import { comprimirImagem, parsePreco, formatarPreco } from '../lib/utils';
import { useEscape, useTravarScroll } from '../hooks/useHashRoute';

const TAMANHOS_RAPIDOS = ['PP', 'P', 'M', 'G', 'GG', 'Tamanho Único'];
const CORES_RAPIDAS = [
  { nome: 'Preto', hex: '#000000' },
  { nome: 'Branco', hex: '#fefafa' },
  { nome: 'Marrom', hex: '#6F3826' },
  { nome: 'Bege', hex: '#d9c3b0' },
  { nome: 'Vinho', hex: '#7b1f2b' },
  { nome: 'Rosa', hex: '#e5b5b3' },
];

const VAZIO = {
  nome: '',
  preco: '',
  precoAntigo: '',
  categoria: '',
  descricao: '',
  aviso: '',
  imagens: [],
  tamanhos: ['Tamanho Único'],
  cores: [],
  novoLancamento: true,
  destaque: false,
  esgotado: false,
  ativo: true,
};

const entrada =
  'w-full px-4 py-3 rounded-xl border border-line bg-cream text-ink outline-none focus:border-rose transition-colors text-sm placeholder:text-muted/60';

const Bloco = ({ titulo, descricao, children }) => (
  <section className="bg-cream border border-line rounded-2xl p-5 md:p-6 mb-4">
    <div className="mb-5">
      <h3 className="text-ink font-semibold text-[15px]">{titulo}</h3>
      {descricao && <p className="text-[11px] text-muted mt-1">{descricao}</p>}
    </div>
    {children}
  </section>
);

const Campo = ({ rotulo, dica, children }) => (
  <label className="block mb-4 last:mb-0">
    <span className="eyebrow text-ink block mb-2">{rotulo}</span>
    {children}
    {dica && <span className="block text-[11px] text-muted mt-1.5">{dica}</span>}
  </label>
);

const ProdutoForm = ({ produto, onFechar }) => {
  const { criarProduto, atualizarProduto, categorias, avisar } = useStore();
  const editando = Boolean(produto);

  const [dados, setDados] = useState(() =>
    produto
      ? {
          ...produto,
          preco: String(produto.preco).replace('.', ','),
          precoAntigo: produto.precoAntigo
            ? String(produto.precoAntigo).replace('.', ',')
            : '',
        }
      : { ...VAZIO, categoria: categorias[0] || 'Outros' }
  );
  const [novoTamanho, setNovoTamanho] = useState('');
  const [novaCor, setNovaCor] = useState({ nome: '', hex: '#b07a75' });
  const [novaCategoria, setNovaCategoria] = useState('');
  const [carregandoFoto, setCarregandoFoto] = useState(false);
  const inputArquivo = useRef(null);

  useEscape(onFechar);
  useTravarScroll(true);

  const mudar = (campo, valor) => setDados((d) => ({ ...d, [campo]: valor }));

  /* -------- imagens -------- */
  const LIMITE_FOTO = 15 * 1024 * 1024; // 15 MB por foto
  const MAX_FOTOS = 10;

  const aoEscolherArquivos = async (evento) => {
    const arquivos = Array.from(evento.target.files || []);
    if (!arquivos.length) return;

    const vagas = MAX_FOTOS - dados.imagens.length;
    if (vagas <= 0) {
      avisar(`Máximo de ${MAX_FOTOS} fotos por peça.`, 'erro');
      if (inputArquivo.current) inputArquivo.current.value = '';
      return;
    }

    const aceitos = arquivos.slice(0, vagas).filter((arquivo) => {
      if (!arquivo.type.startsWith('image/')) {
        avisar(`"${arquivo.name}" não é uma imagem.`, 'erro');
        return false;
      }
      if (arquivo.size > LIMITE_FOTO) {
        avisar(`"${arquivo.name}" passa de 15 MB.`, 'erro');
        return false;
      }
      return true;
    });

    if (!aceitos.length) {
      if (inputArquivo.current) inputArquivo.current.value = '';
      return;
    }

    setCarregandoFoto(true);
    try {
      const convertidas = [];
      for (const arquivo of aceitos) {
        convertidas.push(await comprimirImagem(arquivo));
      }
      setDados((d) => ({ ...d, imagens: [...d.imagens, ...convertidas] }));
      avisar(`${convertidas.length} foto(s) adicionada(s).`);
    } catch (erro) {
      avisar(erro.message || 'Não consegui processar a imagem.', 'erro');
    } finally {
      setCarregandoFoto(false);
      if (inputArquivo.current) inputArquivo.current.value = '';
    }
  };

  const moverImagem = (indice, delta) => {
    setDados((d) => {
      const destino = indice + delta;
      if (destino < 0 || destino >= d.imagens.length) return d;
      const copia = [...d.imagens];
      [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
      return { ...d, imagens: copia };
    });
  };

  const removerImagem = (indice) =>
    setDados((d) => ({ ...d, imagens: d.imagens.filter((_, i) => i !== indice) }));

  /* -------- tamanhos e cores -------- */
  const adicionarTamanho = (valor) => {
    const t = (valor || '').trim();
    if (!t || dados.tamanhos.includes(t)) return;
    setDados((d) => ({ ...d, tamanhos: [...d.tamanhos, t] }));
    setNovoTamanho('');
  };

  const adicionarCor = (cor) => {
    if (!cor.nome.trim()) return;
    if (dados.cores.some((c) => c.nome.toLowerCase() === cor.nome.toLowerCase())) return;
    setDados((d) => ({ ...d, cores: [...d.cores, { ...cor, nome: cor.nome.trim() }] }));
    setNovaCor({ nome: '', hex: '#b07a75' });
  };

  /* -------- salvar -------- */
  const salvar = (e) => {
    e.preventDefault();
    if (!dados.nome.trim()) {
      avisar('Dê um nome para a peça.', 'erro');
      return;
    }
    if (!dados.imagens.length) {
      avisar('Adicione pelo menos uma foto.', 'erro');
      return;
    }

    const carga = {
      ...dados,
      nome: dados.nome.trim(),
      preco: parsePreco(dados.preco),
      precoAntigo: dados.precoAntigo ? parsePreco(dados.precoAntigo) : null,
      categoria: (novaCategoria.trim() || dados.categoria || 'Outros').trim(),
    };

    if (editando) atualizarProduto(produto.id, carga);
    else criarProduto(carga);

    onFechar();
  };

  /* -------- prévia -------- */
  const precoNumero = parsePreco(dados.preco);
  const precoAntigoNumero = dados.precoAntigo ? parsePreco(dados.precoAntigo) : 0;
  const desconto =
    precoAntigoNumero > precoNumero && precoNumero > 0
      ? Math.round((1 - precoNumero / precoAntigoNumero) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-[150] bg-ink/65 backdrop-blur-md flex items-end md:items-center justify-center md:p-6 animate-fade-in">
      <form
        onSubmit={salvar}
        className="bg-sand w-full max-w-5xl md:rounded-[2rem] rounded-t-[2rem] max-h-[95vh] md:max-h-[90vh] flex flex-col sombra-flutuante animate-slide-up md:animate-scale-in overflow-hidden"
      >
        <header className="bg-cream border-b border-line px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <p className="eyebrow mb-1">{editando ? 'Editando peça' : 'Cadastro'}</p>
            <h2 className="font-display text-2xl text-ink leading-none">
              {editando ? dados.nome || 'Peça sem nome' : 'Nova peça'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="w-10 h-10 rounded-full flex items-center justify-center text-ink hover:bg-blush/50 transition-colors"
          >
            <FaTimes />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-5 p-5 md:p-6">
            {/* ---------- coluna do formulário ---------- */}
            <div>
              <Bloco
                titulo="Fotos da peça"
                descricao="A primeira foto é a capa. As imagens são reduzidas automaticamente para caber na memória do navegador."
              >
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {dados.imagens.map((img, i) => (
                    <div
                      key={i}
                      className="relative group aspect-[3/4] rounded-xl overflow-hidden border border-line bg-white"
                    >
                      <img src={img} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                      {i === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-ink text-cream text-[8px] font-bold tracking-wider px-2 py-1 rounded-full flex items-center gap-1">
                          <FaStar className="text-[7px]" /> CAPA
                        </span>
                      )}
                      <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 p-1.5 bg-ink/75 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" onClick={() => moverImagem(i, -1)} className="text-cream p-1" aria-label="Mover para trás">
                          <FaArrowLeft className="text-[10px]" />
                        </button>
                        <button type="button" onClick={() => removerImagem(i)} className="text-red-300 p-1" aria-label="Remover foto">
                          <FaTrashAlt className="text-[10px]" />
                        </button>
                        <button type="button" onClick={() => moverImagem(i, 1)} className="text-cream p-1" aria-label="Mover para frente">
                          <FaArrowRight className="text-[10px]" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => inputArquivo.current?.click()}
                    className="aspect-[3/4] rounded-xl border-2 border-dashed border-line flex flex-col items-center justify-center gap-2 text-muted hover:border-rose hover:text-rose transition-colors bg-sand"
                  >
                    {carregandoFoto ? (
                      <FaSpinner className="animate-spin text-lg" />
                    ) : (
                      <>
                        <FaImages className="text-lg" />
                        <span className="text-[9px] font-bold tracking-[0.12em]">ADICIONAR</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  ref={inputArquivo}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={aoEscolherArquivos}
                  className="hidden"
                />
              </Bloco>

              <Bloco titulo="Informações" descricao="O que aparece no card e no detalhe da peça.">
                <div className="grid md:grid-cols-2 gap-x-4">
                  <Campo rotulo="Nome da peça">
                    <input
                      value={dados.nome}
                      onChange={(e) => mudar('nome', e.target.value)}
                      placeholder="Ex.: Vestido Longo com Fenda"
                      className={entrada}
                    />
                  </Campo>

                  <Campo rotulo="Categoria">
                    <select
                      value={dados.categoria}
                      onChange={(e) => mudar('categoria', e.target.value)}
                      className={`${entrada} select-custom cursor-pointer`}
                    >
                      {categorias.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <input
                      value={novaCategoria}
                      onChange={(e) => setNovaCategoria(e.target.value)}
                      placeholder="ou digite uma categoria nova"
                      className={`${entrada} mt-2`}
                    />
                  </Campo>

                  <Campo rotulo="Preço (R$)">
                    <input
                      value={dados.preco}
                      onChange={(e) => mudar('preco', e.target.value)}
                      inputMode="decimal"
                      placeholder="94,90"
                      className={entrada}
                    />
                  </Campo>

                  <Campo rotulo="Preço antigo" dica="Preencha para mostrar o selo de desconto.">
                    <input
                      value={dados.precoAntigo}
                      onChange={(e) => mudar('precoAntigo', e.target.value)}
                      inputMode="decimal"
                      placeholder="129,90"
                      className={entrada}
                    />
                  </Campo>
                </div>

                <Campo rotulo="Descrição">
                  <textarea
                    value={dados.descricao}
                    onChange={(e) => mudar('descricao', e.target.value)}
                    rows={3}
                    placeholder="Conte sobre o tecido, o caimento e as ocasiões de uso."
                    className={`${entrada} resize-y`}
                  />
                </Campo>

                <Campo rotulo="Aviso especial" dica="Aparece destacado na página da peça.">
                  <input
                    value={dados.aviso}
                    onChange={(e) => mudar('aviso', e.target.value)}
                    placeholder="Ex.: a saia das fotos é vendida separadamente."
                    className={entrada}
                  />
                </Campo>
              </Bloco>

              <Bloco titulo="Variações" descricao="Tamanhos e cores que a cliente pode escolher.">
                <Campo rotulo="Tamanhos">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {dados.tamanhos.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-2 bg-sand border border-line px-3 py-2 rounded-full text-xs text-ink"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => mudar('tamanhos', dados.tamanhos.filter((x) => x !== t))}
                          className="text-muted hover:text-red-500"
                          aria-label={`Remover ${t}`}
                        >
                          <FaTimes className="text-[10px]" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 mb-2.5">
                    <input
                      value={novoTamanho}
                      onChange={(e) => setNovoTamanho(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          adicionarTamanho(novoTamanho);
                        }
                      }}
                      placeholder="Digite um tamanho e aperte Enter"
                      className={entrada}
                    />
                    <button
                      type="button"
                      onClick={() => adicionarTamanho(novoTamanho)}
                      className="px-4 rounded-xl bg-ink text-cream shrink-0"
                      aria-label="Adicionar tamanho"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {TAMANHOS_RAPIDOS.filter((t) => !dados.tamanhos.includes(t)).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => adicionarTamanho(t)}
                        className="text-[11px] px-2.5 py-1 rounded-full border border-line text-muted hover:border-rose hover:text-rose transition-colors"
                      >
                        + {t}
                      </button>
                    ))}
                  </div>
                </Campo>

                <Campo rotulo="Cores">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {dados.cores.map((c) => (
                      <span
                        key={c.nome}
                        className="inline-flex items-center gap-2 bg-sand border border-line px-3 py-2 rounded-full text-xs text-ink"
                      >
                        <span
                          className="w-4 h-4 rounded-full ring-1 ring-inset ring-ink/15"
                          style={{ backgroundColor: c.hex }}
                        />
                        {c.nome}
                        <button
                          type="button"
                          onClick={() => mudar('cores', dados.cores.filter((x) => x.nome !== c.nome))}
                          className="text-muted hover:text-red-500"
                          aria-label={`Remover ${c.nome}`}
                        >
                          <FaTimes className="text-[10px]" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 mb-2.5">
                    <input
                      type="color"
                      value={novaCor.hex}
                      onChange={(e) => setNovaCor((c) => ({ ...c, hex: e.target.value }))}
                      className="w-12 h-[46px] rounded-xl border border-line bg-cream cursor-pointer"
                      aria-label="Escolher cor"
                    />
                    <input
                      value={novaCor.nome}
                      onChange={(e) => setNovaCor((c) => ({ ...c, nome: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          adicionarCor(novaCor);
                        }
                      }}
                      placeholder="Nome da cor"
                      className={entrada}
                    />
                    <button
                      type="button"
                      onClick={() => adicionarCor(novaCor)}
                      className="px-4 rounded-xl bg-ink text-cream shrink-0"
                      aria-label="Adicionar cor"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {CORES_RAPIDAS.filter((c) => !dados.cores.some((x) => x.nome === c.nome)).map((c) => (
                      <button
                        key={c.nome}
                        type="button"
                        onClick={() => adicionarCor(c)}
                        className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border border-line text-muted hover:border-rose hover:text-rose transition-colors"
                      >
                        <span
                          className="w-3 h-3 rounded-full ring-1 ring-inset ring-ink/15"
                          style={{ backgroundColor: c.hex }}
                        />
                        {c.nome}
                      </button>
                    ))}
                  </div>
                </Campo>
              </Bloco>

              <Bloco titulo="Status" descricao="Como a peça se comporta na vitrine.">
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { campo: 'esgotado', rotulo: 'Esgotada', dica: 'Some o botão de compra' },
                    { campo: 'novoLancamento', rotulo: 'Novidade', dica: 'Mostra o selo “Novo”' },
                    { campo: 'destaque', rotulo: 'Destaque', dica: 'Entra nas queridinhas' },
                    { campo: 'ativo', rotulo: 'Visível na loja', dica: 'Desligue para ocultar' },
                  ].map((opcao) => (
                    <button
                      key={opcao.campo}
                      type="button"
                      onClick={() => mudar(opcao.campo, !dados[opcao.campo])}
                      className={`text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                        dados[opcao.campo]
                          ? 'bg-ink text-cream border-ink'
                          : 'bg-sand border-line text-body hover:border-rose'
                      }`}
                    >
                      <span className="switch mt-0.5" data-on={dados[opcao.campo]} />
                      <span>
                        <span className="block text-[12px] font-bold">{opcao.rotulo}</span>
                        <span className="block text-[10px] opacity-70 mt-0.5">{opcao.dica}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </Bloco>
            </div>

            {/* ---------- prévia ao vivo ---------- */}
            <aside className="hidden lg:block">
              <div className="sticky top-0">
                <div className="flex items-center gap-2 mb-3 text-muted">
                  <FaEye className="text-[11px]" />
                  <span className="eyebrow">Prévia na loja</span>
                </div>

                <div className="bg-cream border border-line rounded-2xl p-4">
                  <div className="relative aspect-[3/4] rounded-[1.25rem] overflow-hidden bg-blush/30 mb-4">
                    {dados.imagens[0] ? (
                      <img
                        src={dados.imagens[0]}
                        alt=""
                        className={`w-full h-full object-cover ${dados.esgotado ? 'grayscale-[65%]' : ''}`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted text-[11px] text-center px-6">
                        Adicione uma foto para ver a prévia
                      </div>
                    )}

                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                      {dados.esgotado && (
                        <span className="bg-ink/90 text-cream text-[8px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full">
                          Esgotado
                        </span>
                      )}
                      {!dados.esgotado && desconto > 0 && (
                        <span className="bg-rose text-white text-[8px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full">
                          −{desconto}%
                        </span>
                      )}
                      {!dados.esgotado && dados.novoLancamento && (
                        <span className="bg-cream/95 text-ink text-[8px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full">
                          Novo
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[9px] tracking-[0.2em] uppercase text-muted mb-1.5">
                    {novaCategoria.trim() || dados.categoria || 'Categoria'}
                  </p>
                  <h4 className="text-[15px] font-medium text-ink leading-snug line-clamp-2 mb-2">
                    {dados.nome || 'Nome da peça'}
                  </h4>
                  <div className="flex items-end justify-between">
                    <div className="flex items-baseline gap-2">
                      {desconto > 0 && (
                        <span className="text-[11px] text-muted line-through">
                          {formatarPreco(precoAntigoNumero)}
                        </span>
                      )}
                      <span className="text-[15px] font-semibold text-ink">
                        {formatarPreco(precoNumero)}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {dados.cores.slice(0, 4).map((c) => (
                        <span
                          key={c.nome}
                          className="w-3 h-3 rounded-full ring-1 ring-inset ring-ink/15"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {!dados.ativo && (
                  <p className="text-[11px] text-muted mt-3 leading-relaxed bg-blush/30 border border-line rounded-xl p-3">
                    Esta peça está <strong className="text-ink">oculta</strong> — ela não
                    aparece na loja até você ligar “Visível na loja”.
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>

        <footer className="bg-cream border-t border-line px-6 py-4 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onFechar}
            className="flex-1 py-3.5 rounded-xl border border-line text-ink text-[11px] font-bold tracking-[0.14em] uppercase hover:bg-blush/30 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-[2] py-3.5 rounded-xl bg-ink text-cream text-[11px] font-bold tracking-[0.14em] uppercase hover:bg-rosedark transition-colors"
          >
            {editando ? 'Salvar alterações' : 'Adicionar ao catálogo'}
          </button>
        </footer>
      </form>
    </div>
  );
};

export default ProdutoForm;
