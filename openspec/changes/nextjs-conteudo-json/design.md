## Context

O protótipo aprovado vive em `src/v2/{head,body}.html`, montado por `build.py` em dois formatos: um com assets em caminho relativo e outro com tudo embutido em data URI. O CSS tem cerca de 500 linhas com um sistema de tokens já definido; o texto está escrito no markup; a interatividade é um IIFE de baunilha no fim do arquivo.

O cliente aprovou seis das treze seções com "0 alterações" e descreveu as outras como "perfeitas" com ajustes de texto. A aparência é o ativo desta migração, não o alvo dela.

Restrições que chegaram da conversa e não são negociáveis aqui: hospedagem na Vercel; conteúdo num único arquivo JSON; nomes de campo em português porque o cliente é quem edita; e as galerias de foto e vídeo continuam fora do site, no vidflow.

## Goals / Non-Goals

**Goals**

- Paridade visual com `onkai-prototipo-v2.html` em desktop e celular
- Conteúdo editável sem tocar em código, e conteúdo inválido barrado antes do deploy
- Modelo de conteúdo que um CMS consiga editar depois sem redesenho
- Grid de projetos que sobreviva a qualquer quantidade de itens

**Non-Goals**

- Redesenhar qualquer seção
- Páginas individuais de projeto (o modelo reserva os campos, a rota não existe)
- Envio por e-mail, backend ou registro de leads: a entrega é pelo WhatsApp
- CMS, painel administrativo ou autenticação
- Tornar configuráveis logo, ícones, paleta, tipografia ou ordem de seções

## Decisions

### Portar o CSS na íntegra, sem framework

O `<style>` de `src/v2/head.html` vai para `app/globals.css` praticamente como está, trocando apenas os tokens `{{FONT:...}}` pela variável que o `next/font/local` gera.

Alternativas descartadas: **Tailwind**, que exigiria reescrever 500 linhas aprovadas e convida a deriva visual em cada seção; **CSS Modules por componente**, que fragmenta um sistema cujos seletores atravessam seções (`.wrap`, `.eyebrow`, `.btn`, `.statement`) e cujos tokens são globais por natureza.

O risco de portar em bloco é herdar as fragilidades do CSS atual. Uma delas já é conhecida e documentada: `margin-inline: auto` num grid item resolve a largura para `fit-content`, o que desalinhou o hero quando o título ganhou medida em `ch`. A correção — `width: 100%` no `.hero-in` — já está na v2 e vem com o resto.

### Zod como fonte única do schema, JSON Schema gerado a partir dele

A validação precisa de duas coisas com o mesmo conteúdo: checagem em tempo de build e um `content/site.schema.json` que sirva de ajuda no editor. Manter os dois à mão garante que divirjam.

Decisão: o schema é escrito em Zod, que dá de graça os tipos TypeScript do conteúdo, e o `content/site.schema.json` é gerado a partir dele por um script. Uma fonte, dois artefatos.

Alternativa descartada: **JSON Schema à mão com ajv**. Evita uma dependência, mas obriga a manter tipos TypeScript em paralelo e deixa dois arquivos para atualizar a cada campo novo.

As quatro verificações do spec se dividem assim: parse e schema saem do Zod; existência de imagem e validade de URL são refinamentos adicionais, porque nenhum schema sabe o que existe em `public/`.

### Validação dentro do build, não numa Action separada

O script `build` fica `validate:conteudo && next build`. A Vercel só publica quando o build passa, então o portão já existe — montar uma GitHub Action seria um segundo mecanismo para o mesmo efeito, com um jeito a mais de ficar dessincronizado.

O `validate:conteudo` também roda sozinho, para o desenvolvedor checar antes de commitar.

### Verificação de imagem sensível a maiúsculas

`capa-sivi.JPG` contra `capa-sivi.jpg` passa no macOS, onde o sistema de arquivos ignora caixa, e falha no Linux da Vercel. Comparar caixa explicitamente, listando o diretório e conferindo o nome exato, em vez de perguntar ao sistema se o arquivo existe.

Sem isso a falha aparece só em produção, e como imagem faltando não quebra render, aparece de forma silenciosa.

### Ícones por nome, contra um conjunto fechado

Os dez SVGs ficam num módulo do código, indexados por nome. O conteúdo referencia `"icone": "drone"`. O Zod valida contra o enum, então nome errado quebra o build com a lista de aceitos.

Alternativa descartada: aceitar markup SVG no conteúdo. Daria liberdade aparente e abriria injeção de markup, além de violar a regra de conteúdo sem marcação.

### Ênfase tipográfica como estrutura, não como marcação

As duas frases de impacto usam ênfase de formas diferentes: na seção 03 a segunda linha é esmaecida; na 06 a primeira é esmaecida e a segunda termina em negrito. Um modelo único cobre as duas sem HTML no conteúdo:

```json
"frase_transicao": {
  "linhas": [
    { "texto": "Marcas que querem ser lembradas,", "esmaecido": true },
    { "texto": "investem em conteúdo que", "destaque": "comunica valor." }
  ]
}
```

### Formulário entrega pelo WhatsApp, não por e-mail

Ao enviar, o formulário monta a mensagem com os rótulos que já existem no conteúdo e os valores preenchidos, e abre `https://wa.me/<numero>?text=<mensagem>`.

Vantagens sobre integrar e-mail: não precisa de servidor, serviço de terceiro, chave de API nem tratamento de spam; o lead chega no canal que o cliente já usa para atender; e o histórico fica na conversa, sem precisar de banco.

Consequências que precisam de cuidado:

- **O número passa a ser dado, não URL.** O conteúdo guarda `5512987032908` em `contato.whatsapp`, e o código deriva tanto o link simples do rodapé e da navbar quanto o link com mensagem. Guardar a URL pronta impediria a segunda forma.
- **Abertura tem de ser sincrônica.** `window.open` é chamado dentro do próprio manipulador de envio, senão o bloqueador de pop-up barra.
- **Campos vazios não entram na mensagem.** Empresa, data e cidade são opcionais; incluí-los em branco produziria uma mensagem com linhas soltas.
- **Comprimento.** A mensagem vai codificada na URL, e navegadores têm limite prático. O texto livre é truncado com indicação de corte, para a URL não estourar.
- **Se o pop-up for bloqueado**, a confirmação exibe o link para a pessoa clicar, em vez de falhar em silêncio.

A saudação inicial da mensagem é conteúdo, não código, e fica em `formulario.saudacao`.

Alternativa descartada: **route handler enviando e-mail**. Exige provedor de envio, credencial em variável de ambiente e alguma proteção contra abuso, para entregar o lead num canal que o cliente checa menos que o WhatsApp.

### Campos do formulário como objeto de chaves fixas

O formulário tem um grid onde a área de texto ocupa três colunas. Se o conteúdo pudesse reordenar ou acrescentar campos, o layout quebraria.

Decisão: `formulario.campos` é um objeto com chaves fixas validadas pelo schema — `nome`, `contato`, `empresa`, `tipo`, `data`, `cidade`, `mensagem` — e cada uma carrega apenas `rotulo` e `placeholder`. Ordem e disposição continuam no código; o texto vem do conteúdo.

Os grupos de tipo de projeto, ao contrário, são lista aberta: acrescentar opção não afeta layout.

### Navegação com rótulo configurável e âncora fechada

`navegacao` é uma lista de `{ rotulo, secao }`, onde `secao` é um enum das âncoras que existem. Renomear "Projetos" para "Trabalhos" é conteúdo; inventar uma âncora que não existe é erro de build.

### Grid de projetos: pares em duas colunas, ímpar sobrando ocupa a linha

A regra reproduz o mockup quando há cinco projetos, que é o caso atual, e se comporta previsivelmente em qualquer outra quantidade. Implementada como classe condicional no último item quando o total é ímpar.

### Interatividade reescrita idiomaticamente

O IIFE de baunilha vira componentes de cliente pequenos: estado de rolagem da navbar, observador de entrada das seções, gaveta do menu, modo de anotações e validação do formulário. O restante da página fica em componentes de servidor.

Alternativa descartada: injetar o script atual num `useEffect` único. Preservaria o comportamento com menos leitura, mas mantém manipulação direta do DOM ao lado do React, que é onde bugs de hidratação nascem.

O modo de anotações continua alternando uma classe no `body`, porque os rótulos são desenhados por `[data-step]::before` no CSS que estamos portando.

### Imagens com `fill`

O CSS atual posiciona as imagens em absoluto com `object-fit: cover`. O `fill` do `next/image` assume exatamente essa forma, então o CSS portado continua valendo sem ajuste. A Vercel otimiza imagens locais sem configuração.

### Testar o validador com o runner do Node

Os cenários do spec de conteúdo são casos de teste diretos: JSON malformado, campo ausente, imagem inexistente, URL sem esquema, conteúdo válido. `node:test` cobre isso sem dependência nova, com arquivos de fixture reais em vez de mock — a checagem de imagem só tem valor se olhar o disco de verdade.

## Risks / Trade-offs

- **Deriva visual ao portar CSS e markup** → comparar capturas do Next contra `onkai-prototipo-v2.html` a 1440 e a 390 antes de commitar, seção por seção. É a razão pela qual os HTML antigos ficam no repo.
- **Imagens duplicadas em `assets/` e `public/img/`, cerca de 2,2 MB** → aceito. O `build.py` depende de `assets/` e continua sendo o caminho de rollback; unificar agora acopla o novo ao antigo. Some quando o `build.py` for aposentado.
- **Licença da LEMONMILK para uso comercial** → fora do controle deste change. A fonte é mantida e o cliente precisa verificar; trocar depois é mexer em um `next/font/local` e nos tokens.
- **O Carrd anual vira perda** → decisão do cliente, não deste change. Em contrapartida, o item 04 deixa de ser inviável.
- **JSON não dá autonomia ao cliente, só configurabilidade ao desenvolvedor** → mitigado em parte: campos planos e em português, `LEIA-ME.md` ao lado, schema no editor e build que falha em vez de publicar site quebrado. A autonomia real depende de CMS, fora de escopo.
- **Erro de conteúdo é invisível para quem commitou** → a Vercel marca o commit com falha, mas o cliente precisa saber onde olhar. Documentar isso no `LEIA-ME.md`.
- **Um arquivo único cresce** → com poucos projetos é confortável. Dividir em `content/*.json` depois é mecânico e não muda componente.

## Migration Plan

1. Scaffold do Next na raiz, com `.gitignore` atualizado, sem tocar nos arquivos existentes
2. Copiar imagens para `public/img/` e fontes para `public/fonts/`
3. Portar o CSS para `app/globals.css` e ligar a LEMONMILK por `next/font/local`
4. Escrever o schema em Zod, extrair `content/site.json` do markup atual e gerar o JSON Schema
5. Escrever o validador e seus testes
6. Portar as treze seções como componentes alimentados pelo conteúdo
7. Comparar capturas contra a referência a 1440 e 390, corrigir divergências
8. Escrever `content/LEIA-ME.md`

**Rollback**: os quatro HTML e o `build.py` continuam no repo e funcionando. Reverter o commit devolve o estado atual sem perda; o protótipo entregável não depende do Next.

## Open Questions

- As páginas individuais de projeto entram quando? O modelo já reserva `cliente`, `data`, `local`, `perfil` e `descricao`, mas os valores para os cinco projetos ainda não existem.
- Aposentar `build.py`, `src/` e os HTML gerados depois que o Next estiver validado, ou mantê-los como referência congelada?
- O domínio próprio foi comprado? Continua sem confirmação desde a primeira conversa, e é o que falta para o site sair de um endereço da Vercel.
