# Nevyra Backend

A full-featured e-commerce backend built with Node.js, Express, PostgreSQL, and Sequelize.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   DATABASE_URL=postgres://username:password@host:port/dbname
   JWT_SECRET=your_jwt_secret
   ```
3. Run database seed (optional, for demo data):
   ```bash
   node seeders/seed.js
   ```
4. Start the server:
   ```bash
   npm start
   ```

## Scripts

- `npm start` — Start server
- `npm run dev` — Start server with nodemon
- `node seeders/seed.js` — Seed demo data

## Folder Structure

- `config/` — DB config & Sequelize init
- `controllers/` — Route logic
- `models/` — Sequelize models
- `routes/` — Express routes
- `middlewares/` — Auth, error, logger
- `utils/` — Helpers
- `seeders/` — Seed data

## API Endpoints

See the main project documentation for endpoint details.
