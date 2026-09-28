# RL Store 🌸

Catálogo digital de moda feminina com vitrine, favoritos, sacola com fechamento
via WhatsApp e **painel administrativo** para gerenciar as peças sem mexer no código.

## Rodando o projeto

```bash
npm install
npm run dev
```

A loja abre em `http://localhost:5173/`.

## Painel administrativo

Acesse `http://localhost:5173/#/admin` (ou o link **Área da loja** no rodapé).

- **Não existe senha no código.** No primeiro acesso o painel pede que você
  crie uma; ela é guardada como hash PBKDF2-SHA256 (150 mil iterações, com sal
  aleatório) no navegador, e pode ser trocada na aba **Loja**.
- Layout de dashboard: menu lateral no PC, abas no celular.
- **Peças**: adicionar, editar, excluir, marcar como esgotada, ocultar da loja,
  colocar em destaque, reordenar a vitrine e editar o preço direto na lista.
  O formulário mostra uma **prévia ao vivo** do card como ele ficará na loja.
- **Loja**: nome, frase do banner, subtítulo, WhatsApp, Instagram e categorias.
- **Backup**: exportar/importar um `.json` com tudo e gerar um `produtos-seed.js`
  para deixar o catálogo fixo no código.

## Segurança — o que dá e o que não dá

O site é estático, sem servidor. Então:

- A senha do painel **nunca** aparece em texto puro: nem no código, nem no
  backup, nem no `localStorage` — só o hash com sal.
- O login tem bloqueio progressivo (5 erros → 1 min, 8 → 5 min, 10 → 15 min) e
  a sessão do painel expira em 2 horas.
- Backups importados passam por validação: só campos conhecidos entram, e as
  imagens precisam ser caminho relativo, `http(s)` ou base64 de imagem.
- O painel se marca como `noindex` e o site vai com cabeçalhos de segurança no
  `public/.htaccess` (CSP, X-Frame-Options, Referrer-Policy, HSTS).
- **O que isso não é:** autenticação de verdade. Sem servidor, quem tem acesso
  ao computador e conhecimento técnico consegue mexer nos dados locais. Por
  isso o painel só edita o catálogo daquele navegador — não guarde dados de
  clientes, pagamentos ou qualquer informação sensível aqui.

## Como os dados são guardados

Não há back-end. O catálogo nasce de `src/data/seed.js` e, a partir da primeira
alteração no painel, passa a viver no `localStorage` do navegador.

Consequências práticas:

- As mudanças valem **naquele navegador**. Outro computador (ou o site publicado)
  continua mostrando o catálogo do `seed.js`.
- Fotos enviadas pelo painel são comprimidas e salvas como base64 no `localStorage`
  (limite em torno de 5 MB no total).
- Para tornar uma alteração permanente para todo mundo: aba **Backup** →
  *Gerar produtos-seed.js* → substitua o conteúdo de `PRODUTOS_SEED` em
  `src/data/seed.js` e publique. Para as fotos, coloque os arquivos em
  `public/roupas/` e use o caminho `/roupas/arquivo.jpg`.
- Faça backups `.json` de vez em quando: limpar os dados do navegador apaga tudo.

## Estrutura

```
src/
├─ main.jsx                 roteador por hash (loja × /admin)
├─ App.jsx                  vitrine: busca, filtros, ordenação, paginação
├─ index.css                tokens de cor, fontes e animações (Tailwind v4)
├─ data/seed.js             catálogo inicial + configurações padrão
├─ lib/utils.js             preço, slug, storage, compressão de imagem
├─ store/StoreContext.jsx   estado global: produtos, config, favoritos, sacola
├─ hooks/useHashRoute.js    rota, trava de scroll, Esc, animação ao rolar
├─ components/              Header, Hero, cards, modal, gavetas, rodapé…
└─ admin/                   login, lista de peças, formulário, config, backup
```

## Funcionalidades da loja

- Banner editorial com números da loja, faixa de recados em movimento e barra de
  progresso de leitura.
- Vitrine **Queridinhas** (carrossel com as peças marcadas como destaque).
- Busca por nome, categoria, descrição e cor.
- Filtro por categoria (com contagem) e ordenação (destaques, novidades, preço, A–Z).
- Card com troca de foto no hover, selos de *Novo* / *Esgotado* / desconto,
  bolinhas de cor e botão de adicionar rápido.
- Modal com galeria navegável, contador de fotos, seleção de tamanho e cor e
  teclas de atalho (Esc).
- Seções **Como funciona** e faixa de chamada para o WhatsApp.
- Favoritos e sacola persistentes, com envio da lista pronta para o WhatsApp.
- Responsivo de verdade: navegação inferior no celular, gavetas laterais no PC.

## Sistema de design e movimento

Os tokens ficam em `src/index.css` (`@theme` do Tailwind v4): paleta da marca,
sombras, fontes Playfair Display + Inter, curvas de animação (`--ease-suave`,
`--ease-mola`), textura de papel (`.grao`), fundo pontilhado, brilho no hover
(`.brilho`), chave liga/desliga (`.switch`) e foco visível para teclado.

O movimento mora em `src/hooks/animacoes.js`:

- `useRevelar(dep)` — revela os elementos `data-revelar` em cascata quando
  entram na tela; passe uma dependência para reanimar (filtro, busca, aba).
- `useParallax(f)` — o elemento desliza mais devagar que a página.
- `useContador(valor)` — números que contam do zero ao entrar na tela.
- `useSeguirMouse(px)` — o elemento acompanha o cursor de leve.
- `useTituloAoSair(texto)` — troca o título da aba quando a pessoa sai.

Tudo respeita `prefers-reduced-motion`: quem pede menos movimento no sistema
vê a página inteira estática, sem nada escondido.

---

Desenvolvido com dedicação por Guilherme Mestriner.
