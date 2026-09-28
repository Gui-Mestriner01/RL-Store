import { FaTimes } from 'react-icons/fa';
import { useEscape, useTravarScroll } from '../hooks/useHashRoute';

const Drawer = ({ aberto, titulo, subtitulo, onClose, children, rodape }) => {
  useEscape(onClose, aberto);
  useTravarScroll(aberto);

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-[130] flex justify-end bg-ink/55 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <aside
        className="bg-cream w-full max-w-md h-full flex flex-col shadow-2xl animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 px-6 py-5 border-b border-line">
          <div>
            <h2 className="text-2xl font-display text-ink">{titulo}</h2>
            {subtitulo && <p className="text-xs text-muted mt-1">{subtitulo}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-9 h-9 flex items-center justify-center rounded-full text-ink hover:bg-blush/50 transition-colors"
          >
            <FaTimes />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {rodape && <footer className="border-t border-line px-6 py-5">{rodape}</footer>}
      </aside>
    </div>
  );
};

export default Drawer;
