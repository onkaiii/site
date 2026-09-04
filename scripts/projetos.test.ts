/**
 * Testes da regra do grid de projetos.
 *
 * Cada teste corresponde a um cenario do requisito "Grid de projetos
 * adaptativo" no spec `site-institucional`.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { ocupaLinhaInteira } from "../app/lib/projetos";

/** Devolve os indices que ocupariam a linha inteira, dado um total. */
const largos = (total: number) =>
  Array.from({ length: total }, (_, i) => i).filter((i) => ocupaLinhaInteira(i, total));

test("quantidade par: ninguem ocupa a linha inteira", () => {
  assert.deepEqual(largos(2), []);
  assert.deepEqual(largos(4), []);
  assert.deepEqual(largos(6), []);
});

test("quantidade impar: so o ultimo ocupa a linha inteira", () => {
  assert.deepEqual(largos(5), [4]);
  assert.deepEqual(largos(3), [2]);
  assert.deepEqual(largos(7), [6]);
});

test("projeto unico ocupa a linha inteira", () => {
  assert.deepEqual(largos(1), [0]);
});

test("os cinco projetos atuais reproduzem o mockup aprovado", () => {
  // duas fileiras de dois e o quinto ocupando a linha
  assert.deepEqual(largos(5), [4]);
});
