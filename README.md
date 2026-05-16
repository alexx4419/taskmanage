# Orvix Pro - Team Intelligence Platform

Orvix Pro is a modern, high-performance team management and task-tracking application designed to streamline workflows across different organizational roles. It features a stunning "Graphite & Neon Orange" aesthetic and provides real-time oversight for Project Leads, Quality Reviewers, and Taskers.

## 🚀 Key Features

*   **Role-Based Dashboards**: Customized, deeply integrated views for `PROJECT_LEAD`, `QUALITY_REVIEWER`, and `TASKER` roles.
*   **Live Time Tracking**: A split-layout Punch-In/Punch-Out panel with real-time session timers and daily timeline activity logs.
*   **Comprehensive Task Management**: Create, assign, and track tasks across multiple projects. Real-time status updates (TODO, IN PROGRESS, IN REVIEW, DONE).
*   **Global Project Visibility**: Instant access to Active Tech Projects for seamless cross-team transparency.
*   **Leave Management**: Built-in attendance tracking with an intuitive UI for leads to approve or reject time-off requests.
*   **Premium UI/UX**: Structural dark-mode design utilizing matte graphite backgrounds and vibrant neon orange accents for maximum focus.

## 🛠 Tech Stack

**Frontend:**
*   React 18 + Vite
*   Vanilla CSS (Custom Graphite/Neon Design System)
*   Axios for API requests
*   React Router DOM

**Backend:**
*   Node.js & Express
*   Prisma ORM
*   SQLite (Development database)
*   JSON Web Tokens (JWT) & bcrypt for authentication

## 📦 Local Setup & Installation

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/alexx4419/taskmanage.git
cd taskmanage
```

### 2. Backend Setup
```bash
cd backend
npm install

# Initialize Prisma Database
npx prisma generate
npx prisma db push

# Start the backend server (runs on http://localhost:5000)
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install

# Start the Vite development server (runs on http://localhost:5173)
npm run dev
```

## 🔐 Default Users (For Testing)

If you have seeded the database or wish to log in as different roles, ensure you use the corresponding role accounts created in your local setup.

*   **Project Lead**: Has full oversight, creates projects, assigns tasks, and approves leave.
*   **Quality Reviewer**: Reviews completed tasks, approves final work, and views all active tech projects.
*   **Tasker**: Logs time, views assigned tasks, creates ad-hoc tasks, and tracks daily performance metrics.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
