import { FaWhatsapp, FaInstagram, FaLock, FaArrowUp } from 'react-icons/fa';
import { midia } from '../lib/utils';
import { useStore } from '../store/StoreContext';
import Ornamento from './Ornamento';

const formatarTelefone = (numero = '') => {
  const d = numero.replace(/\D/g, '').replace(/^55/, '');
  if (d.length < 10) return numero;
  return `(${d.slice(0, 2)}) ${d.slice(2, -4)}-${d.slice(-4)}`;
};

const Footer = () => {
  const { config, produtosVisiveis } = useStore();

  const irPara = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer id="contato" className="grao bg-cream border-t border-line pt-16 pb-8">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-12 border-b border-line">
          {/* marca */}
          <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
            <img src={midia("logo.png")} alt={config.nomeLoja} className="h-20 mb-5 object-contain" />
            <p className="text-body text-sm leading-relaxed max-w-xs text-pretty mb-6">
              {config.subtitulo}
            </p>
            <div className="flex gap-2.5">
              <a
                href={`https://wa.me/${config.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full bg-sand border border-line flex items-center justify-center text-ink hover:bg-ink hover:text-cream transition-colors"
              >
                <FaWhatsapp />
              </a>
              <a
                href={`https://www.instagram.com/${config.instagram}/`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-sand border border-line flex items-center justify-center text-ink hover:bg-ink hover:text-cream transition-colors"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* menu */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="eyebrow text-ink mb-5">Navegue</h4>
            <nav className="flex flex-col gap-3 text-sm">
              {[
                { id: 'inicio', rotulo: 'Início' },
                { id: 'catalogo', rotulo: 'Catálogo' },
                { id: 'como-funciona', rotulo: 'Como funciona' },
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => irPara(link.id)}
                  className="text-body hover:text-rose transition-colors text-left"
                >
                  {link.rotulo}
                </button>
              ))}
              <span className="text-muted text-xs mt-1">
                {produtosVisiveis.length} peças disponíveis agora
              </span>
            </nav>
          </div>

          {/* contato */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="eyebrow text-ink mb-5">Fale conosco</h4>
            <div className="flex flex-col gap-4 text-sm text-body">
              <a
                href={`https://wa.me/${config.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-rose transition-colors group"
              >
                <span className="w-9 h-9 rounded-full bg-sand border border-line flex items-center justify-center group-hover:bg-ink group-hover:text-cream transition-colors">
                  <FaWhatsapp className="text-sm" />
                </span>
                <span className="font-medium">{formatarTelefone(config.whatsapp)}</span>
              </a>

              <a
                href={`https://www.instagram.com/${config.instagram}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-rose transition-colors group"
              >
                <span className="w-9 h-9 rounded-full bg-sand border border-line flex items-center justify-center group-hover:bg-ink group-hover:text-cream transition-colors">
                  <FaInstagram className="text-sm" />
                </span>
                <span className="font-medium">@{config.instagram}</span>
              </a>

              <p className="text-xs text-muted leading-relaxed mt-1 max-w-[240px]">
                {config.cidade} · Respondemos todos os dias
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center py-7">
          <Ornamento />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-muted">
          <p>
            &copy; {new Date().getFullYear()} {config.nomeLoja}. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-5">
            <a
              href="#/admin"
              className="inline-flex items-center gap-1.5 hover:text-rose transition-colors"
            >
              <FaLock className="text-[9px]" /> Área da loja
            </a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1.5 hover:text-rose transition-colors"
            >
              Voltar ao topo <FaArrowUp className="text-[9px]" />
            </button>
          </div>

          <p>Desenvolvido com dedicação por Guilherme Mestriner.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
