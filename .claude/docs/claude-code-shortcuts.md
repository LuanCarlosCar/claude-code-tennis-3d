# Claude Code — Guia Completo de Atalhos e Comandos para Devs

> Referência pensada para o dia a dia de desenvolvimento: atalhos de teclado, slash commands, modo Vim, bash mode, background tasks e dicas de produtividade.
>
> **Base:** documentação oficial do Claude Code ([code.claude.com/docs](https://code.claude.com/docs/en/overview)) — versão consultada em abril de 2026.
>
> **Convenções deste documento:**
> - `<arg>` = argumento **obrigatório**
> - `[arg]` = argumento **opcional**
> - "Alias" = forma alternativa de chamar o mesmo comando
> - Onde existir trade-off ou risco, você vê uma seção **⚠️ Atenção**

---

## Sumário

1. [Como descobrir o que existe na sua instalação](#1-como-descobrir-o-que-existe-na-sua-instalação)
2. [Atalhos de teclado](#2-atalhos-de-teclado)
3. [Slash commands por categoria](#3-slash-commands-por-categoria)
4. [Modo Vim no prompt](#4-modo-vim-no-prompt)
5. [Bash mode, background tasks e menções de arquivo](#5-bash-mode-background-tasks-e-menções-de-arquivo)
6. [Combos práticos para o dia a dia](#6-combos-práticos-para-o-dia-a-dia)
7. [Observações sobre Windows/WSL e VS Code](#7-observações-sobre-windowswsl-e-vs-code)

---

## 1. Como descobrir o que existe na sua instalação

Antes de decorar qualquer tabela, dois atalhos resolvem 80% das dúvidas:

| Tecla/Comando | O que faz |
|---|---|
| `?` | Mostra todos os **atalhos de teclado** disponíveis no seu terminal atual |
| `/` (prompt vazio) | Abre o menu com **todos os slash commands** disponíveis, incluindo built-in, skills, plugins e MCP |
| `/help` | Lista comandos e ajuda básica |
| `/powerup` | Tutorial interativo com demos animadas dos recursos |

**Por que isso importa:** nem todo comando aparece para todo mundo. Alguns dependem do seu plano (Pro/Max), da sua plataforma (macOS vs Windows) ou de features habilitadas (voice, sandbox, Bedrock/Vertex). `/` e `?` mostram o que **realmente** está disponível no seu setup — evite decorar comandos que podem não existir pra você.

---

## 2. Atalhos de teclado

### 2.1 Controles gerais

| Atalho | O que faz | Quando usar |
|---|---|---|
| `Ctrl+C` | Cancela o input atual ou a geração em andamento | Interromper resposta quando o Claude pegou o caminho errado |
| `Ctrl+D` | Sai da sessão (EOF) | Encerrar a sessão limpa |
| `Esc` | Interrompe a geração atual | Equivalente a `Ctrl+C` para parar resposta sem encerrar |
| `Esc` + `Esc` | **Rewind mode**: volta a conversa e/ou código a um ponto anterior | Desfazer várias ações de uma vez (ver [checkpointing](https://code.claude.com/docs/en/checkpointing)) |
| `Ctrl+L` | Limpa o input e redesenha a tela | Quando o terminal fica com render quebrado; **não apaga o histórico da conversa** |
| `Ctrl+O` | Abre/fecha o **transcript viewer** | Ver chamadas de tools expandidas (MCP, etc.) |
| `Ctrl+R` | **Reverse search** no histórico de comandos | Buscar prompts antigos da sessão atual |
| `Ctrl+T` | Mostra/esconde a **task list** | Acompanhar progresso de tarefas longas |
| `Ctrl+B` | Move a execução de um Bash tool para **background** | Buildar, subir servidor dev, rodar testes longos sem travar a sessão |
| `Ctrl+X Ctrl+K` | Mata **todos os background agents** (confirmar 2x em 3s) | Matar tudo de uma vez quando algo saiu do controle |
| `Ctrl+G` ou `Ctrl+X Ctrl+E` | Abre o prompt no **editor padrão** (`$EDITOR`) | Escrever prompts longos com conforto de editor (vim, nvim, VS Code, etc.) |
| `Ctrl+V` | Cola imagem do clipboard como `[Image #N]` | Colar screenshot de erro, mockup, print de Postman/DBeaver |
| `Shift+Tab` ou `Alt+M` | Cicla entre **permission modes**: `default` → `acceptEdits` → `plan` → outros habilitados | Trocar para plan mode antes de uma task crítica |
| `Option+P` (Mac) / `Alt+P` (Win/Linux) | **Switch model** sem perder o prompt digitado | Trocar de Sonnet pra Opus no meio de uma task pesada |
| `Option+T` / `Alt+T` | Liga/desliga **extended thinking** | Habilitar raciocínio profundo em problemas arquiteturais |
| `Option+O` / `Alt+O` | Liga/desliga **fast mode** | Respostas mais rápidas para tarefas simples |
| `←` / `→` | Cicla entre tabs em diálogos de permissão | Navegar menus sem mouse |
| `↑` / `↓` (ou `Ctrl+P`/`Ctrl+N`) | Navega cursor em input multiline; nas bordas, navega histórico | Revisitar prompts anteriores |

> **⚠️ Atenção — macOS e teclas Option/Alt:**
> Atalhos `Alt+B`, `Alt+F`, `Alt+Y`, `Alt+M`, `Alt+P`, `Alt+T` só funcionam se o terminal estiver configurado pra tratar **Option como Meta**:
> - **iTerm2:** Settings → Profiles → Keys → General → Left/Right Option key = "Esc+"
> - **Apple Terminal:** Settings → Profiles → Keyboard → marque "Use Option as Meta Key"
> - **VS Code:** `"terminal.integrated.macOptionIsMeta": true` no settings.json
>
> No Windows/Linux normalmente já funciona sem configuração extra.

### 2.2 Edição de texto (estilo readline)

Estes atalhos funcionam no prompt do Claude Code, útil para quem já tem dedo treinado no Bash/Zsh:

| Atalho | O que faz |
|---|---|
| `Ctrl+A` | Move o cursor para o **início da linha lógica** |
| `Ctrl+E` | Move o cursor para o **fim da linha lógica** |
| `Ctrl+K` | Apaga do cursor até o **fim da linha** (guarda pra colar depois) |
| `Ctrl+U` | Apaga do cursor até o **início da linha** (guarda pra colar) |
| `Ctrl+W` | Apaga a **palavra anterior** (guarda pra colar) |
| `Ctrl+Y` | Cola o texto apagado por `Ctrl+K`/`U`/`W` |
| `Alt+Y` (após `Ctrl+Y`) | Cicla pelo histórico de textos apagados (kill-ring) |
| `Alt+B` | Move o cursor **uma palavra pra trás** |
| `Alt+F` | Move o cursor **uma palavra pra frente** |

**Dica:** no Windows, `Ctrl+Backspace` também apaga palavra anterior. No macOS, `Cmd+Backspace` é mapeado pro mesmo `Ctrl+U` (apagar até o início da linha).

### 2.3 Input multiline (quebra de linha sem enviar)

Por padrão, `Enter` envia a mensagem. Pra escrever prompts em várias linhas:

| Método | Atalho | Onde funciona |
|---|---|---|
| **Quick escape** | `\` + `Enter` | **Todos os terminais** — é o método universal, sem configuração |
| Option key | `Option+Enter` | Depois de configurar Option as Meta (macOS) |
| Shift+Enter | `Shift+Enter` | Nativo em **iTerm2, WezTerm, Ghostty, Kitty, Warp, Apple Terminal** |
| Control sequence | `Ctrl+J` | Qualquer terminal, sem configuração |
| Paste mode | Colar texto diretamente | Pra colar bloco de código ou logs |

> **Recomendação para VS Code, Cursor, Windsurf, Alacritty, Zed:** rode `/terminal-setup` uma vez pra instalar o binding do `Shift+Enter`. **Precisa reiniciar o terminal** pra valer.

### 2.4 Prefixos rápidos no início do prompt

| Prefixo | O que faz |
|---|---|
| `/` no início | Abre menu de **commands/skills** |
| `!` no início | Entra em **bash mode** (executa comando shell direto, adiciona output ao contexto) |
| `@` | Dispara **autocomplete de file path** — muito usado pra referenciar arquivos específicos no prompt |

### 2.5 Transcript viewer (quando `Ctrl+O` está aberto)

| Tecla | O que faz |
|---|---|
| `Ctrl+E` | Alterna entre ver conteúdo resumido vs. expandido |
| `[` | Escreve a conversa inteira no scrollback nativo do terminal (permite `Cmd+F`, tmux copy mode) — requer fullscreen rendering |
| `v` | Escreve a conversa em arquivo temporário e abre no `$VISUAL` ou `$EDITOR` |
| `q`, `Ctrl+C`, `Esc` | Fecham o transcript |

### 2.6 Voice input (opcional)

| Atalho | O que faz |
|---|---|
| Segurar `Space` | Push-to-talk dictation (requer voice dictation habilitado e conta claude.ai) |

---

## 3. Slash commands por categoria

### 3.1 Sessão e contexto

Gerenciar o estado da conversa. Esta é a categoria que mais importa no dia a dia.

| Comando | O que faz |
|---|---|
| `/clear` | **Limpa o histórico** e libera contexto. Inicia uma sessão nova. Aliases: `/reset`, `/new` |
| `/compact [instructions]` | **Resume** a conversa mantendo o essencial. Pode passar instruções de foco (ex: `/compact keep only auth-related context`) |
| `/context` | Mostra uso de contexto em grid colorido, com sugestões de otimização |
| `/cost` | Mostra estatísticas de tokens da sessão |
| `/resume [session]` | Retoma uma conversa por ID/nome, ou abre seletor. Alias: `/continue` |
| `/branch [name]` | **Cria um branch** da conversa no ponto atual. Preserva o original (volta com `/resume`). Alias: `/fork` |
| `/rename [name]` | Renomeia a sessão atual |
| `/export [filename]` | Exporta a conversa como texto (clipboard ou arquivo) |
| `/copy [N]` | Copia a última resposta do assistant (ou a N-ésima anterior). Com blocos de código, abre picker interativo |
| `/rewind` | Volta o código e/ou conversa a um ponto anterior. Alias: `/checkpoint` |
| `/recap` | Gera um resumo on-demand da sessão atual |
| `/exit` | Sai do CLI. Alias: `/quit` |

> **⚠️ Trade-off `/clear` vs `/compact`:**
> - `/clear` é **destrutivo**: perde o contexto inteiro, mas libera o máximo de tokens. Use quando mudar completamente de task.
> - `/compact` **preserva** as decisões importantes em forma resumida — melhor quando você quer continuar a task mas a conversa está pesada. Risco: o summary pode perder nuances.
> - **`/branch` é o melhor dos dois mundos**: cria um fork salvando o estado atual. Se der ruim no branch novo, volta pro anterior via `/resume`. Use quando quiser experimentar uma abordagem nova sem perder o caminho principal.

### 3.2 Planejamento e execução

| Comando | O que faz |
|---|---|
| `/plan [description]` | Entra em **plan mode** direto do prompt (opcionalmente já com uma task: `/plan refatorar auth`) |
| `/effort [low\|medium\|high\|max\|auto]` | Ajusta o **effort level** do modelo. `low/medium/high` persistem; `max` só na sessão atual e **requer Opus 4.6** |
| `/model [model]` | Troca o modelo. Em modelos compatíveis, setas ←/→ ajustam effort. **Aplica imediatamente**, sem esperar resposta atual terminar |
| `/fast [on\|off]` | Liga/desliga [fast mode](https://code.claude.com/docs/en/fast-mode) |
| `/ultraplan <prompt>` | Rascunha um plano em sessão ultraplan, revisa no navegador, executa remoto ou volta pro terminal |

### 3.3 Permissões e segurança

| Comando | O que faz |
|---|---|
| `/permissions` | Gerencia regras **allow/ask/deny** de tools. Dialog interativo. Alias: `/allowed-tools` |
| `/sandbox` | Liga/desliga [sandbox mode](https://code.claude.com/docs/en/sandboxing) (onde suportado) |
| `/security-review` | **Analisa o diff atual** procurando vulnerabilidades (injection, auth, data exposure) |
| `/privacy-settings` | Ver/atualizar configurações de privacidade (apenas Pro e Max) |

> **Dica de setup:** edite `.claude/settings.local.json` manualmente pra liberar comandos em lote. Exemplo útil no seu workflow:
> ```json
> {
>   "permissions": {
>     "allow": [
>       "Bash(pnpm *)",
>       "Bash(npm run *)",
>       "Bash(git status)",
>       "Bash(git diff *)"
>     ],
>     "deny": [
>       "Bash(git push *)",
>       "Bash(rm -rf *)"
>     ]
>   }
> }
> ```
> **Trade-off:** wildcards (`Bash(pnpm *)`) são práticos, mas também permitem `pnpm publish` ou `pnpm remove`. Mais seguro: listar comandos específicos (`Bash(pnpm test)`, `Bash(pnpm typecheck)`).

### 3.4 Git, GitHub e PRs

| Comando | O que faz |
|---|---|
| `/diff` | Abre **viewer interativo de diff**: uncommitted changes + per-turn diffs. `←/→` navega entre git diff e turnos do Claude, `↑/↓` entre arquivos |
| `/autofix-pr [prompt]` | Spawna uma sessão web que **fica vigiando o PR**: se CI falhar ou review pedir mudanças, ela pusha correções. Pode passar prompt pra restringir (`/autofix-pr only fix lint errors`). Requer `gh` CLI |
| `/install-github-app` | Instala o **Claude GitHub Actions** no repositório |
| `/teleport` (`/tp`) | Traz uma sessão de Claude Code on the web pro seu terminal (branch + conversa) |

> **PR review status no footer:** quando estiver num branch com PR aberto, o footer mostra um link (`PR #446`) com underline colorido: 🟢 aprovado, 🟡 pending, 🔴 changes requested, ⚪ draft, 🟣 merged. `Cmd+click` / `Ctrl+click` abre no navegador. Atualiza a cada 60s. Requer `gh` CLI autenticado.

### 3.5 Produtividade — comandos pouco conhecidos que valem muito

| Comando | O que faz |
|---|---|
| `/btw <question>` | **Side question**: pergunta rápida sobre a conversa atual **sem poluir o histórico**. Funciona **enquanto o Claude está trabalhando**. A resposta é efêmera (overlay) |
| `/loop [interval] [prompt]` | **Skill**: roda um prompt repetidamente. Sem intervalo, o Claude auto-pace. Sem prompt, roda a manutenção autônoma ou o conteúdo de `.claude/loop.md`. Ex: `/loop 5m verifica se o deploy terminou`. Alias: `/proactive` |
| `/batch <instruction>` | **Skill**: orquestra mudanças paralelas no codebase. Decompõe em 5-30 unidades, cria 1 agent por unidade em worktree isolado, cada um abre um PR. Ex: `/batch migrar src/ de Solid pra React` |
| `/simplify [focus]` | **Skill**: revisa arquivos recentes em 3 agents paralelos (reuso, qualidade, eficiência) e aplica fixes |
| `/debug [description]` | **Skill**: habilita debug logging e analisa issues |
| `/claude-api` | **Skill**: carrega referência da Claude API pra linguagem do projeto (TS, Python, etc.). Ativa auto quando você importa `@anthropic-ai/sdk` |
| `/schedule [description]` | Cria/gerencia **routines** (tarefas agendadas) |
| `/tasks` | Lista/gerencia background tasks. Alias: `/bashes` |
| `/remote-control` (`/rc`) | Torna esta sessão controlável remotamente pelo claude.ai |

> **⚠️ `/btw` vs subagent:**
> - `/btw` tem **visibilidade total** da conversa, mas **nenhuma tool** (não lê arquivo, não roda comando). Use pra perguntar sobre o que o Claude já sabe desta sessão.
> - Subagent tem **tools completas**, mas **contexto vazio**. Use pra ir buscar coisa nova sem poluir a conversa principal.

> **⚠️ `/loop` — cuidado com custo:** cada iteração consome tokens. Configure intervalos realistas (`/loop 10m` em vez de `/loop 30s`) e defina uma condição de saída no prompt, ex: `... e pare quando CI passar`.

### 3.6 Configuração e customização

| Comando | O que faz |
|---|---|
| `/config` | Abre o painel de **Settings** (tema, modelo, output style, editor mode, etc.). Alias: `/settings` |
| `/init` | Cria um **CLAUDE.md** inicial no projeto. `CLAUDE_CODE_NEW_INIT=1` ativa flow interativo com skills, hooks e memory files |
| `/memory` | Edita arquivos `CLAUDE.md`, liga/desliga **auto-memory**, vê entradas automáticas |
| `/keybindings` | Abre/cria seu arquivo de keybindings customizados |
| `/theme` | Troca o tema (light/dark, daltonized, ANSI) |
| `/color [color\|default]` | Cor da **prompt bar** desta sessão (red, blue, green, yellow, purple, orange, pink, cyan). Útil pra distinguir múltiplas sessões abertas |
| `/statusline` | Configura o status line. Descreva o que quer, ou rode sem args pra auto-configurar do seu shell |
| `/agents` | Gerencia [sub-agents](https://code.claude.com/docs/en/sub-agents) |
| `/plugin` | Gerencia [plugins](https://code.claude.com/docs/en/plugins) |
| `/reload-plugins` | Recarrega plugins sem reiniciar |
| `/skills` | Lista skills disponíveis |
| `/hooks` | Mostra configurações de hooks |

### 3.7 Integrações (IDE, Chrome, Slack, Desktop, Mobile)

| Comando | O que faz |
|---|---|
| `/ide` | Gerencia integração com IDE (VS Code, Cursor, etc.) |
| `/terminal-setup` | Configura keybindings do terminal (Shift+Enter, etc.). Só aparece onde é necessário |
| `/chrome` | Configura [Claude in Chrome](https://code.claude.com/docs/en/chrome) |
| `/install-slack-app` | Instala o Claude Slack app (OAuth no browser) |
| `/desktop` | Continua a sessão no Claude Code Desktop app (macOS/Windows). Alias: `/app` |
| `/mobile` | QR code pra baixar o app mobile. Aliases: `/ios`, `/android` |
| `/mcp` | Gerencia **MCP servers** e OAuth |
| `/web-setup` | Conecta GitHub ao Claude Code on the web via `gh` CLI local |
| `/remote-env` | Configura o ambiente remoto default pra sessões web |

### 3.8 Diagnóstico e telemetria

| Comando | O que faz |
|---|---|
| `/doctor` | **Diagnostica** a instalação. Com `f`, manda o Claude corrigir problemas reportados |
| `/status` | Abre Settings (tab Status) com versão, modelo, conta, conectividade. Funciona **mesmo com resposta em andamento** |
| `/stats` | Visualiza uso diário, sessões, streaks, preferências de modelo |
| `/insights` | Relatório analisando suas sessões (áreas do projeto, padrões, fricções) |
| `/usage` | Limites do plano e rate limit |
| `/extra-usage` | Configura uso extra pra continuar quando bater rate limit |
| `/release-notes` | Changelog com version picker |
| `/feedback [report]` | Envia feedback. Alias: `/bug` |
| `/team-onboarding` | Gera guia de onboarding a partir dos últimos 30 dias de uso (pra colar como primeira msg num novo dev do time) |

### 3.9 Conta e plano

| Comando | O que faz |
|---|---|
| `/login` | Entra na conta Anthropic |
| `/logout` | Sai |
| `/upgrade` | Abre página de upgrade de plano |
| `/passes` | Compartilha uma semana grátis de Claude Code com amigos (se elegível) |

### 3.10 Setup enterprise (Bedrock/Vertex)

| Comando | O que faz |
|---|---|
| `/setup-bedrock` | Wizard interativo pra AWS Bedrock. Só visível com `CLAUDE_CODE_USE_BEDROCK=1` |
| `/setup-vertex` | Wizard pra Google Vertex AI. Só visível com `CLAUDE_CODE_USE_VERTEX=1` |

---

## 4. Modo Vim no prompt

Pra ativar: `/config` → Editor mode → Vim.

> **Nota:** o comando `/vim` **foi removido** na v2.1.92. Use `/config` pra alternar.

### 4.1 Mudança de modo

| Tecla | Ação | Modo de origem |
|---|---|---|
| `Esc` | Entra em **NORMAL mode** | INSERT |
| `i` | Insere antes do cursor | NORMAL |
| `I` | Insere no início da linha | NORMAL |
| `a` | Insere depois do cursor | NORMAL |
| `A` | Insere no fim da linha | NORMAL |
| `o` | Abre linha abaixo | NORMAL |
| `O` | Abre linha acima | NORMAL |

### 4.2 Navegação (NORMAL)

| Tecla | Ação |
|---|---|
| `h` / `j` / `k` / `l` | Esquerda / baixo / cima / direita |
| `w` | Próxima palavra |
| `e` | Fim da palavra |
| `b` | Palavra anterior |
| `0` | Início da linha |
| `$` | Fim da linha |
| `^` | Primeiro caractere não-branco |
| `gg` | Início do input |
| `G` | Fim do input |
| `f{char}` | Pula para próxima ocorrência do char |
| `F{char}` | Pula para ocorrência anterior do char |
| `t{char}` | Pula para **antes** da próxima ocorrência |
| `T{char}` | Pula para **depois** da ocorrência anterior |
| `;` | Repete último f/F/t/T |
| `,` | Repete em reverso |

### 4.3 Edição (NORMAL)

| Tecla | Ação |
|---|---|
| `x` | Deleta caractere |
| `dd` | Deleta linha |
| `D` | Deleta até fim da linha |
| `dw` / `de` / `db` | Deleta palavra / até fim / pra trás |
| `cc` | Muda linha |
| `C` | Muda até fim da linha |
| `cw` / `ce` / `cb` | Muda palavra / até fim / pra trás |
| `yy` / `Y` | Yank (copia) linha |
| `yw` / `ye` / `yb` | Yank palavra / até fim / pra trás |
| `p` | Cola depois do cursor |
| `P` | Cola antes |
| `>>` / `<<` | Indenta / desindenta |
| `J` | Junta linhas |
| `u` | Undo |
| `.` | Repete última mudança |

### 4.4 Text objects (NORMAL)

Funcionam com operadores `d`, `c`, `y` — ex: `diw` (delete inner word), `ca"` (change around double quotes).

| Tecla | Ação |
|---|---|
| `iw` / `aw` | Inner / around **word** |
| `iW` / `aW` | Inner / around **WORD** (whitespace-delimited) |
| `i"` / `a"` | Inner / around **aspas duplas** |
| `i'` / `a'` | Inner / around **aspas simples** |
| `i(` / `a(` | Inner / around **parênteses** |
| `i[` / `a[` | Inner / around **colchetes** |
| `i{` / `a{` | Inner / around **chaves** |

---

## 5. Bash mode, background tasks e menções de arquivo

### 5.1 Bash mode (`!`)

Prefixe com `!` pra **rodar direto no shell**, sem o Claude interpretar:

```
! npm test
! git status
! pnpm typecheck
```

**Características:**
- Adiciona comando **e output** ao contexto da conversa
- Mostra progresso em tempo real
- Suporta `Ctrl+B` pra backgroundar
- **Não requer aprovação** do Claude
- Tab completa do histórico de `!` commands do projeto atual
- Sai com `Escape`, `Backspace` ou `Ctrl+U` em prompt vazio
- Colar texto que começa com `!` em prompt vazio entra em bash mode automaticamente

**Quando usar vs. deixar o Claude rodar:**
- **Bash mode:** quando você já sabe o comando exato e só quer que o output esteja no contexto (ex: colar saída de `pnpm typecheck` pra o Claude analisar).
- **Deixar o Claude rodar:** quando o comando depende de contexto, parsing de output, ou pode precisar de retry com variação.

### 5.2 Background tasks

Comandos longos (build, dev server, testes pesados, docker) podem rodar em background:

**Como backgroundar:**
1. Peça pro Claude: _"rode o build em background"_
2. Ou pressione `Ctrl+B` com um Bash tool ativo (usuários de **tmux precisam apertar 2x** por causa do prefix)

**Características:**
- Output vai pra arquivo, Claude lê com a tool Read
- Cada task tem ID único
- Limpas automaticamente ao sair do Claude Code
- **Terminadas automaticamente se passar de 5GB de output** (com nota no stderr)
- Gerenciáveis via `/tasks` (alias `/bashes`)

**Comandos que costumam ir pra background:**
- Build tools (webpack, vite, esbuild)
- Package managers rodando install grande
- Test runners em watch mode (jest, vitest, pytest)
- Dev servers (`pnpm dev`, `npm run dev`)
- Docker, terraform, builds Expo

**Como desligar:** `export CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1`

### 5.3 Menções de arquivo (`@`)

Digite `@` e começa a aparecer autocomplete de paths. Isso:
- Pede pro Claude **ler** aquele arquivo como parte do contexto do prompt
- Evita ambiguidade quando há nomes parecidos (`user.ts` vs `users/user.ts`)
- Funciona com diretórios (`@src/components/`)

**Exemplo:**
```
Refatora a função login em @src/auth/login.ts pra usar o padrão que está em @src/auth/register.ts
```

### 5.4 Prompt suggestions

Ao abrir a sessão, um prompt cinza aparece como sugestão (baseado no git history do projeto). Depois de respostas, sugestões continuam aparecendo como continuação natural.

- `Tab` ou `→`: aceita
- `Enter`: aceita e envia
- Começar a digitar: descarta

**Pra desligar:** `export CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION=false`

---

## 6. Combos práticos para o dia a dia

Fluxos que combinam atalhos e funcionam bem em projetos reais:

### 6.1 Debug de bug com screenshot
1. Tira print do erro (Lightshot/Snipping Tool/Flameshot)
2. No Claude Code: `Ctrl+V` cola a imagem como `[Image #1]`
3. `@caminho/do/arquivo.ts` pra referenciar o arquivo suspeito
4. Digita o prompt descrevendo o comportamento
5. `Shift+Tab` pra entrar em **plan mode** antes de deixar ele mexer

### 6.2 Refactor grande sem perder sanidade
1. `/branch refactor-experiment` — cria fork da conversa
2. Peça o refactor
3. Se ficar ruim: `/resume` volta pro branch anterior
4. Se ficar bom: segue. Depois `/compact` pra enxugar contexto

### 6.3 Session recovery após conexão cair
```bash
claude --continue       # volta pra sessão mais recente do diretório atual
claude -r <session-id>  # volta pra uma sessão específica
```
Ou dentro do Claude Code: `/resume` abre o picker.

### 6.4 Rodar typecheck + testes sem travar a sessão
1. `! pnpm typecheck` (bash mode)
2. `Ctrl+B` manda pro background
3. Continua conversando
4. `/tasks` pra ver status
5. Quando terminar, Claude lê o output automaticamente

### 6.5 Prompt longo com conforto de editor
1. `Ctrl+G` abre seu `$EDITOR` (vim, nvim, VS Code, etc.)
2. Escreve o prompt com syntax highlighting e multi-cursor
3. Salva e fecha — o prompt volta pro Claude Code

### 6.6 Quebrar prompt em várias linhas universal
Use `\` + `Enter` — funciona em **qualquer terminal** sem configuração. O `Shift+Enter` só funciona nativo em alguns (iTerm2, WezTerm, Ghostty, Kitty, Warp, Apple Terminal).

### 6.7 Review antes do commit
1. `/diff` abre o viewer interativo
2. `/security-review` analisa vulnerabilidades no diff
3. `/simplify` revisa qualidade em 3 agents paralelos

### 6.8 Matar tudo e começar do zero
- Response ruim no meio: `Esc` (para a geração) → reformula
- Quer desfazer várias ações: `Esc Esc` (rewind mode)
- Quer começar do zero: `/clear`
- Background agents descontrolados: `Ctrl+X Ctrl+K` (2x em 3s)

### 6.9 Perguntar algo rápido sem sujar contexto
`/btw qual era o nome daquele campo no schema?` — resposta efêmera em overlay, sem entrar no histórico.

### 6.10 Multi-sessão organizada
Abra 2-3 terminais, em cada um:
- `/color red` numa (ex: feature A)
- `/color blue` noutra (ex: bug fix)
- `/color green` numa de research

Prompt bar fica colorida, impossível confundir.

---

## 7. Observações sobre Windows/WSL e VS Code

Considerando que você roda em **Windows + WSL + VS Code**, pontos de atenção:

- **Option/Alt como Meta:** no Windows, `Alt+X` atalhos geralmente já funcionam sem config extra. No VS Code integrated terminal no Windows, também.
- **`Shift+Enter` no VS Code:** rode `/terminal-setup` uma vez dentro do VS Code integrated terminal. **Reinicie o VS Code depois** pra valer.
- **`/ide` no VS Code:** conecta com a extensão do Claude Code. Git diffs passam a abrir no VS Code (melhor que o diff do terminal).
- **WSL + background tasks:** o limite de 5GB de output **também vale**. Cuidado ao backgroundar um `pnpm dev` que loga bastante — pode ser terminado.
- **Permissions em `.claude/settings.local.json`:** esse arquivo é **por projeto**. Se você trabalha em monorepo (`gescorpGo`), revisa se as regras estão no nível certo (root vs. package).
- **MCP em WSL:** caminhos Linux (`/home/user/...`) vs Windows (`C:\Users\...`) confundem. Configura MCPs usando paths WSL sempre que possível.

---

## Referências

- [Claude Code — Interactive mode](https://code.claude.com/docs/en/interactive-mode)
- [Claude Code — Commands reference](https://code.claude.com/docs/en/commands)
- [Claude Code — CLI reference](https://code.claude.com/docs/en/cli-reference)
- [Claude Code — Keybindings](https://code.claude.com/docs/en/keybindings)
- [Claude Code — Skills](https://code.claude.com/docs/en/skills)
- [Claude Code — Checkpointing](https://code.claude.com/docs/en/checkpointing)
- [Claude Code — Permissions](https://code.claude.com/docs/en/permissions)
- [Claude Code — Environment variables](https://code.claude.com/docs/en/env-vars)

---

> **Dica final:** esse guia cobre o **built-in**. Skills que você instalar (ex: **Superpowers**) e plugins vão adicionar mais comandos em `/`. Rode `/skills` pra listar o que está ativo, e `/` sempre que quiser descobrir algo novo sem sair do Claude Code.