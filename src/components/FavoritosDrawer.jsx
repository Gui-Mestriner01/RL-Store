import { FaHeart, FaTrashAlt, FaWhatsapp } from 'react-icons/fa';
import Drawer from './Drawer';
import { useStore } from '../store/StoreContext';
import { formatarPreco } from '../lib/utils';

const FavoritosDrawer = ({ aberto, onClose, onAbrirProduto }) => {
  const { produtosVisiveis, favoritos, alternarFavorito, config } = useStore();
  const salvas = produtosVisiveis.filter((p) => favoritos.includes(String(p.id)));

  const enviarLista = () => {
    let mensagem = `Olá! Separei essas peças no site da ${config.nomeLoja}:\n\n`;
    salvas.forEach((p, i) => {
      mensagem += `${i + 1}. ${p.nome} — ${formatarPreco(p.preco)}\n`;
    });
    mensagem += `\nPode me contar mais sobre elas?`;
    window.open(
      `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(mensagem)}`,
      '_blank'
    );
  };

  return (
    <Drawer
      aberto={aberto}
      onClose={onClose}
      titulo="Meus favoritos"
      subtitulo={salvas.length ? `${salvas.length} ${salvas.length === 1 ? 'peça salva' : 'peças salvas'}` : 'Nenhuma peça salva'}
      rodape={
        salvas.length > 0 && (
          <button
            onClick={enviarLista}
            className="w-full py-4 bg-ink text-cream rounded-2xl font-semibold tracking-wide hover:bg-rosedark transition-colors flex items-center justify-center gap-3"
          >
            <FaWhatsapp className="text-xl" /> ENVIAR LISTA NO WHATSAPP
          </button>
        )
      }
    >
      {salvas.length === 0 ? (
        <div className="flex flex-col items-center text-center gap-3 pt-16">
          <FaHeart className="text-5xl text-blush" />
          <h3 className="font-display text-xl text-ink">Sua lista está vazia</h3>
          <p className="text-sm text-body max-w-xs leading-relaxed">
            Toque no coração das peças que você amar — elas ficam guardadas aqui
            mesmo se você fechar o site.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {salvas.map((produto) => (
            <li
              key={produto.id}
              className="flex gap-3.5 bg-white rounded-2xl p-3 border border-line animate-fade-in"
            >
              <img
                src={produto.imagens[0]}
                alt={produto.nome}
                onClick={() => {
                  onClose();
                  onAbrirProduto(produto);
                }}
                className="w-20 h-24 object-cover rounded-xl bg-sand shrink-0 cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <h4
                  onClick={() => {
                    onClose();
                    onAbrirProduto(produto);
                  }}
                  className="text-sm font-medium text-ink leading-snug line-clamp-2 cursor-pointer hover:text-rose transition-colors"
                >
                  {produto.nome}
                </h4>
                <p className="text-[11px] text-muted mt-1">{produto.categoria}</p>
                <p className="text-sm font-semibold text-rosedark mt-2">
                  {produto.esgotado ? 'Esgotada' : formatarPreco(produto.preco)}
                </p>
              </div>
              <button
                onClick={() => alternarFavorito(produto.id)}
                aria-label="Remover dos favoritos"
                className="text-muted hover:text-red-500 transition-colors self-start p-1"
              >
                <FaTrashAlt className="text-xs" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
};

export default FavoritosDrawer;
