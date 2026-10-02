import { useState } from 'react';
import { FaWhatsapp, FaTrashAlt, FaPlus, FaMinus, FaShoppingBag } from 'react-icons/fa';
import Drawer from './Drawer';
import { useStore } from '../store/StoreContext';
import { formatarPreco } from '../lib/utils';

const SacolaDrawer = ({ aberto, onClose }) => {
  const { sacola, totalSacola, qtdSacola, mudarQtd, removerDaSacola, limparSacola, config } =
    useStore();
  const [confirmandoLimpeza, setConfirmandoLimpeza] = useState(false);

  const finalizar = () => {
    let mensagem = `Olá, ${config.nomeLoja}! Quero fechar esse pedido:\n\n`;
    sacola.forEach((item, i) => {
      mensagem += `${i + 1}. *${item.nome}*\n`;
      const detalhes = [
        item.tamanho && `Tam: ${item.tamanho}`,
        item.cor && `Cor: ${item.cor}`,
        `Qtd: ${item.qtd}`,
      ].filter(Boolean);
      mensagem += `   ${detalhes.join(' · ')}\n`;
      mensagem += `   ${formatarPreco(item.preco * item.qtd)}\n\n`;
    });
    mensagem += `*Total: ${formatarPreco(totalSacola)}*\n\nPode confirmar a disponibilidade?`;
    window.open(
      `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(mensagem)}`,
      '_blank'
    );
  };

  return (
    <Drawer
      aberto={aberto}
      onClose={onClose}
      titulo="Minha sacola"
      subtitulo={qtdSacola > 0 ? `${qtdSacola} ${qtdSacola === 1 ? 'item' : 'itens'}` : 'Ainda vazia'}
      rodape={
        sacola.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-ink">
              <span className="text-sm text-body">Total estimado</span>
              <span className="text-2xl font-semibold text-rosedark">
                {formatarPreco(totalSacola)}
              </span>
            </div>
            <button
              onClick={finalizar}
              className="w-full py-4 bg-ink text-cream rounded-2xl font-semibold tracking-wide hover:bg-rosedark transition-colors flex items-center justify-center gap-3"
            >
              <FaWhatsapp className="text-xl" /> FECHAR NO WHATSAPP
            </button>
            {confirmandoLimpeza ? (
              <div className="flex items-center justify-center gap-2 animate-fade-in">
                <span className="text-[11px] text-body">Tirar tudo da sacola?</span>
                <button
                  onClick={() => {
                    limparSacola();
                    setConfirmandoLimpeza(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-[10px] font-bold tracking-wide"
                >
                  SIM, ESVAZIAR
                </button>
                <button
                  onClick={() => setConfirmandoLimpeza(false)}
                  className="px-3 py-1.5 rounded-lg border border-line text-ink text-[10px] font-bold tracking-wide"
                >
                  CANCELAR
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmandoLimpeza(true)}
                className="text-[11px] tracking-[0.14em] uppercase text-muted hover:text-rose transition-colors"
              >
                Esvaziar sacola
              </button>
            )}
            <p className="text-[11px] text-muted text-center leading-relaxed">
              O pagamento e a entrega são combinados diretamente com a loja.
            </p>
          </div>
        )
      }
    >
      {sacola.length === 0 ? (
        <div className="flex flex-col items-center text-center gap-3 pt-16">
          <FaShoppingBag className="text-5xl text-blush" />
          <h3 className="font-display text-xl text-ink">Sua sacola está vazia</h3>
          <p className="text-sm text-body max-w-xs leading-relaxed">
            Escolha suas peças favoritas e monte o pedido. A gente envia tudo
            organizadinho pro WhatsApp.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {sacola.map((item) => (
            <li
              key={item.assinatura}
              className="flex gap-3.5 bg-white rounded-2xl p-3 border border-line animate-fade-in"
            >
              <img
                src={item.imagem}
                alt={item.nome}
                className="w-20 h-24 object-cover rounded-xl bg-sand shrink-0"
              />
              <div className="flex-1 min-w-0 flex flex-col">
                <h4 className="text-sm font-medium text-ink leading-snug line-clamp-2">
                  {item.nome}
                </h4>
                <p className="text-[11px] text-muted mt-1">
                  {[item.tamanho, item.cor].filter(Boolean).join(' · ') || 'Padrão'}
                </p>
                <div className="flex items-center justify-between mt-auto pt-2">
                  <div className="flex items-center gap-2 border border-line rounded-full px-1.5 py-1">
                    <button
                      onClick={() => mudarQtd(item.assinatura, -1)}
                      aria-label="Diminuir"
                      className="w-6 h-6 flex items-center justify-center text-ink hover:text-rose"
                    >
                      <FaMinus className="text-[9px]" />
                    </button>
                    <span className="text-xs font-semibold w-4 text-center">{item.qtd}</span>
                    <button
                      onClick={() => mudarQtd(item.assinatura, 1)}
                      aria-label="Aumentar"
                      className="w-6 h-6 flex items-center justify-center text-ink hover:text-rose"
                    >
                      <FaPlus className="text-[9px]" />
                    </button>
                  </div>
                  <span className="text-sm font-semibold text-rosedark">
                    {formatarPreco(item.preco * item.qtd)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => removerDaSacola(item.assinatura)}
                aria-label="Remover item"
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

export default SacolaDrawer;
