/**
 * Gera `content/site.schema.json` a partir do Zod.
 *
 * O JSON Schema existe para ajudar quem edita `content/site.json` num editor.
 * Nao e fonte da verdade: `content/schema.ts` e. Rode este script depois de
 * mexer no schema, senao os dois divergem.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import * as z from "zod";
import { schemaDoSite } from "../content/schema";

const destino = join(import.meta.dirname, "..", "content", "site.schema.json");

const jsonSchema = z.toJSONSchema(schemaDoSite, { io: "input" });

writeFileSync(destino, JSON.stringify(jsonSchema, null, 2) + "\n", "utf8");
console.log(`content/site.schema.json gerado a partir de content/schema.ts`);
