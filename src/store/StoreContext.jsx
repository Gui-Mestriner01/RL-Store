/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { PRODUTOS_SEED, CONFIG_PADRAO } from '../data/seed';
import { ACESSO_PADRAO } from '../data/acesso';
import { load, save, uid, parsePreco, midia } from '../lib/utils';
import {
  conferirSenha,
  criarRegistroSenha,
  urlDeImagemSegura,
  textoLimpo,
  corSegura,
} from '../lib/seguranca';

const CHAVES = {
  produtos: 'rl_produtos_v2',
  config: 'rl_config_v2',
  favoritos: 'rl_favoritos_v2',
  sacola: 'rl_sacola_v2',
};

const StoreContext = createContext(null);

/** Garante que todo produto tenha a mesma "forma", venha de onde vier. */
export const normalizarProduto = (bruto = {}) => ({
  id: textoLimpo(bruto.id, 60) || uid(),
  nome: textoLimpo(bruto.nome, 120) || 'Peça sem nome',
  preco: Math.max(0, parsePreco(bruto.preco)),
  precoAntigo:
    bruto.precoAntigo === null || bruto.precoAntigo === undefined || bruto.precoAntigo === ''
      ? null
      : Math.max(0, parsePreco(bruto.precoAntigo)),
  categoria: textoLimpo(bruto.categoria, 40) || 'Outros',
  descricao: textoLimpo(bruto.descricao, 1200),
  aviso: textoLimpo(bruto.aviso, 300),
  // só entram caminhos de imagem reconhecidos (relativo, http(s) ou base64)
  imagens: Array.isArray(bruto.imagens)
    ? bruto.imagens
        .slice(0, 12)
        .map((img) => urlDeImagemSegura(midia(img)))
        .filter(Boolean)
    : [],
  tamanhos:
    Array.isArray(bruto.tamanhos) && bruto.tamanhos.length
      ? bruto.tamanhos.slice(0, 12).map((t) => textoLimpo(t, 30)).filter(Boolean)
      : ['Tamanho Único'],
  cores: Array.isArray(bruto.cores)
    ? bruto.cores
        .slice(0, 12)
        .filter((c) => c && c.nome)
        .map((c) => ({ nome: textoLimpo(c.nome, 30), hex: corSegura(c.hex) }))
    : [],
  novoLancamento: Boolean(bruto.novoLancamento ?? bruto['novoLançamento']),
  destaque: Boolean(bruto.destaque),
  esgotado: Boolean(bruto.esgotado),
  ativo: bruto.ativo === undefined ? true : Boolean(bruto.ativo),
  criadoEm: bruto.criadoEm || new Date().toISOString(),
  atualizadoEm: bruto.atualizadoEm || new Date().toISOString(),
});

export function StoreProvider({ children }) {
  const [produtos, setProdutos] = useState(() =>
    load(CHAVES.produtos, PRODUTOS_SEED).map(normalizarProduto)
  );
  const [config, setConfig] = useState(() => {
    const guardado = load(CHAVES.config, {});
    // versões antigas guardavam a senha em texto puro: descartamos esse campo
    // e o painel pede uma senha nova no próximo acesso
    const { senhaAdmin, ...resto } = guardado;
    void senhaAdmin;
    return { ...CONFIG_PADRAO, ...resto, acesso: resto.acesso || null };
  });
  const [favoritos, setFavoritos] = useState(() =>
    load(CHAVES.favoritos, []).map(String)
  );
  const [sacola, setSacola] = useState(() => load(CHAVES.sacola, []));
  const [avisos, setAvisos] = useState([]);

  /* ---------------- toasts ---------------- */
  const avisar = useCallback((mensagem, tipo = 'sucesso') => {
    const id = uid();
    setAvisos((atual) => [...atual, { id, mensagem, tipo }]);
    setTimeout(() => {
      setAvisos((atual) => atual.filter((a) => a.id !== id));
    }, 3200);
  }, []);

  const fecharAviso = useCallback((id) => {
    setAvisos((atual) => atual.filter((a) => a.id !== id));
  }, []);

  /* ---------------- persistência ---------------- */
  const persistirProdutos = useCallback(
    (lista) => {
      const resultado = save(CHAVES.produtos, lista);
      if (!resultado.ok) {
        // fora do ciclo de render para não encadear atualizações de estado
        setTimeout(
          () =>
            avisar(
              'Memória do navegador cheia. Use fotos menores ou exporte um backup.',
              'erro'
            ),
          0
        );
      }
      return resultado.ok;
    },
    [avisar]
  );

  useEffect(() => {
    persistirProdutos(produtos);
  }, [produtos, persistirProdutos]);

  useEffect(() => {
    save(CHAVES.config, config);
  }, [config]);

  useEffect(() => {
    save(CHAVES.favoritos, favoritos);
  }, [favoritos]);

  useEffect(() => {
    save(CHAVES.sacola, sacola);
  }, [sacola]);

  /* ---------------- CRUD de produtos ---------------- */
  const criarProduto = useCallback(
    (dados) => {
      const novo = normalizarProduto({ ...dados, id: dados.id || uid() });
      setProdutos((atual) => [novo, ...atual]);
      avisar(`"${novo.nome}" foi adicionada ao catálogo.`);
      return novo;
    },
    [avisar]
  );

  const atualizarProduto = useCallback(
    (id, dados) => {
      setProdutos((atual) =>
        atual.map((p) =>
          p.id === id
            ? normalizarProduto({
                ...p,
                ...dados,
                id,
                atualizadoEm: new Date().toISOString(),
              })
            : p
        )
      );
      avisar('Alterações salvas.');
    },
    [avisar]
  );

  const removerProduto = useCallback(
    (id) => {
      setProdutos((atual) => atual.filter((p) => p.id !== id));
      setFavoritos((atual) => atual.filter((f) => f !== String(id)));
      setSacola((atual) => atual.filter((i) => i.produtoId !== id));
      avisar('Peça removida do catálogo.', 'aviso');
    },
    [avisar]
  );

  const alternarCampo = useCallback(
    (id, campo) => {
      setProdutos((atual) =>
        atual.map((p) =>
          p.id === id
            ? { ...p, [campo]: !p[campo], atualizadoEm: new Date().toISOString() }
            : p
        )
      );
    },
    []
  );

  const moverProduto = useCallback((id, direcao) => {
    setProdutos((atual) => {
      const indice = atual.findIndex((p) => p.id === id);
      const destino = indice + direcao;
      if (indice < 0 || destino < 0 || destino >= atual.length) return atual;
      const copia = [...atual];
      [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
      return copia;
    });
  }, []);

  const substituirCatalogo = useCallback(
    (lista, mensagem = 'Catálogo atualizado.') => {
      setProdutos(lista.map(normalizarProduto));
      avisar(mensagem);
    },
    [avisar]
  );

  const restaurarSeed = useCallback(() => {
    setProdutos(PRODUTOS_SEED.map(normalizarProduto));
    avisar('Catálogo original restaurado.', 'aviso');
  }, [avisar]);

  /* ---------------- configurações ---------------- */
  const salvarConfig = useCallback(
    (novos) => {
      // a senha nunca passa por aqui — ela tem caminho próprio, com hash
      const limpos = { ...novos };
      delete limpos.acesso;
      delete limpos.senhaAdmin;
      setConfig((atual) => ({ ...atual, ...limpos }));
      avisar('Configurações da loja salvas.');
    },
    [avisar]
  );

  // Quando existe uma senha definida no código (npm run senha), ela vale para
  // todos os navegadores e tem prioridade sobre qualquer senha local.
  const senhaNoCodigo = Boolean(ACESSO_PADRAO);
  const acessoEmUso = ACESSO_PADRAO || config.acesso;

  /** Ninguém definiu senha ainda — primeiro acesso neste navegador. */
  const semSenhaDefinida = !acessoEmUso;
  // senha herdada da versão antiga, guardada sem hash
  const senhaEmFormatoAntigo = !senhaNoCodigo && config.acesso?.tipo === 'simples';

  /** Confere a senha digitada no login. */
  const verificarSenha = useCallback(
    async (senha) => {
      const registro = ACESSO_PADRAO || config.acesso;
      if (!registro) return false;
      return conferirSenha(senha, registro);
    },
    [config.acesso]
  );

  /** Define uma senha nova guardando apenas o hash. */
  const definirSenha = useCallback(
    async (senhaNova) => {
      const registro = await criarRegistroSenha(senhaNova);
      setConfig((atual) => ({ ...atual, acesso: registro }));
      avisar('Senha do painel atualizada.');
      return true;
    },
    [avisar]
  );

  /* ---------------- favoritos ---------------- */
  const ehFavorito = useCallback(
    (id) => favoritos.includes(String(id)),
    [favoritos]
  );

  const alternarFavorito = useCallback(
    (id) => {
      const chave = String(id);
      setFavoritos((atual) => {
        const jaTem = atual.includes(chave);
        avisar(
          jaTem ? 'Removida dos favoritos.' : 'Salva nos favoritos ♥',
          jaTem ? 'aviso' : 'sucesso'
        );
        return jaTem ? atual.filter((f) => f !== chave) : [...atual, chave];
      });
    },
    [avisar]
  );

  /* ---------------- sacola ---------------- */
  const adicionarNaSacola = useCallback(
    (produto, { tamanho, cor } = {}) => {
      const assinatura = `${produto.id}|${tamanho || ''}|${cor || ''}`;
      setSacola((atual) => {
        const existente = atual.find((i) => i.assinatura === assinatura);
        if (existente) {
          return atual.map((i) =>
            i.assinatura === assinatura ? { ...i, qtd: i.qtd + 1 } : i
          );
        }
        return [
          ...atual,
          {
            assinatura,
            produtoId: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagens[0] || '',
            tamanho: tamanho || '',
            cor: cor || '',
            qtd: 1,
          },
        ];
      });
      avisar(`"${produto.nome}" entrou na sacola.`);
    },
    [avisar]
  );

  const mudarQtd = useCallback((assinatura, delta) => {
    setSacola((atual) =>
      atual
        .map((i) =>
          i.assinatura === assinatura ? { ...i, qtd: Math.max(0, i.qtd + delta) } : i
        )
        .filter((i) => i.qtd > 0)
    );
  }, []);

  const removerDaSacola = useCallback((assinatura) => {
    setSacola((atual) => atual.filter((i) => i.assinatura !== assinatura));
  }, []);

  const limparSacola = useCallback(() => setSacola([]), []);

  const totalSacola = useMemo(
    () => sacola.reduce((soma, i) => soma + i.preco * i.qtd, 0),
    [sacola]
  );

  const qtdSacola = useMemo(
    () => sacola.reduce((soma, i) => soma + i.qtd, 0),
    [sacola]
  );

  /* ---------------- derivados ---------------- */
  const produtosVisiveis = useMemo(
    () => produtos.filter((p) => p.ativo),
    [produtos]
  );

  const categorias = useMemo(() => {
    const doCatalogo = produtos.map((p) => p.categoria).filter(Boolean);
    return Array.from(new Set([...(config.categorias || []), ...doCatalogo]));
  }, [produtos, config.categorias]);

  const valor = {
    produtos,
    produtosVisiveis,
    categorias,
    config,
    favoritos,
    sacola,
    totalSacola,
    qtdSacola,
    avisos,
    avisar,
    fecharAviso,
    criarProduto,
    atualizarProduto,
    removerProduto,
    alternarCampo,
    moverProduto,
    substituirCatalogo,
    restaurarSeed,
    salvarConfig,
    verificarSenha,
    definirSenha,
    semSenhaDefinida,
    senhaEmFormatoAntigo,
    senhaNoCodigo,
    ehFavorito,
    alternarFavorito,
    adicionarNaSacola,
    mudarQtd,
    removerDaSacola,
    limparSacola,
  };

  return <StoreContext.Provider value={valor}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore precisa estar dentro de <StoreProvider>.');
  return ctx;
};
