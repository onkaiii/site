## Why

O protótipo do site da onkai.films existe hoje como dois arquivos HTML gerados por um script Python, com todo o texto escrito à mão no markup. Cada ajuste do cliente — e a última rodada trouxe onze — obriga alguém a caçar strings dentro do HTML. Migrar para Next.js com o conteúdo isolado num JSON estático separa o que muda com frequência (texto, projetos, contato) do que praticamente não muda (layout, paleta, ícones), e abre caminho para o cliente editar o próprio conteúdo pelo GitHub, com a Vercel bloqueando o deploy quando ele errar.

## What Changes

- **BREAKING**: o site passa a ser uma aplicação Next.js na raiz do repo. O par `build.py` + `src/v1` + `src/v2` e os quatro HTML gerados deixam de ser a fonte da verdade e ficam preservados apenas como referência visual congelada.
- Todo o conteúdo editável das 13 seções sai do markup e vai para um único `content/site.json`, com nomes de campo em português.
- Cada seção do protótipo v2 vira um componente React que recebe seu pedaço do JSON como propriedade.
- O grid de projetos deixa de assumir cinco itens e passa a se adaptar a qualquer quantidade: pares em duas colunas e, quando a quantidade é ímpar, o último ocupa a linha inteira.
- Os quatro ícones de serviço passam a ser referenciados por nome (`"icone": "drone"`) resolvido contra um conjunto fechado no código, em vez de SVG solto no conteúdo.
- Entra validação de conteúdo no próprio build: o JSON precisa parsear, bater com um schema, referenciar apenas imagens que existem em `public/` e conter URLs bem formadas. Falhar em qualquer um desses pontos derruba o build e, por consequência, impede o deploy na Vercel.
- O formulário passa a montar a mensagem a partir dos campos preenchidos e abrir o WhatsApp do cliente já com o texto pronto, em vez de integrar com e-mail ou servidor.
- Entra um `content/LEIA-ME.md` explicando campo por campo, já que JSON não aceita comentário e o cliente é quem vai editar.
- As numerações visíveis de seção (`01 / PROJETOS`, `02 / SERVIÇOS`) passam a derivar da ordem das seções em vez de serem digitadas.

### Non-goals

- Não implementa as páginas individuais de projeto (item 04 das anotações do cliente), adiadas por decisão dele. O modelo de conteúdo já reserva espaço para os campos que elas exigem.
- Não implementa envio por e-mail, backend, banco ou registro de leads. O formulário entrega o lead pelo WhatsApp e o histórico fica na conversa.
- Não torna configuráveis logo, ícones, paleta, tipografia, a ordem das seções nem o modo de anotações.
- Não inclui CMS. O modelo de conteúdo é desenhado para aceitar um depois, sem retrabalho.

## Capabilities

### New Capabilities

- `conteudo-configuravel`: contrato do `content/site.json` — quais blocos existem, quais campos cada um exige, e o que acontece quando o conteúdo é inválido.
- `site-institucional`: as 13 seções do site, o que cada uma renderiza a partir do conteúdo, e as regras de layout que precisam sobreviver a mudanças de conteúdo (grid de projetos adaptativo, numeração derivada, legibilidade de texto sobre foto).

### Modified Capabilities

Nenhuma. O diretório `openspec/specs/` está vazio; este é o primeiro change do projeto.

## Impact

**Adicionado**

- `package.json`, `next.config.ts`, `tsconfig.json` e a árvore `app/` na raiz do repo
- `content/site.json`, `content/site.schema.json`, `content/LEIA-ME.md`
- `public/img/` com as nove imagens hoje em `assets/`, e `public/fonts/` com os três pesos da LEMONMILK
- Script de validação de conteúdo executado antes do `next build`
- Entradas de `.gitignore` para `node_modules/`, `.next/` e `.vercel/`

**Preservado sem alteração**

- `index.html`, `index-v2.html`, `onkai-prototipo.html`, `onkai-prototipo-v2.html`, `build.py` e `src/` continuam no repo como referência da aparência aprovada pelo cliente. O `assets/` permanece porque o `build.py` depende dele.

**Dependências novas**

- Next.js, React e TypeScript. Node 20.20 já instalado atende.
- Hospedagem na Vercel, escolhida pelo usuário. Habilita `next/image`. O formulário não exige servidor, porque entrega pelo WhatsApp.

**Riscos e pendências fora do controle deste change**

- A licença da LEMONMILK é gratuita para uso pessoal; uso comercial pode exigir licença paga. O change mantém a fonte, mas o cliente precisa verificar.
- Migrar para Next.js abandona o Carrd, que o cliente pagou anualmente. Em troca, o item 04 deixa de ser inviável.
- JSON estático dá configurabilidade ao desenvolvedor, não autonomia ao cliente. A autonomia real depende de um CMS ou de o cliente aprender a editar JSON no GitHub — decisão posterior.
