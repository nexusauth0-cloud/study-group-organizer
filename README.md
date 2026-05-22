# Study Group Organizer

A mobile-friendly web application for students, tutors, and mentors to create/join study groups, schedule sessions, share resources, chat, and video call in real-time. PWA-enabled and optimized for Android/Termux.

## Features

- **User Accounts**: Registration/login (email/password), profile management, role-based access (student/mentor)
- **Study Groups**: Create/join groups by subject, search/filter, group description/rules/resources
- **Scheduling**: Session scheduler, notifications/reminders, recurring sessions
- **Resources**: Upload/download resources, collaborative notes, tagging and categorization
- **Chat**: Real-time group chat with text, images, and typing indicators
- **Video/Audio Calls**: WebRTC-based peer-to-peer video calling
- **Mentors**: Find mentors, request mentorship, rating/feedback system
- **PWA**: Offline support, installable on mobile devices, dark/light mode

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, React Router, Socket.io Client
- **Backend**: Node.js, Express, Socket.io
- **Database**: MongoDB with Mongoose
- **Auth**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io for chat and notifications
- **Video**: WebRTC (native browser API)

## Prerequisites

- **Node.js 16+** and **npm**
- **MongoDB** (local or Atlas) - for Termux: `pkg install mongodb` or use MongoDB Atlas free tier
- A modern web browser (Chrome, Firefox, or any Chromium-based browser)

## Quick Start (Termux / Android)

```bash
# 1. Install Node.js and MongoDB
pkg update && pkg upgrade
pkg install nodejs mongod

# 2. Start MongoDB
mkdir -p ~/mongodb/data
mongod --dbpath ~/mongodb/data --bind_ip 127.0.0.1 &

# 3. Clone or copy the project
# (If copied via USB/storage, navigate to the project folder)
cd study-group-organizer

# 4. Install all dependencies
npm run install:all

# 5. Seed the database with sample data
npm run seed

# 6. Start the app
npm run dev
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Test Accounts (after seeding)

| Name             | Email                | Password      | Role    |
|------------------|----------------------|---------------|---------|
| Alice Mentor     | alice@example.com    | password123   | mentor  |
| Bob Student      | bob@example.com      | password123   | student |
| Charlie Mentor   | charlie@example.com  | password123   | mentor  |
| Diana Student    | diana@example.com    | password123   | student |
| Eve Student      | eve@example.com      | password123   | student |

## Full Setup

### 1. Environment Variables

The server uses defaults that work out-of-the-box. To customize, edit `server/.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/studygroup
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### 2. Install Dependencies

```bash
# Root (concurrently for running both)
npm install

# Server
cd server && npm install

# Client
cd ../client && npm install
cd ..
```

### 3. Seed Database

```bash
npm run seed
```

### 4. Run Development

```bash
# Run both frontend and backend simultaneously
npm run dev

# Or separately:
npm run dev:server   # Backend on :5000
npm run dev:client   # Frontend on :3000
```

### 5. Production Build

```bash
npm run build
npm start
```

## Project Structure

```
study-group-organizer/
├── client/                          # React frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json            # PWA manifest
│   │   ├── sw.js                    # Service Worker
│   │   └── icons/                   # App icons
│   └── src/
│       ├── App.js                   # Main app with routing
│       ├── index.js                 # Entry point
│       ├── context/                 # React contexts (Auth, Theme, Socket)
│       ├── components/
│       │   ├── auth/                # Login, Register, Profile
│       │   ├── layout/              # Navbar, Sidebar, ProtectedRoute
│       │   ├── groups/              # GroupCard, GroupList, CreateGroup, etc.
│       │   ├── chat/                # ChatWindow, MessageList, MessageInput
│       │   ├── scheduler/           # SessionScheduler, SessionList
│       │   ├── resources/           # ResourceUpload, ResourceList
│       │   ├── mentor/              # MentorList, MentorRequest
│       │   ├── video/               # VideoCall (WebRTC)
│       │   └── common/              # Loading, Modal, EmptyState
│       ├── pages/                   # Home, Dashboard, Groups, Scheduler, Mentors
│       ├── hooks/                   # Custom React hooks
│       ├── services/                # API client, Socket client
│       └── styles/                  # Tailwind CSS
├── server/                          # Express backend
│   ├── index.js                     # Server entry point
│   ├── config/                      # DB connection, env config
│   ├── models/                      # Mongoose schemas (User, Group, Session, etc.)
│   ├── controllers/                 # Business logic for each entity
│   ├── routes/                      # Express route definitions
│   ├── middleware/                   # Auth, upload, error handling
│   ├── socket/                      # Socket.io event handlers
│   └── seed/                        # Database seed script
└── package.json                     # Root scripts (dev, build, seed)
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/oauth` - OAuth login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/become-mentor` - Upgrade to mentor

### Groups
- `GET /api/groups` - List groups (search, filter)
- `GET /api/groups/my` - User's groups
- `GET /api/groups/:id` - Group details
- `POST /api/groups` - Create group
- `PUT /api/groups/:id` - Update group
- `POST /api/groups/:id/join` - Join group
- `POST /api/groups/:id/leave` - Leave group

### Sessions
- `GET /api/groups/:groupId/sessions` - List sessions
- `POST /api/groups/:groupId/sessions` - Create session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session
- `POST /api/sessions/:id/rsvp` - RSVP to session

### Messages
- `GET /api/groups/:groupId/messages` - Get messages
- `POST /api/groups/:groupId/messages` - Send message
- `POST /api/groups/:groupId/messages/read` - Mark as read

### Resources
- `GET /api/groups/:groupId/resources` - List resources
- `POST /api/groups/:groupId/resources` - Upload resource
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource

### Mentors
- `GET /api/mentors` - List mentors
- `POST /api/mentors/request` - Send mentorship request
- `GET /api/mentors/requests` - My sent requests
- `GET /api/mentors/requests/me` - Received requests
- `PUT /api/mentors/requests/:id/respond` - Accept/reject
- `PUT /api/mentors/requests/:id/rate` - Rate mentor

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark one read
- `PUT /api/notifications/read-all` - Mark all read

## PWA & Mobile Optimization

- **Installable**: Add to home screen on Android via Chrome
- **Offline**: Service Worker caches app shell for offline access
- **Responsive**: Works on mobile, tablet, and desktop
- **Dark Mode**: Toggle in navbar, persists across sessions
- **Low Bandwidth**: Optimized assets, minimal dependencies

## Deployment

### Render / Heroku
1. Set environment variables in dashboard
2. Use MongoDB Atlas for database
3. Build command: `npm run build`
4. Start command: `npm start`

### Vercel (Frontend only)
1. Set `REACT_APP_API_URL` to your backend URL
2. Deploy the `client/` directory

## License

MIT
