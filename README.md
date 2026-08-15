# TaskFlow

TaskFlow is a full-stack task management application built with **React + Vite** on the frontend and **Node.js + Express + SQLite** on the backend.

The project provides a simple Kanban-style workflow for organizing tasks across boards and columns such as **To Do**, **In Progress**, and **Done**.

## Tech Stack

### Frontend
- React
- React DOM
- Vite
- JavaScript
- CSS
- ESLint

### Backend
- Node.js
- Express.js
- CORS
- SQLite
- better-sqlite3

### Database
- SQLite
- SQL schema for creating the database tables
- Seed script for inserting initial/sample data

---

## Project Structure

```text
taskflow/
│
├── README.md
├── .gitignore
│
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   │
│   └── src/
│       ├── server.js
│       │
│       ├── controllers/
│       │   ├── boardController.js
│       │   └── taskController.js
│       │
│       ├── routes/
│       │   ├── boardRoutes.js
│       │   └── taskRoutes.js
│       │
│       └── db/
│           ├── database.js
│           ├── schema.sql
│           ├── init-db.js
│           └── seed.js
│
└── frontend/
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    │
    └── src/
        ├── App.jsx
        ├── main.jsx
        │
        ├── components/
        │   ├── Board.jsx
        │   ├── Column.jsx
        │   ├── TaskCard.jsx
        │   ├── TaskMenu.jsx
        │   ├── Header.jsx
        │   ├── AddTaskModal.jsx
        │   └── EditTaskModal.jsx
        │
        ├── services/
        │   └── api.js
        │
        └── styles/
            ├── App.css
            ├── Board.css
            ├── Column.css
            ├── Header.css
            ├── Modal.css
            └── TaskCard.css
```

---

## Prerequisites

Before running the project, make sure you have:

- **Node.js 20 LTS or newer**
- **npm**
- **Git**

Check your installed versions:

```bash
node -v
npm -v
git --version
```

> **Note:** A Conda environment is not required for this project. The project uses Node.js, and its dependencies are managed through `package.json` and `package-lock.json`.

---

# Getting Started

## 1. Clone the repository

Clone the GitHub repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Then enter the project directory:

```bash
cd taskflow
```

---

# Backend Setup

Open a terminal and move into the backend directory:

```bash
cd backend
```

Install the backend dependencies:

```bash
npm install
```

This installs the dependencies listed in `backend/package.json`.

The main backend dependencies include:

- Express
- CORS
- better-sqlite3

---

## 2. Initialize the database

TaskFlow uses SQLite as its database.

The database structure is defined in:

```text
backend/src/db/schema.sql
```

Initialize the database by running:

```bash
node src/db/init-db.js
```

This creates the required SQLite tables.

Then add the initial/sample data:

```bash
node src/db/seed.js
```

The seed data creates the initial TaskFlow board and sample workflow data.

### Database flow

```text
schema.sql
    ↓
init-db.js
    ↓
SQLite database
    ↓
seed.js
    ↓
Initial/sample data
```

> If you choose to commit an existing `taskflow.db` file to the repository for demo purposes, the database may already contain data. For a clean and reproducible setup, it is recommended to generate the database using `schema.sql`, `init-db.js`, and `seed.js` instead.

---

## 3. Start the backend

From the `backend` directory:

```bash
node src/server.js
```

The backend runs on:

```text
http://localhost:5000
```

The frontend communicates with the backend through the API base URL:

```text
http://localhost:5000/api
```

---

# Frontend Setup

Open a **second terminal** while keeping the backend running.

From the project root:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

Then start the Vite development server:

```bash
npm run dev
```

Vite will provide a local URL similar to:

```text
http://localhost:5173
```

Open that URL in your browser.

---

# Running the Complete Application

You need two terminals.

### Terminal 1 — Backend

```bash
cd taskflow/backend
npm install
node src/db/init-db.js
node src/db/seed.js
node src/server.js
```

### Terminal 2 — Frontend

```bash
cd taskflow/frontend
npm install
npm run dev
```

Then open the frontend URL shown by Vite, normally:

```text
http://localhost:5173
```

The overall architecture is:

```text
                    ┌──────────────────────┐
                    │       Browser        │
                    │   React + Vite UI    │
                    │   localhost:5173     │
                    └──────────┬───────────┘
                               │
                               │ HTTP API
                               ▼
                    ┌──────────────────────┐
                    │    Express Server    │
                    │   localhost:5000     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       SQLite         │
                    │     taskflow.db      │
                    └──────────────────────┘
```

---

# Dependency Management

The project does **not** require `node_modules` to be committed to GitHub.

Both the frontend and backend contain:

```text
package.json
package-lock.json
```

These files describe the dependencies required by each part of the application.

After cloning the repository, simply run:

```bash
npm install
```

inside both `backend` and `frontend`.

This creates the required local `node_modules` directories.

### Do not commit

```text
node_modules/
dist/
.env
*.log
```

A `.gitignore` file should be used to prevent unnecessary/generated files from being committed.

---

# Database Notes

TaskFlow uses **SQLite**, so no separate MySQL/PostgreSQL database server is required.

The database is stored locally and is accessed using `better-sqlite3`.

The database setup files are:

```text
schema.sql     → Defines database tables
init-db.js     → Creates the database structure
seed.js        → Inserts initial/sample data
database.js    → Creates/opens the SQLite database connection
```

This makes the project easy to set up on another machine without requiring an external database server.

---

# Available Scripts

## Frontend

From the `frontend` directory:

```bash
npm run dev
```

Starts the Vite development server.

Other scripts available in the frontend `package.json` can be used for building and checking the application.

## Backend

From the `backend` directory:

```bash
node src/server.js
```

Starts the Express backend.

If a development script is added to `backend/package.json`, the backend can also be started using:

```bash
npm run dev
```

---

# Troubleshooting

## Backend is not connecting

Make sure the backend is running on:

```text
http://localhost:5000
```

Also check that the frontend API configuration points to:

```text
http://localhost:5000/api
```

---

## Database errors

If the database is missing or the required tables do not exist, run:

```bash
cd backend
node src/db/init-db.js
node src/db/seed.js
```

Then restart the backend:

```bash
node src/server.js
```

---

## `npm install` errors

Check your Node.js version:

```bash
node -v
```

Using a current LTS version of Node.js is recommended.

If dependencies were partially installed, you can remove the local dependency folder and reinstall:

```bash
rm -rf node_modules
npm install
```

On Windows, you can delete the `node_modules` folder manually and run:

```bash
npm install
```

---

# Development Decisions and Assumptions

No major additional assumptions or decisions were made beyond the requirements provided for the project.

The project uses SQLite because it keeps the application simple to run locally and does not require a separate database server. The frontend and backend are kept as separate applications so that each can be developed and run independently.

---

# What I Would Improve With More Time

With more development time, I would improve the project in several areas:

- Add task timers and reminders so users can set reminders for important tasks and receive notifications when a task needs attention.
- Restrict task deletion based on task status. Tasks in the To Do and In Progress columns would not have a delete option because they  represent ongoing or pending work. A task would become eligible for deletion only after it has been moved to the Done column, ensuring that unfinished tasks are not accidentally deleted.
- Implement priority-based task ordering. Tasks would automatically be arranged according to their priority, with high-priority   tasks  appearing first, followed by medium- and low-priority tasks. This would help users focus on the most important work first

---

# Development Experience

One of the main things I learned while building TaskFlow was 
**how to debug errors systematically instead of trying random fixes**. I became more comfortable reading error messages, tracing the problem to the relevant part of the application, and testing possible solutions step by step.

I also learned how to work effectively under a **fixed deadline**—breaking a larger task into smaller parts, prioritizing the most important functionality first, and completing the required features within the available time.

---

# Time Spent

I spent approximately 2.5 days developing and testing the project.

---

# Interesting Thing I Learned

A particularly useful part of the development process was learning that debugging is not just about fixing an error after it occurs. It is about understanding the error message, identifying where the problem originates, reproducing it, and then verifying that the fix does not introduce another problem.

Working with a deadline also helped me understand the importance of prioritization: completing the core functionality first and then using the remaining time for improvements and polishing.

---

# License

This project was created for development and demonstration purposes.
