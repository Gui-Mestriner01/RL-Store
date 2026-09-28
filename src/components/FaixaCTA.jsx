import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { useStore } from '../store/StoreContext';

const FaixaCTA = () => {
  const { config } = useStore();

  return (
    <section className="px-5 md:px-8 pb-20 max-w-[1280px] mx-auto">
      <div
        data-revelar
        className="grao relative overflow-hidden rounded-[2rem] bg-ink text-cream px-8 py-14 md:px-16 md:py-16 text-center"
      >
        <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-rose/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-blush/10 blur-3xl pointer-events-none" />

        <div className="relative">
          <p className="eyebrow text-blush mb-4">Não achou o que procurava?</p>
          <h2 className="font-display text-[2rem] md:text-[2.75rem] leading-tight mb-5 text-balance">
            A gente procura a peça
            <span className="italic text-blush"> perfeita pra você</span>
          </h2>
          <p className="text-cream/70 text-sm md:text-base max-w-lg mx-auto mb-9 leading-relaxed text-pretty">
            Chama no WhatsApp contando o que você tem em mente — tamanho, ocasião,
            estilo. Nosso estoque muda toda semana e muita coisa nem chega ao site.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/${config.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-cream text-ink rounded-full text-[11px] font-bold tracking-[0.16em] uppercase hover:bg-blush transition-colors"
            >
              <FaWhatsapp className="text-base text-[#25D366]" /> Chamar no WhatsApp
            </a>
            <a
              href={`https://www.instagram.com/${config.instagram}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-9 py-4 border border-cream/25 text-cream rounded-full text-[11px] font-bold tracking-[0.16em] uppercase hover:bg-cream/10 transition-colors"
            >
              <FaInstagram className="text-base" /> Ver o Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaixaCTA;
