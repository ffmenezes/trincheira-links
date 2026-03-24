# Guia de Tags - Gerenciador de Bookmarks

Este guia estabelece a taxonomia e as regras para a classificação (tags) de links no projeto, utilizando uma abordagem facetada inspirada na biblioteconomia para garantir uma filtragem clara, precisa e escalável.

## Como classificar um novo link

Ao adicionar um novo link, você deve atribuir tags considerando **três eixos principais**. O ideal é que cada link tenha de 2 a 4 tags.

### Eixo A: Domínio Principal (Onde se encaixa de forma geral?)
Escolha **uma** tag que represente a grande área do link.
- `ai` (Inteligência Artificial, Modelos, Agentes)
- `dev` (Desenvolvimento de Software, Programação)
- `design` (UI/UX, Ferramentas de Design)
- `nocode` (Ferramentas visuais, construção sem código)
- `negocios` (Empreendedorismo, Marketing, Vendas, Produtividade)
- `conteudo` (Material de consumo passivo ou estudo genérico)

### Eixo B: Especialidade ou Formato (A "Prateleira")
Escolha as tags que melhor detalham a área ou o formato do link dentro do Domínio.
- **Desenvolvimento / AI / Design:** `frontend`, `backend`, `api`, `database`, `devops`, `security`, `mobile`, `agents`, `vibecoding`, `icons`, `ui`.
- **Formatos de Conteúdo:** `livros`, `blog`, `youtube`, `newsletter`, `reddit`.
- **Negócios:** `marketing`, `produtividade`, `analytics`.

### Eixo C: Assunto Específico / Ferramenta (A "Etiqueta" do Item)
Use tags altamente específicas para facilitar a busca pontual. Essa é a camada mais detalhada.
- **Tipos de Dados / Tecnologias:** `regex`, `yaml`, `json`, `jwt`, `pdf`, `video`, `mockdata`, `webhook`.
- **Funções Específicas:** `qrcode`, `screenshots`, `transcricao`, `acessibilidade`, `dev-tools`, `ferramentas`.
- **Marcas, Escolas e Ecossistemas:** `tech12k`, `saas7d`, `bmad`, `shadcn`, `supabase`, `postgres`, `semcodar`, `bubble`.

---

## Regras Importantes

1. **Evite `open-source` ou `utils` genéricos:**
   - Em vez de `open-source`, use `github` (se for um repositório) ou vá direto para a funcionalidade da ferramenta.
   - A tag `utils` foi descontinuada por ser muito ampla. Use `dev-tools` (para desenvolvedores) ou `ferramentas` (para utilitários gerais), ou melhor ainda, a tag da função específica (ex: `regex`, `json`).
2. **Evite Redundância:**
   - Não use `gpt` se já for usar `ai` ou `agents`.
   - `components` e `ui` significam quase o mesmo, prefira sempre `ui`.
3. **Mantenha Marcas e Ferramentas Próprias:**
   - Ferramentas fundamentais ou ecossistemas de cursos (`bubble`, `semcodar`, `shadcn`) **devem** ser mantidas como tags próprias se isso ajudar a organizar o conhecimento.

## Exemplo de Aplicação
* **Site:** Regex101
* **Tags antigas:** `["utils", "regex"]`
* **Novas tags (Eixo A + B + C):** `["dev", "dev-tools", "regex"]`

* **Site:** Curso Bubble Sem Codar
* **Tags antigas:** `["bubble", "semcodar"]`
* **Novas tags (Eixo A + C):** `["nocode", "bubble", "semcodar"]`
