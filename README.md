# 🧠 Memory Match: The Full-Stack Concentration Game

This project implements the classic **"Memory Match"** (or **"Concentration"**) card game as a robust, full-stack web application. It features secure user authentication and the ability to save and load game progress, creating a persistent and competitive experience.

## 🚀 Key Technologies

This application is built using a modern and powerful stack:

### Frontend (`/frontend`)

* **Framework:** **React.js** for building a dynamic user interface.
* **Styling:** **Tailwind CSS** for rapid, utility-first, and responsive styling.
* **State Management:** **React Hooks** (`useState`, `useEffect`, `useContext`) for efficient and component-local state handling.

### Backend (`/backend`)

* **Server:** **Express.js** (Node.js) for handling API requests and business logic.
* **Database & Authentication:** **Supabase** (PostgreSQL, Auth, and APIs) for:
    * Secure **User Registration** and **Login** (Authentication).
    * Persistently saving and loading **Game State** (Database).

---

## 📁 Project Structure Overview

The project is cleanly divided into two main areas: the **frontend** (the React client) and the **backend** (the Express/Supabase API).

```
memory-game-project/  
├── backend/  
│ ├── node_modules/  
│ ├── src/  
│ │ ├── routes/  
│ │ │ ├── auth.js // Supabase authentication handlers  
│ │ │ └── game.js // API endpoints for saving/loading state  
│ │ ├── controllers/  
│ │ │ └── gameController.js // Logic for interacting with Supabase  
│ │ └── index.js // Express main application file  
│ ├── package.json  
│ └── .env // Supabase connection keys  
│  
├── frontend/  
│ ├── node_modules/  
│ ├── public/  
│ ├── src/  
│ │ ├── components/  
│ │ │ ├── Card.jsx  
│ │ │ └── Header.jsx  
│ │ ├── assets/ // images folder  
│ │ │ └── cards/  
│ │ │ ├── img1.jpg  
│ │ │ └── ...  
│ │ ├── api/  
│ │ │ └── gameApi.js // Axios calls to Express backend  
│ │ └── App.jsx // Main game component  
│ ├── package.json  
│ └── tailwind.config.js  
│  
├── .gitignore  
└── README.md 
```
