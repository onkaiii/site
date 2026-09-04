/**
 * Frase de impacto, usada nas secoes 03 e 06.
 *
 * A enfase chega como estrutura, nao como marcacao: `esmaecido` vale para a
 * linha inteira e `destaque` e o trecho final em negrito. E por isso que o
 * conteudo nao precisa carregar HTML para as duas frases parecerem diferentes.
 */
import type { ConteudoDoSite } from "@/content/schema";

type Props = {
  frase: ConteudoDoSite["frase_impacto"];
  passo: string;
  className?: string;
};

export function Frase({ frase, passo, className }: Props) {
  return (
    <section className={`statement${className ? ` ${className}` : ""}`} data-step={passo}>
      <div className="wrap">
        <p className="disp rv">
          {frase.linhas.map((linha, indice) => (
            <span key={indice}>
              {indice > 0 && <br />}
              {linha.esmaecido ? <em>{linha.texto}</em> : linha.texto}
              {linha.destaque && (
                <>
                  {" "}
                  <b>{linha.destaque}</b>
                </>
              )}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
