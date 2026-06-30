<div align="center">

# 🍔 FoodSnap

### Rede Social para apaixonados por gastronomia

🌐 **Acesse a aplicação:**  
## [https://rede-social-foodsnap.vercel.app](https://rede-social-food-snap.vercel.app)

Compartilhe experiências, descubra novos restaurantes, publique fotos e vídeos, acompanhe estabelecimentos e encontre os melhores lugares para comer.

![Vue](https://img.shields.io/badge/Vue.js-3.5-42b883?style=for-the-badge&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql)
![Vercel](https://img.shields.io/badge/Vercel-Frontend-black?style=for-the-badge&logo=vercel)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=for-the-badge)

</div>

---

# 📖 Sobre o projeto

O **FoodSnap** é uma rede social voltada exclusivamente para o universo gastronômico.

O objetivo é conectar pessoas através da comida, permitindo que usuários compartilhem experiências em restaurantes, publiquem fotos e vídeos de pratos, descubram novos estabelecimentos e interajam com outros apaixonados por gastronomia.

Diferente das redes sociais tradicionais, o FoodSnap foi pensado especificamente para avaliação gastronômica, divulgação de restaurantes e criação de comunidades locais.

---

# 🚀 Funcionalidades

## 👤 Usuários

- Cadastro
- Login
- Perfil
- Avatar
- Cidade
- Alteração de dados
- Exclusão de conta

---

## 🍽️ Restaurantes

- Cadastro de estabelecimento
- Perfil comercial
- Informações completas
- Categoria
- Endereço
- Horário de funcionamento
- Contato

---

## 📷 Publicações

- Fotos
- Vídeos
- Texto
- Localização
- Categoria
- Curtidas
- Comentários

---

## ❤️ Interações

- Curtir publicações
- Comentar
- Seguir usuários
- Seguir restaurantes
- Salvar postagens

---

## 🎟️ Cupons

- Cadastro de cupons
- Divulgação de promoções
- Controle de validade
- Resgate pelo usuário

---

## 🔔 Notificações

- Novos seguidores
- Curtidas
- Comentários
- Cupons publicados

---

# 🏗 Arquitetura

O projeto foi dividido em Front-end e Back-end.

```
FoodSnap
│
├── frontend/
│   ├── Vue
│   ├── TypeScript
│   ├── Pinia
│   ├── Vue Router
│   └── Axios
│
├── backend/
│   ├── Node.js
│   ├── Express
│   ├── Prisma ORM
│   ├── PostgreSQL
│   └── JWT
│
└── database/
    └── PostgreSQL (Supabase)
```

---

# 🖥️ Tecnologias utilizadas

## Front-end

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Axios

---

## Back-end

- Node.js
- Express
- TypeScript
- Prisma ORM
- JWT
- Bcrypt

---

## Banco de Dados

- PostgreSQL
- Supabase

---

## Deploy

Frontend

- Vercel

Backend

- Render

Banco

- Supabase

---

# 📂 Estrutura do projeto

```
FoodSnap
│
├── frontend
│   ├── src
│   │
│   ├── components
│   ├── pages
│   ├── router
│   ├── services
│   ├── stores
│   ├── types
│   └── assets
│
├── backend
│   ├── src
│   │
│   ├── controllers
│   ├── repositories
│   ├── routes
│   ├── middlewares
│   ├── prisma
│   ├── services
│   ├── utils
│   └── types
│
└── README.md
```

---

# 🗄️ Banco de Dados

Principais entidades:

- Usuário
- Restaurante
- Publicação
- Comentário
- Curtida
- Seguidor
- Cupom
- Notificação
- Categoria
- Mídia

---

# 🔐 Autenticação

O sistema utiliza:

- JWT
- Hash de senhas com Bcrypt
- Middleware de autenticação
- Rotas protegidas

---

# 📡 API

Alguns endpoints disponíveis:

## Usuários

```
POST /users
POST /login
GET /users/:id
PUT /users/:id
DELETE /users/:id
```

---

## Restaurantes

```
POST /business
GET /business
GET /business/:id
PUT /business/:id
DELETE /business/:id
```

---

## Posts

```
POST /posts
GET /posts
GET /posts/:id
PUT /posts/:id
DELETE /posts/:id
```

---

## Curtidas

```
POST /likes
DELETE /likes/:id
```

---

## Comentários

```
POST /comments
GET /comments
DELETE /comments/:id
```

---

## Seguidores

```
POST /follow
DELETE /follow
```

---

## Cupons

```
POST /coupons
GET /coupons
PUT /coupons/:id
DELETE /coupons/:id
```

---

# ⚙️ Instalação

## Clone o projeto

```bash
git clone https://github.com/PedroGiffoni/Rede-Social-FoodSnap.git
```

---

## Entre na pasta

```bash
cd Rede-Social-FoodSnap
```

---

## Backend

```bash
cd backend
```

Instale as dependências

```bash
npm install
```

Configure o arquivo

```
.env
```

Exemplo

```env
DATABASE_URL=
JWT_SECRET=
PORT=3333
```

Execute

```bash
npm run dev
```

---

## Frontend

```bash
cd frontend
```

Instale

```bash
npm install
```

Configure

```
.env
```

```env
VITE_API_URL=http://localhost:3333
```

Execute

```bash
npm run dev
```

---

# 🌐 Deploy

## Front-end

Vercel

```
https://vercel.com
```

---

## Back-end

Render

```
https://render.com
```

---

## Banco

Supabase

```
https://supabase.com
```

---

# 📸 Principais telas

- Login
- Cadastro
- Feed
- Perfil
- Restaurante
- Publicação
- Comentários
- Cupons
- Busca

---

# 📈 Próximas funcionalidades

- Chat entre usuários
- Stories
- Sistema de avaliações
- Ranking de restaurantes
- Geolocalização
- Busca inteligente
- Recomendações utilizando IA
- Feed personalizado
- Push Notifications
- Compartilhamento de localização
- Dashboard administrativo
- Painel para restaurantes
- Sistema de anúncios patrocinados

---

# 💡 Aprendizados

Durante o desenvolvimento deste projeto foram aplicados conceitos importantes de desenvolvimento Full Stack, como:

- Arquitetura em camadas
- APIs REST
- CRUD completo
- Autenticação JWT
- ORM com Prisma
- Banco PostgreSQL
- Deploy em nuvem
- Versionamento com Git/GitHub
- Consumo de APIs
- Componentização com Vue
- Gerenciamento de estado com Pinia

---

# 👨‍💻 Autor

## Pedro Toni Melo Giffoni

Fotógrafo, desenvolvedor Full Stack em formação e estudante de Análise e Desenvolvimento de Sistemas.

- GitHub: https://github.com/PedroGiffoni
- LinkedIn: https://www.linkedin.com/in/pedrogiffoni
- Email: pedrogiffoni@edu.unifor.br

---

# 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos durante a formação em Desenvolvimento Full Stack, podendo servir como base para estudos e futuras evoluções.

---

<div align="center">

### ⭐ Se este projeto foi útil para você, deixe uma estrela no repositório!

**FoodSnap — Conectando pessoas através da gastronomia. 🍔📸**

</div>
