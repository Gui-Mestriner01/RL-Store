/** Cabeçalho padrão das seções: rótulo pequeno, título em serifa e um fio. */
const TituloSecao = ({ eyebrow, titulo, destaque, texto, alinhamento = 'centro' }) => {
  const centro = alinhamento === 'centro';
  return (
    <div
      data-revelar
      className={`mb-10 ${centro ? 'text-center flex flex-col items-center' : 'text-left'}`}
    >
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="font-display text-ink text-[2.25rem] md:text-[2.9rem] leading-tight">
        {titulo} {destaque && <span className="italic text-rose">{destaque}</span>}
      </h2>
      {texto && (
        <p className="text-body text-sm md:text-[15px] leading-relaxed max-w-lg mt-4 text-pretty">
          {texto}
        </p>
      )}
      <div className={`h-px w-16 bg-line mt-6 ${centro ? '' : 'mr-auto'}`} />
    </div>
  );
};

export default TituloSecao;
