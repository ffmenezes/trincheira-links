## ADDED Requirements

### Requirement: Sistema de bookmarks completo
O sistema SHALL permitir criar, ler, atualizar e deletar bookmarks com todos os campos necessários.

#### Scenario: Criar novo bookmark
- **WHEN** usuário adiciona novo link
- **THEN** sistema salva com nome, link, descrição, data, tags, favicon, ogthumb e creator

#### Scenario: Editar bookmark existente
- **WHEN** usuário modifica campos de um bookmark
- **THEN** sistema atualiza todos os dados mantendo integridade

#### Scenario: Deletar bookmark
- **WHEN** usuário remove um bookmark
- **THEN** sistema exclui permanentemente com confirmação

### Requirement: Sistema de tags com busca filtrada
O sistema SHALL permitir adicionar tags aos bookmarks e realizar busca filtrada por múltiplas tags.

#### Scenario: Adicionar tags a bookmark
- **WHEN** usuário adiciona tags a um link
- **THEN** sistema armazena tags e permite busca por elas

#### Scenario: Busca por tag única
- **WHEN** usuário clica em uma tag
- **THEN** sistema mostra apenas bookmarks com aquela tag

#### Scenario: Filtro de múltiplas tags
- **WHEN** usuário aplica múltiplas tags
- **THEN** sistema mostra interseção de bookmarks com todas as tags

### Requirement: Busca textual livre
O sistema SHALL permitir busca em todos os campos dos bookmarks.

#### Scenario: Busca por título
- **WHEN** usuário busca por termo no campo de busca
- **THEN** sistema retorna bookmarks com título correspondente

#### Scenario: Busca por descrição
- **WHEN** usuário busca por termo na descrição
- **THEN** sistema retorna bookmarks com descrição correspondente

#### Scenario: Busca combinada com tags
- **WHEN** usuário busca e aplica tags simultaneamente
- **THEN** sistema retorna resultados filtrados por ambos critérios

### Requirement: Suporte a bundles de links
O sistema SHALL permitir agrupar bookmarks em bundles para organização temática.

#### Scenario: Criar novo bundle
- **WHEN** usuário cria um bundle
- **THEN** sistema permite adicionar bookmarks ao bundle

#### Scenario: Adicionar bookmarks a bundle
- **WHEN** usuário adiciona links a um bundle existente
- **THEN** sistema mantém relação entre bundle e bookmarks

#### Scenario: Visualizar bundle
- **WHEN** usuário acessa um bundle
- **THEN** sistema mostra todos os bookmarks agrupados

### Requirement: Tema minimalista com cor verde bélica
O sistema SHALL implementar interface minimalista com esquema de cores verde bélica predominante.

#### Scenario: Interface limpa
- **WHEN** usuário acessa o sistema
- **THEN** interface apresenta design minimalista sem elementos desnecessários

#### Scenario: Cores verde bélica
- **WHEN** sistema renderiza interface
- **THEN** cores predominantes são tons de verde bélico

#### Scenario: Responsividade
- **WHEN** usuário acessa em dispositivos móveis
- **THEN** sistema adapta layout para telas menores

### Requirement: Armazenamento otimizado para páginas estáticas
O sistema SHALL funcionar principalmente com arquivos estáticos, migrando para PostgreSQL apenas se necessário.

#### Scenario: Funcionamento estático
- **WHEN** sistema roda sem backend
- **THEN** todos os dados são carregados de arquivos JSON

#### Scenario: Migração para PostgreSQL
- **WHEN** performance de arquivos estáticos degrada
- **THEN** sistema migra para banco de dados PostgreSQL

#### Scenario: Cache eficiente
- **WHEN** usuário acessa dados frequentemente
- **THEN** sistema usa cache para melhorar performance