"use client";

/**
 * Modo de anotacoes: sobrepoe os rotulos numerados de cada secao.
 *
 * Nao e conteudo do site, e ferramenta de revisao. Ganhou o direito de ficar:
 * o cliente usou estes rotulos para escrever o retorno dele secao por secao,
 * e sem eles a linguagem comum se perde.
 *
 * Alterna uma classe no `body` porque os rotulos sao desenhados pelo CSS
 * portado, em `[data-step]::before`.
 */
import { useEffect, useState } from "react";

export function Anotacoes() {
  const [ligado, setLigado] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("annot-on", ligado);
    return () => document.body.classList.remove("annot-on");
  }, [ligado]);

  return (
    <button className="annot" aria-pressed={ligado} onClick={() => setLigado((v) => !v)}>
      <span className="dot" /> Anotações
    </button>
  );
}
