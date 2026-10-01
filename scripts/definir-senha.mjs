#!/usr/bin/env node
/**
 * Define a senha única do painel administrativo.
 *
 * A senha é transformada em hash (PBKDF2-SHA256, 150 mil iterações, com sal
 * aleatório) e gravada em src/data/acesso.js. A senha em si não fica guardada
 * em lugar nenhum — nem no arquivo, nem no histórico do terminal.
 *
 * Uso:  npm run senha
 */
import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { Writable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ITERACOES = 150000;
const MINIMO = 8;
const DESTINO = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'acesso.js');

/* ---- leitura das senhas ---- */

const interativo = Boolean(process.stdin.isTTY);

// No terminal: pergunta escondendo o que é digitado.
// Fora dele (pipe, script): lê as linhas que vierem na entrada.
let leitor = null;
let silenciar = false;
let linhasDaEntrada = null;

if (interativo) {
  const saidaMascarada = new Writable({
    write(pedaco, codificacao, pronto) {
      if (!silenciar) process.stdout.write(pedaco, codificacao);
      pronto();
    },
  });
  leitor = createInterface({
    input: process.stdin,
    output: saidaMascarada,
    terminal: true,
  });
}

async function lerEntradaInteira() {
  const pedacos = [];
  for await (const pedaco of process.stdin) pedacos.push(pedaco);
  return Buffer.concat(pedacos).toString('utf8').split(/\r?\n/);
}

async function perguntarSenha(mensagem) {
  if (!interativo) {
    if (linhasDaEntrada === null) linhasDaEntrada = await lerEntradaInteira();
    process.stdout.write(mensagem + '\n');
    return (linhasDaEntrada.shift() || '').trim();
  }

  return new Promise((resolve) => {
    process.stdout.write(mensagem);
    silenciar = true;
    leitor.question('', (resposta) => {
      silenciar = false;
      process.stdout.write('\n');
      resolve(resposta.trim());
    });
  });
}

const encerrar = (codigo) => {
  if (leitor) leitor.close();
  process.exit(codigo);
};

/* ---- força da senha ---- */

const forcaDaSenha = (senha) => {
  const criterios = [
    /[a-z]/.test(senha),
    /[A-Z]/.test(senha),
    /[0-9]/.test(senha),
    /[^a-zA-Z0-9]/.test(senha),
    senha.length >= 12,
  ].filter(Boolean).length;
  if (criterios >= 4) return 'forte';
  if (criterios >= 3) return 'razoável';
  return 'fraca';
};

/* ---- fluxo ---- */

console.log('\n  RL Store — senha do painel administrativo');
console.log('  ------------------------------------------');
console.log('  Essa senha vale para qualquer navegador ou celular que abrir o site.');
console.log('  Só o hash dela vai para o código; a senha não fica guardada.\n');

const senha = await perguntarSenha('  Nova senha: ');

if (senha.length < MINIMO) {
  console.error(`\n  ✗ A senha precisa ter pelo menos ${MINIMO} caracteres.\n`);
  encerrar(1);
}

const confirmacao = await perguntarSenha('  Repita a senha: ');

if (senha !== confirmacao) {
  console.error('\n  ✗ As duas senhas não são iguais.\n');
  encerrar(1);
}

const forca = forcaDaSenha(senha);
if (forca === 'fraca') {
  console.error(
    '\n  ✗ Senha fraca. Como o hash vai junto com o site, uma senha curta ou\n' +
      '    óbvia pode ser descoberta. Use pelo menos 12 caracteres misturando\n' +
      '    maiúsculas, minúsculas, números e símbolos.\n'
  );
  encerrar(1);
}

const sal = randomBytes(16).toString('hex');
const hash = pbkdf2Sync(senha, Buffer.from(sal, 'utf8'), ITERACOES, 32, 'sha256').toString('hex');

const conteudo = `// ⚠️ Arquivo gerado pelo comando \`npm run senha\` — não edite à mão.
//
// Quando ACESSO_PADRAO está preenchido, essa é a senha do painel em QUALQUER
// navegador ou celular que abrir o site: uma senha só, para todo mundo que
// administra a loja. Aqui fica apenas o hash (PBKDF2-SHA256), nunca a senha.
//
// Para definir ou trocar a senha:
//   npm run senha
// depois faça commit e publique o site de novo.

export const ACESSO_PADRAO = {
  tipo: 'pbkdf2',
  sal: '${sal}',
  hash: '${hash}',
  iteracoes: ${ITERACOES},
  criadoEm: '${new Date().toISOString()}',
};
`;

writeFileSync(DESTINO, conteudo, 'utf8');

console.log(`\n  ✓ Senha definida (força: ${forca}).`);
console.log('  ✓ Hash gravado em src/data/acesso.js\n');
console.log('  Próximos passos:');
console.log('    git add src/data/acesso.js');
console.log('    git commit -m "chore: nova senha do painel"');
console.log('    git push');
console.log('\n  Depois disso, publique o site de novo na Hostinger.\n');

encerrar(0);
