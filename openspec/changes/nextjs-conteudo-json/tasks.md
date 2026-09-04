## 1. Scaffold

- [x] 1.1 Criar `package.json` com Next, React, TypeScript e Zod; scripts `dev`, `build` (validação antes do `next build`), `start`, `validate:conteudo`, `schema:gerar` e `test`
- [x] 1.2 Criar `tsconfig.json` com alias `@/*` para a raiz, e `next.config.ts`
- [x] 1.3 Acrescentar `node_modules/`, `.next/`, `.vercel/` e `*.tsbuildinfo` ao `.gitignore`
- [x] 1.4 Rodar `npm install` e confirmar que `npx next --version` responde
- [x] 1.5 Confirmar que `build.py` continua gerando os quatro HTML sem erro depois do scaffold

## 2. Assets

- [x] 2.1 Copiar as nove imagens de `assets/` para `public/img/`, mantendo os nomes
- [x] 2.2 Copiar os três pesos da LEMONMILK de `assets/` para `public/fonts/`
- [x] 2.3 Registrar a LEMONMILK com `next/font/local` nos três pesos, expondo variável CSS para o token `--display`

## 3. Estilo

- [x] 3.1 Copiar o `<style>` de `src/v2/head.html` para `app/globals.css`, trocando os `{{FONT:...}}` pela variável do `next/font/local`
- [x] 3.2 Ligar a Archivo do Google Fonts em `app/layout.tsx` e apontar o token `--body` para ela
- [x] 3.3 Substituir `grid-template-columns:repeat(5,1fr)` do processo e `repeat(4,1fr)` da estrutura por contagem derivada, para que as seções acompanhem a quantidade de itens do conteúdo
- [x] 3.4 Acrescentar a classe do cartão largo condicional usada pelo grid adaptativo de projetos

## 4. Schema e conteúdo

- [x] 4.1 Escrever o schema em Zod em `content/schema.ts`, cobrindo os blocos `site`, `contato`, `navegacao`, `hero`, `frase_impacto`, `projetos`, `frase_transicao`, `servicos`, `sobre`, `estrutura`, `processo`, `chamada_final`, `formulario` e `rodape`, com chaves em português
- [x] 4.2 Modelar as frases de impacto como lista de linhas com `esmaecido` e `destaque` opcionais, sem HTML
- [x] 4.3 Modelar `contato.whatsapp` como número cru e `formulario.saudacao` como a primeira linha da mensagem
- [x] 4.4 Modelar `formulario.campos` como objeto de chaves fixas (`nome`, `contato`, `empresa`, `tipo`, `data`, `cidade`, `mensagem`) com `rotulo` e `placeholder`
- [x] 4.5 Modelar `projetos.itens` com os obrigatórios (`categoria`, `titulo`, `tags`, `galeria`, `capa`, `alt`) e os opcionais reservados para as páginas de projeto (`cliente`, `data`, `local`, `perfil`, `descricao`)
- [x] 4.6 Restringir `servicos.itens[].icone` a um enum que espelhe o conjunto de ícones do código, e `navegacao[].secao` ao enum das âncoras existentes
- [x] 4.7 Extrair todo o conteúdo de `src/v2/body.html` para `content/site.json`, conferindo string por string contra o markup
- [x] 4.8 Escrever `scripts/gerar-schema.ts` que emite `content/site.schema.json` a partir do Zod, e rodá-lo
- [x] 4.9 Referenciar `content/site.schema.json` pela chave `$schema` em `content/site.json`

## 5. Validação

- [x] 5.1 Escrever `scripts/validar-conteudo.ts`: parse do JSON com erro apontando linha e coluna, validação pelo Zod com caminho do campo na mensagem, e saída com código diferente de zero em caso de falha
- [x] 5.2 Acrescentar a verificação de existência de imagem lendo o diretório e comparando o nome com sensibilidade a maiúsculas
- [x] 5.3 Acrescentar a verificação de URL absoluta, aceitando também `mailto:` e `tel:`
- [x] 5.4 Escrever testes com `node:test` cobrindo os cenários do spec: JSON malformado, campo obrigatório ausente, imagem inexistente com caixa divergente, URL sem esquema, nome de ícone desconhecido e conteúdo válido, usando fixtures reais em disco
- [x] 5.5 Confirmar que `npm run build` falha quando o conteúdo é inválido e passa quando é válido

## 6. Componentes

- [x] 6.1 Criar `app/layout.tsx` com as fontes, metadados de SEO vindos do conteúdo e importação do CSS global
- [x] 6.2 Criar o módulo de ícones indexado por nome, com os quatro de serviço e os três de contato
- [x] 6.3 Criar `app/page.tsx` lendo `content/site.json` e compondo as treze seções na ordem aprovada
- [x] 6.4 Implementar navbar com os ícones de contato vindos do bloco `contato` e a gaveta de menu no celular
- [x] 6.5 Implementar hero com `next/image` em modo `fill`, título, subtítulo e os dois botões
- [x] 6.6 Implementar o componente de frase de impacto, usado nas seções 03 e 06, aplicando `esmaecido` e `destaque`
- [x] 6.7 Implementar cabeçalho e grid de projetos com a regra adaptativa: pares em duas colunas, último ocupando a linha quando a quantidade é ímpar
- [x] 6.8 Implementar serviços, sobre, estrutura, processo e chamada final a partir do conteúdo
- [x] 6.9 Implementar o formulário com rótulos e placeholders do conteúdo, grupos de tipo de projeto e validação no cliente
- [x] 6.10 Montar a mensagem do WhatsApp a partir da saudação e dos campos preenchidos, omitindo os vazios, truncando o texto livre longo e abrindo `wa.me` sincronicamente no manipulador de envio
- [x] 6.11 Exibir link de fallback na confirmação quando o navegador bloquear a abertura da nova aba
- [x] 6.12 Implementar o rodapé com as linhas de assinatura, os links de contato e o ano corrente calculado
- [x] 6.13 Derivar a numeração visível dos rótulos de seção a partir da ordem, sem lê-la do conteúdo
- [x] 6.14 Implementar o modo de anotações alternando a classe no `body`, preservando os rótulos `data-step` das treze seções

## 7. Interatividade

- [x] 7.1 Implementar o estado de rolagem da navbar
- [x] 7.2 Implementar a revelação das seções por observador de interseção, com fallback que mostra tudo quando não houver suporte
- [x] 7.3 Implementar o destaque do item de navegação da seção visível
- [x] 7.4 Confirmar que a preferência por movimento reduzido desliga as animações e deixa todo o conteúdo visível

## 8. Verificação visual

- [x] 8.1 Comparar capturas do Next contra `onkai-prototipo-v2.html` a 1440 de largura, seção por seção, e corrigir divergências
- [x] 8.2 Repetir a comparação a 390 de largura
- [x] 8.3 Conferir que o console não emite erro nem aviso de hidratação
- [x] 8.4 Testar o grid de projetos com quatro, cinco e um item, confirmando o comportamento descrito no spec
- [x] 8.5 Testar o envio do formulário de ponta a ponta: campos obrigatórios vazios, envio completo, opcionais em branco e texto livre longo
- [x] 8.6 Conferir a legibilidade do texto sobre as fotos claras, em especial a capa do Lake Burguer e a chamada final

## 9. Documentação e fechamento

- [x] 9.1 Escrever `content/LEIA-ME.md` explicando cada bloco e cada campo, quais são obrigatórios, como adicionar um projeto com a imagem de capa, e onde ver a falha de build quando o conteúdo está inválido
- [x] 9.2 Registrar em `openspec/config.yaml` o contexto do projeto: Next com App Router, TypeScript, conteúdo em JSON com chaves em português, hospedagem na Vercel
- [x] 9.3 Commitar em branch própria, sem tocar nos quatro HTML nem no `build.py`
