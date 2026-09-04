/**
 * Home da onkai.films: as treze secoes na ordem aprovada pelo cliente.
 *
 * Todo texto vem de `content/site.json`. A ordem das secoes, a numeracao dos
 * rotulos, o layout e os icones ficam aqui, porque mudar qualquer um deles e
 * decisao de design e nao de conteudo.
 */
import Image from "next/image";
import { Anotacoes } from "@/app/componentes/Anotacoes";
import { Formulario } from "@/app/componentes/Formulario";
import { Frase } from "@/app/componentes/Frase";
import { Navbar } from "@/app/componentes/Navbar";
import { Revelacao } from "@/app/componentes/Revelacao";
import { iconesDeContato, iconesDeServico } from "@/app/icones";
import { conteudo, numeroDaSecao } from "@/app/lib/conteudo";
import { ocupaLinhaInteira } from "@/app/lib/projetos";
import { linkDaConversa } from "@/app/lib/whatsapp";

const {
  site,
  contato,
  navegacao,
  hero,
  frase_impacto,
  projetos,
  frase_transicao,
  servicos,
  sobre,
  estrutura,
  processo,
  chamada_final,
  formulario,
  rodape,
} = conteudo;

/** Rotulo de secao: o numero vem da posicao, o texto vem do conteudo. */
function Rotulo({ numero, texto }: { numero: string; texto: string }) {
  return (
    <p className="eyebrow">
      <b>{numero}</b> / {texto}
    </p>
  );
}

export default function Home() {
  const total = projetos.itens.length;

  return (
    <>
      <Revelacao />

      <Navbar
        navegacao={navegacao}
        contato={contato}
        nome={site.nome}
        rotuloOrcamento={hero.botao_secundario.rotulo}
      />

      {/* 02 · Hero */}
      <section className="hero" id="topo" data-step="02 · Hero">
        <div className="hero-media">
          <Image src={hero.imagem.arquivo} alt={hero.imagem.alt} fill priority sizes="100vw" />
        </div>
        <div className="hero-in wrap">
          <p className="eyebrow">
            <b>{hero.marca}</b> — {hero.complemento}
          </p>
          <h1>{hero.titulo}</h1>
          <p className="lede">{hero.subtitulo}</p>
          <div className="hero-cta">
            <a className="btn solid" href={`#${hero.botao_primario.destino}`}>
              {hero.botao_primario.rotulo}
            </a>
            <a className="btn" href={`#${hero.botao_secundario.destino}`}>
              {hero.botao_secundario.rotulo}
            </a>
          </div>
        </div>
        <div className="scrollcue">
          <i /> {hero.dica_de_rolagem}
        </div>
      </section>

      <Frase frase={frase_impacto} passo="03 · Frase" />

      {/* 04 + 05 · Projetos */}
      <section id="projetos" data-step="04 · Projetos">
        <div className="wrap sechead rv">
          <Rotulo numero={numeroDaSecao("projetos")} texto={projetos.rotulo} />
          <h2>{projetos.titulo}</h2>
          <p className="lede">{projetos.descricao}</p>
        </div>
        <div className="wrap">
          <div className="grid">
            {projetos.itens.map((projeto, indice) => {
              const largo = ocupaLinhaInteira(indice, total);
              return (
                <a
                  key={projeto.galeria}
                  className={`card rv${largo ? " wide" : ""}`}
                  href={projeto.galeria}
                  target="_blank"
                  rel="noopener"
                >
                  <Image
                    src={projeto.imagem.arquivo}
                    alt={projeto.imagem.alt}
                    fill
                    sizes={largo ? "100vw" : "(max-width: 720px) 100vw, 50vw"}
                  />
                  <div className="card-in">
                    <p className="eyebrow">{projeto.categoria}</p>
                    <h3>{projeto.titulo}</h3>
                    <div className="tags">
                      {projeto.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="golink">
                      Ver projeto <span className="ar">→</span>
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <Frase
        frase={frase_transicao}
        passo="06 · Frase"
        className="statement-transicao"
      />

      {/* 07 · Serviços */}
      <section className="services" id="servicos" data-step="07 · Serviços">
        <div className="wrap sechead rv">
          <Rotulo numero={numeroDaSecao("servicos")} texto={servicos.rotulo} />
          <h2>{servicos.titulo}</h2>
          <p className="lede">{servicos.descricao}</p>
        </div>
        <div className="wrap">
          <div className="svc-grid rv">
            {servicos.itens.map((servico) => (
              <div className="svc" key={servico.titulo}>
                {iconesDeServico[servico.icone]}
                <h3>{servico.titulo}</h3>
                <p>{servico.descricao}</p>
                <ul>
                  {servico.topicos.map((topico) => (
                    <li key={topico}>{topico}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 08 · Sobre */}
      <section className="about" id="sobre" data-step="08 · Sobre">
        <div className="about-img">
          <Image
            src={sobre.imagem.arquivo}
            alt={sobre.imagem.alt}
            fill
            sizes="(max-width: 1000px) 100vw, 50vw"
          />
        </div>
        <div className="about-txt rv">
          <Rotulo numero={numeroDaSecao("sobre")} texto={sobre.rotulo} />
          <h2>{sobre.titulo}</h2>
          {sobre.paragrafos.map((paragrafo) => (
            <p key={paragrafo}>{paragrafo}</p>
          ))}
        </div>
      </section>

      {/* 09 · Estrutura */}
      <section className="structure" data-step="09 · Estrutura">
        <div className="wrap structure-in">
          <div className="rv coluna-titulo">
            <Rotulo numero={numeroDaSecao("estrutura")} texto={estrutura.rotulo} />
            <h2 className="titulo-menor">{estrutura.titulo}</h2>
            <p className="apoio-claro">{estrutura.descricao}</p>
          </div>
          <div
            className="stats rv"
            style={{ "--colunas": estrutura.itens.length } as React.CSSProperties}
          >
            {estrutura.itens.map((item, indice) => (
              <div className="stat" key={item.titulo}>
                <span className="n">{String(indice + 1).padStart(2, "0")}</span>
                <h3>{item.titulo}</h3>
                <p>{item.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10 · Processo */}
      <section className="process" data-step="10 · Processo">
        <div className="wrap process-in">
          <div className="rv coluna-titulo">
            <Rotulo numero={numeroDaSecao("processo")} texto={processo.rotulo} />
            <h2 className="titulo-menor">{processo.titulo}</h2>
            <p className="lede apoio-estreito">{processo.descricao}</p>
          </div>
          <div
            className="steps rv"
            id="steps"
            style={{ "--colunas": processo.etapas.length } as React.CSSProperties}
          >
            {processo.etapas.map((etapa, indice) => (
              <div className="step" key={etapa.titulo}>
                <span className="n">{String(indice + 1).padStart(2, "0")}</span>
                <i className="rail" />
                <h3>{etapa.titulo}</h3>
                <p>{etapa.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11 · Chamada final */}
      <section className="cta" data-step="11 · CTA">
        <Image
          src={chamada_final.imagem.arquivo}
          alt={chamada_final.imagem.alt}
          fill
          sizes="100vw"
        />
        <div className="wrap cta-in rv">
          <Rotulo numero={numeroDaSecao("chamada_final")} texto={chamada_final.rotulo} />
          <h2>{chamada_final.titulo}</h2>
          <a className="btn solid" href={`#${chamada_final.botao.destino}`}>
            {chamada_final.botao.rotulo} <span className="ar">→</span>
          </a>
        </div>
      </section>

      {/* 12 · Contato */}
      <section className="contact" id="contato" data-step="12 · Contato">
        <div className="wrap contact-in">
          <div className="rv coluna-titulo">
            <h2 className="titulo-menor">{formulario.titulo}</h2>
            <p className="lede apoio-curto">{formulario.descricao}</p>
          </div>
          <Formulario formulario={formulario} numeroDeWhatsapp={contato.whatsapp} />
        </div>
      </section>

      {/* 13 · Footer */}
      <footer data-step="13 · Footer">
        <div className="wrap foot">
          <div>
            <Image className="logo" src="/img/logo.png" alt={site.nome} width={760} height={210} />
            <p className="tag-line">
              {rodape.linhas.map((linha, indice) => (
                <span key={linha}>
                  {indice > 0 && <br />}
                  {linha}
                </span>
              ))}
            </p>
          </div>
          <nav className="socials">
            <a href={contato.instagram} target="_blank" rel="noopener">
              {iconesDeContato.instagram} Instagram
            </a>
            <a href={linkDaConversa(contato.whatsapp)} target="_blank" rel="noopener">
              {iconesDeContato.whatsapp} WhatsApp
            </a>
            <a href={`mailto:${contato.email}`}>{iconesDeContato.email} E-mail</a>
          </nav>
          <p className="copy">© {new Date().getFullYear()} {site.nome}</p>
        </div>
      </footer>

      <Anotacoes />
    </>
  );
}
