/**
 * Testes da montagem do link do WhatsApp.
 *
 * Cobrem os cenarios do spec `site-institucional` sobre a entrega do lead:
 * mensagem com saudacao e rotulos, campos opcionais em branco fora da mensagem,
 * e texto livre longo truncado.
 *
 * Sao testes de logica pura sobre o conteudo real do repositorio, sem mock:
 * o que precisa ser provado e o texto que chega na conversa.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { schemaDoSite } from "../content/schema";
import { montarLinkDoFormulario, linkDaConversa } from "../app/lib/whatsapp";

const conteudo = schemaDoSite.parse(
  JSON.parse(readFileSync(join(import.meta.dirname, "..", "content", "site.json"), "utf8")),
);
const { formulario, contato } = conteudo;

function texto(url: string): string {
  return decodeURIComponent(new URL(url).searchParams.get("text") ?? "");
}

const completo = {
  nome: "Kaio Brazão",
  empresa: "@onkai.films",
  contato: "12 98703-2908",
  tipo: "Cobertura de evento",
  data: "12/07/2026",
  cidade: "Ilhabela",
  mensagem: "Regata de fim de semana, preciso de foto e drone.",
};

test("a conversa aponta para o numero declarado no conteudo", () => {
  assert.equal(linkDaConversa(contato.whatsapp), "https://wa.me/5512987032908");
});

test("a mensagem comeca pela saudacao do conteudo", () => {
  const { url } = montarLinkDoFormulario(formulario, contato.whatsapp, completo);
  assert.ok(texto(url).startsWith(formulario.saudacao));
});

test("cada campo preenchido aparece com o rotulo que o formulario exibe", () => {
  const { url } = montarLinkDoFormulario(formulario, contato.whatsapp, completo);
  const corpo = texto(url);
  for (const [chave, valor] of Object.entries(completo)) {
    const rotulo = formulario.campos[chave as keyof typeof formulario.campos].rotulo;
    assert.ok(corpo.includes(`*${rotulo}:* ${valor}`), `faltou ${rotulo}`);
  }
});

test("campos opcionais em branco nao entram e nao deixam linha vazia", () => {
  const { url } = montarLinkDoFormulario(formulario, contato.whatsapp, {
    ...completo,
    empresa: "",
    data: "   ",
    cidade: "",
  });
  const corpo = texto(url);
  assert.ok(!corpo.includes(formulario.campos.empresa.rotulo));
  assert.ok(!corpo.includes(formulario.campos.data.rotulo));
  assert.ok(!corpo.includes(formulario.campos.cidade.rotulo));
  // a unica linha vazia e a que separa a saudacao dos campos
  assert.equal(corpo.split("\n").filter((l) => l === "").length, 1);
});

test("texto livre longo e truncado com indicacao de corte, e a URL cabe", () => {
  const { url, truncado } = montarLinkDoFormulario(formulario, contato.whatsapp, {
    ...completo,
    mensagem: "detalhe do projeto ".repeat(300),
  });
  assert.equal(truncado, true);
  assert.ok(url.length <= 1800, `URL ficou com ${url.length}`);
  assert.match(texto(url), /mensagem cortada/);
});

test("texto curto nao e marcado como truncado", () => {
  const { truncado } = montarLinkDoFormulario(formulario, contato.whatsapp, completo);
  assert.equal(truncado, false);
});

test("mensagem vazia ainda produz link utilizavel", () => {
  const { url } = montarLinkDoFormulario(formulario, contato.whatsapp, {
    nome: "Alguém",
    contato: "alguem@exemplo.com",
    tipo: "Retrato",
  });
  const corpo = texto(url);
  assert.ok(corpo.includes("Alguém"));
  assert.ok(!corpo.includes(formulario.campos.mensagem.rotulo));
});
