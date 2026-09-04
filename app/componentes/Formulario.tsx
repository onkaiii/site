"use client";

/**
 * Formulario de orcamento.
 *
 * Nao envia nada para servidor: valida no navegador e abre o WhatsApp do
 * cliente com a mensagem ja escrita. Decisao do cliente, e ela dispensa
 * provedor de e-mail, chave de API e protecao contra abuso.
 *
 * A abertura acontece dentro do proprio manipulador de envio, sincronicamente,
 * senao o bloqueador de pop-up barra. Se ainda assim for barrada, a confirmacao
 * mostra o link para a pessoa clicar — a falha nao acontece em silencio.
 */
import { useState } from "react";
import type { ConteudoDoSite } from "@/content/schema";
import { montarLinkDoFormulario, type ValoresDoFormulario } from "@/app/lib/whatsapp";

type Props = {
  formulario: ConteudoDoSite["formulario"];
  numeroDeWhatsapp: string;
};

const OBRIGATORIOS = ["nome", "contato", "tipo", "mensagem"] as const;

export function Formulario({ formulario, numeroDeWhatsapp }: Props) {
  const { campos, tipos_de_projeto } = formulario;
  const [pendentes, setPendentes] = useState<string[]>([]);
  const [linkAberto, setLinkAberto] = useState<string | null>(null);

  function aoEnviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    const valores: ValoresDoFormulario = Object.fromEntries(
      Object.keys(campos).map((chave) => [chave, String(dados.get(chave) ?? "")]),
    );

    const faltando = OBRIGATORIOS.filter((chave) => !valores[chave]?.trim());
    setPendentes(faltando);
    if (faltando.length > 0) {
      setLinkAberto(null);
      return;
    }

    const { url } = montarLinkDoFormulario(formulario, numeroDeWhatsapp, valores);
    setLinkAberto(url);
    window.open(url, "_blank", "noopener");
  }

  function aoDigitar(evento: React.FormEvent<HTMLFormElement>) {
    const alvo = evento.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    if (alvo.value.trim()) setPendentes((atuais) => atuais.filter((chave) => chave !== alvo.name));
  }

  const classe = (chave: string) => `f${pendentes.includes(chave) ? " err" : ""}`;
  const aviso = (chave: string) => (pendentes.includes(chave) ? formulario.erro_de_campo : "");

  return (
    <form className="rv" onSubmit={aoEnviar} onInput={aoDigitar} noValidate>
      <div className={classe("nome")}>
        <label htmlFor="nome">{campos.nome.rotulo}</label>
        <input id="nome" name="nome" placeholder={campos.nome.placeholder} />
        <span className="msg">{aviso("nome")}</span>
      </div>

      <div className={classe("empresa")}>
        <label htmlFor="empresa">{campos.empresa.rotulo}</label>
        <input id="empresa" name="empresa" placeholder={campos.empresa.placeholder} />
        <span className="msg" />
      </div>

      <div className={classe("contato")}>
        <label htmlFor="contato">{campos.contato.rotulo}</label>
        <input id="contato" name="contato" placeholder={campos.contato.placeholder} />
        <span className="msg">{aviso("contato")}</span>
      </div>

      <div className={classe("tipo")}>
        <label htmlFor="tipo">{campos.tipo.rotulo}</label>
        <select id="tipo" name="tipo" defaultValue="">
          <option value="">{campos.tipo.placeholder}</option>
          {tipos_de_projeto.grupos.map((grupo) => (
            <optgroup key={grupo.rotulo} label={grupo.rotulo}>
              {grupo.opcoes.map((opcao) => (
                <option key={opcao}>{opcao}</option>
              ))}
            </optgroup>
          ))}
          {tipos_de_projeto.avulsas.map((opcao) => (
            <option key={opcao}>{opcao}</option>
          ))}
        </select>
        <span className="msg">{aviso("tipo")}</span>
      </div>

      <div className={classe("data")}>
        <label htmlFor="data">{campos.data.rotulo}</label>
        <input id="data" name="data" placeholder={campos.data.placeholder} />
        <span className="msg" />
      </div>

      <div className={classe("cidade")}>
        <label htmlFor="cidade">{campos.cidade.rotulo}</label>
        <input id="cidade" name="cidade" placeholder={campos.cidade.placeholder} />
        <span className="msg" />
      </div>

      <div className={`${classe("mensagem")} span3`}>
        <label htmlFor="mensagem">{campos.mensagem.rotulo}</label>
        <textarea id="mensagem" name="mensagem" placeholder={campos.mensagem.placeholder} />
        <span className="msg">{aviso("mensagem")}</span>
      </div>

      <div className="f-actions">
        <button className="btn solid" type="submit">
          {formulario.botao} <span className="ar">→</span>
        </button>
        {/*
          Fica sempre no DOM, invisivel por opacidade, como no protótipo: assim a
          confirmacao entra sem empurrar o layout. Escondido do leitor de tela
          enquanto nao vale, senao seria anunciado antes de existir.
        */}
        <span
          className={`sent${linkAberto ? " on" : ""}`}
          aria-hidden={!linkAberto}
          aria-live="polite"
        >
          {formulario.confirmacao}
          {linkAberto && (
            <>
              {" · "}
              <a href={linkAberto} target="_blank" rel="noopener">
                {formulario.fallback}
              </a>
            </>
          )}
        </span>
      </div>
    </form>
  );
}
