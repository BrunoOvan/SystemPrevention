# SystemPrevention

Sistema web para **prevenção, registro e análise de golpes financeiros**, desenvolvido utilizando **Java Spring Boot**, **PostgreSQL**, **JWT**, frontend web e integração com inteligência artificial.

O objetivo principal do sistema é permitir que usuários registrem tentativas de golpes, acompanhem suas denúncias por protocolo e tenham acesso a informações preventivas sobre golpes financeiros comuns, como falsa central de atendimento, phishing, links suspeitos, boletos falsos, QR Code falso, golpes via WhatsApp, fraudes com cartão, falso empréstimo, Pix indevido e outros tipos de fraudes bancárias.

---

## Sobre o projeto

O **SystemPrevention** foi desenvolvido com foco em golpes financeiros frequentemente sofridos por usuários. A proposta é oferecer uma plataforma simples, acessível e organizada para:

- Registrar relatos de tentativas de golpes;
- Consultar denúncias por protocolo;
- Exibir status da análise da denúncia;
- Apresentar estatísticas sobre os tipos de golpes mais relatados;
- Auxiliar usuários com dicas de prevenção;
- Utilizar inteligência artificial para apoiar a classificação e análise dos relatos.

O sistema não representa nenhuma instituição financeira específica. A identidade visual utiliza tons de vermelho como inspiração visual, mas o projeto é independente e acadêmico.

---

## Finalidade do sistema

A finalidade do **SystemPrevention** é ajudar na prevenção de golpes financeiros por meio da coleta, organização e análise de denúncias feitas pelos usuários.

Com os dados registrados, o sistema pode gerar informações úteis, como:

- Quais tipos de golpes estão ocorrendo com mais frequência;
- Quais canais são mais utilizados pelos golpistas, como SMS, ligação, WhatsApp e e-mail;
- Quantidade de denúncias registradas;
- Status das denúncias;
- Tendências e padrões de golpes;
- Recomendações preventivas para os usuários.

Essas informações podem ajudar tanto os usuários quanto empresas, instituições ou equipes de segurança a entender melhor os riscos e criar ações preventivas.

---

## Funcionalidades principais

### Cadastro e login de usuários

O sistema permite que o usuário crie uma conta e faça login para acessar as funcionalidades protegidas.

A autenticação é feita com **JWT**, garantindo maior segurança no acesso às rotas privadas.

---

### Registro de denúncia

O usuário pode relatar uma tentativa de golpe informando dados como:

- Tipo de golpe;
- Canal de contato utilizado;
- Descrição do ocorrido;
- Informações relevantes para análise.

Após o registro, o sistema gera um **protocolo**, que poderá ser usado para acompanhar a denúncia.

---

### Acompanhamento por protocolo

O usuário pode consultar uma denúncia utilizando o número de protocolo gerado no momento do registro.

Nessa tela, é possível visualizar informações como:

- Protocolo;
- Tipo de golpe;
- Canal de contato;
- Status da denúncia;
- Resultado da análise;
- Data de registro.

---

### Dashboard de estatísticas

O sistema possui uma tela de estatísticas com gráficos e indicadores sobre as denúncias registradas.

O dashboard apresenta informações como:

- Total de denúncias;
- Denúncias concluídas;
- Denúncias em análise;
- Tipos de golpes mais frequentes;
- Canais de contato mais utilizados;
- Tendência de registros por período.

---

### Assistente virtual

O sistema também possui uma área de dúvidas e prevenção, onde o usuário pode consultar orientações sobre golpes financeiros.

A proposta do assistente é ajudar o usuário com:

- Dicas de segurança;
- Explicações sobre golpes;
- Orientações sobre links suspeitos;
- Cuidados com ligações falsas;
- Recomendações sobre Pix, boletos, cartões e contas bancárias.

---

## Tecnologias utilizadas

### Backend

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

- HTML5
- CSS3
- JavaScript
- Chart.js
- Lucide Icons
- Layout responsivo
- Integração com API REST

---

### Banco de dados

- PostgreSQL
- PgAdmin para administração do banco
- Dados iniciais inseridos por carga automática com `DataLoader`

---

### Inteligência Artificial

- Integração planejada com Groq
- Uso da IA para auxiliar na análise de relatos
- Classificação de possíveis golpes
- Apoio na geração de recomendações preventivas

---

### Deploy

- Backend hospedado no Render
- Frontend hospedado em serviço web separado
- API REST consumida pelo frontend via arquivo `api.js`

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
│   │   │       ├── application.properties
│   │   │       └── data loader
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
