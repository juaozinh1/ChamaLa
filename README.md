# 🛠️ ServiçoJá — Conectando profissionais a quem precisa

**ServiçoJá** é uma proposta de aplicativo mobile que conecta clientes a profissionais de serviços gerais, facilitando a contratação de serviços residenciais de maneira prática, acessível e segura.

A plataforma permitirá que profissionais criem seus próprios perfis, cadastrem suas especialidades e passem por um processo de verificação. Os clientes poderão encontrar profissionais próximos à sua localização, consultar informações sobre suas qualificações, analisar avaliações e solicitar serviços para suas residências.

O objetivo é aproximar clientes e profissionais, ampliar a visibilidade dos prestadores de serviços e proporcionar uma experiência de contratação mais confiável.

---

## 🎯 Objetivo do projeto

Desenvolver uma plataforma mobile que simplifique a busca e a contratação de profissionais de serviços gerais, utilizando geolocalização, perfis verificados e avaliações para facilitar a conexão entre clientes e prestadores de serviços.

## 💡 Problema que queremos resolver

Encontrar profissionais de confiança para realizar serviços residenciais pode ser um processo demorado, especialmente quando não existem referências confiáveis ou informações suficientes para comparar as opções disponíveis.

O ServiçoJá busca solucionar esse problema por meio de uma plataforma que centraliza a busca por profissionais, facilita o contato entre as partes e oferece recursos para aumentar a transparência e a confiança durante a contratação.

---

## ✨ Funcionalidades planejadas

### 👤 Para clientes

* Cadastro e autenticação de usuários.
* Criação e gerenciamento do perfil.
* Busca por profissionais de acordo com a categoria do serviço.
* Localização de profissionais próximos à residência.
* Visualização de perfis, especialidades e avaliações.
* Solicitação e acompanhamento de serviços.
* Histórico de contratações.
* Avaliação dos profissionais após a conclusão do serviço.

### 🔧 Para profissionais

* Cadastro e gerenciamento de conta profissional.
* Cadastro de especialidades e experiência.
* Envio de documentos para verificação.
* Acompanhamento do status de verificação.
* Definição de disponibilidade para atendimento.
* Recebimento, aceitação e recusa de solicitações.
* Gerenciamento dos serviços contratados.
* Visualização das avaliações recebidas.

### 🛡️ Para a administração da plataforma

* Análise dos cadastros profissionais.
* Verificação de documentos e qualificações, conforme os critérios de cada serviço.
* Gerenciamento de usuários e profissionais.
* Monitoramento de denúncias.
* Controle de suspensões e situações que exijam análise administrativa.

---

## 🧰 Tecnologias e ferramentas

O projeto foi planejado utilizando tecnologias voltadas ao desenvolvimento mobile, à construção de APIs REST e ao gerenciamento de dados relacionais.

### 📱 Frontend — Aplicativo mobile

| Tecnologia       | Finalidade                                                      |
| ---------------- | --------------------------------------------------------------- |
| React Native     | Desenvolvimento das interfaces mobile.                          |
| Expo             | Facilitar a configuração, a execução e os testes do aplicativo. |
| TypeScript       | Tipagem estática e maior organização do código.                 |
| React Navigation | Gerenciamento da navegação entre telas.                         |
| Axios            | Comunicação HTTP com o backend.                                 |

### ⚙️ Backend — API REST

| Tecnologia      | Finalidade                                  |
| --------------- | ------------------------------------------- |
| Java            | Implementação das regras de negócio.        |
| Spring Boot     | Desenvolvimento da aplicação backend.       |
| Spring Web      | Construção dos endpoints REST.              |
| Spring Security | Autenticação e controle de acesso.          |
| Spring Data JPA | Persistência e acesso aos dados.            |
| Hibernate       | Mapeamento objeto-relacional.               |
| Maven           | Gerenciamento de dependências e compilação. |
| JUnit e Mockito | Testes automatizados.                       |

### 🗄️ Banco de dados e geolocalização

| Tecnologia           | Finalidade                                                          |
| -------------------- | ------------------------------------------------------------------- |
| PostgreSQL           | Armazenamento e gerenciamento dos dados.                            |
| PostGIS              | Consultas geográficas e busca por proximidade.                      |
| Google Maps Platform | Recursos de mapas e localização, conforme a necessidade do projeto. |

### ☁️ Infraestrutura e ferramentas de desenvolvimento

| Tecnologia | Finalidade                                             |
| ---------- | ------------------------------------------------------ |
| Git        | Controle de versão.                                    |
| GitHub     | Hospedagem do código e colaboração.                    |
| Postman    | Testes e validação da API.                             |
| Docker     | Contêineres para o ambiente de desenvolvimento.        |
| AWS        | Possível infraestrutura de hospedagem e armazenamento. |

> **Observação:** as tecnologias acima representam a stack planejada para o projeto. A implementação e a integração de cada ferramenta ocorrerão durante o desenvolvimento.

---

## 🏗️ Arquitetura do sistema

O ServiçoJá será estruturado em três componentes principais:

**1. Aplicativo mobile**

Responsável pela interface dos clientes e profissionais, pela navegação entre telas e pelo envio de solicitações.

**2. Backend**

Responsável pela autenticação, aplicação das regras de negócio, gerenciamento dos usuários, verificação profissional, solicitações de serviços e avaliações.

**3. Banco de dados**

Responsável por armazenar as informações dos usuários, especialidades, profissionais, solicitações, avaliações e demais dados necessários ao funcionamento da plataforma.

### Fluxo simplificado

```text
┌──────────────────────────────┐
│        Aplicativo Mobile     │
│       React Native + Expo    │
└──────────────┬───────────────┘
               │
               │ Requisições HTTP
               ▼
┌──────────────────────────────┐
│          API REST            │
│          Spring Boot         │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│        Regras de Negócio     │
│  Autenticação e Serviços     │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│          PostgreSQL          │
│            PostGIS           │
└──────────────────────────────┘
```

---

## 📍 Busca por profissionais próximos

A geolocalização será um dos principais recursos do ServiçoJá.

A proposta é permitir que o cliente encontre profissionais que atendam à sua região, considerando critérios como:

* Categoria do serviço.
* Distância aproximada.
* Disponibilidade para atendimento.
* Situação da verificação profissional.
* Avaliações de outros clientes.

A busca geográfica será implementada no backend utilizando PostgreSQL com PostGIS.

O objetivo é tornar a busca mais eficiente e ajudar o cliente a encontrar profissionais compatíveis com suas necessidades.

---

## 🔐 Segurança e confiabilidade

Como a plataforma conectará pessoas para a realização de serviços residenciais, a segurança será considerada desde a arquitetura inicial.

Entre as medidas planejadas estão:

* Proteção de senhas por algoritmos apropriados de hash.
* Autenticação e autorização de usuários.
* Controle de acesso conforme o perfil da conta.
* Verificação dos dados e documentos profissionais.
* Proteção de informações pessoais e endereços.
* Avaliações vinculadas a serviços realizados.
* Mecanismos de denúncia e suspensão de contas.
* Tratamento adequado dos dados pessoais, em conformidade com a LGPD.

A verificação cadastral será combinada com avaliações e mecanismos de acompanhamento para promover maior confiança entre clientes e profissionais.

---

## 📂 Estrutura planejada do projeto

```text
servico-ja/
│
├── servico-ja-mobile/
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── navigation/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── contexts/
│   │   ├── types/
│   │   └── utils/
│   ├── assets/
│   └── package.json
│
├── servico-ja-backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
│
└── README.md
```

A estrutura poderá ser ajustada conforme a evolução da implementação.

---
## ⚙️ Como rodar o front-end

### Pré-requisitos
- Node.js (versão LTS)
- VS Code com as extensões **Prettier** e **ESLint**
- App **Expo Go** no celular (ou um emulador Android/iOS)

### Instalação
```bash
cd servico-ja-mobile
npm install
npx expo start
```
Escaneie o QR Code com o Expo Go para abrir o app.

### Padronização de código
O projeto usa **Prettier** (formatação) e **ESLint** (erros e boas práticas)
para que todo o time escreva código no mesmo estilo.

- As regras do Prettier ficam em `.prettierrc`. Não altere sem avisar o time.
- No VS Code, ative **Format On Save** e escolha **Prettier - Code formatter**
  como formatador padrão (`Ctrl + ,` e pesquise por essas opções).
- Formatar todo o código: `npx prettier --write src`
- Verificar erros: `npx expo lint`

### Arquivo `.npmrc`
Contém `legacy-peer-deps=true`, que evita o erro `ERESOLVE` do npm causado
por conflito de peer dependencies. Não remova.

### Fluxo de branches
- `master`: versão estável.
- `develop`: integração do time.
- Novas funcionalidades: `feature/nome-da-tarefa`, abertas a partir da `develop`.

## 🚀 Etapas de desenvolvimento

O desenvolvimento será organizado em etapas para permitir a evolução gradual do produto.

* [ ] Planejamento dos requisitos e prototipação das interfaces.
* [x] Configuração do ambiente de desenvolvimento.
* [ ] Modelagem e implementação do banco de dados.
* [ ] Desenvolvimento do backend e da API REST.
* [ ] Implementação do cadastro e da autenticação.
* [ ] Desenvolvimento dos perfis de clientes e profissionais.
* [ ] Implementação do processo de verificação profissional.
* [ ] Integração da geolocalização e busca por proximidade.
* [ ] Desenvolvimento das solicitações e do acompanhamento de serviços.
* [ ] Implementação das avaliações.
* [ ] Desenvolvimento do painel administrativo.
* [ ] Testes, correções e validação das funcionalidades.
* [ ] Preparação para implantação e publicação.

*O checklist será atualizado conforme as funcionalidades forem implementadas.*

---

## 🔮 Melhorias futuras

Após a implementação das funcionalidades essenciais, o projeto poderá evoluir com recursos adicionais, como:

* Chat entre clientes e profissionais.
* Notificações push.
* Integração com meios de pagamento.
* Agendamento de serviços.
* Histórico detalhado de atendimentos.
* Programa de reputação para profissionais.
* Painel de indicadores e métricas.
* Monitoramento e análise de desempenho da plataforma.

Esses recursos dependerão das necessidades identificadas durante o desenvolvimento e a validação do produto.

---

## 📚 Aprendizados e objetivos técnicos

O desenvolvimento do ServiçoJá tem como objetivo aplicar conhecimentos de Ciência da Computação em um projeto prático, envolvendo:

* Desenvolvimento de aplicações mobile.
* Programação orientada a objetos.
* Construção e integração de APIs REST.
* Modelagem de bancos de dados relacionais.
* Persistência de dados com JPA e Hibernate.
* Autenticação e autorização.
* Geolocalização e consultas espaciais.
* Testes de software.
* Controle de versão e organização de código.
* Conceitos de arquitetura de software e computação em nuvem.

---

## 👩‍💻 Sobre o projeto

O **ServiçoJá** é um projeto de desenvolvimento de software voltado à conexão entre clientes e profissionais de serviços gerais.

A proposta combina tecnologia, geolocalização e mecanismos de verificação para facilitar a contratação de serviços residenciais e ampliar a visibilidade dos profissionais.

**Status:** Em planejamento e desenvolvimento.

---

⭐ *ServiçoJá — Facilitando conexões, valorizando profissionais e aproximando soluções.*

