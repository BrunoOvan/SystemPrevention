# SystemPrevention

Sistema web para **prevenção, registro e análise de golpes financeiros**, desenvolvido utilizando **Java Spring Boot**, **PostgreSQL**, **JWT**, frontend web responsivo e integração com inteligência artificial.

O objetivo do projeto é permitir que usuários registrem tentativas de golpes, acompanhem suas denúncias por protocolo e visualizem informações preventivas sobre golpes financeiros comuns.

---

## Sobre o projeto

O **SystemPrevention** é uma aplicação voltada para a prevenção de golpes financeiros frequentemente sofridos por usuários.

A proposta do sistema é oferecer uma plataforma simples, acessível e organizada para registrar relatos de golpes, analisar informações, gerar protocolos e apresentar dados estatísticos que ajudem na conscientização e prevenção.

O sistema pode ser utilizado para registrar situações como:

- Falsa central de atendimento;
- Phishing por e-mail;
- SMS com link falso;
- WhatsApp clonado;
- Boleto falso;
- QR Code falso;
- Pix indevido;
- Falso funcionário de banco;
- Falso investimento;
- Falso empréstimo;
- Fraude com cartão;
- Falso comprovante;
- Links suspeitos;
- Tentativas de roubo de dados pessoais.

O projeto não representa nenhuma instituição financeira específica. A identidade visual utiliza tons de vermelho como inspiração visual, mas o sistema é independente e desenvolvido com finalidade acadêmica.

---

## Finalidade do sistema

A finalidade do **SystemPrevention** é ajudar na prevenção de golpes financeiros por meio da coleta, organização e análise de denúncias feitas pelos usuários.

Com os dados registrados, o sistema pode gerar informações úteis, como:

- Quais tipos de golpes são mais frequentes;
- Quais canais são mais utilizados pelos golpistas;
- Quantidade total de denúncias;
- Status das denúncias;
- Tendências de crescimento ou redução de golpes;
- Recomendações preventivas;
- Histórico de ocorrências registradas.

Essas informações podem auxiliar usuários, empresas, instituições e equipes de segurança a compreender melhor os riscos e criar ações preventivas contra fraudes financeiras.

---

## Funcionalidades principais

### Cadastro de usuários

O sistema permite que o usuário crie uma conta informando seus dados básicos.

Após o cadastro, o usuário poderá acessar áreas protegidas da aplicação.

---

### Login com autenticação JWT

O login é feito por meio de autenticação com **JWT**.

Após o usuário realizar login, o backend gera um token de acesso, que será utilizado nas requisições protegidas da API.

---

### Registro de denúncia

O usuário pode registrar uma tentativa de golpe informando detalhes como:

- Tipo de golpe;
- Canal de contato utilizado;
- Descrição do ocorrido;
- Informações relevantes para análise.

Após o registro, o sistema gera um **protocolo** para acompanhamento.

---

### Acompanhamento por protocolo

O usuário pode consultar uma denúncia utilizando o protocolo gerado no momento do registro.

Na consulta, o sistema pode exibir:

- Número do protocolo;
- Tipo de golpe;
- Canal de contato;
- Descrição da denúncia;
- Status;
- Resultado da análise;
- Data de registro.

---

### Dashboard de estatísticas

O sistema possui um dashboard com gráficos e indicadores sobre as denúncias registradas.

O dashboard apresenta informações como:

- Total de denúncias;
- Denúncias pendentes;
- Denúncias em análise;
- Denúncias concluídas;
- Tipos de golpes mais relatados;
- Canais de contato mais utilizados;
- Tendências por período.

---

### Assistente virtual

O sistema possui uma proposta de assistente virtual para auxiliar o usuário com dúvidas e orientações preventivas.

O assistente pode ajudar com:

- Dicas de segurança;
- Explicações sobre golpes financeiros;
- Orientações sobre links suspeitos;
- Cuidados com ligações falsas;
- Recomendações sobre Pix, boletos, cartões e contas bancárias.

---

## Tecnologias utilizadas

### Backend

<p>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" width="45" height="45" alt="Java"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" width="45" height="45" alt="Spring Boot"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/maven/maven-original.svg" width="45" height="45" alt="Maven"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="45" height="45" alt="PostgreSQL"/>
</p>

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT
- PostgreSQL
- Maven
- Lombok
- Bean Validation

---

### Frontend

<p>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="45" height="45" alt="HTML5"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="45" height="45" alt="CSS3"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="45" height="45" alt="JavaScript"/>
</p>

- HTML5
- CSS3
- JavaScript
- Chart.js
- Lucide Icons
- Layout responsivo
- Integração com API REST

---

### Banco de dados

<p>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="45" height="45" alt="PostgreSQL"/>
</p>

- PostgreSQL
- PgAdmin
- Spring Data JPA
- Carga inicial de dados com `DataLoader`

---

### Ferramentas de desenvolvimento

<p>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" width="45" height="45" alt="VS Code"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="45" height="45" alt="Git"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="45" height="45" alt="GitHub"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" width="45" height="45" alt="Postman"/>
</p>

- Visual Studio Code
- Git
- GitHub
- Postman
- PgAdmin

---

### Inteligência Artificial

🤖 **Groq API**

- Integração planejada com Groq
- Uso da IA para auxiliar na análise de relatos
- Classificação de possíveis golpes
- Apoio na geração de recomendações preventivas
- Assistente virtual para dúvidas sobre prevenção

---

### Deploy

🚀 **Render**

- Backend hospedado no Render
- Frontend hospedado em serviço web separado
- API REST consumida pelo frontend através do arquivo `api.js`

---

## Estrutura geral do projeto

```txt
SystemPrevention/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/systemprevention/
│   │   │   │       ├── controller/
│   │   │   │       ├── service/
│   │   │   │       ├── repository/
│   │   │   │       ├── model/
│   │   │   │       ├── dto/
│   │   │   │       ├── security/
│   │   │   │       └── config/
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   └── pom.xml
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── cadastro.html
│   ├── dashboard.html
│   ├── relatar.html
│   ├── acompanhar.html
│   ├── duvidas.html
│   ├── contato.html
│   ├── css/
│   └── js/
│
└── README.md
