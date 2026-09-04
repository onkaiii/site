## ADDED Requirements

### Requirement: Fonte única de conteúdo

Todo texto visível ao visitante, toda URL externa e todo caminho de imagem de conteúdo SHALL vir de `content/site.json`. Nenhum componente SHALL conter texto de conteúdo escrito no código.

Ficam explicitamente fora do JSON, por serem decisões de design e não de conteúdo: o logo, os ícones SVG, os tokens de cor e tipografia, a ordem e a existência das seções, e os rótulos do modo de anotações.

#### Scenario: Trocar um texto sem tocar em código

- **WHEN** um campo de texto é alterado em `content/site.json` e o site é reconstruído
- **THEN** o texto novo aparece na seção correspondente
- **AND** nenhum arquivo dentro de `app/` precisou ser editado

#### Scenario: Nenhum texto de conteúdo no código

- **WHEN** os componentes de seção em `app/` são inspecionados
- **THEN** não existe frase de conteúdo escrita em JSX
- **AND** rótulos estruturais que não são conteúdo, como os do modo de anotações, permanecem no código

### Requirement: Nomes de campo em português

As chaves de `content/site.json` SHALL usar português, sem acento e em minúsculas, porque o cliente é quem edita o arquivo.

#### Scenario: Cliente reconhece o campo que quer mudar

- **WHEN** o cliente abre `content/site.json` para trocar o título de um projeto
- **THEN** encontra a chave `titulo` dentro de um item de `projetos`
- **AND** não precisa interpretar termo em inglês

### Requirement: Conteúdo sem marcação embutida

Nenhum valor em `content/site.json` SHALL conter HTML. Ênfase tipográfica SHALL ser expressa por campos separados, e o componente decide como renderizar.

Esta restrição existe por dois motivos: permitir que um CMS edite o arquivo depois sem retrabalho, e evitar injeção de markup pelo conteúdo.

#### Scenario: Frase de impacto com destaque

- **WHEN** uma frase de impacto é definida com os campos `linha1`, `linha2` e `destaque`
- **THEN** o componente renderiza `linha1` esmaecida, `linha2` em texto normal e `destaque` em negrito
- **AND** o JSON não contém nenhuma tag

#### Scenario: Tentativa de injetar markup

- **WHEN** um valor de texto no JSON contém `<script>` ou qualquer outra tag
- **THEN** o conteúdo é renderizado como texto literal, sem ser interpretado como HTML

### Requirement: Validação de conteúdo bloqueia o build

O build SHALL executar uma validação de `content/site.json` antes de compilar o site, e SHALL falhar com mensagem legível quando qualquer verificação não passar.

A validação SHALL verificar:

1. que o arquivo é JSON válido;
2. que o conteúdo satisfaz `content/site.schema.json`, incluindo campos obrigatórios e tipos;
3. que todo caminho de imagem referenciado corresponde a um arquivo existente em `public/`, comparando de forma sensível a maiúsculas e minúsculas;
4. que todo campo de URL contém uma URL absoluta válida, ou um `mailto:`, ou um `tel:`.

#### Scenario: JSON malformado

- **WHEN** o JSON tem uma vírgula sobrando e o build roda
- **THEN** o build falha
- **AND** a mensagem aponta a linha e a coluna do erro

#### Scenario: Campo obrigatório ausente

- **WHEN** um item de `projetos` não tem `titulo` e o build roda
- **THEN** o build falha
- **AND** a mensagem nomeia o campo ausente e o caminho dele dentro do JSON

#### Scenario: Imagem citada que não existe

- **WHEN** um projeto aponta `capa` para `img/capa-sivi.JPG` e o arquivo em `public/img/` chama-se `capa-sivi.jpg`
- **THEN** o build falha
- **AND** a mensagem diz qual caminho foi citado e não encontrado

Esta verificação existe porque, sem ela, a falha seria silenciosa: o build passaria e a imagem simplesmente não apareceria no site.

#### Scenario: URL inválida

- **WHEN** a galeria de um projeto contém `galleries.vidflow.co/abc`, sem esquema
- **THEN** o build falha
- **AND** a mensagem indica o campo e o valor rejeitado

#### Scenario: Conteúdo válido

- **WHEN** todas as verificações passam
- **THEN** a validação não emite erro e o build prossegue

### Requirement: Deploy protegido contra conteúdo inválido

Quando a validação falha, o site já publicado SHALL permanecer intacto. Nenhum deploy SHALL ocorrer a partir de um build que falhou.

#### Scenario: Cliente publica JSON quebrado

- **WHEN** o cliente faz commit de um `content/site.json` inválido
- **THEN** o build falha e nenhuma versão nova vai ao ar
- **AND** o visitante continua vendo a última versão válida

### Requirement: Documentação do conteúdo ao lado do arquivo

O repositório SHALL conter `content/LEIA-ME.md` explicando cada bloco e cada campo de `content/site.json`, incluindo quais campos são obrigatórios e como adicionar um projeto novo com a respectiva imagem.

Este arquivo existe porque JSON não aceita comentário e quem edita não é desenvolvedor.

#### Scenario: Cliente adiciona um projeto

- **WHEN** o cliente consulta `content/LEIA-ME.md` para incluir um projeto
- **THEN** encontra a lista de campos obrigatórios do item
- **AND** encontra a instrução de onde subir a imagem de capa e como referenciá-la

### Requirement: Modelo de conteúdo preparado para páginas de projeto

Cada item de `projetos` SHALL aceitar os campos opcionais `cliente`, `data`, `local`, `perfil` e `descricao`, que a implementação atual não renderiza.

Estes campos existem porque o cliente já os especificou para as páginas individuais de projeto, adiadas neste change. Reservá-los agora evita mudar o schema depois.

#### Scenario: Projeto com campos extras preenchidos

- **WHEN** um projeto declara `cliente` e `descricao` e o build roda
- **THEN** a validação aceita o conteúdo
- **AND** a home continua renderizando apenas capa, categoria, título, tags e link da galeria

#### Scenario: Projeto sem os campos extras

- **WHEN** um projeto declara apenas os campos obrigatórios
- **THEN** a validação aceita o conteúdo
