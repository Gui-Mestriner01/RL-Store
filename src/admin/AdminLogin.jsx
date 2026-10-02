import { useEffect, useState } from 'react';
import { FaLock, FaArrowLeft, FaArrowRight, FaSpinner, FaShieldAlt } from 'react-icons/fa';
import { useStore } from '../store/StoreContext';
import { midia } from '../lib/utils';
import {
  bloqueioRestante,
  registrarFalha,
  limparTentativas,
  formatarEspera,
} from '../lib/seguranca';

const AdminLogin = ({ onEntrar }) => {
  const { config, produtos, verificarSenha, definirSenha, semSenhaDefinida } = useStore();
  const [senha, setSenha] = useState('');
  const [confirma, setConfirma] = useState('');
  const [erro, setErro] = useState('');
  const [conferindo, setConferindo] = useState(false);
  const [espera, setEspera] = useState(() => bloqueioRestante());

  // enquanto estiver bloqueado, o contador anda sozinho
  useEffect(() => {
    if (espera <= 0) return;
    const relogio = setInterval(() => setEspera(bloqueioRestante()), 1000);
    return () => clearInterval(relogio);
  }, [espera]);

  // primeiro acesso: a pessoa cria a senha do painel neste navegador
  const criar = async (evento) => {
    evento.preventDefault();
    if (conferindo) return;

    if (senha.length < 8) {
      setErro('A senha precisa ter pelo menos 8 caracteres.');
      return;
    }
    if (senha !== confirma) {
      setErro('As duas senhas não são iguais.');
      return;
    }

    setConferindo(true);
    setErro('');
    await definirSenha(senha);
    limparTentativas();
    setConferindo(false);
    onEntrar();
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    if (conferindo) return;

    const restante = bloqueioRestante();
    if (restante > 0) {
      setEspera(restante);
      setErro(`Muitas tentativas. Tente de novo em ${formatarEspera(restante)}.`);
      return;
    }

    setConferindo(true);
    setErro('');
    const certa = await verificarSenha(senha);
    setConferindo(false);

    if (certa) {
      limparTentativas();
      onEntrar();
      return;
    }

    const { ate } = registrarFalha();
    setSenha('');
    if (ate > Date.now()) {
      setEspera(ate - Date.now());
      setErro(`Muitas tentativas. Aguarde ${formatarEspera(ate - Date.now())}.`);
    } else {
      setErro('Senha incorreta. Tente novamente.');
    }
  };

  const bloqueado = espera > 0;

  return (
    <div className="min-h-screen bg-sand lg:grid lg:grid-cols-2">
      {/* lado visual */}
      <div className="grao relative hidden lg:flex flex-col justify-between bg-ink text-cream p-12 overflow-hidden">
        <div className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-rose/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blush/10 blur-3xl" />

        <img
          src={midia('logo.png')}
          alt=""
          aria-hidden="true"
          className="h-14 object-contain relative brightness-0 invert opacity-90"
        />

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
        <form
          onSubmit={semSenhaDefinida ? criar : enviar}
          className="w-full max-w-sm animate-fade-up"
        >
          <img
            src={midia('logo.png')}
            alt=""
            aria-hidden="true"
            className="h-16 mx-auto mb-8 object-contain lg:hidden"
          />

          <div className="inline-flex items-center gap-2 text-rose mb-3">
            <FaLock className="text-[11px]" />
            <span className="eyebrow">{semSenhaDefinida ? 'Primeiro acesso' : 'Área restrita'}</span>
          </div>

          <h1 className="font-display text-[2.5rem] text-ink leading-tight mb-2">
            {semSenhaDefinida ? 'Crie sua senha' : 'Bem-vindo'}
          </h1>
          <p className="text-body text-sm mb-8">
            {semSenhaDefinida
              ? 'Este navegador ainda não tem senha para o painel. Escolha uma agora — ela fica guardada só aqui, como hash.'
              : 'Digite a senha para gerenciar o catálogo da loja.'}
          </p>

          <label className="block mb-4">
            <span className="eyebrow text-ink block mb-2">
              {semSenhaDefinida ? 'Nova senha' : 'Senha de acesso'}
            </span>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              autoComplete={semSenhaDefinida ? 'new-password' : 'current-password'}
              disabled={bloqueado || conferindo}
              autoFocus
              className="w-full px-4 py-3.5 rounded-xl border border-line bg-cream text-ink outline-none focus:border-rose transition-colors disabled:opacity-50"
            />
          </label>

          {semSenhaDefinida && (
            <label className="block mb-4">
              <span className="eyebrow text-ink block mb-2">Repita a senha</span>
              <input
                type="password"
                value={confirma}
                onChange={(e) => setConfirma(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={conferindo}
                className="w-full px-4 py-3.5 rounded-xl border border-line bg-cream text-ink outline-none focus:border-rose transition-colors disabled:opacity-50"
              />
            </label>
          )}

          {erro && (
            <p className="text-red-600 text-xs mb-4 animate-fade-in" role="alert">
              {erro}
            </p>
          )}

          {bloqueado && (
            <p className="text-xs text-muted mb-4">
              Liberado em {formatarEspera(espera)}.
            </p>
          )}

          <button
            type="submit"
            disabled={bloqueado || conferindo || !senha || (semSenhaDefinida && !confirma)}
            className="group w-full py-4 bg-ink text-cream rounded-xl text-[11px] font-bold tracking-[0.16em] uppercase hover:bg-rosedark transition-colors flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {conferindo ? (
              <>
                <FaSpinner className="animate-spin text-sm" /> {semSenhaDefinida ? 'Guardando' : 'Conferindo'}
              </>
            ) : (
              <>
                {semSenhaDefinida ? 'Criar senha e entrar' : 'Entrar no painel'}
                <FaArrowRight className="text-[11px] group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {semSenhaDefinida && (
            <div className="mt-6 flex gap-3 bg-blush/40 border border-line rounded-xl p-4">
              <FaShieldAlt className="text-rose shrink-0 mt-0.5 text-sm" />
              <p className="text-[11px] text-ink leading-relaxed">
                Não existe senha padrão no código do site. A que você criar aqui
                vale para <strong>este navegador</strong> — anote num lugar seguro,
                porque não há como recuperá-la.
              </p>
            </div>
          )}

          <a
            href="#/"
            className="mt-6 flex items-center justify-center gap-2 text-[11px] text-muted hover:text-rose transition-colors"
          >
            <FaArrowLeft className="text-[9px]" /> Voltar para a loja
          </a>


        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
