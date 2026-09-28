import { useRef, useState } from 'react';
import { FaDownload, FaUpload, FaUndoAlt, FaCode, FaExclamationTriangle } from 'react-icons/fa';
import { useStore } from '../store/StoreContext';
import { baixarArquivo, dataHoje } from '../lib/utils';

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
  const { produtos, config, substituirCatalogo, salvarConfig, restaurarSeed, avisar } = useStore();
  const inputArquivo = useRef(null);
  const [confirmando, setConfirmando] = useState(false);

  const exportarJSON = () => {
    const conteudo = JSON.stringify({ versao: 2, config, produtos }, null, 2);
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

  const importarJSON = (evento) => {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = () => {
      try {
        const dados = JSON.parse(leitor.result);
        const lista = Array.isArray(dados) ? dados : dados.produtos;
        if (!Array.isArray(lista)) throw new Error('formato');
        substituirCatalogo(lista, `${lista.length} peças importadas.`);
        if (dados.config) salvarConfig(dados.config);
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
        <p className="eyebrow mb-2">Segurança dos dados</p>
        <h1 className="font-display text-[2.25rem] text-ink leading-none">Backup</h1>
        <p className="text-body text-sm mt-2">
          Guarde uma cópia do catálogo e leve suas alterações para o código.
        </p>
      </header>

      <div className="flex gap-3.5 bg-blush/35 border border-line rounded-2xl p-5 mb-5">
        <FaExclamationTriangle className="text-rose shrink-0 mt-0.5" />
        <p className="text-[12px] text-ink leading-relaxed text-pretty">
          O catálogo fica salvo na memória <strong>deste navegador</strong>. Se você trocar
          de computador, limpar os dados do navegador ou publicar o site em outro
          lugar, as alterações não vão junto — exporte um backup de vez em quando.
        </p>
      </div>

      <Cartao
        titulo="Backup completo"
        texto="Baixa um arquivo .json com todas as peças, fotos e configurações. Guarde no Drive ou no celular."
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
