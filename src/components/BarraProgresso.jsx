import { useEffect, useState } from 'react';

/** Fininha barra no topo mostrando o quanto da página já foi lida. */
const BarraProgresso = () => {
  const [largura, setLargura] = useState(0);

  useEffect(() => {
    const calcular = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      setLargura(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    calcular();
    window.addEventListener('scroll', calcular, { passive: true });
    window.addEventListener('resize', calcular);
    return () => {
      window.removeEventListener('scroll', calcular);
      window.removeEventListener('resize', calcular);
    };
  }, []);

  return <div className="progresso" style={{ width: `${largura}%` }} aria-hidden="true" />;
};

export default BarraProgresso;
