# Mental Health Support Platform

A full-stack web application for mental health support with React frontend and Express backend with JSON database.

## Features

- **User Authentication**: Register and login with role-based access (Student/Admin)
- **Mental Health Resources**: Browse and manage articles, guides, and self-help materials
- **Virtual Therapy Sessions**: Schedule and manage counseling sessions
- **Support Groups**: Join and participate in peer support groups
- **Admin Dashboard**: Manage resources, sessions, and groups (Admin role)

## Tech Stack

- **Frontend**: React 18, React Router, Axios
- **Backend**: Node.js, Express
- **Database**: JSON file-based storage
- **Authentication**: JWT (JSON Web Tokens), bcryptjs

## Project Structure

```
mental-health-platform/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/         # Page components
│   │   └── App.js
│   └── package.json
├── server/                 # Express backend
│   ├── data/              # JSON database files
│   ├── routes/            # API routes
│   └── index.js
└── package.json
```

## Installation

1. Install all dependencies (backend and frontend):
```bash
npm run install-all
```

Or install separately:
```bash
# Backend dependencies
npm install

# Frontend dependencies
cd client
npm install
```

## Running the Application

### Development Mode (Both Server and Client)

Run both server and client concurrently:
```bash
npm run dev
```

### Run Separately

**Backend Server:**
```bash
npm run server
```
Server runs on `http://localhost:5000`

**Frontend Client:**
```bash
npm run client
```
Client runs on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Resources
- `GET /api/resources` - Get all resources
- `GET /api/resources/:id` - Get resource by ID
- `POST /api/resources` - Create resource (Admin only)
- `PUT /api/resources/:id` - Update resource (Admin only)
- `DELETE /api/resources/:id` - Delete resource (Admin only)

### Sessions
- `GET /api/sessions` - Get sessions (user's own or all if admin)
- `POST /api/sessions` - Create session (Student)
- `PUT /api/sessions/:id/status` - Update session status (Admin)
- `DELETE /api/sessions/:id` - Delete session

### Groups
- `GET /api/groups` - Get all groups
- `POST /api/groups` - Create group (Admin only)
- `POST /api/groups/:id/join` - Join group (Student)
- `POST /api/groups/:id/leave` - Leave group (Student)
- `DELETE /api/groups/:id` - Delete group (Admin only)

## User Roles

### Student
- Browse mental health resources
- Schedule counseling sessions
- Join support groups
- View own sessions

### Admin
- All student features
- Create/edit/delete resources
- Manage all sessions (confirm, complete, cancel)
- Create/delete support groups

## Default Data

The application initializes with sample data:
- 2 sample resources
- 2 sample support groups

## Notes

- JWT secret is set to a default value. Change `JWT_SECRET` in production.
- Passwords are hashed using bcryptjs
- JSON database files are stored in `server/data/` directory
- Data files are ignored by git (see .gitignore)

## License

MIT


