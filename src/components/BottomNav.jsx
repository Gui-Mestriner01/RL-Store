import { FaHome, FaThLarge, FaHeart, FaShoppingBag } from 'react-icons/fa';
import { useStore } from '../store/StoreContext';

const rolarPara = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const ItemNav = ({ icone, rotulo, onClick, badge = 0 }) => (
  <button
    onClick={onClick}
    className="relative flex flex-col items-center justify-center gap-1 text-body hover:text-ink transition-colors px-3 min-w-[56px] min-h-[44px]"
  >
    <span className="text-lg">{icone}</span>
    <span className="text-[10px] uppercase tracking-[0.1em]">{rotulo}</span>
    {badge > 0 && (
      <span className="absolute top-0 right-1 bg-rose text-white text-[9px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
        {badge}
      </span>
    )}
  </button>
);

const BottomNav = ({ onAbrirFavoritos, onAbrirSacola }) => {
  const { favoritos, qtdSacola } = useStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-line z-[60] md:hidden flex justify-around items-center py-2.5 px-2 shadow-[0_-4px_24px_rgba(46,33,29,.08)]">
      <ItemNav icone={<FaHome />} rotulo="Início" onClick={() => rolarPara('inicio')} />
      <ItemNav icone={<FaThLarge />} rotulo="Catálogo" onClick={() => rolarPara('catalogo')} />
      <ItemNav
        icone={<FaHeart />}
        rotulo="Favoritos"
        onClick={onAbrirFavoritos}
        badge={favoritos.length}
      />
      <ItemNav
        icone={<FaShoppingBag />}
        rotulo="Sacola"
        onClick={onAbrirSacola}
        badge={qtdSacola}
      />
    </nav>
  );
};

export default BottomNav;
