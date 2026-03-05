## ADDED Requirements

### Requirement: Sistema de busca por tags com filtragem múltipla
O sistema SHALL permitir busca e filtragem por tags com interseção lógica.

#### Scenario: Lista de tags disponíveis
- **WHEN** usuário visualiza bookmarks
- **THEN** sistema mostra todas as tags disponíveis para filtragem

#### Scenario: Seleção de tag única
- **WHEN** usuário clica em uma tag
- **THEN** sistema filtra bookmarks mostrando apenas os que contêm aquela tag

#### Scenario: Seleção múltipla de tags
- **WHEN** usuário seleciona múltiplas tags
- **THEN** sistema mostra interseção de bookmarks que contêm todas as tags selecionadas

#### Scenario: Remoção de filtro
- **WHEN** usuário remove uma tag do filtro
- **THEN** sistema atualiza resultados mostrando bookmarks com as tags restantes

#### Scenario: Tags remanescentes
- **WHEN** usuário filtra por tags
- **THEN** sistema mostra apenas as tags presentes nos resultados filtrados

### Requirement: Interface de busca por tags intuitiva
O sistema SHALL apresentar interface clara para seleção e gerenciamento de filtros por tags.

#### Scenario: Tags como chips
- **WHEN** usuário visualiza filtros ativos
- **THEN** sistema mostra tags selecionadas como chips removíveis

#### Scenario: Contagem de resultados
- **WHEN** usuário passa mouse sobre tag
- **THEN** sistema mostra quantidade de bookmarks associados

#### Scenario: Busca combinada com texto
- **WHEN** usuário digita termo de busca e seleciona tags
- **THEN** sistema aplica ambos filtros simultaneamente

### Requirement: Performance em busca por tags
O sistema SHALL manter performance aceitável mesmo com grande quantidade de tags e bookmarks.

#### Scenario: Busca instantânea
- **WHEN** usuário seleciona tags
- **THEN** sistema retorna resultados em até 100ms

#### Scenario: Escalabilidade
- **WHEN** sistema possui mais de 10.000 bookmarks
- **THEN** busca por tags continua funcional com performance aceitável

#### Scenario: Cache de resultados
- **WHEN** mesmo filtro é aplicado repetidamente
- **THEN** sistema usa cache para evitar recálculos