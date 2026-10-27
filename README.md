# Cloud-Based Hotel Guest Service Management Platform

A simple full-stack web app where hotel guests request services (housekeeping, room service, food, laundry, maintenance, transport, amenities), the admin assigns each request to a staff member, and staff update the status until it is completed. Guests get notifications and can send feedback.

## Features

- **Guest**: register/login, view services, request room service / housekeeping / maintenance / food / laundry / transport / amenities, track status, cancel pending requests, request history, feedback, profile, notifications
- **Staff**: view assigned requests, see guest details, accept (In Progress) and complete tasks
- **Admin**: dashboard cards + 3 charts, manage guests / staff / hotel services, view all requests, assign staff, view feedback
- JWT authentication, bcrypt password hashing, role-based access on pages and APIs
- Search and status filter on request tables, loading spinners, error messages, success toasts, form validation
- Responsive layout (Bootstrap 5) with sidebar dashboards

## Technologies

| Part | Tech |
|------|------|
| Frontend | React 18, Vite, React Router, Bootstrap 5, Axios, Recharts |
| Backend | Node.js, Express, REST API, JWT, bcryptjs |
| Database | MongoDB + Mongoose |

> `bcryptjs` is the pure-JavaScript version of bcrypt (same algorithm, no C++ build tools needed, so it installs easily on Windows).

## Folder structure

```
hotel-guest-service-platform/
├── backend/   (config, controllers, middleware, models, routes, services, utils, server.js)
├── frontend/  (public, src/components, pages, services, context, hooks, assets, App.jsx, main.jsx)
├── README.md
└── .gitignore
```

## Requirements

- Node.js 18 or newer
- MongoDB running locally (Community Server) **or** a free MongoDB Atlas cluster

## MongoDB setup

**Option A – Local MongoDB:** install MongoDB Community Server and start it. The default URL is `mongodb://127.0.0.1:27017/hotel_guest_service`. The database is created automatically.

**Option B – MongoDB Atlas:** create a free cluster, add a database user, allow your IP, copy the connection string and use it as `MONGO_URI`.

## Backend setup (Terminal 1)

```bash
cd backend
npm install
cp .env.example .env        # Windows CMD: copy .env.example .env
npm run seed                # loads demo data (5 guests, 3 staff, 1 admin, 8 services, requests, feedback)
npm start                   # API runs on http://localhost:5000
```

## Frontend setup (Terminal 2)

```bash
cd frontend
npm install
npm run dev                 # opens on http://localhost:5173
```

The Vite dev server proxies `/api` to `http://localhost:5000`, so no extra config is needed.

## Environment variables (`backend/.env`)

| Variable | Meaning | Example |
|----------|---------|---------|
| PORT | API port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb://127.0.0.1:27017/hotel_guest_service |
| JWT_SECRET | Secret used to sign tokens (change it!) | some_long_random_text |
| JWT_EXPIRES_IN | Token lifetime | 7d |
| CLIENT_URL | Allowed frontend origin (CORS) | http://localhost:5173 |

Frontend (optional): `VITE_API_URL` – only needed if you do not want to use the Vite proxy.

## Sample login credentials (after `npm run seed`)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hotel.com | admin123 |
| Staff | staff1@hotel.com, staff2@hotel.com, staff3@hotel.com | staff123 |
| Guest | guest1@hotel.com … guest5@hotel.com | guest123 |

The login page also has one-click demo buttons.

## User roles

| Role | Can do |
|------|--------|
| Guest | Create/cancel own requests, see own history, feedback, profile |
| Staff | See requests assigned to them, set In Progress / Completed |
| Admin | Everything above plus manage users and services, assign requests, see all feedback and stats |

Public registration always creates a **guest**. Staff are added by the admin.

## API endpoints

Send the token as `Authorization: Bearer <token>`.

**Auth**
- `POST /api/auth/register` – register guest
- `POST /api/auth/login` – login, returns token + user
- `GET /api/auth/me` – current user

**Users** (admin unless noted)
- `GET /api/users?role=guest|staff`
- `POST /api/users` – admin creates guest/staff
- `GET /api/users/:id` – admin, staff or self
- `PUT /api/users/:id` – admin or self
- `DELETE /api/users/:id`

**Services**
- `GET /api/services` (public)
- `POST /api/services`, `PUT /api/services/:id`, `DELETE /api/services/:id` (admin)

**Requests**
- `POST /api/requests` (guest)
- `GET /api/requests` (guest: own, staff: assigned, admin: all; optional `?status=`)
- `GET /api/requests/:id`
- `PUT /api/requests/:id` (guest cancels, staff updates status, admin edits)
- `PUT /api/requests/:id/assign` (admin) body: `{ "staffId": "..." }`
- `DELETE /api/requests/:id` (admin)

**Staff / Stats**
- `GET /api/staff` (admin)
- `GET /api/stats` (admin)

**Feedback** – `POST /api/feedback` (guest), `GET /api/feedback` (guest: own, admin: all)

**Notifications** – `GET /api/notifications`, `PUT /api/notifications/:id/read`

## Testing the workflow

1. Login as `guest1@hotel.com` → Housekeeping → submit a request.
2. Login as `admin@hotel.com` → All Requests → choose staff → Assign.
3. Login as `staff1@hotel.com` → Accept → Complete.
4. Login again as the guest → Notifications show the updates → Feedback.

Quick API test with curl:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"guest1@hotel.com","password":"guest123"}'
```

## Error handling

Invalid login (401), duplicate email (400), missing fields (400), unauthorized / wrong role (401/403), invalid service request (400), invalid IDs (400), MongoDB connection failure (server logs the error and stops), unexpected server errors (500 with a safe message).

## Project screenshots

Add your screenshots here after running the app:

- Home page: `screenshots/home.png`
- Guest dashboard: `screenshots/guest-dashboard.png`
- Admin dashboard: `screenshots/admin-dashboard.png`
- Staff dashboard: `screenshots/staff-dashboard.png`
