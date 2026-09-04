/**
 * Monta o link do WhatsApp com a mensagem do formulario ja escrita.
 *
 * O formulario nao envia nada para servidor nenhum: ele abre a conversa com o
 * texto pronto. Por isso o numero fica no conteudo como numero cru, e nao como
 * URL — de uma URL pronta nao daria para montar o parametro de texto.
 */
import type { ConteudoDoSite } from "@/content/schema";

type Formulario = ConteudoDoSite["formulario"];
type ChaveDeCampo = keyof Formulario["campos"];

/**
 * Teto do comprimento da URL final.
 *
 * Navegadores e o proprio WhatsApp toleram mais que isso, mas nao ha numero
 * garantido; 1800 e conservador e ainda cabe um texto longo de verdade.
 */
const LIMITE_DA_URL = 1800;

const MARCA_DE_CORTE = "… (mensagem cortada, o restante eu conto aqui)";

/** Ordem em que os campos aparecem na mensagem; a mensagem livre vai por ultimo. */
const ORDEM: ChaveDeCampo[] = [
  "nome",
  "empresa",
  "contato",
  "tipo",
  "data",
  "cidade",
  "mensagem",
];

export type ValoresDoFormulario = Partial<Record<ChaveDeCampo, string>>;

export function linkDaConversa(numero: string): string {
  return `https://wa.me/${numero}`;
}

function montarTexto(
  formulario: Formulario,
  valores: ValoresDoFormulario,
  mensagem: string,
): string {
  const linhas = [formulario.saudacao, ""];
  for (const chave of ORDEM) {
    const valor = chave === "mensagem" ? mensagem : (valores[chave] ?? "").trim();
    // Campos opcionais em branco nao entram: gerariam linhas soltas na conversa.
    if (!valor) continue;
    linhas.push(`*${formulario.campos[chave].rotulo}:* ${valor}`);
  }
  return linhas.join("\n");
}

function montarUrl(numero: string, texto: string): string {
  return `${linkDaConversa(numero)}?text=${encodeURIComponent(texto)}`;
}

/**
 * Devolve a URL da conversa e se o texto livre precisou ser cortado.
 *
 * Corta apenas a mensagem livre, porque os outros campos sao curtos por
 * natureza e perder qualquer um deles descaracterizaria o pedido.
 */
export function montarLinkDoFormulario(
  formulario: Formulario,
  numero: string,
  valores: ValoresDoFormulario,
): { url: string; truncado: boolean } {
  const mensagemCompleta = (valores.mensagem ?? "").trim();
  const url = montarUrl(numero, montarTexto(formulario, valores, mensagemCompleta));
  if (url.length <= LIMITE_DA_URL) return { url, truncado: false };

  let corte = mensagemCompleta.length;
  const cabe = (n: number) =>
    montarUrl(
      numero,
      montarTexto(formulario, valores, mensagemCompleta.slice(0, n) + MARCA_DE_CORTE),
    ).length <= LIMITE_DA_URL;

  while (corte > 0 && !cabe(corte)) corte -= 20;
  corte = Math.max(corte, 0);

  return {
    url: montarUrl(
      numero,
      montarTexto(formulario, valores, mensagemCompleta.slice(0, corte) + MARCA_DE_CORTE),
    ),
    truncado: true,
  };
}
