/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { PRODUTOS_SEED, CONFIG_PADRAO } from '../data/seed';
import { ACESSO_PADRAO } from '../data/acesso';
import {
  load,
  save,
  uid,
  parsePreco,
  midia,
  slugify,
  medirArmazenamento,
} from '../lib/utils';
import {
  conferirSenha,
  criarRegistroSenha,
  urlDeImagemSegura,
  textoLimpo,
  corSegura,
} from '../lib/seguranca';

const CHAVES = {
  produtos: 'rl_produtos_v2',
  baseVersao: 'rl_base_versao',
  config: 'rl_config_v2',
  favoritos: 'rl_favoritos_v2',
  sacola: 'rl_sacola_v2',
};

const StoreContext = createContext(null);

/** Garante que todo produto tenha a mesma "forma", venha de onde vier. */
export const normalizarProduto = (bruto = {}) => {
  const id = textoLimpo(bruto.id, 60) || uid();
  const nome = textoLimpo(bruto.nome, 120) || 'Peça sem nome';
  return {
  id,
  nome,
  // endereço próprio da peça, usado em #/peca/<slug>
  slug: slugify(bruto.slug || nome) || slugify(id),
  preco: Math.max(0, parsePreco(bruto.preco)),
  precoAntigo:
    bruto.precoAntigo === null || bruto.precoAntigo === undefined || bruto.precoAntigo === ''
      ? null
      : Math.max(0, parsePreco(bruto.precoAntigo)),
  categoria: textoLimpo(bruto.categoria, 40) || 'Outros',
  descricao: textoLimpo(bruto.descricao, 1200),
  medidas: textoLimpo(bruto.medidas, 400),
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
  };
};

/** Resumo estável do catálogo, para saber se há algo ainda não publicado. */
const assinarCatalogo = (produtos = [], config = {}) =>
  JSON.stringify({
    produtos: produtos.map((p) => ({ ...p, atualizadoEm: undefined })),
    loja: {
      nomeLoja: config.nomeLoja,
      frase: config.frase,
      subtitulo: config.subtitulo,
      whatsapp: config.whatsapp,
      instagram: config.instagram,
      cidade: config.cidade,
      categorias: config.categorias,
      fotosInstagram: config.fotosInstagram,
      pagamento: config.pagamento,
      entrega: config.entrega,
      troca: config.troca,
    },
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
  // o que está publicado em produtos.json — ou seja, o que a cliente vê
  const [publicado, setPublicado] = useState(() => ({
    versao: load(CHAVES.baseVersao, 0),
    assinatura: null,
    existe: false,
  }));

  /* -------- catálogo publicado (produtos.json) -------- */
  useEffect(() => {
    let cancelado = false;

    const buscar = async () => {
      try {
        const resposta = await fetch(`${midia('produtos.json')}?v=${Date.now()}`, {
          cache: 'no-store',
        });
        if (!resposta.ok) return;
        const dados = await resposta.json();
        if (cancelado || !dados || !Array.isArray(dados.produtos)) return;

        const lista = dados.produtos.map(normalizarProduto);
        const versao = Number(dados.versao) || 0;
        const baseLocal = load(CHAVES.baseVersao, 0);
        const configPublicada =
          dados.config && typeof dados.config === 'object' ? dados.config : {};
        const assinatura = assinarCatalogo(lista, {
          ...CONFIG_PADRAO,
          ...configPublicada,
        });

        // Arquivo mais novo que a base do rascunho local: o publicado manda.
        // É o que fecha o ciclo "exportei no painel → subi → todos veem igual".
        if (versao > baseLocal) {
          setProdutos(lista);
          save(CHAVES.produtos, lista);
          setConfig((atual) => ({ ...atual, ...configPublicada, acesso: atual.acesso }));
          save(CHAVES.baseVersao, versao);
        }
        setPublicado({ versao, assinatura, existe: true });
      } catch {
        /* nada publicado ainda: segue com o catálogo local */
      }
    };

    buscar();
    return () => {
      cancelado = true;
    };
  }, []);

  /* ---------------- toasts ---------------- */
  const avisar = useCallback((mensagem, tipo = 'sucesso', acao = null) => {
    const id = uid();
    setAvisos((atual) => [...atual, { id, mensagem, tipo, acao }]);
    setTimeout(
      () => setAvisos((atual) => atual.filter((a) => a.id !== id)),
      acao ? 9000 : 3200
    );
  }, []);

  const fecharAviso = useCallback((id) => {
    setAvisos((atual) => atual.filter((a) => a.id !== id));
  }, []);

  /* ---------------- persistência ---------------- */

  // quanto do armazenamento do navegador já foi usado
  const [espaco, setEspaco] = useState(() => medirArmazenamento());

  // espelho do catálogo para montar a nova versão antes de gravar
  const produtosRef = useRef(produtos);
  useEffect(() => {
    produtosRef.current = produtos;
  }, [produtos]);

  /**
   * Altera o catálogo APENAS se a gravação der certo.
   * Antes, a peça entrava na tela e sumia no F5 quando a memória estava
   * cheia — a cliente via "adicionada" e perdia tudo em silêncio.
   */
  const aplicarNoCatalogo = useCallback(
    (transformar) => {
      const anterior = produtosRef.current;
      const nova = transformar(anterior);
      const resultado = save(CHAVES.produtos, nova);

      if (!resultado.ok) {
        const { porcentagem } = medirArmazenamento();
        avisar(
          `Não deu para salvar: a memória do navegador está cheia (${Math.round(
            porcentagem
          )}%). Publique o catálogo, exporte um backup e apague peças antigas antes de cadastrar novas.`,
          'erro'
        );
        return false;
      }

      produtosRef.current = nova;
      setProdutos(nova);
      setEspaco(medirArmazenamento());
      return true;
    },
    [avisar]
  );

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
      // só avisa que entrou se realmente couber e for gravada
      const salvou = aplicarNoCatalogo((atual) => [novo, ...atual]);
      if (!salvou) return null;
      avisar(`"${novo.nome}" foi adicionada ao catálogo.`);
      return novo;
    },
    [aplicarNoCatalogo, avisar]
  );

  const atualizarProduto = useCallback(
    (id, dados) => {
      const salvou = aplicarNoCatalogo((atual) =>
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
      if (salvou) avisar('Alterações salvas.');
      return salvou;
    },
    [aplicarNoCatalogo, avisar]
  );

  const removerProduto = useCallback(
    (id) => {
      const peca = produtosRef.current.find((p) => p.id === id);
      const posicao = produtosRef.current.findIndex((p) => p.id === id);
      if (!peca) return false;

      const salvou = aplicarNoCatalogo((atual) => atual.filter((p) => p.id !== id));
      if (!salvou) return false;

      setFavoritos((atual) => atual.filter((f) => f !== String(id)));
      setSacola((atual) => atual.filter((i) => i.produtoId !== id));

      // dá para voltar atrás: a peça volta para o mesmo lugar da lista
      avisar(`"${peca.nome}" foi removida.`, 'aviso', {
        rotulo: 'Desfazer',
        aoClicar: () => {
          const voltou = aplicarNoCatalogo((atual) => {
            const copia = [...atual];
            copia.splice(Math.max(0, posicao), 0, peca);
            return copia;
          });
          if (voltou) avisar(`"${peca.nome}" voltou para o catálogo.`);
        },
      });
      return true;
    },
    [aplicarNoCatalogo, avisar]
  );

  const alternarCampo = useCallback(
    (id, campo) => {
      aplicarNoCatalogo((atual) =>
        atual.map((p) =>
          p.id === id
            ? { ...p, [campo]: !p[campo], atualizadoEm: new Date().toISOString() }
            : p
        )
      );
    },
    [aplicarNoCatalogo]
  );

  const moverProduto = useCallback(
    (id, direcao) => {
      aplicarNoCatalogo((atual) => {
        const indice = atual.findIndex((p) => p.id === id);
        const destino = indice + direcao;
        if (indice < 0 || destino < 0 || destino >= atual.length) return atual;
        const copia = [...atual];
        [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
        return copia;
      });
    },
    [aplicarNoCatalogo]
  );

  const substituirCatalogo = useCallback(
    (lista, mensagem = 'Catálogo atualizado.') => {
      const salvou = aplicarNoCatalogo(() => lista.map(normalizarProduto));
      if (salvou) avisar(mensagem);
    },
    [aplicarNoCatalogo, avisar]
  );

  const restaurarSeed = useCallback(() => {
    const salvou = aplicarNoCatalogo(() => PRODUTOS_SEED.map(normalizarProduto));
    if (salvou) avisar('Catálogo original restaurado.', 'aviso');
  }, [aplicarNoCatalogo, avisar]);

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

  /* -------- publicação do catálogo -------- */

  const assinaturaAtual = useMemo(
    () => assinarCatalogo(produtos, config),
    [produtos, config]
  );

  /** Existe coisa editada aqui que a cliente ainda não vê? */
  const alteracoesNaoPublicadas = publicado.existe
    ? assinaturaAtual !== publicado.assinatura
    : produtos.length > 0;

  /** Monta o conteúdo do produtos.json que vai para a hospedagem. */
  const montarPublicacao = useCallback(() => {
    const limpo = { ...config };
    delete limpo.acesso;
    delete limpo.senhaAdmin;
    return {
      versao: Date.now(),
      geradoEm: new Date().toISOString(),
      config: limpo,
      produtos,
    };
  }, [config, produtos]);

  /** Volta para o catálogo que está publicado, descartando o rascunho. */
  const descartarRascunho = useCallback(async () => {
    try {
      const resposta = await fetch(`${midia('produtos.json')}?v=${Date.now()}`, {
        cache: 'no-store',
      });
      if (!resposta.ok) throw new Error('sem arquivo');
      const dados = await resposta.json();
      const lista = (dados.produtos || []).map(normalizarProduto);
      setProdutos(lista);
      save(CHAVES.produtos, lista);
      if (dados.config) {
        setConfig((atual) => ({ ...atual, ...dados.config, acesso: atual.acesso }));
      }
      save(CHAVES.baseVersao, Number(dados.versao) || 0);
      avisar('Rascunho descartado: voltamos ao catálogo publicado.', 'aviso');
    } catch {
      avisar('Não encontrei um produtos.json publicado para voltar.', 'erro');
    }
  }, [avisar]);

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
    publicado,
    alteracoesNaoPublicadas,
    espaco,
    montarPublicacao,
    descartarRascunho,
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
