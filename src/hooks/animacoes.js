import { useEffect, useRef, useState } from 'react';

const semMovimento = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Revela os elementos marcados com data-revelar quando eles entram na tela,
 * em cascata: cada irmão espera um pouquinho mais que o anterior.
 *
 * Também fica de olho no que aparece depois (troca de filtro, busca, "ver
 * mais"): todo elemento novo é registrado automaticamente, senão ele nasceria
 * transparente e nunca apareceria.
 */
export function useRevelar(dependencia) {
  useEffect(() => {
    const revelar = (alvo) => {
      const grupo = alvo.parentElement;
      const irmaos = grupo
        ? Array.from(grupo.querySelectorAll(':scope > [data-revelar]'))
        : [];
      const indice = Math.max(0, irmaos.indexOf(alvo));
      alvo.style.setProperty('--atraso', `${Math.min(indice, 7) * 75}ms`);
      alvo.classList.add('revelado');
      alvo.addEventListener(
        'animationend',
        () => alvo.classList.add('revelar-pronto'),
        { once: true }
      );
    };

    const pendentes = () =>
      Array.from(document.querySelectorAll('[data-revelar]:not(.revelado)'));

    // Sem animação (ou sem suporte): tudo aparece na hora, inclusive o que
    // for criado depois.
    if (semMovimento() || !('IntersectionObserver' in window)) {
      const revelarTudo = () => pendentes().forEach((a) => a.classList.add('revelado'));
      revelarTudo();
      const vigia = new MutationObserver(revelarTudo);
      vigia.observe(document.body, { childList: true, subtree: true });
      return () => vigia.disconnect();
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          revelar(entrada.target);
          observador.unobserve(entrada.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    let resgate = null;
    const registrar = () => {
      const novos = pendentes();
      if (!novos.length) return;
      novos.forEach((alvo) => observador.observe(alvo));

      // Rede de segurança: se em pouco mais de um segundo algum elemento que
      // já está na área visível continuar escondido, mostra assim mesmo.
      clearTimeout(resgate);
      resgate = setTimeout(() => {
        pendentes().forEach((alvo) => {
          const caixa = alvo.getBoundingClientRect();
          const naTela = caixa.top < window.innerHeight && caixa.bottom > -40;
          if (naTela) {
            revelar(alvo);
            observador.unobserve(alvo);
          }
        });
      }, 1200);
    };

    registrar();

    // Observa o que o React montar depois (filtros, busca, paginação...).
    let agendado = null;
    const vigia = new MutationObserver(() => {
      if (agendado !== null) return;
      agendado = requestAnimationFrame(() => {
        agendado = null;
        registrar();
      });
    });
    vigia.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(resgate);
      if (agendado !== null) cancelAnimationFrame(agendado);
      vigia.disconnect();
      observador.disconnect();
    };
  }, [dependencia]);
}

/**
 * Parallax leve: o elemento desliza mais devagar que a página.
 * Uso: const ref = useParallax(0.12)
 */
export function useParallax(intensidade = 0.12) {
  const referencia = useRef(null);

  useEffect(() => {
    const elemento = referencia.current;
    if (!elemento || semMovimento()) return;

    let pedido = null;
    const atualizar = () => {
      pedido = null;
      const caixa = elemento.getBoundingClientRect();
      const centro = caixa.top + caixa.height / 2 - window.innerHeight / 2;
      elemento.style.transform = `translate3d(0, ${(-centro * intensidade).toFixed(1)}px, 0)`;
    };
    const aoRolar = () => {
      if (pedido === null) pedido = requestAnimationFrame(atualizar);
    };

    atualizar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', aoRolar);
    return () => {
      if (pedido) cancelAnimationFrame(pedido);
      window.removeEventListener('scroll', aoRolar);
      window.removeEventListener('resize', aoRolar);
    };
  }, [intensidade]);

  return referencia;
}

/**
 * Conta de zero até o valor quando o elemento aparece na tela.
 * Devolve [ref, valorAtual].
 */
export function useContador(valorFinal = 0, duracao = 1400) {
  const referencia = useRef(null);
  const anima =
    !semMovimento() &&
    typeof window !== 'undefined' &&
    'IntersectionObserver' in window;
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    const elemento = referencia.current;
    if (!elemento || !anima) return;

    let quadro = null;
    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas[0].isIntersecting) return;
        observador.disconnect();

        const inicio = performance.now();
        const animar = (agora) => {
          const fracao = Math.min(1, (agora - inicio) / duracao);
          // desacelera no final (easeOutExpo)
          setProgresso(fracao === 1 ? 1 : 1 - Math.pow(2, -10 * fracao));
          if (fracao < 1) quadro = requestAnimationFrame(animar);
        };
        quadro = requestAnimationFrame(animar);
      },
      { threshold: 0.4 }
    );

    observador.observe(elemento);
    return () => {
      if (quadro) cancelAnimationFrame(quadro);
      observador.disconnect();
    };
  }, [anima, duracao]);

  return [referencia, anima ? valorFinal * progresso : valorFinal];
}

/** Move suavemente o conteúdo conforme o mouse passa por cima (só no PC). */
export function useSeguirMouse(intensidade = 10) {
  const referencia = useRef(null);

  useEffect(() => {
    const elemento = referencia.current;
    if (!elemento || semMovimento()) return;
    if (!window.matchMedia('(hover: hover)').matches) return;

    const mover = (evento) => {
      const caixa = elemento.getBoundingClientRect();
      const x = (evento.clientX - caixa.left) / caixa.width - 0.5;
      const y = (evento.clientY - caixa.top) / caixa.height - 0.5;
      elemento.style.setProperty('--mx', `${(-x * intensidade).toFixed(2)}px`);
      elemento.style.setProperty('--my', `${(-y * intensidade).toFixed(2)}px`);
    };
    const sair = () => {
      elemento.style.setProperty('--mx', '0px');
      elemento.style.setProperty('--my', '0px');
    };

    elemento.addEventListener('mousemove', mover);
    elemento.addEventListener('mouseleave', sair);
    return () => {
      elemento.removeEventListener('mousemove', mover);
      elemento.removeEventListener('mouseleave', sair);
    };
  }, [intensidade]);

  return referencia;
}

/** Troca o título da aba quando a pessoa sai do site — um aceno de volta. */
export function useTituloAoSair(recado = 'A gente te espera ♡') {
  useEffect(() => {
    const original = document.title;
    const aoTrocar = () => {
      document.title = document.hidden ? recado : original;
    };
    document.addEventListener('visibilitychange', aoTrocar);
    return () => {
      document.removeEventListener('visibilitychange', aoTrocar);
      document.title = original;
    };
  }, [recado]);
}
