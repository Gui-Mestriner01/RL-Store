// Utilidades gerais da loja

export const uid = () =>
  'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export const slugify = (texto = '') =>
  texto
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const formatarPreco = (valor) => {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return 'Sob consulta';
  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
};

// Aceita "R$ 94,90", "94,90", "94.90" e devolve number
export const parsePreco = (entrada) => {
  if (typeof entrada === 'number') return entrada;
  if (!entrada) return 0;
  const limpo = String(entrada)
    .replace(/[^\d,.-]/g, '')
    .replace(/\.(?=\d{3}\b)/g, '')
    .replace(',', '.');
  const numero = parseFloat(limpo);
  return Number.isFinite(numero) ? numero : 0;
};

export const load = (chave, padrao) => {
  try {
    const bruto = localStorage.getItem(chave);
    if (!bruto) return padrao;
    return JSON.parse(bruto);
  } catch {
    return padrao;
  }
};

export const save = (chave, valor) => {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
    return { ok: true };
  } catch (erro) {
    return { ok: false, erro };
  }
};

export const cn = (...classes) => classes.filter(Boolean).join(' ');

/**
 * Lê um arquivo de imagem, redimensiona e devolve um dataURL leve (JPEG).
 * Evita estourar o limite do localStorage com fotos de celular.
 */
export const comprimirImagem = (arquivo, larguraMax = 900, qualidade = 0.78) =>
  new Promise((resolve, reject) => {
    if (!arquivo.type.startsWith('image/')) {
      reject(new Error('O arquivo selecionado não é uma imagem.'));
      return;
    }
    const leitor = new FileReader();
    leitor.onerror = () => reject(new Error('Não consegui ler o arquivo.'));
    leitor.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Imagem inválida ou corrompida.'));
      img.onload = () => {
        const escala = Math.min(1, larguraMax / img.width);
        const largura = Math.round(img.width * escala);
        const altura = Math.round(img.height * escala);

        const canvas = document.createElement('canvas');
        canvas.width = largura;
        canvas.height = altura;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, largura, altura);
        resolve(canvas.toDataURL('image/jpeg', qualidade));
      };
      img.src = leitor.result;
    };
    leitor.readAsDataURL(arquivo);
  });

export const baixarArquivo = (nome, conteudo, tipo = 'application/json') => {
  const blob = new Blob([conteudo], { type: tipo });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const dataHoje = () => new Date().toISOString().slice(0, 10);

/**
 * Resolve o caminho de uma imagem da pasta public respeitando a base do site.
 * Assim as fotos aparecem tanto na raiz do domínio quanto numa subpasta.
 */
const BASE = import.meta.env.BASE_URL || '/';
export const midia = (caminho = '') => {
  if (!caminho) return '';
  if (/^(https?:|data:|blob:|\.\/)/.test(caminho)) return caminho;
  return `${BASE.endsWith('/') ? BASE : BASE + '/'}${caminho.replace(/^\//, '')}`;
};
