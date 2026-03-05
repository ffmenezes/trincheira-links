## ADDED Requirements

### Requirement: Busca textual completa em todos os campos
O sistema SHALL permitir busca em todos os campos dos bookmarks incluindo nome, link, descrição, tags e conteúdo.

#### Scenario: Busca por nome
- **WHEN** usuário busca por termo
- **THEN** sistema retorna bookmarks com nome contendo o termo

#### Scenario: Busca por link
- **WHEN** usuário busca por URL ou parte dela
- **THEN** sistema retorna bookmarks com link correspondente

#### Scenario: Busca por descrição
- **WHEN** usuário busca por texto na descrição
- **THEN** sistema retorna bookmarks com descrição contendo o termo

#### Scenario: Busca por tags
- **WHEN** usuário busca por tag existente
- **THEN** sistema retorna bookmarks com aquela tag

#### Scenario: Busca por conteúdo do link
- **WHEN** usuário busca por conteúdo extraído do link
- **THEN** sistema retorna bookmarks com conteúdo correspondente

### Requirement: Busca fuzzy e tolerante a erros
O sistema SHALL implementar busca com tolerância a erros ortográficos e variações.

#### Scenario: Erros ortográficos
- **WHEN** usuário digita com erros de ortografia
- **THEN** sistema retorna resultados relevantes considerando variações

#### Scenario: Busca parcial
- **WHEN** usuário digita parte de uma palavra
- **THEN** sistema retorna resultados com palavras que contêm o termo

#### Scenario: Busca por sinônimos
- **WHEN** usuário busca por termo com sinônimos
- **THEN** sistema retorna resultados considerando variações semânticas

### Requirement: Performance de busca em grande escala
O sistema SHALL manter performance aceitável mesmo com milhares de bookmarks.

#### Scenario: Busca instantânea
- **WHEN** usuário digita termo de busca
- **THEN** sistema retorna resultados em até 200ms

#### Scenario: Busca enquanto digita
- **WHEN** usuário digita continuamente
- **THEN** sistema atualiza resultados em tempo real sem travar

#### Scenario: Busca em modo offline
- **WHEN** usuário está sem conexão
- **THEN** sistema realiza busca nos dados locais cacheados