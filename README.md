# ChamaLÁ — profissionais de confiança perto de você

Aplicativo que conecta clientes a profissionais de serviços gerais (eletricista, encanador,
faxina, pintura…). O cliente abre um pedido com local e horário, um profissional da região
aceita e, no fim, o cliente avalia o atendimento.

O projeto tem três partes, cada uma numa pasta:

| Pasta | O que é | Tecnologia |
| --- | --- | --- |
| `chamala-backend/` | API REST (o "servidor") | Java 21 + Spring Boot 3.4 + PostgreSQL/PostGIS |
| `chamala-mobile/` | App do cliente e do profissional | React Native + Expo 58 (roda no celular e no navegador) |
| `chamala-admin/` | Painel administrativo web (em construção) | React 19 + Vite + Tailwind |

O banco de dados fica no **Supabase** (PostgreSQL com PostGIS, na nuvem).

---

## Sumário

1. [Como as partes se conectam](#1-como-as-partes-se-conectam)
2. [O que instalar antes](#2-o-que-instalar-antes)
3. [Clonar o repositório](#3-clonar-o-repositório)
4. [Configurar o banco de dados](#4-configurar-o-banco-de-dados)
5. [Rodar a API](#5-rodar-a-api-chamala-backend)
6. [Rodar o app](#6-rodar-o-app-chamala-mobile)
7. [Rodar o painel admin](#7-rodar-o-painel-admin-chamala-admin)
8. [Primeiro uso: criar conta e testar](#8-primeiro-uso-criar-conta-e-testar)
9. [Resumo: rodar tudo de uma vez](#9-resumo-rodar-tudo-de-uma-vez)
10. [Portas, endereços e variáveis de ambiente](#10-portas-endereços-e-variáveis-de-ambiente)
11. [Testes e verificações (as mesmas do CI)](#11-testes-e-verificações-as-mesmas-do-ci)
12. [Banco local com Docker (opcional)](#12-banco-local-com-docker-opcional)
13. [Estrutura de pastas](#13-estrutura-de-pastas)
14. [Problemas comuns e soluções](#14-problemas-comuns-e-soluções)
15. [Fluxo de trabalho com Git](#15-fluxo-de-trabalho-com-git)
16. [Documentação do projeto](#16-documentação-do-projeto)

---

## 1. Como as partes se conectam

```text
 ┌────────────────────┐        ┌────────────────────┐
 │  App (Expo)        │        │  Painel admin      │
 │  celular, emulador │        │  navegador         │
 │  ou navegador      │        │  localhost:5173    │
 │  localhost:8082    │        │                    │
 └─────────┬──────────┘        └─────────┬──────────┘
           │  HTTP (JSON)                 │
           └──────────────┬───────────────┘
                          ▼
              ┌───────────────────────┐
              │  API Spring Boot      │
              │  localhost:8085       │
              └───────────┬───────────┘
                          │  JDBC (SSL)
                          ▼
              ┌───────────────────────┐
              │  Supabase             │
              │  PostgreSQL + PostGIS │
              └───────────────────────┘
```

**A ordem importa:** primeiro a API (ela precisa do banco), depois o app e o painel (eles
precisam da API). O app e o painel abrem sem a API, mas login, cadastro e pedidos falham.

---

## 2. O que instalar antes

| Programa | Versão | Para quê | Como conferir |
| --- | --- | --- | --- |
| [Git](https://git-scm.com/downloads) | qualquer recente | baixar o código | `git --version` |
| [Node.js](https://nodejs.org/) | **22 LTS** (o CI usa 22; 24 também funciona) | app e painel | `node --version` |
| npm | vem com o Node | instalar pacotes | `npm --version` |
| [JDK](https://adoptium.net/) | **21 ou mais novo** (o projeto compila para 21; o CI usa 25) | API | `java -version` |
| [Maven](https://maven.apache.org/download.cgi) | 3.9+ — **opcional**, o projeto traz um Maven Wrapper | API | `mvn -v` |
| [Expo Go](https://expo.dev/go) | versão da loja | abrir o app num celular físico | — |
| [Android Studio](https://developer.android.com/studio) | opcional | emulador Android | — |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | opcional | testes do backend e banco local | `docker version` |

> **Windows:** depois de instalar o JDK, confira se a variável `JAVA_HOME` aponta para ele
> (o instalador da Adoptium tem a opção "Set JAVA_HOME"). Feche e abra o terminal depois de
> instalar qualquer coisa, para ele enxergar os programas novos.

---

## 3. Clonar o repositório

```bash
git clone https://github.com/juaozinh1/ChamaLa.git
```

```bash
cd ChamaLa
```

Confira se as três pastas vieram:

```bash
ls
```

Você deve ver `chamala-backend`, `chamala-mobile`, `chamala-admin`, `docs` e este `README.md`.

> Existe também um repositório de backup em `https://github.com/diasDev09/chamaLa.git`.
> Para clonar dele, troque o endereço no `git clone`.

---

## 4. Configurar o banco de dados

O banco é o PostgreSQL do Supabase. **A senha não fica no código**: ela vai num arquivo
`chamala-backend/.env`, que o Git ignora e que cada pessoa cria na própria máquina.

### 4.1 Pegue os dados de conexão

Peça a quem administra o projeto no Supabase, ou, se você tem acesso ao painel:

1. Abra o projeto em <https://supabase.com/dashboard>.
2. Clique em **Connect** (ou **Project Settings → Database**).
3. Escolha **Session pooler** e o formato **JDBC**.
4. Anote o **host** (algo como `aws-1-us-west-2.pooler.supabase.com`), o **usuário**
   (`postgres.<id-do-projeto>`) e a **senha do banco**.

### 4.2 Crie o arquivo `.env` da API

Na pasta `chamala-backend`, copie o modelo:

**Windows (PowerShell ou CMD):**

```bash
copy chamala-backend\.env.example chamala-backend\.env
```

**macOS / Linux / Git Bash:**

```bash
cp chamala-backend/.env.example chamala-backend/.env
```

Abra `chamala-backend/.env` num editor e preencha:

```properties
DB_URL=jdbc:postgresql://aws-1-us-west-2.pooler.supabase.com:5432/postgres?sslmode=require
DB_USER=postgres.<id-do-projeto>
DB_PASSWORD=<senha-do-banco>
PORT=8085
FLYWAY_ENABLED=false
```

| Variável | O que é |
| --- | --- |
| `DB_URL` | Endereço JDBC do banco. Mantenha o `?sslmode=require` no final. |
| `DB_USER` | Usuário do banco no Supabase. |
| `DB_PASSWORD` | Senha do banco. **Nunca faça commit deste arquivo.** |
| `PORT` | Porta da API. O app e o painel esperam `8085`. |
| `FLYWAY_ENABLED` | Deixe `false` no Supabase: as tabelas já existem lá. Use `true` só num banco vazio (ver [seção 12](#12-banco-local-com-docker-opcional)). |

> O `.env` só é lido quando a API roda **de dentro da pasta `chamala-backend`**. Se você
> rodar de outra pasta (por exemplo, pela IDE com o diretório errado), a API ignora o arquivo
> e tenta conectar num banco local que provavelmente não existe.

---

## 5. Rodar a API (`chamala-backend`)

Abra um terminal **só para a API** e entre na pasta:

```bash
cd chamala-backend
```

### 5.1 Inicie a API

Com o Maven instalado:

```bash
mvn spring-boot:run
```

Sem o Maven, use o wrapper que vem no projeto (ele baixa o Maven sozinho na primeira vez).
**Windows (CMD/PowerShell):**

```bash
.mvn\mvnw.cmd spring-boot:run
```

**macOS / Linux / Git Bash:**

```bash
sh .mvn/mvnw spring-boot:run
```

A primeira execução baixa as dependências e pode levar alguns minutos. A API está pronta
quando aparecer no terminal:

```text
Tomcat started on port 8085 (http) with context path '/'
Started ChamaLaApplication in ... seconds
```

**Deixe esse terminal aberto.** Fechar o terminal desliga a API. Para parar, use `Ctrl + C`.

### 5.2 Confira se está funcionando

Em outro terminal (ou no navegador), acesse a lista de categorias:

```bash
curl http://localhost:8085/api/v1/categories
```

A resposta deve ser uma lista em JSON, começando com
`[{"id":1,"name":"Geral",...`. No navegador, abra também a documentação interativa da API:

- Swagger UI: <http://localhost:8085/swagger-ui.html>

### 5.3 Rotas principais

| Método | Rota | Para quê |
| --- | --- | --- |
| `GET` | `/api/v1/categories` | Lista as categorias de serviço |
| `POST` | `/api/v1/auth/register/client` | Cadastro de cliente |
| `POST` | `/api/v1/auth/register/professional` | Cadastro de profissional |
| `POST` | `/api/v1/auth/login` | Login |
| `GET` / `PUT` | `/api/v1/users/{id}` | Ver e atualizar a própria conta |
| `POST` | `/api/v1/orders` | Criar pedido |
| `GET` | `/api/v1/orders/client` | Pedidos do cliente |
| `GET` | `/api/v1/orders/nearby` | Pedidos abertos perto do profissional |
| `POST` | `/api/v1/orders/{id}/accept` e `/complete` | Aceitar e concluir pedido |
| `POST` | `/api/v1/reviews` | Avaliar um atendimento |

> Ainda não há autenticação por token (JWT): a API aceita qualquer requisição. Não exponha
> a API na internet como está.

---

## 6. Rodar o app (`chamala-mobile`)

Abra **outro** terminal (a API continua rodando no primeiro):

```bash
cd chamala-mobile
```

### 6.1 Instale as dependências

```bash
npm install
```

Rode de novo sempre que fizer `git pull` e o `package.json` tiver mudado. O projeto já traz
um `.npmrc` com `legacy-peer-deps`, então não precisa de flags extras.

### 6.2 Crie o `.env` do app

**Windows:**

```bash
copy .env.example .env
```

**macOS / Linux / Git Bash:**

```bash
cp .env.example .env
```

O `.env` tem uma única variável, `EXPO_PUBLIC_API_URL`, que diz ao app **onde está a API**
quando ele roda no celular ou no emulador. O valor depende de onde você vai abrir o app:

| Onde o app roda | Valor de `EXPO_PUBLIC_API_URL` |
| --- | --- |
| Navegador do PC | (ignorado — o app usa `http://localhost:8085` sozinho) |
| Emulador Android | `http://10.0.2.2:8085` (já é o padrão do modelo) |
| Celular físico com Expo Go | `http://<IP do seu PC>:8085`, ex.: `http://192.168.0.10:8085` |

**Como descobrir o IP do seu PC na rede:**

- Windows: rode `ipconfig` e procure **Endereço IPv4** do adaptador Wi-Fi (ex.: `192.168.0.10`).
- macOS: `ipconfig getifaddr en0`
- Linux: `hostname -I`

> Mudou o `.env`? Pare o Expo (`Ctrl + C`) e inicie de novo: as variáveis só são lidas
> quando ele começa.

### 6.3 Escolha onde abrir o app

**Opção A — no navegador do PC (o jeito mais rápido de testar):**

```bash
npm run web
```

O app abre em <http://localhost:8082>. Dica: no navegador, aperte `F12` e ative a visão de
celular (ícone de celular/tablet) para ver o app no tamanho de um telefone.

**Opção B — no celular físico (Expo Go):**

```bash
npm start
```

1. Instale o **Expo Go** no celular (Play Store ou App Store).
2. O celular e o PC precisam estar **na mesma rede Wi-Fi**.
3. Escaneie o QR code que aparece no terminal (Android: pelo Expo Go; iPhone: pela câmera).
4. Confira se o `.env` tem o IP do PC (ver tabela acima).

**Opção C — no emulador Android:**

1. Abra um emulador pelo Android Studio (**Device Manager → ▶**).
2. Rode:

```bash
npm run android
```

### 6.4 Comandos úteis do app

| Comando | O que faz |
| --- | --- |
| `npm start` | Inicia o Expo (porta 8082) e mostra o QR code |
| `npm run web` | Abre o app no navegador |
| `npm run android` | Abre no emulador ou celular Android conectado |
| `npx expo start -c` | Inicia limpando o cache (use quando algo "estranho" acontecer) |
| `npx tsc --noEmit` | Confere os tipos do TypeScript |
| `npm run lint` | Roda o ESLint |
| `npm run api:types` | Regera `src/types/api.ts` a partir do contrato da API |

---

## 7. Rodar o painel admin (`chamala-admin`)

Em mais um terminal:

```bash
cd chamala-admin
```

```bash
npm install
```

Crie o `.env` (Windows: `copy .env.example .env`; macOS/Linux: `cp .env.example .env`). Ele
tem uma variável:

```properties
VITE_API_URL=http://localhost:8085
```

Inicie:

```bash
npm run dev
```

O painel abre em <http://localhost:5173>. Hoje ele tem só o login e o layout; as telas de
gestão ainda estão em construção.

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento (porta 5173) |
| `npm run build` | Gera a versão de produção em `dist/` |
| `npm run lint` | Roda o oxlint |
| `npm run preview` | Serve o `dist/` gerado, para conferir o build |

---

## 8. Primeiro uso: criar conta e testar

Com a API e o app rodando:

1. Na tela de login, toque em **Preciso de um serviço** e preencha o cadastro de cliente.
   Os campos com `*` são obrigatórios; se faltar algo, o campo fica vermelho e um aviso
   aparece no topo.
2. Depois de **Cadastro concluído**, toque em **Ir para o login** e entre com o e-mail e a
   senha que você criou.
3. Na tela inicial do cliente, toque em **+ Novo Pedido**: escolha a categoria, a data
   (dia útil, `DD/MM/AAAA`), o horário (entre 08:00 e 18:00), a descrição e **toque no mapa**
   para marcar o local.
4. Para testar o lado do profissional, saia da conta (avatar no topo → **Sair da conta**) e
   crie uma conta em **Sou profissional**. O pedido aberto aparece em **Disponíveis**.
5. O avatar no topo das telas iniciais abre **Minha conta**, onde dá para mudar nome,
   telefone e senha.

> Tudo o que você cria vai para o banco de verdade do Supabase. Use e-mails de teste
> (ex.: `seu.nome+teste1@gmail.com`) para não misturar com dados reais.

---

## 9. Resumo: rodar tudo de uma vez

Três terminais, nesta ordem:

| Terminal | Pasta | Comando | Pronto quando… |
| --- | --- | --- | --- |
| 1 | `chamala-backend` | `mvn spring-boot:run` | aparece `Started ChamaLaApplication` |
| 2 | `chamala-mobile` | `npm run web` (ou `npm start`) | o navegador abre em `localhost:8082` |
| 3 | `chamala-admin` | `npm run dev` | aparece `Local: http://localhost:5173/` |

Antes da primeira vez: `.env` da API preenchido ([seção 4](#4-configurar-o-banco-de-dados)),
`npm install` no app e no painel, e os `.env` deles copiados dos modelos.

---

## 10. Portas, endereços e variáveis de ambiente

### Portas

| Serviço | Porta | Endereço |
| --- | --- | --- |
| API | 8085 | <http://localhost:8085> · Swagger em `/swagger-ui.html` |
| App (Expo) | 8082 | <http://localhost:8082> |
| Painel admin | 5173 | <http://localhost:5173> |
| PostGIS local (opcional) | 5432 | `localhost:5432`, banco `chamala` |

### Variáveis de ambiente

| Arquivo | Variável | Padrão | Observação |
| --- | --- | --- | --- |
| `chamala-backend/.env` | `DB_URL` | `jdbc:postgresql://localhost:5432/chamala` | Sem ela, a API procura o PostGIS local |
| | `DB_USER` | `chamala` | |
| | `DB_PASSWORD` | `chamala` | Use a do Supabase |
| | `PORT` | `8085` | |
| | `FLYWAY_ENABLED` | `false` | `true` só em banco vazio |
| `chamala-mobile/.env` | `EXPO_PUBLIC_API_URL` | `http://10.0.2.2:8085` | Ignorado no navegador |
| `chamala-admin/.env` | `VITE_API_URL` | `http://localhost:8085` | Sem `/api/v1` no final |

Os três `.env` são ignorados pelo Git. **Nunca coloque senhas em arquivos versionados** —
use sempre o `.env`.

### Quem pode chamar a API (CORS)

A API aceita requisições de `http://localhost:*`, `http://127.0.0.1:*`, `http://10.0.2.2:*` e
`http://192.168.*.*:*`. Se a sua rede usa outra faixa (ex.: `10.0.x.x`), adicione-a em
`chamala-backend/src/main/java/br/com/chamala/config/SecurityConfig.java`.

---

## 11. Testes e verificações (as mesmas do CI)

O GitHub Actions (`.github/workflows/ci.yml`) roda estas verificações em todo pull request.
Rode antes de abrir o seu:

**API:**

```bash
cd chamala-backend
```

```bash
mvn -B verify
```

> Os testes do backend sobem um PostGIS temporário com **Testcontainers**, então precisam do
> **Docker rodando**. Sem Docker, use `mvn -B test-compile` para pelo menos conferir se compila.

**App:**

```bash
cd chamala-mobile
```

```bash
npm ci
```

```bash
npx tsc --noEmit
```

```bash
npx expo lint
```

**Painel:**

```bash
cd chamala-admin
```

```bash
npm ci
```

```bash
npm run lint
```

```bash
npm run build
```

**Contrato da API (OpenAPI):**

```bash
npx -y @redocly/cli lint chamala-backend/api/openapi.yaml --config chamala-backend/api/redocly.yaml
```

> Se o `npm ci` reclamar que o `package-lock.json` está fora de sincronia, rode `npm install`
> e faça commit do `package-lock.json` atualizado.

---

## 12. Banco local com Docker (opcional)

Para trabalhar sem internet ou testar migrações sem mexer no Supabase:

1. Abra o Docker Desktop e espere ele ficar "running".
2. Na raiz do projeto, suba só o banco:

```bash
docker compose up -d db
```

3. No `chamala-backend/.env`, **apague** as linhas `DB_URL`, `DB_USER` e `DB_PASSWORD` e
   coloque `FLYWAY_ENABLED=true`. A API passa a usar `localhost:5432/chamala` e o Flyway
   cria todas as tabelas e as categorias na primeira execução.
4. Rode a API normalmente ([seção 5](#5-rodar-a-api-chamala-backend)).

Para subir banco **e** API juntos em containers (API em `localhost:8085`):

```bash
docker compose up -d --build
```

Para desligar:

```bash
docker compose down
```

As migrações ficam em `chamala-backend/src/main/resources/db/migration/` e espelham o schema
do Supabase. **Toda mudança feita direto no Supabase precisa virar uma migração nova**
(`V3__...sql`, `V4__...sql`), senão o banco local e os testes deixam de bater com o real.

---

## 13. Estrutura de pastas

```text
ChamaLa/
├── chamala-backend/                API Spring Boot
│   ├── .env.example                modelo das variáveis do banco
│   ├── .mvn/mvnw, mvnw.cmd         Maven Wrapper
│   ├── api/openapi.yaml            contrato da API
│   ├── pom.xml
│   └── src/main/
│       ├── java/br/com/chamala/
│       │   ├── auth/               login e cadastros
│       │   ├── category/           categorias de serviço
│       │   ├── config/             segurança, CORS e tratamento de erros
│       │   ├── order/              pedidos (inclui busca por distância)
│       │   ├── review/             avaliações
│       │   └── user/               conta do usuário (Minha conta)
│       └── resources/
│           ├── application.yml     configuração (lê o .env)
│           └── db/migration/       migrações Flyway (V1 schema, V2 categorias)
├── chamala-mobile/                 App Expo
│   ├── App.tsx                     navegação entre as telas
│   ├── .env.example
│   └── src/
│       ├── components/             botões, campos, cards, toast, folhas, cabeçalho…
│       ├── hooks/                  lógica de formulários
│       ├── screens/                Login, Cadastros, Home, Novo pedido, Minha conta
│       ├── services/api.ts         cliente HTTP (endereço da API)
│       └── theme/                  cores, espaçamentos, cantos e sombras
├── chamala-admin/                  Painel web (Vite)
├── docs/                           Fase 1, roadmap, documentação da API e mapa do código
├── docker-compose.yml              PostGIS local opcional (+ API em container)
└── .github/workflows/ci.yml        CI: lint, tipos, build e testes
```

---

## 14. Problemas comuns e soluções

**A API não sobe: `password authentication failed` ou `Connection refused`**
O `.env` está faltando, com valores errados ou a API foi iniciada fora da pasta
`chamala-backend`. Confira a [seção 4](#4-configurar-o-banco-de-dados) e rode o comando de
dentro de `chamala-backend`.

**A API não sobe: `Schema-validation: missing column` / `missing table`**
O banco não tem as tabelas que o código espera. No Supabase, peça a quem administra o banco
para aplicar a migração que falta. Num banco local, use `FLYWAY_ENABLED=true`.

**`Port 8085 was already in use`**
Outra API já está rodando (às vezes num terminal esquecido). Feche-a, ou encontre o processo:
Windows: `netstat -ano | findstr :8085` e depois `taskkill /PID <número> /F`;
macOS/Linux: `lsof -i :8085` e depois `kill <PID>`.

**`JAVA_HOME is not set` ou `release version 21 not supported`**
O JDK não está instalado, é antigo ou o terminal não o encontra. Instale o JDK 21+, configure
o `JAVA_HOME` e abra um terminal novo.

**Expo: `PluginError: Failed to resolve plugin for module "expo-splash-screen"`**
As dependências estão desatualizadas. Rode `npm install` dentro de `chamala-mobile`.

**O app abre, mas login e cadastro dão erro de conexão**
A API não está rodando ou o app procura no endereço errado. Confira o terminal da API e o
`EXPO_PUBLIC_API_URL` (no celular físico, precisa ser o IP do PC, não `localhost`).

**No celular físico o app não alcança a API (funciona no navegador)**
1. Celular e PC na mesma rede Wi-Fi (redes de visitantes costumam bloquear isso).
2. O `.env` do app com o IP do PC e o Expo reiniciado depois da mudança.
3. O firewall do Windows liberando a porta 8085: ao iniciar a API pela primeira vez, aceite
   o aviso do Windows para **redes privadas**, ou libere a porta em
   **Firewall do Windows → Configurações avançadas → Regras de entrada**.
4. Teste no navegador do celular: `http://<IP do PC>:8085/api/v1/categories` deve mostrar o JSON.

**Erro de CORS no navegador (`blocked by CORS policy`)**
O endereço de onde o app está sendo aberto não está na lista da [seção 10](#quem-pode-chamar-a-api-cors).

**`mvn verify` falha com `Could not find a valid Docker environment`**
Os testes precisam do Docker rodando. Abra o Docker Desktop e espere ficar "running", ou use
`mvn -B test-compile` só para conferir se compila.

**Mudei o `.env` e nada mudou**
Toda mudança em `.env` exige reiniciar o programa correspondente (API, Expo ou Vite).

---

## 15. Fluxo de trabalho com Git

1. Atualize a sua `main` antes de começar:

```bash
git switch main
```

```bash
git pull
```

2. Crie um branch para a tarefa:

```bash
git switch -c feat/nome-da-tarefa
```

   Use `feat/` para funcionalidades, `fix/` para correções e `docs/` para documentação.

3. Faça commits pequenos, com mensagens em português que digam **o que** mudou e **por quê**.
4. Rode as verificações da [seção 11](#11-testes-e-verificações-as-mesmas-do-ci).
5. Envie e abra um pull request para a `main`:

```bash
git push -u origin feat/nome-da-tarefa
```

Padronização: Prettier + ESLint no app (`npx prettier --write src`, `npx expo lint`); oxlint
no painel.

---

## 16. Documentação do projeto

- Fase 1 (especificação): [docs/FASE-1.md](docs/FASE-1.md)
- Roadmap: [docs/ROADMAP.md](docs/ROADMAP.md) ·
  [documento online](https://claude.ai/artifact/KN951Y9nJSrGcNpc25ZUy2)
- Contrato da API: `chamala-backend/api/openapi.yaml` (versão navegável em
  `docs/api/index.html`)
- Tipos TypeScript gerados do contrato: `src/types/api.ts` no app e no painel
  (`npm run api:types` para regerar)
- Telas no Figma: <https://www.figma.com/design/9ZR33gdjklJZ88JHpqy2pL>
- Termos de uso e contrato padrão v1 (rascunho para advogado):
  <https://claude.ai/artifact/7FkssxCrEBKv5ajs9g6Lww>

### Próximos passos

- [ ] Ligar a autenticação por token (JWT) e proteger as rotas da API.
- [ ] Revisão jurídica dos termos, principalmente o direito de arrependimento (CDC, art. 49).
- [ ] Telas de gestão do painel admin.
- [ ] Trocar os filtros de categoria fixos da tela inicial do cliente pelas categorias do banco.
