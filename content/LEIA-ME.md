# Como editar o conteúdo do site

Todo o texto do site está em **`site.json`**, neste mesmo diretório. Layout, cores, fonte e ícones ficam no código — o que se muda aqui é conteúdo.

Você edita o arquivo pelo GitHub, e o site se atualiza sozinho depois. Não precisa instalar nada.

## Antes de qualquer coisa: três regras que evitam dor de cabeça

**1. Vírgula é lei.** Todo item de uma lista termina com vírgula, menos o último. Isso vale:

```json
"tags": ["Foto", "Vídeo", "Drone"]
```

Isso quebra:

```json
"tags": ["Foto", "Vídeo", "Drone",]
```

**2. Aspas nunca somem.** Todo texto fica entre `"aspas duplas"`. Se o seu texto tiver aspas dentro, escreva `\"assim\"`.

**3. Nada de HTML.** Não escreva `<b>`, `<br>` nem nenhuma tag. O site mostraria as letras `<b>` na tela. O negrito e a quebra de linha já estão previstos em campos próprios, explicados adiante.

## Se você errar, o site não quebra

Ao salvar, o GitHub avisa a Vercel, que refaz o site. Antes de publicar, ela confere o `site.json`. Se houver erro:

- **o site que está no ar continua no ar**, sem alteração nenhuma;
- o seu commit aparece com um **✗ vermelho** no GitHub;
- clicando no ✗ e depois em "Details", a mensagem diz exatamente o que está errado e onde.

As mensagens são diretas, do tipo `linha 42, coluna 8` ou `imagem citada que não existe em public/img/`. Nada é publicado pela metade.

## Trocar um texto

Ache o campo, mude o que está entre aspas, salve. Exemplo — o título grande da primeira tela:

```json
"hero": {
  "titulo": "Da ideia ao corte final, sempre (on)line com você."
}
```

## Adicionar um projeto

São dois passos, na ordem.

**Passo 1 — subir a foto de capa.** No GitHub, entre em `public/img/`, clique em `Add file` → `Upload files` e arraste a imagem. Use um nome curto, sem espaço e sem acento: `p-sertoes.jpg`.

> Repare na diferença entre `.jpg` e `.JPG`. Elas contam como nomes diferentes. Se o arquivo é `.jpg`, escreva `.jpg` no passo 2.

**Passo 2 — descrever o projeto.** Em `site.json`, dentro de `projetos` → `itens`, copie um bloco existente e ajuste:

```json
{
  "categoria": "Documentário",
  "titulo": "Sertões Kite Surf",
  "tags": ["Foto", "Vídeo", "Drone"],
  "galeria": "https://galleries.vidflow.co/xxxxxxx",
  "imagem": {
    "arquivo": "/img/p-sertoes.jpg",
    "alt": "Kitesurf na praia durante o rally"
  }
}
```

O grid se ajusta sozinho à quantidade de projetos: eles ficam de dois em dois e, se o total for ímpar, o último ocupa a linha inteira. Não precisa fazer nada.

## O que cada bloco controla

| Bloco | O que é |
|---|---|
| `site` | Nome da produtora e o texto que aparece no Google e na aba do navegador |
| `contato` | Instagram, WhatsApp e e-mail. Alimenta os ícones do topo, o rodapé **e** a mensagem do formulário |
| `navegacao` | Os itens do menu |
| `hero` | A primeira tela: rótulo, título, subtítulo, os dois botões e a foto de fundo |
| `frase_impacto` | A frase logo depois da primeira tela |
| `projetos` | Título da seção e a lista de trabalhos |
| `frase_transicao` | A frase entre projetos e serviços |
| `servicos` | Os quatro serviços |
| `sobre` | Texto e foto da seção Sobre |
| `estrutura` | Os quatro números com qualidade, versatilidade, planejamento e detalhes |
| `processo` | As etapas de briefing até entrega |
| `chamada_final` | A faixa com foto e o convite ao orçamento |
| `formulario` | Os nomes dos campos e a mensagem que vai pro WhatsApp |
| `rodape` | As duas linhas de assinatura |

## Campos que têm regra própria

### `contato.whatsapp` — só números

```json
"whatsapp": "5512987032908"
```

Sem `+`, sem espaço, sem parênteses, sem `https://`. Começa em `55` (Brasil), depois o DDD, depois o número. É desse campo que sai o link do ícone no topo, o do rodapé e o do formulário — muda num lugar, muda em todos.

### As frases de impacto — negrito e cor sem HTML

Cada frase é uma lista de linhas. Cada linha aceita:

- `esmaecido: true` deixa a linha inteira em cinza
- `destaque` é o trecho final da linha, em negrito

```json
"frase_transicao": {
  "linhas": [
    { "texto": "Marcas que querem ser lembradas,", "esmaecido": true },
    { "texto": "investem em conteúdo que", "destaque": "comunica valor." }
  ]
}
```

Para acrescentar uma linha, acrescente um item na lista. A quebra de linha acontece sozinha entre elas.

### `servicos.itens[].icone` — nomes fixos

Só quatro valores funcionam: `fotografia`, `video`, `drone`, `storymaker`. Um ícone novo precisa ser desenhado no código; escrever outro nome aqui derruba o build de propósito, para você não descobrir depois que o ícone sumiu.

Você pode trocar livremente o título, a descrição e os tópicos de cada serviço.

### `navegacao[].destino` — só as seções que existem

Valores aceitos: `topo`, `projetos`, `servicos`, `sobre`, `contato`. O `rotulo` é livre — dá para chamar "Projetos" de "Trabalhos" sem mexer em mais nada.

### `formulario` — o que vira mensagem de WhatsApp

O formulário não manda e-mail. Quando alguém preenche e envia, o WhatsApp abre com o texto já escrito, e você só responde.

- `saudacao` é a primeira linha da mensagem
- os `rotulo` de cada campo aparecem na mensagem, no formato `*Nome:* Kaio`
- campos deixados em branco simplesmente não aparecem
- `confirmacao` e `fallback` são o que a pessoa vê na tela depois de enviar

Em `tipos_de_projeto` você pode acrescentar quantas opções e quantos grupos quiser. `avulsas` são as opções que ficam fora de qualquer grupo, como "Outro".

Os nomes dos campos (`nome`, `empresa`, `contato`, `tipo`, `data`, `cidade`, `mensagem`) são fixos: o `rotulo` e o `placeholder` de cada um você troca, mas a ordem e a quantidade ficam no código, porque mexem no desenho do formulário.

### Toda imagem tem `alt`

O `alt` descreve a foto para quem usa leitor de tela e para o Google. Descreva o que aparece, em uma frase.

## Trocar uma foto que já existe

Suba a foto nova em `public/img/` com um nome novo, e aponte o campo `arquivo` para ela. Só apague a antiga depois de conferir que nada mais a usa.

## O que não se muda por aqui

Logo, ícones, cores, tipografia, a ordem das seções e o desenho de cada uma. Isso é código — fale com quem cuida do site.
