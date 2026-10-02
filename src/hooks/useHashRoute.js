import { useEffect, useState } from 'react';

/** Roteador minimalista por hash: "#/admin" -> "/admin" */
export function useHashRoute() {
  const ler = () => window.location.hash.replace(/^#/, '') || '/';
  const [rota, setRota] = useState(ler);

  useEffect(() => {
    const aoMudar = () => setRota(ler());
    window.addEventListener('hashchange', aoMudar);
    return () => window.removeEventListener('hashchange', aoMudar);
  }, []);

  const navegar = (destino, { semRolar = false } = {}) => {
    window.location.hash = destino;
    if (!semRolar) {
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    }
  };

  return [rota, navegar];
}

/** Trava o scroll do fundo enquanto um modal/drawer está aberto. */
export function useTravarScroll(ativo) {
  useEffect(() => {
    if (!ativo) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = anterior;
    };
  }, [ativo]);
}

/** Executa uma ação ao pressionar Escape. */
export function useEscape(acao, ativo = true) {
  useEffect(() => {
    if (!ativo) return;
    const aoTeclar = (e) => {
      if (e.key === 'Escape') acao();
    };
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [acao, ativo]);
}
