import { FaHeart, FaWhatsapp, FaGift } from 'react-icons/fa';
import TituloSecao from './TituloSecao';

const PASSOS = [
  {
    icone: <FaHeart />,
    titulo: 'Escolha suas peças',
    texto: 'Navegue pelo catálogo, salve as favoritas e monte sua sacola sem pressa.',
  },
  {
    icone: <FaWhatsapp />,
    titulo: 'Fale com a gente',
    texto: 'Um toque e o pedido chega organizado no nosso WhatsApp. Tiramos suas dúvidas na hora.',
  },
  {
    icone: <FaGift />,
    titulo: 'Receba e arrase',
    texto: 'Combinamos pagamento e entrega do jeito que for melhor pra você.',
  },
];

const ComoFunciona = () => (
  <section id="como-funciona" className="relative px-5 md:px-8 py-20 md:py-24">
    <div className="absolute inset-0 pontilhado opacity-30 pointer-events-none" />
    <div className="relative max-w-[1280px] mx-auto">
    <TituloSecao
      eyebrow="Simples assim"
      titulo="Como"
      destaque="funciona"
      texto="Sem carrinho complicado nem cadastro: a conversa é direta com a loja, do jeito que a gente gosta."
    />

    <div className="grid md:grid-cols-3 gap-5 md:gap-6">
      {PASSOS.map((passo, i) => (
        <article
          key={passo.titulo}
          data-revelar
          className="subir grao relative bg-cream border border-line rounded-[1.75rem] p-8 pt-10 overflow-hidden group sombra-suave hover:sombra-alta"
        >
          <span className="absolute top-5 right-7 font-display italic text-6xl text-blush/70 leading-none select-none transition-all duration-700 group-hover:text-rose/30 group-hover:scale-110">
            {i + 1}
          </span>

          <div className="w-12 h-12 rounded-full bg-sand border border-line flex items-center justify-center text-rose text-lg mb-6 group-hover:bg-ink group-hover:text-cream group-hover:border-ink transition-colors duration-500">
            {passo.icone}
          </div>

          <h3 className="font-display text-2xl text-ink mb-3">{passo.titulo}</h3>
          <p className="text-body text-sm leading-relaxed text-pretty">{passo.texto}</p>
        </article>
      ))}
      </div>
    </div>
  </section>
);

export default ComoFunciona;
