/**
 * Valida `content/site.json` antes do build.
 *
 * Roda dentro do script `build`, entao conteudo invalido derruba o build e a
 * Vercel nao publica: o site que esta no ar continua no ar.
 *
 * Quatro verificacoes:
 *  1. o arquivo e JSON valido (com linha e coluna quando nao e);
 *  2. bate com o schema, incluindo obrigatorios, tipos, enums e formato de URL;
 *  3. toda imagem citada existe em `public/`, comparando caixa explicitamente;
 *  4. nenhum texto carrega marcacao HTML.
 *
 * A verificacao 3 nao pergunta ao sistema de arquivos se o arquivo existe:
 * o macOS ignora maiusculas e o Linux da Vercel nao, entao `capa.JPG` passaria
 * aqui e falharia em producao. Ela lista o diretorio e compara o nome exato.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import * as z from "zod";
import { schemaDoSite, type ConteudoDoSite } from "../content/schema";

const RAIZ = join(import.meta.dirname, "..");
const ARQUIVO = join(RAIZ, "content", "site.json");

export class ConteudoInvalido extends Error {}

/** Converte um deslocamento de caractere em linha e coluna, para a mensagem ser acionavel. */
function posicao(texto: string, indice: number): string {
  const antes = texto.slice(0, indice);
  const linha = antes.split("\n").length;
  const coluna = indice - antes.lastIndexOf("\n");
  return `linha ${linha}, coluna ${coluna}`;
}

/** 1. Parse, traduzindo o deslocamento do erro para linha e coluna. */
export function lerJson(bruto: string): unknown {
  try {
    return JSON.parse(bruto);
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : String(erro);
    const achado = /position (\d+)/.exec(mensagem);
    const onde = achado ? ` (${posicao(bruto, Number(achado[1]))})` : "";
    throw new ConteudoInvalido(`content/site.json não é JSON válido${onde}: ${mensagem}`);
  }
}

/** 2. Schema. Enums e formato de URL vem daqui, de forma declarativa. */
export function validarSchema(dados: unknown): ConteudoDoSite {
  const resultado = schemaDoSite.safeParse(dados);
  if (!resultado.success) {
    throw new ConteudoInvalido(
      `content/site.json não bate com o schema:\n${z.prettifyError(resultado.error)}`,
    );
  }
  return resultado.data;
}

function caminhosDeImagem(conteudo: ConteudoDoSite): string[] {
  return [
    conteudo.hero.imagem.arquivo,
    conteudo.sobre.imagem.arquivo,
    conteudo.chamada_final.imagem.arquivo,
    ...conteudo.projetos.itens.map((p) => p.imagem.arquivo),
  ];
}

/** 3. Existencia de imagem, sensivel a maiusculas e minusculas. */
export function validarImagens(conteudo: ConteudoDoSite, raiz = RAIZ): void {
  const existentes = new Set(readdirSync(join(raiz, "public", "img")));
  const faltando = [...new Set(caminhosDeImagem(conteudo))].filter(
    (caminho) => !existentes.has(caminho.replace("/img/", "")),
  );
  if (faltando.length > 0) {
    throw new ConteudoInvalido(
      `imagem citada em content/site.json que não existe em public/img/:\n` +
        faltando.map((c) => `  ${c}`).join("\n") +
        `\ndisponíveis: ${[...existentes].sort().join(", ")}`,
    );
  }
}

/**
 * 4. Nenhum texto carrega marcacao.
 *
 * O conteudo e renderizado como texto pelo React, entao isto nao e defesa
 * contra injecao: e para o autor descobrir que a tag nao vai funcionar, em vez
 * de ver `<b>` literal na pagina.
 */
export function validarSemHtml(dados: unknown): void {
  const suspeitos: string[] = [];
  const visitar = (valor: unknown, caminho: string) => {
    if (typeof valor === "string") {
      if (/<\/?[a-z][\s\S]*?>/i.test(valor)) suspeitos.push(`${caminho}: ${valor.slice(0, 60)}`);
    } else if (Array.isArray(valor)) {
      valor.forEach((v, i) => visitar(v, `${caminho}[${i}]`));
    } else if (valor && typeof valor === "object") {
      for (const [k, v] of Object.entries(valor)) visitar(v, caminho ? `${caminho}.${k}` : k);
    }
  };
  visitar(dados, "");
  if (suspeitos.length > 0) {
    throw new ConteudoInvalido(
      `conteúdo com marcação HTML, que seria exibida como texto literal:\n` +
        suspeitos.map((s) => `  ${s}`).join("\n"),
    );
  }
}

export function validar(bruto: string, raiz = RAIZ): ConteudoDoSite {
  const dados = lerJson(bruto);
  validarSemHtml(dados);
  const conteudo = validarSchema(dados);
  validarImagens(conteudo, raiz);
  return conteudo;
}

/** Executa como script apenas quando chamado direto, para os testes poderem importar. */
const chamadoDireto = process.argv[1] && import.meta.filename === process.argv[1];
if (chamadoDireto) {
  try {
    const conteudo = validar(readFileSync(ARQUIVO, "utf8"));
    console.log(
      `content/site.json válido: ${conteudo.projetos.itens.length} projetos, ` +
        `${conteudo.servicos.itens.length} serviços, ${conteudo.processo.etapas.length} etapas.`,
    );
  } catch (erro) {
    if (erro instanceof ConteudoInvalido) {
      console.error(`\n${erro.message}\n`);
      process.exit(1);
    }
    throw erro;
  }
}
