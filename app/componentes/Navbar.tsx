"use client";

/**
 * Navbar e gaveta de menu.
 *
 * E componente de cliente porque precisa do estado de rolagem, da gaveta no
 * celular e do destaque do item da secao visivel.
 *
 * O botao de orcamento saiu daqui a pedido do cliente, substituido por icones
 * de contato sem rotulo. Isso remove o unico atalho fixo para o orcamento no
 * desktop; o CTA sobrevive no hero, na chamada final e na gaveta do celular.
 */
import Image from "next/image";
import { useEffect, useState } from "react";
import type { ConteudoDoSite } from "@/content/schema";
import { iconesDeContato, type CanalDeContato } from "@/app/icones";
import { linkDaConversa } from "@/app/lib/whatsapp";

type Props = {
  navegacao: ConteudoDoSite["navegacao"];
  contato: ConteudoDoSite["contato"];
  nome: string;
  rotuloOrcamento: string;
};

export function Navbar({ navegacao, contato, nome, rotuloOrcamento }: Props) {
  const [fixada, setFixada] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [secaoAtiva, setSecaoAtiva] = useState<string | null>(null);

  useEffect(() => {
    const aoRolar = () => setFixada(window.scrollY > 40);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu", menuAberto);
    return () => document.body.classList.remove("menu");
  }, [menuAberto]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          const id = entrada.target.id;
          // Compara com o valor anterior via setState funcional: ler o estado
          // aqui capturaria o valor do render em que o efeito foi criado.
          setSecaoAtiva((atual) => (entrada.isIntersecting ? id : atual === id ? null : atual));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const item of navegacao) {
      const alvo = document.getElementById(item.destino);
      if (alvo) observador.observe(alvo);
    }
    return () => observador.disconnect();
  }, [navegacao]);

  const canais: { canal: CanalDeContato; href: string; titulo: string }[] = [
    { canal: "instagram", href: contato.instagram, titulo: "Instagram" },
    { canal: "whatsapp", href: linkDaConversa(contato.whatsapp), titulo: "WhatsApp" },
    { canal: "email", href: `mailto:${contato.email}`, titulo: "E-mail" },
  ];

  return (
    <>
      <header className={`nav${fixada ? " stuck" : ""}`} data-step="01 · Navbar">
        <a href="#topo" aria-label={`${nome} — início`}>
          <Image className="logo" src="/img/logo.png" alt={nome} width={760} height={210} priority />
        </a>

        <nav className="nav-links">
          {navegacao.map((item) => (
            <a
              key={item.destino}
              href={`#${item.destino}`}
              aria-current={secaoAtiva === item.destino ? "true" : "false"}
            >
              {item.rotulo}
            </a>
          ))}
        </nav>

        <nav className="nav-social" aria-label="Contato">
          {canais.map(({ canal, href, titulo }) => (
            <a
              key={canal}
              href={href}
              target={canal === "email" ? undefined : "_blank"}
              rel={canal === "email" ? undefined : "noopener"}
              aria-label={`${titulo} da ${nome}`}
              title={titulo}
            >
              {iconesDeContato[canal]}
            </a>
          ))}
        </nav>

        <button
          className="burger"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto((aberto) => !aberto)}
        >
          <span />
        </button>
      </header>

      <div className="drawer">
        {navegacao.map((item) => (
          <a key={item.destino} href={`#${item.destino}`} onClick={() => setMenuAberto(false)}>
            {item.rotulo}
          </a>
        ))}
        <a
          href="#contato"
          style={{ color: "var(--sun)", borderBottom: 0 }}
          onClick={() => setMenuAberto(false)}
        >
          {rotuloOrcamento} →
        </a>
      </div>
    </>
  );
}
