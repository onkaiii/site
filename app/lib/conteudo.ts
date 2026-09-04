/**
 * Carrega e tipa o conteudo do site.
 *
 * O `parse` roda uma vez, na compilacao dos componentes de servidor. O build ja
 * validou o mesmo arquivo em `scripts/validar-conteudo.ts`, entao aqui ele nao
 * deve falhar nunca; o motivo de parsear em vez de fazer `as ConteudoDoSite` e
 * obter os tipos de verdade e os valores padrao do schema, em vez de uma
 * afirmacao que mente quando o JSON mudar.
 */
import bruto from "@/content/site.json";
import { schemaDoSite, type ConteudoDoSite } from "@/content/schema";

export const conteudo: ConteudoDoSite = schemaDoSite.parse(bruto);

/**
 * Secoes que exibem numero no rotulo, na ordem em que aparecem.
 *
 * A numeracao visivel (`01 / PROJETOS`) e derivada daqui, e nao escrita no
 * conteudo: digitada a mao, sairia de sequencia na primeira reordenacao.
 */
const SECOES_NUMERADAS = [
  "projetos",
  "servicos",
  "sobre",
  "estrutura",
  "processo",
  "chamada_final",
] as const;

export type SecaoNumerada = (typeof SECOES_NUMERADAS)[number];

/** Devolve "01", "02", ... conforme a posicao da secao. */
export function numeroDaSecao(secao: SecaoNumerada): string {
  return String(SECOES_NUMERADAS.indexOf(secao) + 1).padStart(2, "0");
}
