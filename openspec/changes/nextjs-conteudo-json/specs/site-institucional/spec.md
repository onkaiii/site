## ADDED Requirements

### Requirement: As treze seções do protótipo aprovado

A home SHALL renderizar, nesta ordem: navbar, hero, frase de impacto, cabeçalho de projetos, grid de projetos, frase de transição, serviços, sobre, estrutura, processo, chamada final, formulário de contato e rodapé.

Esta ordem foi aprovada pelo cliente seção por seção e SHALL NOT ser configurável por conteúdo.

#### Scenario: Ordem preservada

- **WHEN** a home é renderizada
- **THEN** as treze seções aparecem na ordem acima

### Requirement: Grid de projetos adaptativo

O grid de projetos SHALL acomodar qualquer quantidade de projetos maior ou igual a um, distribuindo os itens em duas colunas e, quando a quantidade for ímpar, fazendo o último item ocupar a linha inteira.

A implementação anterior assumia exatamente cinco projetos. Sem esta regra, alterar a lista pelo JSON quebraria o layout.

#### Scenario: Quantidade par

- **WHEN** o conteúdo declara quatro projetos
- **THEN** os quatro aparecem em duas fileiras de dois
- **AND** nenhum item ocupa a linha inteira

#### Scenario: Quantidade ímpar

- **WHEN** o conteúdo declara cinco projetos
- **THEN** os quatro primeiros aparecem em duas fileiras de dois
- **AND** o quinto ocupa a linha inteira

#### Scenario: Projeto único

- **WHEN** o conteúdo declara um projeto
- **THEN** ele ocupa a linha inteira

#### Scenario: Uma coluna no celular

- **WHEN** a largura da tela é de celular
- **THEN** todos os projetos aparecem em coluna única, independentemente da quantidade

### Requirement: Cartão de projeto abre a galeria externa

Cada cartão de projeto SHALL ser um link para a galeria externa declarada no conteúdo, abrindo em nova aba.

O site não hospeda foto nem vídeo de portfólio; as galerias vivem fora dele, por decisão do cliente.

#### Scenario: Visitante abre um projeto

- **WHEN** o visitante clica num cartão de projeto
- **THEN** a galeria externa daquele projeto abre em nova aba

### Requirement: Numeração de seção derivada da ordem

As numerações visíveis nos rótulos de seção SHALL ser calculadas a partir da posição da seção, e SHALL NOT vir do conteúdo.

Digitar esses números no conteúdo permitiria que ficassem fora de sequência.

#### Scenario: Rótulos em sequência

- **WHEN** a home é renderizada
- **THEN** os rótulos das seções numeradas seguem a sequência a partir de `01`, sem repetição nem salto

### Requirement: Ícones de serviço por nome

Cada serviço SHALL declarar seu ícone por nome, resolvido contra um conjunto fechado definido no código.

Um ícone novo é trabalho de design, não de conteúdo. Aceitar arquivo SVG pelo conteúdo seria liberdade falsa.

#### Scenario: Nome de ícone conhecido

- **WHEN** um serviço declara `"icone": "drone"`
- **THEN** o ícone de drone é renderizado

#### Scenario: Nome de ícone desconhecido

- **WHEN** um serviço declara um nome de ícone que não existe no conjunto
- **THEN** a validação de conteúdo falha e o build não passa
- **AND** a mensagem lista os nomes aceitos

### Requirement: Legibilidade de texto sobre fotografia

Todo bloco de texto exibido sobre fotografia SHALL receber um escurecimento que mantenha o texto legível independentemente da foto usada.

O cliente pediu isto explicitamente, e o conteúdo passa a poder trocar as fotos: uma capa clara não pode tornar o título ilegível.

#### Scenario: Capa clara

- **WHEN** um projeto usa uma capa predominantemente clara
- **THEN** o título e os rótulos do cartão continuam legíveis

#### Scenario: Chamada final sobre foto

- **WHEN** a seção de chamada final é renderizada sobre a fotografia declarada no conteúdo
- **THEN** o título e o botão continuam legíveis

### Requirement: Contato em um único lugar do conteúdo

Instagram, WhatsApp e e-mail SHALL ser declarados uma única vez no conteúdo, e SHALL alimentar tanto os ícones da navbar quanto os links do rodapé.

Na implementação anterior esses três endereços apareciam duplicados no markup, o que permitia atualizar um lugar e esquecer o outro.

#### Scenario: Trocar o número de WhatsApp

- **WHEN** o número de WhatsApp é alterado no conteúdo
- **THEN** tanto o ícone da navbar quanto o link do rodapé passam a apontar para o número novo

### Requirement: Formulário de orçamento valida no cliente

O formulário SHALL validar os campos obrigatórios no navegador e sinalizar cada campo pendente com mensagem própria, impedindo o envio enquanto houver pendência.

#### Scenario: Envio com campo obrigatório vazio

- **WHEN** o visitante envia o formulário com um campo obrigatório vazio
- **THEN** o campo é sinalizado com mensagem indicando o que falta
- **AND** o WhatsApp não é aberto

#### Scenario: Correção de campo sinalizado

- **WHEN** o visitante preenche um campo que estava sinalizado como pendente
- **THEN** a sinalização daquele campo desaparece

### Requirement: Formulário entrega o lead pelo WhatsApp

Quando o formulário é válido, o site SHALL abrir o WhatsApp do cliente numa nova aba, já com uma mensagem montada a partir dos rótulos do formulário e dos valores preenchidos.

O site SHALL NOT enviar os dados do formulário para nenhum servidor próprio ou de terceiro.

#### Scenario: Envio com tudo preenchido

- **WHEN** o visitante envia o formulário com os campos obrigatórios preenchidos
- **THEN** o WhatsApp do cliente abre em nova aba com a mensagem já escrita
- **AND** a mensagem começa pela saudação declarada no conteúdo
- **AND** cada campo preenchido aparece identificado pelo rótulo que o formulário exibe

#### Scenario: Campos opcionais em branco

- **WHEN** o visitante deixa empresa, data e cidade vazios e envia
- **THEN** a mensagem não menciona esses campos
- **AND** não contém linhas vazias no lugar deles

#### Scenario: Texto livre muito longo

- **WHEN** a descrição do projeto é longa o suficiente para estourar o limite prático de uma URL
- **THEN** a mensagem é truncada com indicação de que houve corte
- **AND** o WhatsApp abre normalmente

#### Scenario: Abertura bloqueada pelo navegador

- **WHEN** o navegador bloqueia a abertura da nova aba
- **THEN** a página exibe um link para o visitante abrir a conversa manualmente
- **AND** a falha não acontece em silêncio

### Requirement: Número de WhatsApp declarado uma vez como número

O conteúdo SHALL declarar o WhatsApp do cliente como número, e o código SHALL derivar dele tanto os links diretos da navbar e do rodapé quanto o link com mensagem pré-preenchida do formulário.

Guardar uma URL pronta no conteúdo impediria montar o link com mensagem.

#### Scenario: Trocar o número

- **WHEN** o número declarado no conteúdo é alterado
- **THEN** os links da navbar e do rodapé passam a apontar para o número novo
- **AND** o formulário passa a abrir a conversa com o número novo

### Requirement: Opções de tipo de projeto agrupadas

O campo de tipo de projeto SHALL apresentar suas opções em grupos declarados no conteúdo, cada grupo com rótulo e lista de opções.

O cliente atende empresa e pessoa física, e as opções chegaram a onze; sem agrupamento a lista fica longa e sem hierarquia.

#### Scenario: Grupos renderizados

- **WHEN** o conteúdo declara grupos de opções
- **THEN** o campo apresenta cada grupo com seu rótulo e as opções correspondentes

### Requirement: Modo de anotações para revisão

A página SHALL oferecer um controle que sobrepõe rótulos numerados identificando cada seção, sem alterar o layout quando desligado.

Este recurso não é conteúdo do site: é ferramenta de revisão. O cliente usou os rótulos para escrever o retorno dele seção por seção, e removê-los quebraria a linguagem comum já estabelecida.

#### Scenario: Ligar as anotações

- **WHEN** o controle de anotações é acionado
- **THEN** cada seção exibe seu rótulo numerado

#### Scenario: Desligar as anotações

- **WHEN** o controle é acionado novamente
- **THEN** os rótulos desaparecem e o layout volta ao estado original

### Requirement: Aparência fiel ao protótipo aprovado

O site SHALL preservar a paleta, a tipografia, o espaçamento, as animações de entrada e o comportamento responsivo do protótipo v2 aprovado pelo cliente.

O cliente aprovou seis das treze seções com "0 alterações". A migração de tecnologia não é ocasião para redesenhar.

#### Scenario: Comparação com a referência

- **WHEN** o site em Next.js é comparado com `onkai-prototipo-v2.html` na mesma largura de tela
- **THEN** as seções correspondentes apresentam a mesma composição visual

#### Scenario: Movimento reduzido

- **WHEN** o visitante configurou preferência por movimento reduzido
- **THEN** as animações de entrada não ocorrem e todo o conteúdo aparece visível
