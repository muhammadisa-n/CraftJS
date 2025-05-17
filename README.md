# CraftJS

A pragmatic backend framework powered by **Express**, **TypeScript**, and **Prisma** — designed for rapid development, simplicity, and scalability.

---

## Features

- **Express.js** based API architecture
- **TypeScript** support out of the box
- **Prisma ORM** with scalable database structure
- **CLI tool** (`craft`) for project automation
- Built-in **Logger**, **Validation**, **Error handler**, and **Request lifecycle**
- Predefined project structure for fast onboarding

---

## Getting Started

### Scaffold a New Project

```bash
npx @muhammadisa226/craftjs@latest my-api
```

### Go to project folder

```bash
cd my-app
```

### Run Craft Setup

```bash
npm install
npm run craft key:generate
npm run craft generate
npm run craft db:migrate
npm run craft dev
```

### Available Craft Commands

```bash
npm run craft help
```

---

## Project Structure

```
my-app/
├── src/
│   ├── apidocs/
│   ├── application/
│   ├── controllers/
│   ├── middleware/
│   ├── repository/
│   ├── request/
│   ├── response/
│   ├── routes/
│   └── services/
│   └── utils/
│   └── validation/
│   └── main.ts
├── test/
├── .env
├── .env.example
├── prisma/
├── .gitignore
├── babel.config.json
├── craft.ts
├── nodemon.json
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

## Scripts

| Command                 | Description                   |
| ----------------------- | ----------------------------- |
| `craft start`           | Start production server       |
| `craft dev`             | Run in development mode       |
| `craft build`           | Build for production          |
| `craft run:test`        | Run Jest tests                |
| `craft db:generate`     | Generate Prisma client        |
| `craft db:migrate`      | Run Prisma migrations         |
| `craft db:reset`        | Run Prisma migrations refresh |
| `craft key:generate`    | Generate secret keys          |
| `craft make:controller` | Make Controller File          |
| `craft make:command`    | Make Command File             |
| `craft make:middleware` | Make Middleware File          |
| `craft make:repository` | Make repository File          |
| `craft make:request`    | Make Request File             |
| `craft make:response`   | Make Response File            |
| `craft make:route`      | Make Route File               |
| `craft make:service`    | Make Service File             |
| `craft make:test`       | Make Test case                |
| `craft make:utils`      | Make Utils                    |
| `craft make:validation` | Make Validation               |

---

Made by [@muhammadisa-n](https://github.com/muhammadisa-n)
