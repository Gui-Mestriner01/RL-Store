// Camada de proteção do painel administrativo.
//
// Importante ser honesto sobre o alcance disso: o site não tem servidor, então
// tudo acontece no navegador. O objetivo aqui é (1) nunca guardar a senha em
// texto puro — nem no código, nem no localStorage — e (2) dificultar tentativa
// e erro. Quem tiver conhecimento técnico e acesso ao computador ainda consegue
// mexer nos dados locais; por isso o painel só edita o catálogo daquele
// navegador, e nada sensível deve ser guardado aqui.

const codificador = new TextEncoder();
const ITERACOES = 150000;

const temCripto = () =>
  typeof crypto !== 'undefined' && crypto.subtle && typeof crypto.subtle.deriveBits === 'function';

const paraHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

export const gerarSal = () => {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  return paraHex(bytes.buffer);
};

/** Deriva o hash da senha com PBKDF2-SHA256. */
export async function derivarHash(senha, sal, iteracoes = ITERACOES) {
  const chave = await crypto.subtle.importKey(
    'raw',
    codificador.encode(senha),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: codificador.encode(sal), iterations: iteracoes, hash: 'SHA-256' },
    chave,
    256
  );
  return paraHex(bits);
}

/** Cria o registro que fica guardado no lugar da senha. */
export async function criarRegistroSenha(senha) {
  if (!temCripto()) {
    // navegador antigo ou página servida sem HTTPS: sem PBKDF2 disponível
    return { tipo: 'simples', valor: senha, criadoEm: new Date().toISOString() };
  }
  const sal = gerarSal();
  const hash = await derivarHash(senha, sal);
  return { tipo: 'pbkdf2', sal, hash, iteracoes: ITERACOES, criadoEm: new Date().toISOString() };
}

const comparar = (a = '', b = '') => {
  if (a.length !== b.length) return false;
  let diferenca = 0;
  for (let i = 0; i < a.length; i += 1) diferenca |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diferenca === 0;
};

/** Confere a senha contra o registro guardado. */
export async function conferirSenha(senha, registro) {
  if (!registro) return false;
  if (registro.tipo === 'pbkdf2' && temCripto()) {
    const hash = await derivarHash(senha, registro.sal, registro.iteracoes || ITERACOES);
    return comparar(hash, registro.hash);
  }
  if (registro.tipo === 'simples') return comparar(senha, registro.valor || '');
  return false;
}

/* ---------------- controle de tentativas ---------------- */

const CHAVE_TENTATIVAS = 'rl_admin_tentativas';
const DEGRAUS = [
  { falhas: 10, espera: 15 * 60 * 1000 },
  { falhas: 8, espera: 5 * 60 * 1000 },
  { falhas: 5, espera: 60 * 1000 },
];

const lerTentativas = () => {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_TENTATIVAS) || '{"falhas":0,"ate":0}');
  } catch {
    return { falhas: 0, ate: 0 };
  }
};

const gravarTentativas = (dados) => {
  try {
    localStorage.setItem(CHAVE_TENTATIVAS, JSON.stringify(dados));
  } catch {
    /* sem espaço: segue sem o controle */
  }
};

/** Quantos milissegundos ainda faltam de bloqueio (0 = liberado). */
export const bloqueioRestante = () => {
  const { ate } = lerTentativas();
  return Math.max(0, (ate || 0) - Date.now());
};

export const registrarFalha = () => {
  const atual = lerTentativas();
  const falhas = (atual.falhas || 0) + 1;
  const degrau = DEGRAUS.find((d) => falhas >= d.falhas);
  const dados = { falhas, ate: degrau ? Date.now() + degrau.espera : 0 };
  gravarTentativas(dados);
  return dados;
};

export const limparTentativas = () => gravarTentativas({ falhas: 0, ate: 0 });

export const formatarEspera = (ms) => {
  const segundos = Math.ceil(ms / 1000);
  if (segundos < 60) return `${segundos} segundo${segundos === 1 ? '' : 's'}`;
  const minutos = Math.ceil(segundos / 60);
  return `${minutos} minuto${minutos === 1 ? '' : 's'}`;
};

/* ---------------- sessão do painel ---------------- */

const CHAVE_SESSAO = 'rl_admin_sessao';
const DURACAO_SESSAO = 2 * 60 * 60 * 1000; // 2 horas

export const abrirSessao = () => {
  try {
    sessionStorage.setItem(
      CHAVE_SESSAO,
      JSON.stringify({ ate: Date.now() + DURACAO_SESSAO })
    );
  } catch {
    /* ignora */
  }
};

export const sessaoValida = () => {
  try {
    const bruto = sessionStorage.getItem(CHAVE_SESSAO);
    if (!bruto) return false;
    const { ate } = JSON.parse(bruto);
    if (!ate || Date.now() > ate) {
      sessionStorage.removeItem(CHAVE_SESSAO);
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export const fecharSessao = () => {
  try {
    sessionStorage.removeItem(CHAVE_SESSAO);
  } catch {
    /* ignora */
  }
};

/* ---------------- higiene de dados ---------------- */

/**
 * Só deixa passar caminho relativo, http(s) ou imagem em base64.
 * Protege contra um arquivo de backup adulterado trazer URLs estranhas.
 */
export const urlDeImagemSegura = (valor = '') => {
  if (typeof valor !== 'string') return '';
  const limpo = valor.trim();
  if (!limpo) return '';
  if (/^data:image\/(png|jpe?g|webp|gif|avif);base64,[a-z0-9+/=\s]+$/i.test(limpo)) return limpo;
  if (/^https?:\/\//i.test(limpo)) return limpo;
  if (/^(\.\/|\/)?[\w\-./]+\.(png|jpe?g|webp|gif|avif)$/i.test(limpo)) return limpo;
  return '';
};

/** Corta texto muito longo e tira caracteres de controle. */
export const textoLimpo = (valor = '', limite = 600) =>
  String(valor ?? '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .trim()
    .slice(0, limite);

/** Aceita só cores em formato hexadecimal. */
export const corSegura = (valor = '') =>
  /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(valor).trim()) ? String(valor).trim() : '#b07a75';
