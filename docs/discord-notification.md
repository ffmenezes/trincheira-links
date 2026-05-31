# Integração de Notificação no Discord

Documentação da automação que avisa no Discord toda vez que um novo link é
adicionado ao **Trincheira Links**.

> Arquivo da automação: [`.github/workflows/notify-discord.yml`](../.github/workflows/notify-discord.yml)

---

## Visão geral

Como o projeto é um site 100% estático sem backend, não existe um servidor para
disparar notificações. A solução roda inteiramente no **GitHub Actions**: quando
um commit chega na branch `master`, um workflow descobre quais arquivos de link
(`.mdx`) foram **adicionados** naquele push e dispara uma mensagem para um
**webhook do Discord**.

```
push em master ──▶ GitHub Actions ──▶ git diff (arquivos .mdx novos)
                                          │
                                          ▼
                            Node.js lê o frontmatter de cada arquivo
                                          │
                                          ▼
                       POST no Discord Webhook (fetch) ──▶ mensagem no canal
```

---

## Como funciona, passo a passo

### 1. Gatilho

```yaml
on:
  push:
    branches: [master]
```

A notificação só dispara em pushes para `master` — ou seja, depois que um PR de
novo link é mergeado. Isso evita spam durante o desenvolvimento em branches.

### 2. Checkout com histórico completo

```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0
```

`fetch-depth: 0` traz todo o histórico. Isso é necessário para conseguir fazer o
`git diff` entre o estado anterior e o atual do push. (Na primeira versão era
`fetch-depth: 2`, mas foi ampliado para `0` para evitar problemas de diff em
pushes com vários commits.)

### 3. Descobrir quais links são novos

```bash
BEFORE="${{ github.event.before }}"
AFTER="${{ github.event.after }}"

if [ "$BEFORE" = "0000000000000000000000000000000000000000" ] || [ -z "$BEFORE" ]; then
  FILES=$(git diff --name-only --diff-filter=A HEAD~1 HEAD | grep 'gerenciador-bookmarks/src/content/links/.*\.mdx$' || true)
else
  FILES=$(git diff --name-only --diff-filter=A $BEFORE $AFTER | grep 'gerenciador-bookmarks/src/content/links/.*\.mdx$' || true)
fi
```

- Usa o range `github.event.before..after` (o intervalo real do push).
- `--diff-filter=A` filtra **apenas arquivos adicionados** (Added) — editar ou
  remover um link não dispara notificação.
- O `grep` garante que só contam arquivos dentro de
  `gerenciador-bookmarks/src/content/links/` com extensão `.mdx`.
- O fallback para `HEAD~1 HEAD` cobre o caso em que `before` vem como
  `0000…` (push inicial de branch).
- Se `FILES` ficar vazio, o job encerra com sucesso (`exit 0`) sem mandar nada.

### 4. Ler o frontmatter e enviar

Um script Node.js inline (`node -e "..."`) processa cada arquivo:

```js
const getValue = (key) => {
  const regex = new RegExp('^' + key + ':\\s*(.*)$', 'm');
  const match = contentFile.match(regex);
  if (!match) return null;
  return match[1].trim().replace(/^["']|["']$/g, '').trim();
};

const name = getValue('name') || 'Sem nome';
const url  = getValue('link') || 'Sem URL';
const desc = getValue('description') || 'Sem descrição';
```

Repare que **não usa nenhum parser de YAML/MDX** — extrai os campos
`name`, `link` e `description` direto do texto com regex. É simples e suficiente
para o formato do frontmatter do projeto.

A mensagem e o envio:

```js
const msg = '🆕 Novo link adicionado em https://links.trincheira.dev/\n' +
            '**' + name + '**' + ' (' + url + ')' + '\n' + desc;

const payload = {
  username: 'Trincheira Links',
  avatar_url: 'https://raw.githubusercontent.com/ffmenezes/trincheira-links/master/gerenciador-bookmarks/public/favicon.png',
  content: msg
};

const response = await fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
```

- Usa o **`fetch` nativo** do Node (disponível no runner do GitHub Actions).
- `username` e `avatar_url` customizam a aparência do bot no canal.
- A mensagem usa **Markdown do Discord**: `**negrito**` no nome do link.

---

## ⚠️ A parte que deu trabalho: mostrar o texto corretamente

Essa integração passou por **5 commits** até funcionar direito, e o ponto que
mais travou foi exibir o texto certo no Discord. Os tropeços principais:

### 1. As aspas vazavam para dentro da mensagem

A **primeira versão** extraía os campos assim:

```js
const matchName = content.match(/^name:\s*"?(.*?)"?$/m);
```

O problema: `(.*?)` é **lazy** (não-guloso) e o `"?` final é opcional. Com um
valor como `name: "Nome do site"`, o grupo acabava capturando a aspa de
fechamento junto — saía `Nome do site"` na mensagem do Discord, com a aspa
sobrando. Frustrante porque o regex *parecia* certo.

A correção foi trocar por uma captura **gulosa** e limpar as aspas de forma
explícita, em um passo separado:

```js
const regex = new RegExp('^' + key + ':\\s*(.*)$', 'm');
// ...
return match[1].trim().replace(/^["']|["']$/g, '').trim();
```

Captura tudo até o fim da linha → tira espaços → remove aspas
(simples ou duplas) só nas pontas → tira espaços de novo. Robusto e previsível.

### 2. Inferno de escape: YAML ⊃ Bash ⊃ JavaScript

O script JS roda dentro de um bloco `run: |` (YAML), que por sua vez passa por
um `node -e "..."` (string com **aspas duplas** no shell). São **três camadas**
de parsing empilhadas, e cada caractere especial precisa sobreviver às três:

- `\\s` no regex (escapado para não virar `\s` antes da hora);
- `\"` para aspas dentro da string do `node -e`;
- `\n` nas quebras de linha da mensagem.

Esse empilhamento foi a maior fonte de dor de cabeça — um escape errado fazia o
script quebrar silenciosamente ou montar a mensagem torta.

### 3. Troca de `https.request` por `fetch`

A versão inicial montava a requisição na mão com o módulo `https` +
`url.parse()`, controlando `Content-Length`, eventos `error`, `req.write/end`
etc. Era verboso e mais difícil de depurar. Migrar para `fetch` + `async/await`
deixou o código muito mais limpo e fácil de ler o status de resposta.

### 4. Embeds → mensagem de texto simples

No começo a notificação usava **embeds** do Discord (`title`, `color`,
`fields` com Nome/URL/Descrição). Isso evoluiu para uma **mensagem `content` em
Markdown puro**, que renderiza o link clicável e fica mais enxuta no canal.

### 5. Evolução do formato da mensagem

O texto final foi sendo lapidado ao longo dos commits:

```text
# Versão com embeds (fields separados)
🚀 Novo link adicionado!  [Nome | URL | Descrição]

# Virou texto markdown
🚀 **Novo link adicionado!**
**Nome:** ...
**Link:** ...
**Descrição:** ...

# Encurtou e apontou pro site
🆕 **Novo link adicionado em https://links.trincheira.dev/**
<nome>
<url>
<desc>

# Formato atual
🆕 Novo link adicionado em https://links.trincheira.dev/
**<nome>** (<url>)
<desc>
```

---

## Configuração necessária

Para a integração funcionar, é preciso ter o secret do webhook configurado no
repositório:

| Secret | Onde configurar | O que é |
| --- | --- | --- |
| `DISCORD_WEBHOOK_URL` | Settings → Secrets and variables → Actions | URL do webhook do canal do Discord onde as notificações chegam |

Como criar o webhook no Discord: **Configurações do canal → Integrações →
Webhooks → Novo Webhook → Copiar URL**.

---

## Logs e depuração

O script imprime bastante coisa no log do Actions para facilitar o diagnóstico:

- `--- Processando: <arquivo> ---` para cada arquivo do diff;
- `Arquivo não encontrado no disco: ...` se o arquivo sumiu;
- `Dados extraídos: { name, url }` mostrando o que o regex pegou;
- `✅ Notificação enviada: <nome>` em caso de sucesso;
- `❌ Erro no Discord: <status> <statusText>` + corpo da resposta, em caso de
  falha do webhook;
- `❌ Erro crítico em <arquivo>: ...` para exceções inesperadas.

Se as notificações pararem de chegar, comece olhando esses logs na aba
**Actions** do GitHub: dá pra ver se o diff achou o arquivo, se o frontmatter
foi lido certo e qual status o Discord retornou.

---

## Limitações conhecidas

- **Só dispara em `master`** — links em PR ainda não mergeado não notificam.
- **Só conta arquivos adicionados** — editar ou remover um link não gera aviso.
- **Parsing por regex** — depende de `name`, `link` e `description` estarem cada
  um em uma única linha no frontmatter (que é o padrão do `_template.mdx`). Valor
  multilinha ou em formato YAML mais exótico não seria lido corretamente.
- Uma notificação é enviada **por arquivo novo**; um push que adiciona vários
  links manda várias mensagens.
