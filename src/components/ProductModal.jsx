import { useState } from 'react';
import {
  FaTimes,
  FaWhatsapp,
  FaShoppingBag,
  FaHeart,
  FaRegHeart,
  FaChevronLeft,
  FaChevronRight,
  FaCreditCard,
  FaTruck,
  FaExchangeAlt,
  FaRulerCombined,
  FaLink,
  FaCheck,
} from 'react-icons/fa';
import { useStore } from '../store/StoreContext';
import { formatarPreco } from '../lib/utils';
import { useEscape, useTravarScroll } from '../hooks/useHashRoute';

const ProductModal = ({ product, onClose }) => {
  const { config, ehFavorito, alternarFavorito, adicionarNaSacola } = useStore();

  // O App monta este componente com key={produto.id}, então o estado
  // inicial já nasce certo para cada peça aberta.
  const [indiceImagem, setIndiceImagem] = useState(0);
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [tamanho, setTamanho] = useState(() => product?.tamanhos[0] || '');
  const [cor, setCor] = useState(() => product?.cores[0]?.nome || '');

  useEscape(onClose, Boolean(product));
  useTravarScroll(Boolean(product));

  if (!product) return null;

  const imagens = product.imagens.length ? product.imagens : [''];
  const imagemAtual = imagens[indiceImagem];
  const favorito = ehFavorito(product.id);
  const desconto =
    product.precoAntigo && product.precoAntigo > product.preco
      ? Math.round((1 - product.preco / product.precoAntigo) * 100)
      : 0;

  const navegarImagem = (delta) =>
    setIndiceImagem((i) => (i + delta + imagens.length) % imagens.length);

  const copiarLink = async () => {
    const endereco = `${window.location.origin}${window.location.pathname}#/peca/${product.slug}`;
    try {
      await navigator.clipboard.writeText(endereco);
      setLinkCopiado(true);
      setTimeout(() => setLinkCopiado(false), 2200);
    } catch {
      window.prompt('Copie o link da peça:', endereco);
    }
  };

  const chamarWhatsApp = () => {
    let mensagem = `Olá! Vi o catálogo da ${config.nomeLoja} e me interessei por:\n\n`;
    mensagem += `*${product.nome}* — ${formatarPreco(product.preco)}\n`;
    if (tamanho) mensagem += `Tamanho: ${tamanho}\n`;
    if (cor) mensagem += `Cor: ${cor}\n`;
    mensagem += `\nAinda está disponível?`;
    window.open(
      `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(mensagem)}`,
      '_blank'
    );
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end md:items-center justify-center bg-ink/65 backdrop-blur-md animate-fade-in md:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-da-peca"
        className="bg-cream w-full max-w-5xl md:rounded-[2rem] rounded-t-[2rem] sombra-flutuante flex flex-col relative max-h-[94vh] md:max-h-[88vh] overflow-hidden md:overflow-y-auto no-scrollbar animate-slide-up md:animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-ink bg-cream/95 rounded-full hover:bg-ink hover:text-cream z-20 transition-all sombra-suave"
        >
          <FaTimes className="text-sm" />
        </button>

        {/* Tudo que rola: galeria + informações */}
        <div className="flex-1 min-h-0 overflow-y-auto md:overflow-visible no-scrollbar flex flex-col md:flex-row">
        {/* Galeria */}
        <div className="w-full md:w-[54%] bg-white p-4 md:p-6 flex flex-col-reverse md:flex-row gap-3.5">
          {imagens.length > 1 && (
            <div className="flex md:flex-col gap-2.5 md:w-[74px] shrink-0 overflow-auto no-scrollbar">
              {imagens.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setIndiceImagem(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  className={`shrink-0 w-16 h-20 md:w-full md:h-[92px] rounded-xl overflow-hidden transition-all duration-300 ${
                    i === indiceImagem
                      ? 'ring-2 ring-ink ring-offset-2 ring-offset-white'
                      : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.nome} — foto ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 relative group">
            {imagemAtual ? (
              <img
                src={imagemAtual}
                alt={`${product.nome} — foto ${indiceImagem + 1} de ${imagens.length}`}
                className="w-full aspect-[3/4] object-cover rounded-2xl"
              />
            ) : (
              <div className="w-full aspect-[3/4] bg-sand rounded-2xl flex items-center justify-center text-sm text-muted">
                Sem imagem
              </div>
            )}

            {imagens.length > 1 && (
              <>
                <button
                  onClick={() => navegarImagem(-1)}
                  aria-label="Foto anterior"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cream/95 text-ink flex items-center justify-center sombra-suave md:opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaChevronLeft className="text-[11px]" />
                </button>
                <button
                  onClick={() => navegarImagem(1)}
                  aria-label="Próxima foto"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cream/95 text-ink flex items-center justify-center sombra-suave md:opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaChevronRight className="text-[11px]" />
                </button>
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-ink/70 text-cream text-[10px] tracking-[0.16em] px-3 py-1.5 rounded-full backdrop-blur-sm">
                  {indiceImagem + 1} / {imagens.length}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Informações */}
        <div className="w-full md:w-[46%] p-6 md:p-9 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <span className="eyebrow">{product.categoria}</span>
            {product.novoLancamento && !product.esgotado && (
              <span className="text-[9px] font-bold tracking-[0.18em] uppercase bg-blush/50 text-rosedark px-2.5 py-1 rounded-full">
                Novo
              </span>
            )}
            {product.esgotado && (
              <span className="text-[9px] font-bold tracking-[0.18em] uppercase bg-ink text-cream px-2.5 py-1 rounded-full">
                Esgotado
              </span>
            )}
          </div>

          <h2
            id="titulo-da-peca"
            className="font-display text-ink text-[2rem] md:text-[2.4rem] leading-[1.1] mb-4"
          >
            {product.nome}
          </h2>

          <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-line">
            {desconto > 0 && (
              <span className="text-sm text-muted line-through">
                {formatarPreco(product.precoAntigo)}
              </span>
            )}
            <span className="font-display text-3xl text-ink">
              {formatarPreco(product.preco)}
            </span>
            {desconto > 0 && (
              <span className="text-[10px] font-bold tracking-wide text-white bg-rose px-2.5 py-1 rounded-full">
                −{desconto}%
              </span>
            )}
          </div>

          {product.descricao && (
            <p className="text-body text-sm mb-6 leading-relaxed text-pretty">
              {product.descricao}
            </p>
          )}

          {product.medidas && (
            <div className="mb-6 bg-sand border border-line rounded-xl p-4">
              <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-ink mb-2">
                <FaRulerCombined className="text-rose" /> Medidas
              </p>
              <p className="text-[13px] text-body leading-relaxed whitespace-pre-line">
                {product.medidas}
              </p>
            </div>
          )}

          {product.aviso && (
            <div className="mb-6 bg-blush/30 border-l-2 border-rose p-3.5 rounded-r-xl">
              <p className="text-xs text-rosedark leading-relaxed">{product.aviso}</p>
            </div>
          )}

          {product.tamanhos.length > 0 && (
            <div className="mb-6">
              <span className="eyebrow text-ink block mb-3">Tamanho</span>
              <div className="flex gap-2 flex-wrap">
                {product.tamanhos.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTamanho(t)}
                    className={`px-4 py-2.5 rounded-xl border text-[13px] font-medium transition-all ${
                      tamanho === t
                        ? 'border-ink bg-ink text-cream'
                        : 'border-line bg-cream text-body hover:border-rose'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.cores.length > 0 && (
            <div className="mb-7">
              <span className="eyebrow text-ink block mb-3">
                Cor <span className="normal-case tracking-normal font-normal text-muted ml-1">— {cor}</span>
              </span>
              <div className="flex gap-2.5">
                {product.cores.map((c) => (
                  <button
                    key={c.nome}
                    onClick={() => setCor(c.nome)}
                    title={c.nome}
                    aria-label={c.nome}
                    className={`w-9 h-9 rounded-full transition-all ring-1 ring-inset ring-ink/10 ${
                      cor === c.nome ? 'ring-2 ring-offset-2 ring-ink scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No celular o modal rola bastante: as ações ficam grudadas embaixo,
              sempre à mão, em vez de só aparecerem no fim do conteúdo. */}
          <div className="hidden md:flex mt-auto flex-col gap-2.5 pt-2">
            {product.esgotado ? (
              <button
                onClick={chamarWhatsApp}
                className="w-full py-4 bg-ink text-cream rounded-2xl text-[11px] font-bold tracking-[0.16em] uppercase hover:bg-rosedark transition-colors flex items-center justify-center gap-3"
              >
                <FaWhatsapp className="text-base" /> Avise-me quando chegar
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    adicionarNaSacola(product, { tamanho, cor });
                    onClose();
                  }}
                  className="w-full py-4 bg-ink text-cream rounded-2xl text-[11px] font-bold tracking-[0.16em] uppercase hover:bg-rosedark transition-colors flex items-center justify-center gap-3"
                >
                  <FaShoppingBag className="text-sm" /> Adicionar à sacola
                </button>
                <button
                  onClick={chamarWhatsApp}
                  className="w-full py-4 bg-cream border border-line text-ink rounded-2xl text-[11px] font-bold tracking-[0.16em] uppercase hover:border-rose transition-colors flex items-center justify-center gap-3"
                >
                  <FaWhatsapp className="text-base text-[#25D366]" /> Comprar agora
                </button>
              </>
            )}


          </div>

          <div className="order-last md:order-none">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => alternarFavorito(product.id)}
                className="py-3 text-[10px] font-bold tracking-[0.16em] uppercase text-muted hover:text-rose transition-colors flex items-center justify-center gap-2"
              >
                {favorito ? <FaHeart className="text-rose" /> : <FaRegHeart />}
                {favorito ? 'Salva' : 'Salvar'}
              </button>
              <button
                onClick={copiarLink}
                className="py-3 text-[10px] font-bold tracking-[0.16em] uppercase text-muted hover:text-rose transition-colors flex items-center justify-center gap-2"
              >
                {linkCopiado ? <FaCheck className="text-green-700" /> : <FaLink />}
                {linkCopiado ? 'Copiado' : 'Copiar link'}
              </button>
            </div>

            <div className="flex flex-col gap-2.5 pt-4 mt-1 border-t border-line">
              {[
                { icone: <FaCreditCard />, titulo: 'Pagamento', texto: config.pagamento },
                { icone: <FaTruck />, titulo: 'Entrega', texto: config.entrega },
                { icone: <FaExchangeAlt />, titulo: 'Troca', texto: config.troca },
              ]
                .filter((item) => item.texto)
                .map((item) => (
                  <div key={item.titulo} className="flex gap-2.5 items-start">
                    <span className="text-rose text-[11px] mt-0.5">{item.icone}</span>
                    <p className="text-[11px] leading-relaxed text-body">
                      <span className="font-semibold text-ink">{item.titulo}:</span>{' '}
                      {item.texto}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
        </div>

        {/* Barra de ação do celular: sempre à mão, sem precisar rolar */}
        <div className="md:hidden shrink-0 border-t border-line bg-cream px-4 py-3.5 flex items-center gap-2.5">
          {product.esgotado ? (
            <button
              onClick={chamarWhatsApp}
              className="flex-1 py-4 bg-ink text-cream rounded-2xl text-[11px] font-bold tracking-[0.16em] uppercase flex items-center justify-center gap-2.5"
            >
              <FaWhatsapp className="text-base" /> Avise-me quando chegar
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  adicionarNaSacola(product, { tamanho, cor });
                  onClose();
                }}
                className="flex-1 py-4 bg-ink text-cream rounded-2xl text-[11px] font-bold tracking-[0.16em] uppercase flex items-center justify-center gap-2.5"
              >
                <FaShoppingBag className="text-sm" /> Adicionar à sacola
              </button>
              <button
                onClick={chamarWhatsApp}
                aria-label="Comprar agora pelo WhatsApp"
                className="w-14 h-14 shrink-0 rounded-2xl bg-cream border border-line text-[#25D366] flex items-center justify-center"
              >
                <FaWhatsapp className="text-2xl" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
