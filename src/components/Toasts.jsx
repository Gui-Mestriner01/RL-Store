import { FaCheck, FaInfoCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { useStore } from '../store/StoreContext';

const ESTILOS = {
  sucesso: { cor: 'bg-ink text-cream', icone: <FaCheck /> },
  aviso: { cor: 'bg-rose text-white', icone: <FaInfoCircle /> },
  erro: { cor: 'bg-red-600 text-white', icone: <FaExclamationTriangle /> },
};

const Toasts = () => {
  const { avisos, fecharAviso } = useStore();

  return (
    <div className="fixed z-[200] flex flex-col gap-2 pointer-events-none w-[92%] max-w-sm bottom-24 left-1/2 -translate-x-1/2 items-center md:bottom-auto md:left-auto md:translate-x-0 md:top-6 md:right-6 md:items-end">
      {avisos.map((aviso) => {
        const estilo = ESTILOS[aviso.tipo] || ESTILOS.sucesso;
        return (
          <div
            key={aviso.id}
            className={`${estilo.cor} pointer-events-auto w-full flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl animate-fade-up text-sm`}
          >
            <span className="shrink-0 opacity-90">{estilo.icone}</span>
            <p className="flex-1 leading-snug">{aviso.mensagem}</p>
            {aviso.acao && (
              <button
                onClick={() => {
                  aviso.acao.aoClicar();
                  fecharAviso(aviso.id);
                }}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-cream/20 text-[10px] font-bold tracking-[0.12em] uppercase hover:bg-cream/30 transition-colors"
              >
                {aviso.acao.rotulo}
              </button>
            )}
            <button
              onClick={() => fecharAviso(aviso.id)}
              aria-label="Fechar aviso"
              className="opacity-60 hover:opacity-100 transition"
            >
              <FaTimes />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toasts;
