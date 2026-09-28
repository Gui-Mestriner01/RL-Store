import { useState } from 'react';
import { FaLock, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { midia } from '../lib/utils';
import { useStore } from '../store/StoreContext';

const AdminLogin = ({ onEntrar }) => {
  const { config, produtos } = useStore();
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const enviar = (e) => {
    e.preventDefault();
    if (senha === config.senhaAdmin) {
      setErro('');
      onEntrar();
    } else {
      setErro('Senha incorreta. Tente novamente.');
      setSenha('');
    }
  };

  return (
    <div className="min-h-screen bg-sand lg:grid lg:grid-cols-2">
      {/* lado visual */}
      <div className="grao relative hidden lg:flex flex-col justify-between bg-ink text-cream p-12 overflow-hidden">
        <div className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-rose/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blush/10 blur-3xl" />

        <img src={midia("logo.png")} alt="" className="h-14 object-contain relative brightness-0 invert opacity-90" />

        <div className="relative">
          <p className="eyebrow text-blush mb-4">Painel administrativo</p>
          <h2 className="font-display text-[2.75rem] leading-[1.1] mb-5">
            Sua loja,
            <span className="block italic text-blush">sempre atualizada</span>
          </h2>
          <p className="text-cream/65 text-sm leading-relaxed max-w-sm text-pretty">
            Cadastre peças, ajuste preços, marque o que esgotou e mude os textos
            do site — tudo sem tocar em uma linha de código.
          </p>

          <div className="flex gap-8 mt-10">
            <div>
              <p className="font-display text-3xl">{produtos.length}</p>
              <p className="text-[10px] tracking-[0.16em] uppercase text-cream/45 mt-1">peças</p>
            </div>
            <div className="w-px bg-cream/15" />
            <div>
              <p className="font-display text-3xl">{produtos.filter((p) => p.esgotado).length}</p>
              <p className="text-[10px] tracking-[0.16em] uppercase text-cream/45 mt-1">esgotadas</p>
            </div>
          </div>
        </div>

        <p className="relative text-[11px] text-cream/35">
          {config.nomeLoja} · desenvolvido por Guilherme Mestriner
        </p>
      </div>

      {/* formulário */}
      <div className="flex flex-col items-center justify-center px-6 py-16">
        <form onSubmit={enviar} className="w-full max-w-sm animate-fade-up">
          <img src={midia("logo.png")} alt="" className="h-16 mx-auto mb-8 object-contain lg:hidden" />

          <div className="inline-flex items-center gap-2 text-rose mb-3">
            <FaLock className="text-[11px]" />
            <span className="eyebrow">Área restrita</span>
          </div>

          <h1 className="font-display text-[2.5rem] text-ink leading-tight mb-2">Bem-vindo</h1>
          <p className="text-body text-sm mb-8">
            Digite a senha para gerenciar o catálogo da loja.
          </p>

          <label className="block mb-4">
            <span className="eyebrow text-ink block mb-2">Senha de acesso</span>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              autoFocus
              className="w-full px-4 py-3.5 rounded-xl border border-line bg-cream text-ink outline-none focus:border-rose transition-colors"
            />
          </label>

          {erro && (
            <p className="text-red-600 text-xs mb-4 animate-fade-in">{erro}</p>
          )}

          <button
            type="submit"
            className="group w-full py-4 bg-ink text-cream rounded-xl text-[11px] font-bold tracking-[0.16em] uppercase hover:bg-rosedark transition-colors flex items-center justify-center gap-3"
          >
            Entrar no painel
            <FaArrowRight className="text-[11px] group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#/"
            className="mt-6 flex items-center justify-center gap-2 text-[11px] text-muted hover:text-rose transition-colors"
          >
            <FaArrowLeft className="text-[9px]" /> Voltar para a loja
          </a>

          <p className="text-[11px] text-muted/80 mt-10 text-center leading-relaxed">
            Esta senha é uma trava simples no navegador, não uma autenticação de
            servidor. Não guarde dados sensíveis aqui.
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
