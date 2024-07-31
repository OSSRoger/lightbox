# Next.js REST API with PostgreSQL

This project is a Next.js application that provides REST API endpoints for managing users and posts. The API uses PostgreSQL for data storage, and the application is configured to be deployed on Vercel.

## Features

- CRUD operations for Users
- CRUD operations for Posts
- Validation for user age and non-negative values
- Automated tests using Playwright

## Getting Started

### Prerequisites

- Node.js (>= 18.7)
- pnpm
- PostgreSQL

### Installation

1. Clone the repository:

```bash
  git clone https://github.com/OSSRoger/lightbox.git
  cd lightbox
```

2. Install dependencies:

```bash
  pnpm install
```

3. Setup Vercel project and Vercel DB.

   [Follow the quickstart guide here.](https://vercel.com/docs/storage/vercel-postgres/quickstart#quickstart)

4. Set up environment variables:

   Create a `.env` file in the root of the project and add your PostgreSQL connection string:

```dotenv
  vercel env pull .env
```

5. Initialize the database:

   Push the schema to the newly created db in Vercel.

```
  npx drizzle-kit push
```

6. Start the development server:

```bash
  pnpm dev
```

7. Inspect the DB

```bash
  pnpm studio
```

### Testing

This project uses Playwright for testing. To run the tests:

```bash
pnpm test
```
