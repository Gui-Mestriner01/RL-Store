import { FaInstagram } from 'react-icons/fa';
import { useStore } from '../store/StoreContext';
import { midia } from '../lib/utils';

const InstagramFeed = () => {
  const { config } = useStore();
  const link = `https://www.instagram.com/${config.instagram}/`;
  const fotos = config.fotosInstagram || [];

  return (
    <section className="px-5 md:px-16 py-20 max-w-[1400px] mx-auto">
      <div
        data-revelar
        className="bg-gradient-to-br from-blush/60 to-sand rounded-[2rem] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-10 border border-line"
      >
        <div className="flex items-center gap-6 lg:w-1/3 w-full">
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="text-4xl text-rose p-5 bg-cream rounded-full shadow-sm hover:scale-105 hover:text-rosedark transition-all shrink-0"
          >
            <FaInstagram />
          </a>
          <div>
            <h3 className="text-2xl font-display text-ink mb-1">Siga o nosso dia a dia</h3>
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="text-rosedark font-medium text-sm hover:underline"
            >
              @{config.instagram}
            </a>
            <p className="text-body text-sm mt-2 leading-relaxed">
              Novidades, provador e promoções que saem primeiro por lá.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:w-2/3 w-full">
          {fotos.map((foto, i) => (
            <a
              key={i}
              href={link}
              target="_blank"
              rel="noreferrer"
              className="relative group overflow-hidden rounded-2xl"
            >
              <img
                src={midia(foto)}
                alt={`Publicação ${i + 1} do Instagram`}
                loading="lazy"
                className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-ink/0 group-hover:bg-ink/35 flex items-center justify-center text-cream opacity-0 group-hover:opacity-100 transition-all">
                <FaInstagram className="text-2xl" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
