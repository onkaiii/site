"use client";

/**
 * Revela as secoes conforme entram na tela.
 *
 * Nao envolve nada: observa os elementos que ja tem a classe `rv` no markup.
 * Um componente que envolvesse os filhos acrescentaria um `div` no meio de
 * grids e cartoes, e o CSS portado depende da estrutura exata do protótipo.
 *
 * Sem suporte a IntersectionObserver, ou com movimento reduzido, tudo aparece
 * de uma vez: o conteudo nunca fica invisivel por causa da animacao.
 */
import { useEffect } from "react";

export function Revelacao() {
  useEffect(() => {
    const alvos = Array.from(document.querySelectorAll<HTMLElement>(".rv"));
    const trilha = document.getElementById("steps");

    const mostrarTudo = () => {
      for (const alvo of alvos) alvo.classList.add("in");
      trilha?.classList.add("in");
    };

    const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (movimentoReduzido || !("IntersectionObserver" in window)) {
      mostrarTudo();
      return;
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          entrada.target.classList.add("in");
          observador.unobserve(entrada.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    for (const alvo of alvos) observador.observe(alvo);
    return () => observador.disconnect();
  }, []);

  return null;
}
