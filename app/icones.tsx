/**
 * Icones do site, indexados por nome.
 *
 * Ficam no codigo, e nao no conteudo: um icone novo e trabalho de design.
 * O conteudo referencia `"icone": "drone"`, e `content/schema.ts` valida o nome
 * contra `ICONES_SERVICO`, que precisa espelhar as chaves de `iconesDeServico`.
 *
 * Os paths vem verbatim de src/v2/body.html; o traco e a cor sao do CSS.
 */
import type { ReactElement } from "react";
import type { IconeDeServico } from "@/content/schema";

const moldura = { viewBox: "0 0 24 24", "aria-hidden": true } as const;

export const iconesDeServico: Record<IconeDeServico, ReactElement> = {
  fotografia: (
    <svg {...moldura}>
      <path d="M3 7.5h3.2l1.4-2h8.8l1.4 2H21v11H3z" />
      <circle cx="12" cy="13" r="3.6" />
    </svg>
  ),
  video: (
    <svg {...moldura}>
      <path d="M3 8h18v12H3z" />
      <path d="M3 8l2.6-4h3L6 8m4 0l2.6-4h3L13 8" />
    </svg>
  ),
  drone: (
    <svg {...moldura}>
      <path d="M8.5 8.5h7v7h-7z" />
      <path d="M8.5 8.5L5 5m10.5 3.5L19 5M8.5 15.5L5 19m10.5-3.5L19 19" />
      <circle cx="4" cy="4" r="1.8" />
      <circle cx="20" cy="4" r="1.8" />
      <circle cx="4" cy="20" r="1.8" />
      <circle cx="20" cy="20" r="1.8" />
    </svg>
  ),
  storymaker: (
    <svg {...moldura}>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M10.6 5.4h2.8" />
      <circle cx="12" cy="18" r="1" />
    </svg>
  ),
};

export type CanalDeContato = "instagram" | "whatsapp" | "email";

export const iconesDeContato: Record<CanalDeContato, ReactElement> = {
  instagram: (
    <svg {...moldura}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r=".9" fill="currentColor" stroke="none" />
    </svg>
  ),
  whatsapp: (
    <svg {...moldura}>
      <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.4-4.3A8.5 8.5 0 1 1 20.5 11.7z" />
      <path
        d="M8.9 9.3c.3 2.6 2.6 4.9 5.2 5.2l1-1.4 1.9.8-.4 1.7c-3.7.6-8.2-3.9-7.6-7.6l1.7-.4.8 1.9z"
        stroke="none"
        fill="currentColor"
      />
    </svg>
  ),
  email: (
    <svg {...moldura}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.6 6.2 12 12.6l8.4-6.4" />
    </svg>
  ),
};
