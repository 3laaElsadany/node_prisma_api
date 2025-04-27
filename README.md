# Node.js Prisma API

This project is a RESTful API built using **Node.js** and **Prisma ORM**, designed to perform full CRUD operations with a mysql database (or any Prisma-supported database).

## Requirements

- Node.js (v14 or higher)
- npm or yarn
- A database (e.g., MYSQL)
- Prisma CLI

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/3laaElsadany/node_prisma_api.git
cd node_prisma_api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment

Create a `.env` file in the root of the project and add your database URL:

```
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DATABASE_NAME"
JWT_SECRET="Enter any secret key"
```

### 4. Setup Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Run the server in development

```bash
npm run dev
```

The API will run on: `http://localhost:3000`

## 🗂️ Project Structure

```
├── prisma/
│   └── schema.prisma      # Prisma schema and DB models
├── src/
│   ├── routes/            # API routes
│   ├── controllers/       # Business logic
│   ├── middlewares/       # Express middlewares
│   └── index.ts           # Entry point
├── .env                   # Environment variables
├── package.json
└── README.md
```

## 🧪 Useful Commands

- `npx prisma studio` – Open Prisma Studio (GUI for DB)
- `npx prisma migrate dev` – Run migrations
- `npx prisma generate` – Generate Prisma client
