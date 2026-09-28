import { useState } from 'react';
import { FaPlus, FaTimes, FaSave, FaUndoAlt, FaShieldAlt, FaKey, FaSpinner } from 'react-icons/fa';
import { useStore } from '../store/StoreContext';

const entrada =
  'w-full px-4 py-3 rounded-xl border border-line bg-cream text-ink outline-none focus:border-rose transition-colors text-sm placeholder:text-muted/60';

const Bloco = ({ titulo, descricao, children }) => (
  <section className="bg-cream border border-line rounded-2xl p-5 md:p-6 mb-4">
    <div className="mb-5">
      <h3 className="text-ink font-semibold text-[15px]">{titulo}</h3>
      {descricao && <p className="text-[11px] text-muted mt-1">{descricao}</p>}
    </div>
    {children}
  </section>
);

const Campo = ({ rotulo, dica, children }) => (
  <label className="block mb-4 last:mb-0">
    <span className="eyebrow text-ink block mb-2">{rotulo}</span>
    {children}
    {dica && <span className="block text-[11px] text-muted mt-1.5">{dica}</span>}
  </label>
);

const PainelConfig = () => {
  const {
    config,
    salvarConfig,
    verificarSenha,
    definirSenha,
    semSenhaDefinida,
    senhaEmFormatoAntigo,
    avisar,
  } = useStore();
  const [form, setForm] = useState(config);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [senhas, setSenhas] = useState({ atual: '', nova: '', confirma: '' });
  const [trocando, setTrocando] = useState(false);

  const trocarSenha = async (evento) => {
    evento.preventDefault();
    if (trocando) return;

    if (senhas.nova.length < 8) {
      avisar('A nova senha precisa ter pelo menos 8 caracteres.', 'erro');
      return;
    }
    if (senhas.nova !== senhas.confirma) {
      avisar('A confirmação não bate com a nova senha.', 'erro');
      return;
    }

    setTrocando(true);
    const confere = await verificarSenha(senhas.atual);
    if (!confere) {
      setTrocando(false);
      avisar('A senha atual está incorreta.', 'erro');
      return;
    }

    await definirSenha(senhas.nova);
    setSenhas({ atual: '', nova: '', confirma: '' });
    setTrocando(false);
  };

  const mudar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));
  const alterado = JSON.stringify(form) !== JSON.stringify(config);

  const adicionarCategoria = () => {
    const c = novaCategoria.trim();
    if (!c || form.categorias.includes(c)) return;
    mudar('categorias', [...form.categorias, c]);
    setNovaCategoria('');
  };

  const palavras = (form.frase || '').trim().split(' ');

  return (
    <div className="animate-fade-in">
      <header className="mb-7">
        <p className="eyebrow mb-2">Configurações</p>
        <h1 className="font-display text-[2.25rem] text-ink leading-none">Sua loja</h1>
        <p className="text-body text-sm mt-2">
          Textos, contatos e categorias que aparecem no site.
        </p>
      </header>

      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-5 lg:items-start">
        <div>
          <Bloco titulo="Identidade" descricao="O que a cliente lê logo ao abrir o site.">
            <Campo rotulo="Nome da loja">
              <input value={form.nomeLoja} onChange={(e) => mudar('nomeLoja', e.target.value)} className={entrada} />
            </Campo>

            <Campo rotulo="Frase principal" dica="As duas últimas palavras ficam em itálico rosa no banner.">
              <input value={form.frase} onChange={(e) => mudar('frase', e.target.value)} className={entrada} />
            </Campo>

            <Campo rotulo="Subtítulo">
              <textarea
                value={form.subtitulo}
                onChange={(e) => mudar('subtitulo', e.target.value)}
                rows={2}
                className={`${entrada} resize-y`}
              />
            </Campo>

            <Campo rotulo="Recado da faixa superior">
              <input value={form.cidade} onChange={(e) => mudar('cidade', e.target.value)} className={entrada} />
            </Campo>
          </Bloco>

          <Bloco titulo="Contato" descricao="Usados nos botões e nas mensagens automáticas.">
            <div className="grid sm:grid-cols-2 gap-x-4">
              <Campo rotulo="WhatsApp" dica="Somente números, com DDI e DDD. Ex.: 5511972276750">
                <input
                  value={form.whatsapp}
                  onChange={(e) => mudar('whatsapp', e.target.value.replace(/\D/g, ''))}
                  className={entrada}
                />
              </Campo>

              <Campo rotulo="Instagram" dica="Apenas o usuário, sem arroba.">
                <input
                  value={form.instagram}
                  onChange={(e) => mudar('instagram', e.target.value.replace('@', ''))}
                  className={entrada}
                />
              </Campo>
            </div>
          </Bloco>

          <Bloco titulo="Categorias" descricao="Os filtros que aparecem acima do catálogo.">
            <div className="flex flex-wrap gap-2 mb-3">
              {form.categorias.map((c) => (
                <span key={c} className="inline-flex items-center gap-2 bg-sand border border-line px-3 py-2 rounded-full text-xs text-ink">
                  {c}
                  <button
                    type="button"
                    onClick={() => mudar('categorias', form.categorias.filter((x) => x !== c))}
                    className="text-muted hover:text-red-500"
                    aria-label={`Remover ${c}`}
                  >
                    <FaTimes className="text-[10px]" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    adicionarCategoria();
                  }
                }}
                placeholder="Nova categoria"
                className={entrada}
              />
              <button onClick={adicionarCategoria} className="px-4 rounded-xl bg-ink text-cream shrink-0" aria-label="Adicionar categoria">
                <FaPlus className="text-xs" />
              </button>
            </div>
          </Bloco>

          <Bloco
            titulo="Acesso ao painel"
            descricao="A senha é guardada como hash (PBKDF2) neste navegador — nunca em texto puro, nem no código do site."
          >
            {(semSenhaDefinida || senhaEmFormatoAntigo) && (
              <div className="flex gap-3 bg-blush/40 border border-line rounded-xl p-4 mb-5">
                <FaShieldAlt className="text-rose shrink-0 mt-0.5 text-sm" />
                <p className="text-[11px] text-ink leading-relaxed">
                  {semSenhaDefinida
                    ? 'Nenhuma senha definida neste navegador ainda.'
                    : 'Sua senha veio de uma versão antiga e está guardada sem hash. Defina uma nova para protegê-la.'}
                </p>
              </div>
            )}

            <form onSubmit={trocarSenha}>
              <Campo rotulo="Senha atual">
                <input
                  type="password"
                  autoComplete="current-password"
                  value={senhas.atual}
                  onChange={(e) => setSenhas((s) => ({ ...s, atual: e.target.value }))}
                  placeholder="••••••••"
                  className={entrada}
                />
              </Campo>

              <div className="grid sm:grid-cols-2 gap-x-4">
                <Campo rotulo="Nova senha" dica="Pelo menos 8 caracteres.">
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={senhas.nova}
                    onChange={(e) => setSenhas((s) => ({ ...s, nova: e.target.value }))}
                    placeholder="••••••••"
                    className={entrada}
                  />
                </Campo>

                <Campo rotulo="Repita a nova senha">
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={senhas.confirma}
                    onChange={(e) => setSenhas((s) => ({ ...s, confirma: e.target.value }))}
                    placeholder="••••••••"
                    className={entrada}
                  />
                </Campo>
              </div>

              <button
                type="submit"
                disabled={trocando || !senhas.atual || !senhas.nova}
                className="w-full py-3.5 rounded-xl bg-ink text-cream text-[11px] font-bold tracking-[0.14em] uppercase hover:bg-rosedark transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {trocando ? <FaSpinner className="animate-spin text-xs" /> : <FaKey className="text-xs" />}
                {trocando ? 'Guardando' : 'Trocar senha'}
              </button>

              <p className="text-[11px] text-muted mt-3 leading-relaxed">
                Guarde a senha num lugar seguro: como não há servidor, não existe
                recuperação. Esquecendo, dá para voltar à senha de fábrica
                limpando os dados do site no navegador — o que também apaga o
                catálogo, então mantenha um backup.
              </p>
            </form>
          </Bloco>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => salvarConfig(form)}
              disabled={!alterado}
              className="flex-1 py-3.5 rounded-xl bg-ink text-cream text-[11px] font-bold tracking-[0.14em] uppercase hover:bg-rosedark transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaSave className="text-xs" /> Salvar configurações
            </button>
            {alterado && (
              <button
                onClick={() => setForm(config)}
                className="px-6 rounded-xl border border-line bg-cream text-ink text-[11px] font-bold tracking-[0.14em] uppercase hover:border-rose transition-colors flex items-center gap-2"
              >
                <FaUndoAlt className="text-[10px]" /> Desfazer
              </button>
            )}
          </div>
        </div>

        {/* prévia do banner */}
        <aside className="hidden lg:block sticky top-0">
          <div className="flex items-center gap-2 mb-3 text-muted">
            <span className="eyebrow">Prévia do banner</span>
          </div>
          <div className="grao rounded-2xl border border-line bg-gradient-to-br from-cream via-sand to-blush/60 p-6 overflow-hidden">
            <span className="inline-flex items-center gap-2 text-[8px] font-bold tracking-[0.2em] uppercase text-rosedark bg-cream/90 border border-line px-3 py-1.5 rounded-full mb-5">
              <span className="w-1 h-1 rounded-full bg-rose" /> Novidades
            </span>
            <h4 className="font-display text-ink text-[1.6rem] leading-[1.05] mb-3">
              {palavras.slice(0, -2).join(' ')}
              <span className="block italic text-rose">{palavras.slice(-2).join(' ')}</span>
            </h4>
            <p className="text-body text-[11px] leading-relaxed mb-4 line-clamp-3">
              {form.subtitulo}
            </p>
            <span className="inline-block px-5 py-2.5 bg-ink text-cream rounded-full text-[9px] font-bold tracking-[0.16em] uppercase">
              Ver catálogo
            </span>
          </div>
          <p className="text-[11px] text-muted mt-3 leading-relaxed">
            A faixa preta do topo mostrará: “{form.cidade}”.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default PainelConfig;
