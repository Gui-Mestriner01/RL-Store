import { useState } from 'react';
import {
  FaBoxOpen,
  FaCog,
  FaCloudDownloadAlt,
  FaStore,
  FaSignOutAlt,
} from 'react-icons/fa';
import AdminLogin from './AdminLogin';
import PainelProdutos from './PainelProdutos';
import PainelConfig from './PainelConfig';
import PainelBackup from './PainelBackup';
import ProdutoForm from './ProdutoForm';
import { useStore } from '../store/StoreContext';
import { midia } from '../lib/utils';

const CHAVE_SESSAO = 'rl_admin_sessao';

const ABAS = [
  { id: 'produtos', rotulo: 'Peças', icone: <FaBoxOpen />, descricao: 'Catálogo da loja' },
  { id: 'config', rotulo: 'Loja', icone: <FaCog />, descricao: 'Textos e contatos' },
  { id: 'backup', rotulo: 'Backup', icone: <FaCloudDownloadAlt />, descricao: 'Exportar e importar' },
];

const AdminApp = () => {
  const { config, produtos } = useStore();
  const [autenticado, setAutenticado] = useState(
    () => sessionStorage.getItem(CHAVE_SESSAO) === 'ok'
  );
  const [aba, setAba] = useState('produtos');
  const [formAberto, setFormAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);

  if (!autenticado) {
    return (
      <AdminLogin
        onEntrar={() => {
          sessionStorage.setItem(CHAVE_SESSAO, 'ok');
          setAutenticado(true);
        }}
      />
    );
  }

  const abrirNovo = () => {
    setProdutoEditando(null);
    setFormAberto(true);
  };

  const abrirEdicao = (produto) => {
    setProdutoEditando(produto);
    setFormAberto(true);
  };

  const sair = () => {
    sessionStorage.removeItem(CHAVE_SESSAO);
    setAutenticado(false);
  };

  return (
    <div className="min-h-screen bg-sand md:flex">
      {/* ---------- menu lateral (PC) ---------- */}
      <aside className="hidden md:flex flex-col w-[248px] shrink-0 bg-ink text-cream/70 min-h-screen sticky top-0 grao">
        <div className="px-6 pt-7 pb-6 border-b border-cream/10">
          <img src={midia("logo.png")} alt="" className="h-12 object-contain mb-4 brightness-0 invert opacity-90" />
          <p className="text-[9px] tracking-[0.24em] uppercase text-rose font-bold">Painel</p>
          <p className="text-cream text-sm font-medium mt-1">{config.nomeLoja}</p>
        </div>

        <nav className="flex-1 p-3">
          {ABAS.map((item) => (
            <button
              key={item.id}
              onClick={() => setAba(item.id)}
              className={`w-full text-left flex items-center gap-3.5 px-4 py-3.5 rounded-xl mb-1 transition-all duration-300 ${
                aba === item.id
                  ? 'bg-cream/10 text-cream'
                  : 'hover:bg-cream/5 hover:text-cream'
              }`}
            >
              <span className={aba === item.id ? 'text-rose' : 'text-cream/40'}>{item.icone}</span>
              <span className="flex-1">
                <span className="block text-[13px] font-semibold">{item.rotulo}</span>
                <span className="block text-[10px] opacity-60">{item.descricao}</span>
              </span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-cream/10">
          <div className="px-4 py-3 mb-2 rounded-xl bg-cream/5">
            <p className="text-[10px] tracking-[0.14em] uppercase text-cream/40">No catálogo</p>
            <p className="text-cream font-display text-2xl">{produtos.length} peças</p>
          </div>
          <a
            href="#/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[12px] font-medium hover:bg-cream/5 hover:text-cream transition-colors"
          >
            <FaStore className="text-cream/40" /> Ver a loja
          </a>
          <button
            onClick={sair}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[12px] font-medium hover:bg-cream/5 hover:text-red-300 transition-colors"
          >
            <FaSignOutAlt className="text-cream/40" /> Sair
          </button>
        </div>
      </aside>

      {/* ---------- topo (celular) ---------- */}
      <div className="md:hidden sticky top-0 z-40 glass border-b border-line">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={midia("logo.png")} alt="" className="h-9 object-contain" />
            <div>
              <p className="text-[9px] tracking-[0.2em] uppercase text-rose font-bold">Painel</p>
              <p className="text-[13px] text-ink font-medium leading-tight">{config.nomeLoja}</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <a
              href="#/"
              aria-label="Ver a loja"
              className="w-9 h-9 rounded-xl border border-line bg-cream text-ink flex items-center justify-center"
            >
              <FaStore className="text-xs" />
            </a>
            <button
              onClick={sair}
              aria-label="Sair"
              className="w-9 h-9 rounded-xl border border-line bg-cream text-muted flex items-center justify-center"
            >
              <FaSignOutAlt className="text-xs" />
            </button>
          </div>
        </div>
        <nav className="flex px-2 gap-1 -mb-px overflow-x-auto no-scrollbar">
          {ABAS.map((item) => (
            <button
              key={item.id}
              onClick={() => setAba(item.id)}
              className={`flex items-center gap-2 px-4 py-3 text-[11px] font-bold tracking-[0.12em] uppercase border-b-2 whitespace-nowrap transition-colors ${
                aba === item.id ? 'border-ink text-ink' : 'border-transparent text-muted'
              }`}
            >
              {item.icone} {item.rotulo}
            </button>
          ))}
        </nav>
      </div>

      {/* ---------- conteúdo ---------- */}
      <main className="flex-1 min-w-0 px-4 md:px-9 py-6 md:py-9">
        <div className="max-w-[1080px] mx-auto">
          {aba === 'produtos' && <PainelProdutos onNovo={abrirNovo} onEditar={abrirEdicao} />}
          {aba === 'config' && <PainelConfig />}
          {aba === 'backup' && <PainelBackup />}
        </div>
      </main>

      {formAberto && (
        <ProdutoForm
          key={produtoEditando ? produtoEditando.id : 'nova-peca'}
          produto={produtoEditando}
          onFechar={() => setFormAberto(false)}
        />
      )}
    </div>
  );
};

export default AdminApp;
