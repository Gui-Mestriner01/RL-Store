// Catálogo inicial da loja. É a base usada na primeira visita e no botão
// "Restaurar catálogo original" do painel administrativo.

export const CATEGORIAS_PADRAO = ['Vestidos', 'Blusas', 'Saias', 'Conjuntos', 'Outros'];

export const PRODUTOS_SEED = [
  {
    id: 'p-vestido-longo-fenda',
    nome: 'Vestido Longo com Fenda Suplex',
    preco: 94.9,
    precoAntigo: null,
    categoria: 'Vestidos',
    descricao:
      'Elegante, confortável e com ótimo caimento. O modelo longo com fenda lateral garante um toque moderno e sofisticado ao look.',
    aviso: '',
    imagens: ['/roupas/VestidoLongo1.jpeg', '/roupas/VestidoLongo2.jpeg'],
    tamanhos: ['Tamanho Único'],
    cores: [{ nome: 'Preto', hex: '#000000' }],
    novoLancamento: true,
    destaque: true,
    esgotado: false,
    ativo: true,
  },
  {
    id: 'p-bata-frente-unica',
    nome: 'Bata Frente Única Assimétrica',
    preco: 59.9,
    precoAntigo: null,
    categoria: 'Blusas',
    descricao:
      'Leve, elegante e moderna, com modelagem assimétrica e caimento fluido. Perfeita para compor looks estilosos e versáteis.',
    aviso: '',
    imagens: [
      '/roupas/Bata1.jpg',
      '/roupas/Bata2.jpg',
      '/roupas/Bata3.jpg',
      '/roupas/Bata4.jpg',
    ],
    tamanhos: ['Tamanho Único'],
    cores: [
      { nome: 'Preto', hex: '#000000' },
      { nome: 'Marrom', hex: '#6F3826' },
    ],
    novoLancamento: true,
    destaque: true,
    esgotado: false,
    ativo: true,
  },
  {
    id: 'p-body-manga-longa',
    nome: 'Body Manga Longa',
    preco: 50,
    precoAntigo: null,
    categoria: 'Blusas',
    descricao:
      'Modelo confortável e elegante, com manga longa e design moderno. Perfeito para compor looks casuais e estilizados.',
    aviso: 'Atenção: a saia apresentada nas fotos é vendida separadamente.',
    imagens: ['/roupas/BodyMangaLonga1.jpg', '/roupas/BodyMangaLonga2.jpg'],
    tamanhos: ['Tamanho Único'],
    cores: [{ nome: 'Marrom', hex: '#6F3826' }],
    novoLancamento: true,
    destaque: false,
    esgotado: false,
    ativo: true,
  },
  {
    id: 'p-saia-isis',
    nome: 'Saia Isis',
    preco: 59.9,
    precoAntigo: null,
    categoria: 'Saias',
    descricao:
      'Saia curta com detalhe assimétrico e cauda lateral, que dá um movimento diferenciado à peça.',
    aviso: '',
    imagens: [
      '/roupas/SaiaIsis4.jpg',
      '/roupas/SaiaIsis3.jpg',
      '/roupas/SaiaIsis2.jpg',
      '/roupas/SaiaIsis1.jpg',
    ],
    tamanhos: ['Tamanho Único'],
    cores: [
      { nome: 'Preto', hex: '#000000' },
      { nome: 'Marrom', hex: '#6F3826' },
    ],
    novoLancamento: false,
    destaque: true,
    esgotado: false,
    ativo: true,
  },
  {
    id: 'p-vestido-gola-alta',
    nome: 'Vestido Curto de Gola Alta e Manga Longa',
    preco: 84.9,
    precoAntigo: null,
    categoria: 'Vestidos',
    descricao:
      'Vestido curto com gola alta e mangas longas, ideal para ocasiões especiais ou para um look elegante no dia a dia.',
    aviso: '',
    imagens: ['/roupas/Vestido1.jpg', '/roupas/Vestido2.jpg'],
    tamanhos: ['Tamanho Único'],
    cores: [{ nome: 'Marrom', hex: '#6F3826' }],
    novoLancamento: false,
    destaque: false,
    esgotado: false,
    ativo: true,
  },
  {
    id: 'p-saia-alfaiataria',
    nome: 'Saia Alfaiataria',
    preco: 74.9,
    precoAntigo: null,
    categoria: 'Saias',
    descricao:
      'Saia alfaiataria com corte clássico e detalhes elegantes, perfeita para compor looks sofisticados.',
    aviso: '',
    imagens: ['/roupas/SaiaAlfaiataria.jpg', '/roupas/SaiaAlfaiataria2.jpg'],
    tamanhos: ['Tamanho Único'],
    cores: [{ nome: 'Branco', hex: '#fefafa' }],
    novoLancamento: true,
    destaque: false,
    esgotado: false,
    ativo: true,
  },
];

export const CONFIG_PADRAO = {
  nomeLoja: 'RL Store',
  frase: 'Estilo que te representa',
  subtitulo:
    'Peças selecionadas para realçar sua beleza e confiança todos os dias.',
  whatsapp: '5511972276750',
  instagram: 'rl.modastore',
  cidade: 'Entrega local rápida',
  categorias: CATEGORIAS_PADRAO,
  fotosInstagram: [
    '/roupas/insta1.jpg',
    '/roupas/insta2.jpg',
    '/roupas/insta3.jpg',
    '/roupas/insta4.jpg',
  ],
  // A senha do painel não mora aqui: ela é definida com `npm run senha`,
  // que grava só o hash em src/data/acesso.js.
  acesso: null,
};
