# Next.js Application

This project is built with **Next.js 15** using the App Router and was bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

![pastebin-demo](https://github.com/user-attachments/assets/50f11735-8374-4b2a-a946-15db6cf51fcd)

## ⚡ Getting Started

Install dependencies:

```bash
pnpm install
```

Start the application and database using Docker:

```bash
docker compose up -d
```

Push the database schema:

```bash
pnpm db:push
```

Once the containers are running, open:

➡️ **http://localhost:3000**

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), Vercel’s modern typeface.

---

## 📚 Learn More

- **Next.js Documentation** – https://nextjs.org/docs
- **Interactive Next.js Tutorial** – https://nextjs.org/learn
- **Next.js GitHub Repository** – https://github.com/vercel/next.js

---

## 🚀 Deployment

The recommended way to deploy this application is via **Vercel**, the creators of Next.js:

https://vercel.com/new?filter=next.js

Deployment docs:  
https://nextjs.org/docs/app/building-your-application/deploying
