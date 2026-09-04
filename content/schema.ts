/**
 * Contrato de `content/site.json`.
 *
 * Fonte unica: daqui saem os tipos usados pelos componentes e o
 * `content/site.schema.json` que ajuda quem edita o arquivo num editor.
 *
 * Regras que este schema existe para sustentar:
 *  - nenhum valor carrega HTML; enfase tipografica e estrutura, nao marcacao;
 *  - nomes de campo em portugues, porque quem edita o arquivo e o cliente;
 *  - o que é decisao de design (icone, ancora, ordem) e enum fechado, nao texto livre.
 */
import * as z from "zod";

/** Ancoras que existem na pagina. Inventar uma quebra o build. */
export const ANCORAS = ["topo", "projetos", "servicos", "sobre", "contato"] as const;

/** Icones desenhados no codigo. Um icone novo e trabalho de design, nao de conteudo. */
export const ICONES_SERVICO = ["fotografia", "video", "drone", "storymaker"] as const;

const texto = z.string().trim().min(1, "não pode ficar vazio");

const urlHttp = texto.refine(
  (v) => {
    try {
      const u = new URL(v);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  },
  { message: 'precisa ser uma URL absoluta começando por "https://"' },
);

/** Caminho servido de `public/`. A existencia do arquivo e conferida pelo validador. */
const caminhoImagem = texto.regex(/^\/img\/[\w.-]+$/, 'precisa começar com "/img/" e apontar um arquivo');

const ancora = z.enum(ANCORAS);

const imagem = z.object({
  arquivo: caminhoImagem,
  alt: texto.describe("descrição da imagem para leitor de tela"),
});

const botao = z.object({ rotulo: texto, destino: ancora });

/** Uma linha de frase de impacto. `destaque` e o trecho final em negrito. */
const linhaDeFrase = z.object({
  texto,
  esmaecido: z.boolean().optional(),
  destaque: texto.optional(),
});

const frase = z.object({ linhas: z.array(linhaDeFrase).min(1) });

const campoDeFormulario = z.object({ rotulo: texto, placeholder: texto });

export const schemaDoSite = z.object({
  $schema: z.string().optional(),

  site: z.object({
    nome: texto,
    seo: z.object({ titulo: texto, descricao: texto }),
  }),

  /** Declarado uma vez; alimenta navbar, rodape e a mensagem do formulario. */
  contato: z.object({
    instagram: urlHttp,
    whatsapp: texto
      .regex(/^\d{12,13}$/, "só dígitos, com código do país e DDD, ex.: 5512987032908")
      .describe("numero cru, sem + nem espaco; o codigo monta os links a partir dele"),
    email: z.email("precisa ser um e-mail válido"),
  }),

  navegacao: z.array(z.object({ rotulo: texto, destino: ancora })).min(1),

  hero: z.object({
    marca: texto.describe("primeira parte do rótulo, em destaque"),
    complemento: texto.describe("segunda parte do rótulo"),
    titulo: texto,
    subtitulo: texto,
    botao_primario: botao,
    botao_secundario: botao,
    dica_de_rolagem: texto,
    imagem,
  }),

  frase_impacto: frase,

  projetos: z.object({
    rotulo: texto,
    titulo: texto,
    descricao: texto,
    itens: z
      .array(
        z.object({
          categoria: texto,
          titulo: texto,
          tags: z.array(texto).min(1),
          galeria: urlHttp,
          imagem,
          // Reservados para as paginas individuais de projeto, ainda nao implementadas.
          cliente: texto.optional(),
          data: texto.optional(),
          local: texto.optional(),
          perfil: texto.optional(),
          descricao: texto.optional(),
        }),
      )
      .min(1, "precisa de pelo menos um projeto"),
  }),

  frase_transicao: frase,

  servicos: z.object({
    rotulo: texto,
    titulo: texto,
    descricao: texto,
    itens: z
      .array(
        z.object({
          icone: z.enum(ICONES_SERVICO),
          titulo: texto,
          descricao: texto,
          topicos: z.array(texto).min(1),
        }),
      )
      .min(1),
  }),

  sobre: z.object({
    rotulo: texto,
    titulo: texto,
    paragrafos: z.array(texto).min(1),
    imagem,
  }),

  estrutura: z.object({
    rotulo: texto,
    titulo: texto,
    descricao: texto,
    itens: z.array(z.object({ titulo: texto, descricao: texto })).min(1),
  }),

  processo: z.object({
    rotulo: texto,
    titulo: texto,
    descricao: texto,
    etapas: z.array(z.object({ titulo: texto, descricao: texto })).min(1),
  }),

  chamada_final: z.object({
    rotulo: texto,
    titulo: texto,
    botao,
    imagem,
  }),

  formulario: z.object({
    titulo: texto,
    descricao: texto,
    /** Chaves fixas: a ordem e a disposicao no grid ficam no codigo. */
    campos: z.object({
      nome: campoDeFormulario,
      empresa: campoDeFormulario,
      contato: campoDeFormulario,
      tipo: campoDeFormulario,
      data: campoDeFormulario,
      cidade: campoDeFormulario,
      mensagem: campoDeFormulario,
    }),
    tipos_de_projeto: z.object({
      grupos: z
        .array(z.object({ rotulo: texto, opcoes: z.array(texto).min(1) }))
        .min(1),
      avulsas: z.array(texto).default([]),
    }),
    botao: texto,
    erro_de_campo: texto.describe("mensagem exibida sob um campo obrigatório vazio"),
    /** Primeira linha da mensagem enviada ao WhatsApp. */
    saudacao: texto,
    confirmacao: texto,
    fallback: texto.describe("texto do link quando o navegador bloqueia a nova aba"),
  }),

  rodape: z.object({ linhas: z.array(texto).min(1) }),
});

export type ConteudoDoSite = z.infer<typeof schemaDoSite>;
export type Projeto = ConteudoDoSite["projetos"]["itens"][number];
export type IconeDeServico = (typeof ICONES_SERVICO)[number];
export type Ancora = (typeof ANCORAS)[number];
