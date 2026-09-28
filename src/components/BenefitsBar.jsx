import { FaTruck, FaComments, FaGem, FaExchangeAlt } from 'react-icons/fa';

const BENEFICIOS = [
  {
    icone: <FaTruck />,
    titulo: 'Entrega local rápida',
    texto: 'Levamos o seu look até você, com entregas ágeis na nossa região.',
  },
  {
    icone: <FaComments />,
    titulo: 'Atendimento de verdade',
    texto: 'Dúvida de tamanho ou tecido? Respondemos no WhatsApp, pessoalmente.',
  },
  {
    icone: <FaGem />,
    titulo: 'Curadoria premium',
    texto: 'Peças escolhidas a dedo, pensando em qualidade, conforto e estilo.',
  },
  {
    icone: <FaExchangeAlt />,
    titulo: 'Troca sem estresse',
    texto: 'Não serviu? A gente resolve junto com você, sem complicação.',
  },
];

const BenefitsBar = () => (
  <section className="grao bg-cream border-y border-line py-14">
    <div className="max-w-[1280px] mx-auto px-6 md:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 divide-x-0 lg:divide-x lg:divide-line">
        {BENEFICIOS.map((b) => (
          <div
            key={b.titulo}
            data-revelar
            className="flex flex-col items-center text-center gap-3 group px-2 lg:px-6"
          >
            <div className="w-12 h-12 rounded-full bg-sand border border-line flex items-center justify-center text-rose text-base group-hover:bg-ink group-hover:text-cream group-hover:border-ink transition-all duration-500">
              {b.icone}
            </div>
            <h3 className="font-semibold text-ink text-[12px] tracking-wide mt-1">{b.titulo}</h3>
            <p className="text-body text-[11px] leading-relaxed max-w-[200px]">{b.texto}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsBar;
