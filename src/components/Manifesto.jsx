import { useParallax } from '../hooks/animacoes';
import Ornamento from './Ornamento';

/** Respiro editorial entre o catálogo e o resto da página. */
const Manifesto = () => {
  const aspas = useParallax(0.06);

  return (
    <section className="grao relative overflow-hidden bg-blush/35 pt-28 pb-24 md:pt-32 md:pb-28">
      <div className="absolute inset-0 pontilhado opacity-40 pointer-events-none" />

      <span
        ref={aspas}
        aria-hidden="true"
        className="absolute left-1/2 top-2 -translate-x-1/2 font-display text-[13rem] md:text-[16rem] leading-none text-cream/60 select-none pointer-events-none"
      >
        &ldquo;
      </span>

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <div data-revelar className="flex justify-center mb-8">
          <Ornamento />
        </div>

        <blockquote
          data-revelar
          className="font-display text-ink text-[1.75rem] md:text-[2.5rem] leading-[1.25] text-balance mb-8"
        >
          Roupa boa não é a que está na moda — é a que te faz{' '}
          <span className="italic text-rose">sair de casa confiante</span>.
        </blockquote>

        <p data-revelar className="text-body text-sm md:text-[15px] leading-relaxed max-w-xl mx-auto text-pretty">
          Por isso cada peça daqui passa pela nossa mão antes de chegar na sua:
          a gente veste, sente o tecido e só então coloca no catálogo.
        </p>

        <p data-revelar className="eyebrow mt-8">RL Store</p>
      </div>
    </section>
  );
};

export default Manifesto;
