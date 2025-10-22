# Kohee Coffee Shop (React frontend + Express + MySQL)

This workspace contains a Create React App frontend in `frontend/` and a minimal Express backend in `backend/` that connects to MySQL (intended for XAMPP).

Quick overview:

- frontend/: React app with pages (Home, Coffee Menu, Pastries, Feedback, Profile, Login, Signup, Cart)
- backend/: Express API with auth (JWT), products, cart, feedback, profile
- backend/db.sql: SQL schema and seed data for MySQL (import into XAMPP/phpMyAdmin or mysql CLI)

Setup (Windows / PowerShell):

1. Import database

Using mysql CLI (if you have it available):

```powershell
mysql -u root -p < backend/db.sql
```

If you're using XAMPP, open phpMyAdmin (http://localhost/phpmyadmin), create the database `kohee_shop` and import `backend/db.sql`.

2. Start backend

Open a PowerShell terminal in `backend/` and run:

```powershell
cd backend
npm install
# optionally create .env file or set env vars, see .env.example
# then start
npm start
```

Backend defaults:

- host: 127.0.0.1
- user: root
- password: (empty)
- database: kohee_shop
- port: 4000

You can customize via environment variables: DB_HOST, DB_USER, DB_PASS, DB_NAME, JWT_SECRET, PORT

3. Start frontend

Open a PowerShell terminal in `frontend/` and run:

```powershell
cd frontend
npm install
npm start
```

After both are running:

- Visit http://localhost:3000 to open the React app
- Use Sign Up to create a user, then add coffees/pastries to cart and submit feedback.

Notes and next steps:

- This is a minimal scaffold to get you started. Consider adding validation, error handling, better styling, and production-level configuration.
- For production, secure the JWT secret and use HTTPS.Kohee Shop (React + Express + MySQL)

This workspace contains a React frontend in `frontend/` and a minimal Express backend in `backend/`. The backend uses MySQL (suitable for XAMPP's MySQL/MariaDB).

Quick setup

1. Database (XAMPP)

- Start MySQL in XAMPP control panel.
- Open phpMyAdmin or use mysql CLI and run the SQL in `backend/db.sql` to create the `kohee_shop` database and seed products.

2. Backend

- Open a terminal in `backend/` and run:

```powershell
npm install
# optional for dev
npm install -g nodemon
npm run dev
# or
npm start
```

- The backend listens on http://localhost:4000 by default. You can set env vars DB_HOST, DB_USER, DB_PASS, DB_NAME, JWT_SECRET.

3. Frontend

- Open a terminal in `frontend/` and run:

```powershell
npm install
npm start
```

- Frontend runs on http://localhost:3000 and calls the backend at http://localhost:4000.

Notes

- Authentication is JWT-based and stored in localStorage. This is a minimal demo and not production hardened.
- Use XAMPP's phpMyAdmin to inspect tables `users`, `products`, `cart_items`, `feedback`.

Files added

- backend/: Express server and db.sql schema
- frontend/: React pages, contexts, routing

If you'd like, I can:

- Add CORS proxy or adjust to use relative paths
- Harden auth and validation
- Add ordering/checkout flow
- Add styles and polish UI

Static assets (header image)

- Place the header image used by the Home page at: `frontend/public/uploads/header.jpg`.
  The Home CSS references `/uploads/header.jpg` which maps to `public/uploads/header.jpg` when served by CRA.
