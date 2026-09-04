import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import localFont from "next/font/local";
import { conteudo } from "@/app/lib/conteudo";
import "./globals.css";

/** Fonte da marca. Os pesos correspondem aos usados no CSS portado. */
const lemonMilk = localFont({
  src: [
    { path: "../public/fonts/LEMONMILK-Light.otf", weight: "300", style: "normal" },
    { path: "../public/fonts/LEMONMILK-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/LEMONMILK-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--fonte-display",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--fonte-corpo",
  display: "swap",
});

export const metadata: Metadata = {
  title: conteudo.site.seo.titulo,
  description: conteudo.site.seo.descricao,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${lemonMilk.variable} ${archivo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
