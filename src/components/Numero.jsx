import { useContador } from '../hooks/animacoes';

/** Número que conta de zero até o valor quando entra na tela. */
const Numero = ({ valor, sufixo = '', prefixo = '', decimais = 0, className = '' }) => {
  const [referencia, atual] = useContador(Number(valor) || 0);
  const mostrado = atual.toLocaleString('pt-BR', {
    minimumFractionDigits: decimais,
    maximumFractionDigits: decimais,
  });

  return (
    <span ref={referencia} className={className}>
      {prefixo}
      {mostrado}
      {sufixo}
    </span>
  );
};

export default Numero;
