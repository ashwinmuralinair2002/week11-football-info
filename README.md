# ASH SPEAKS ⚽

ASH SPEAKS is a football information web application built using Node.js, Express, MongoDB and EJS. It provides a platform for users to explore football information, manage accounts and access an admin dashboard.

## Features

- User registration and login
- Password hashing using bcrypt
- Session-based authentication
- User dashboard displaying football information
- Admin dashboard with user management
- Create, view, update and delete football entries
- Role-based access control for users and administrators
- Form validation and CSRF protection

## Technology Stack

**Frontend**
- HTML5
- CSS3
- EJS
- Bootstrap

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

**Authentication & Security**
- bcryptjs
- express-session
- connect-mongo
- express-validator
- Helmet
- csurf

## Project Structure

```text
week11-football-info/
├── config/
├── controllers/
├── middlewares/
├── models/
├── public/
│   ├── images/
│   └── styles.css
├── routes/
├── scripts/
├── services/
├── views/
├── server.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ashwinmuralinair2002/week11-football-info.git
```

2. Navigate to the project directory:

```bash
cd week11-football-info
```

3. Install dependencies:

```bash
npm install
```

### Environment Configuration

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb://127.0.0.1:27017/week11_football_info
SESSION_SECRET=your_random_session_secret
PORT=3256
```

Replace the session secret with a randomly generated value.

### Run the Application

Start the application:

```bash
npm start
```

Open your browser:

```text
http://localhost:3256
```

Make sure MongoDB is running before starting the application.

## Disclaimer

ASH SPEAKS is an independent educational project developed for learning and demonstrating full-stack web development concepts.
