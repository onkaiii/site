/**
 * Testes do validador de conteudo.
 *
 * Cada teste cobre um cenario do spec `conteudo-configuravel`.
 *
 * A verificacao de imagem le o disco de verdade, em diretorio temporario: um
 * mock diria apenas que o codigo chama a funcao que eu escrevi, e o que precisa
 * ser provado e que `capa.JPG` contra `capa.jpg` falha aqui como falharia no
 * Linux da Vercel. No macOS, onde estes testes rodam, o sistema de arquivos
 * ignora maiusculas — e exatamente por isso o teste tem valor.
 */
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  ConteudoInvalido,
  lerJson,
  validar,
  validarImagens,
  validarSchema,
  validarSemHtml,
} from "./validar-conteudo";

const RAIZ_REAL = join(import.meta.dirname, "..");
const BRUTO = readFileSync(join(RAIZ_REAL, "content", "site.json"), "utf8");

function conteudoBase(): Record<string, any> {
  return JSON.parse(BRUTO);
}

/** Cria um `public/img/` de verdade contendo os arquivos pedidos. */
function raizComImagens(nomes: string[]): string {
  const raiz = mkdtempSync(join(tmpdir(), "onkai-"));
  mkdirSync(join(raiz, "public", "img"), { recursive: true });
  for (const nome of nomes) writeFileSync(join(raiz, "public", "img", nome), "");
  return raiz;
}

function todasAsImagens(c: Record<string, any>): string[] {
  return [
    c.hero.imagem.arquivo,
    c.sobre.imagem.arquivo,
    c.chamada_final.imagem.arquivo,
    ...c.projetos.itens.map((p: any) => p.imagem.arquivo),
  ].map((caminho: string) => caminho.replace("/img/", ""));
}

test("o conteudo do repositorio e valido", () => {
  const conteudo = validar(BRUTO, RAIZ_REAL);
  assert.equal(conteudo.projetos.itens.length, 5);
});

test("JSON malformado aponta linha e coluna", () => {
  const quebrado = '{\n  "site": {},\n  "contato": {},,\n}';
  assert.throws(
    () => lerJson(quebrado),
    (erro: Error) => {
      assert.ok(erro instanceof ConteudoInvalido);
      assert.match(erro.message, /linha \d+, coluna \d+/);
      return true;
    },
  );
});

test("campo obrigatorio ausente nomeia o caminho dentro do JSON", () => {
  const c = conteudoBase();
  delete c.projetos.itens[0].titulo;
  assert.throws(
    () => validarSchema(c),
    (erro: Error) => {
      assert.ok(erro instanceof ConteudoInvalido);
      assert.match(erro.message, /projetos/);
      assert.match(erro.message, /titulo/);
      return true;
    },
  );
});

test("imagem inexistente por divergencia de caixa e recusada", () => {
  const c = validarSchema(conteudoBase());
  const nomes = todasAsImagens(c as any);
  // o disco tem p-sivi.jpg; o conteudo vai pedir p-sivi.JPG
  const raiz = raizComImagens(nomes);
  (c as any).projetos.itens[0].imagem.arquivo = "/img/p-sivi.JPG";

  assert.throws(
    () => validarImagens(c, raiz),
    (erro: Error) => {
      assert.ok(erro instanceof ConteudoInvalido);
      assert.match(erro.message, /p-sivi\.JPG/);
      return true;
    },
  );
});

test("imagem existente com a caixa correta e aceita", () => {
  const c = validarSchema(conteudoBase());
  const raiz = raizComImagens(todasAsImagens(c as any));
  assert.doesNotThrow(() => validarImagens(c, raiz));
});

test("URL sem esquema e recusada", () => {
  const c = conteudoBase();
  c.projetos.itens[0].galeria = "galleries.vidflow.co/omklh1gl";
  assert.throws(
    () => validarSchema(c),
    (erro: Error) => {
      assert.match(erro.message, /galeria|URL absoluta/i);
      return true;
    },
  );
});

test("nome de icone desconhecido e recusado", () => {
  const c = conteudoBase();
  c.servicos.itens[0].icone = "podcast";
  assert.throws(
    () => validarSchema(c),
    (erro: Error) => {
      assert.match(erro.message, /icone|fotografia/i);
      return true;
    },
  );
});

test("ancora inexistente e recusada", () => {
  const c = conteudoBase();
  c.navegacao[0].destino = "blog";
  assert.throws(() => validarSchema(c), ConteudoInvalido);
});

test("whatsapp precisa ser numero cru", () => {
  const c = conteudoBase();
  c.contato.whatsapp = "https://wa.me/5512987032908";
  assert.throws(
    () => validarSchema(c),
    (erro: Error) => {
      assert.match(erro.message, /dígitos|whatsapp/i);
      return true;
    },
  );
});

test("texto com marcacao HTML e recusado", () => {
  const c = conteudoBase();
  c.hero.titulo = "Da ideia ao <b>corte final</b>";
  assert.throws(
    () => validarSemHtml(c),
    (erro: Error) => {
      assert.match(erro.message, /hero\.titulo/);
      return true;
    },
  );
});

test("campo de texto vazio e recusado", () => {
  const c = conteudoBase();
  c.hero.titulo = "   ";
  assert.throws(() => validarSchema(c), ConteudoInvalido);
});

test("lista de projetos vazia e recusada", () => {
  const c = conteudoBase();
  c.projetos.itens = [];
  assert.throws(
    () => validarSchema(c),
    (erro: Error) => {
      assert.match(erro.message, /pelo menos um projeto/);
      return true;
    },
  );
});

test("campos opcionais de pagina de projeto sao aceitos", () => {
  const c = conteudoBase();
  Object.assign(c.projetos.itens[0], {
    cliente: "Sertões",
    data: "2026",
    local: "Ceará",
    perfil: "@sertoes.kitesurf",
    descricao: "Cinco dias de evento transformados em documentário.",
  });
  const conteudo = validarSchema(c);
  assert.equal(conteudo.projetos.itens[0].cliente, "Sertões");
});
