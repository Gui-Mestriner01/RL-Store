import { useRef, useState } from 'react';
import {
  FaDownload,
  FaUpload,
  FaUndoAlt,
  FaCode,
  FaExclamationTriangle,
  FaCloudUploadAlt,
  FaCheckCircle,
} from 'react-icons/fa';
import { useStore } from '../store/StoreContext';
import { baixarArquivo, dataHoje, formatarTamanho } from '../lib/utils';

const Cartao = ({ titulo, texto, children, perigo }) => (
  <div
    className={`bg-cream border rounded-2xl p-5 md:p-6 mb-4 ${
      perigo ? 'border-red-200' : 'border-line'
    }`}
  >
    <h3 className="text-ink font-semibold text-[15px] mb-1.5">{titulo}</h3>
    <p className="text-[12px] text-body mb-5 leading-relaxed text-pretty">{texto}</p>
    {children}
  </div>
);

const botao =
  'w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-[11px] font-bold tracking-[0.14em] uppercase transition-colors';

const PainelBackup = () => {
  const {
    produtos,
    config,
    substituirCatalogo,
    salvarConfig,
    restaurarSeed,
    avisar,
    alteracoesNaoPublicadas,
    montarPublicacao,
    descartarRascunho,
    publicado,
    espaco,
  } = useStore();
  const inputArquivo = useRef(null);
  const [confirmando, setConfirmando] = useState(false);

  const publicarCatalogo = () => {
    const conteudo = JSON.stringify(montarPublicacao(), null, 2);
    baixarArquivo('produtos.json', conteudo);
    avisar('produtos.json gerado. Agora é só subir na hospedagem.');
  };

  const exportarJSON = () => {
    // o hash da senha não sai no backup
    const configSemSenha = { ...config };
    delete configSemSenha.acesso;
    const conteudo = JSON.stringify(
      { versao: 3, config: configSemSenha, produtos },
      null,
      2
    );
    baixarArquivo(`rl-store-backup-${dataHoje()}.json`, conteudo);
    avisar('Backup baixado.');
  };

  const exportarSeed = () => {
    const semBase64 = produtos.map((p) => ({
      ...p,
      imagens: p.imagens.filter((img) => !img.startsWith('data:')),
    }));
    const conteudo =
      '// Gerado pelo painel da RL Store em ' +
      dataHoje() +
      '\n// Cole no lugar de PRODUTOS_SEED em src/data/seed.js\n\n' +
      'export const PRODUTOS_SEED = ' +
      JSON.stringify(semBase64, null, 2) +
      ';\n';
    baixarArquivo('produtos-seed.js', conteudo, 'text/javascript');
    avisar('Arquivo gerado. Fotos enviadas pelo painel não entram nele.', 'aviso');
  };

  const LIMITE_ARQUIVO = 25 * 1024 * 1024; // 25 MB
  const CAMPOS_DE_CONFIG = [
    'nomeLoja',
    'frase',
    'subtitulo',
    'whatsapp',
    'instagram',
    'cidade',
    'categorias',
    'fotosInstagram',
  ];

  const importarJSON = (evento) => {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;

    if (arquivo.size > LIMITE_ARQUIVO) {
      avisar('Arquivo grande demais para um backup do catálogo.', 'erro');
      if (inputArquivo.current) inputArquivo.current.value = '';
      return;
    }

    const leitor = new FileReader();
    leitor.onerror = () => avisar('Não consegui ler o arquivo.', 'erro');
    leitor.onload = () => {
      try {
        const dados = JSON.parse(leitor.result);
        const lista = Array.isArray(dados) ? dados : dados?.produtos;
        if (!Array.isArray(lista) || lista.length > 500) throw new Error('formato');

        // as peças passam pela normalização, que limpa textos, cores e imagens
        substituirCatalogo(lista, `${lista.length} peças importadas.`);

        // do arquivo só aproveitamos campos conhecidos — nunca senha ou acesso
        if (dados?.config && typeof dados.config === 'object') {
          const limpos = {};
          CAMPOS_DE_CONFIG.forEach((campo) => {
            const valor = dados.config[campo];
            if (typeof valor === 'string') limpos[campo] = valor.slice(0, 300);
            if (Array.isArray(valor)) {
              limpos[campo] = valor
                .filter((v) => typeof v === 'string')
                .slice(0, 30)
                .map((v) => v.slice(0, 200));
            }
          });
          if (Object.keys(limpos).length) salvarConfig(limpos);
        }
      } catch {
        avisar('Arquivo inválido. Use um backup exportado por este painel.', 'erro');
      }
      if (inputArquivo.current) inputArquivo.current.value = '';
    };
    leitor.readAsText(arquivo);
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <header className="mb-7">
        <p className="eyebrow mb-2">Publicação e backup</p>
        <h1 className="font-display text-[2.25rem] text-ink leading-none">Publicar</h1>
        <p className="text-body text-sm mt-2">
          Mande suas alterações para o site e guarde uma cópia de segurança.
        </p>
      </header>

      <div
        className={`rounded-2xl p-5 mb-5 border ${
          alteracoesNaoPublicadas ? 'bg-blush/40 border-rose/40' : 'bg-cream border-line'
        }`}
      >
        <div className="flex gap-3.5">
          {alteracoesNaoPublicadas ? (
            <FaExclamationTriangle className="text-rose shrink-0 mt-0.5" />
          ) : (
            <FaCheckCircle className="text-green-700 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-ink mb-1">
              {alteracoesNaoPublicadas
                ? 'Você tem alterações que a cliente ainda não vê'
                : 'Tudo que você editou já está publicado'}
            </p>
            <p className="text-[12px] text-body leading-relaxed text-pretty">
              {alteracoesNaoPublicadas
                ? 'O que você edita aqui fica neste navegador até ser publicado. Gere o arquivo abaixo e suba na hospedagem para que ele apareça para quem acessa o site.'
                : 'O catálogo deste painel é o mesmo que está no ar.'}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={publicarCatalogo}
                className={`${botao} ${
                  alteracoesNaoPublicadas
                    ? 'bg-ink text-cream hover:bg-rosedark'
                    : 'bg-sand border border-line text-ink hover:border-rose'
                }`}
              >
                <FaCloudUploadAlt className="text-sm" /> Gerar produtos.json
              </button>

              {alteracoesNaoPublicadas && publicado.existe && (
                <button
                  onClick={descartarRascunho}
                  className={`${botao} bg-sand border border-line text-ink hover:border-rose`}
                >
                  <FaUndoAlt className="text-xs" /> Descartar e voltar ao publicado
                </button>
              )}
            </div>

            <ol className="text-[11px] text-muted mt-4 leading-relaxed list-decimal pl-4 space-y-1">
              <li>Clique em <span className="text-ink">Gerar produtos.json</span>.</li>
              <li>
                Na Hostinger, abra o Gerenciador de Arquivos e coloque o arquivo na
                pasta do site, junto do <span className="text-ink">index.html</span>.
              </li>
              <li>Pronto: todo mundo que abrir o site vê o catálogo novo.</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="bg-cream border border-line rounded-2xl p-5 md:p-6 mb-4">
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h3 className="text-ink font-semibold text-[15px]">Espaço do navegador</h3>
          <span
            className={`text-[12px] font-semibold ${
              espaco.porcentagem > 75 ? 'text-red-600' : 'text-body'
            }`}
          >
            {formatarTamanho(espaco.usado)} de ~5 MB
          </span>
        </div>

        <div className="h-2 rounded-full bg-sand overflow-hidden mb-3">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              espaco.porcentagem > 75 ? 'bg-red-500' : 'bg-rose'
            }`}
            style={{ width: `${Math.max(2, espaco.porcentagem)}%` }}
          />
        </div>

        <p className="text-[12px] text-body leading-relaxed text-pretty">
          {espaco.porcentagem > 75
            ? 'Está quase cheio. Publique o catálogo, exporte um backup e apague peças antigas — cadastros novos podem ser recusados.'
            : 'As fotos ficam guardadas aqui até você publicar. Cada foto ocupa algumas centenas de KB, então cabem mais ou menos 12 fotos no total.'}
        </p>
      </div>

      <Cartao
        titulo="Backup completo"
        texto="Baixa um arquivo .json com todas as peças, fotos e textos da loja. A senha do painel não vai no arquivo. Guarde no Drive ou no celular."
      >
        <button onClick={exportarJSON} className={`${botao} bg-ink text-cream hover:bg-rosedark`}>
          <FaDownload className="text-xs" /> Baixar backup (.json)
        </button>
      </Cartao>

      <Cartao
        titulo="Restaurar backup"
        texto="Substitui o catálogo atual pelo conteúdo de um arquivo de backup."
      >
        <button
          onClick={() => inputArquivo.current?.click()}
          className={`${botao} bg-sand border border-line text-ink hover:border-rose`}
        >
          <FaUpload className="text-xs" /> Escolher arquivo
        </button>
        <input ref={inputArquivo} type="file" accept="application/json" onChange={importarJSON} className="hidden" />
      </Cartao>

      <Cartao
        titulo="Gerar arquivo para o código"
        texto="Cria um produtos-seed.js para colar no projeto e deixar o catálogo permanente para todo mundo que acessar o site. Fotos enviadas pelo painel não entram — para isso, use imagens da pasta public/roupas."
      >
        <button onClick={exportarSeed} className={`${botao} bg-sand border border-line text-ink hover:border-rose`}>
          <FaCode className="text-xs" /> Gerar produtos-seed.js
        </button>
      </Cartao>

      <Cartao
        perigo
        titulo="Restaurar catálogo original"
        texto="Volta às peças que vieram no projeto. Tudo que você cadastrou pelo painel será perdido."
      >
        {confirmando ? (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                restaurarSeed();
                setConfirmando(false);
              }}
              className={`${botao} bg-red-600 text-white hover:bg-red-700`}
            >
              Sim, restaurar tudo
            </button>
            <button
              onClick={() => setConfirmando(false)}
              className={`${botao} bg-sand border border-line text-ink`}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmando(true)}
            className={`${botao} bg-sand border border-line text-ink hover:border-red-300 hover:text-red-600`}
          >
            <FaUndoAlt className="text-xs" /> Restaurar catálogo original
          </button>
        )}
      </Cartao>
    </div>
  );
};

export default PainelBackup;
