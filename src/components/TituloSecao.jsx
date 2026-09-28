import Ornamento from './Ornamento';

/** Cabeçalho padrão das seções: rótulo, título em serifa e o ornamento da marca. */
const TituloSecao = ({ eyebrow, titulo, destaque, texto, alinhamento = 'centro' }) => {
  const centro = alinhamento === 'centro';
  return (
    <div className={`mb-10 ${centro ? 'text-center flex flex-col items-center' : 'text-left'}`}>
      {eyebrow && (
        <p data-revelar className="eyebrow mb-3">
          {eyebrow}
        </p>
      )}
      <h2
        data-revelar
        className="font-display text-ink text-[2.25rem] md:text-[2.9rem] leading-tight"
      >
        {titulo} {destaque && <span className="italic text-rose">{destaque}</span>}
      </h2>
      {texto && (
        <p
          data-revelar
          className="text-body text-sm md:text-[15px] leading-relaxed max-w-lg mt-4 text-pretty"
        >
          {texto}
        </p>
      )}
      <div data-revelar className={`mt-6 ${centro ? '' : 'mr-auto'}`}>
        <Ornamento />
      </div>
    </div>
  );
};

export default TituloSecao;
