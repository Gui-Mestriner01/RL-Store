import { useEffect, useState } from 'react';
import { midia } from '../lib/utils';

/** Abertura curta: some assim que a página está pronta. */
const Cortina = () => {
  const [saindo, setSaindo] = useState(false);
  const [removida, setRemovida] = useState(false);

  useEffect(() => {
    const sair = () => setSaindo(true);
    const tempo = setTimeout(sair, 650);
    window.addEventListener('load', sair, { once: true });

    const limpar = setTimeout(() => setRemovida(true), 1600);
    return () => {
      clearTimeout(tempo);
      clearTimeout(limpar);
      window.removeEventListener('load', sair);
    };
  }, []);

  if (removida) return null;

  return (
    <div className="cortina" data-saindo={saindo} aria-hidden="true">
      <div className="flex flex-col items-center gap-5">
        <img
          src={midia('logo.png')}
          alt=""
          aria-hidden="true"
          className="h-16 object-contain animate-fade-in"
        />
        <div className="cortina-anel" />
      </div>
    </div>
  );
};

export default Cortina;
