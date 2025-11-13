# frontend-backend-flask-react-vite
# 🧩 Flask + React CRUD Application

A simple full-stack **CRUD (Create, Read, Update, Delete)** application built using **Flask (Python)** for the backend API and **React (JavaScript)** for the frontend UI.  

The app allows users to manage a list of tasks — create, view, update, and delete — demonstrating clean API design and component-based UI structure.

---

## 🚀 Features

✅ Create, Read, Update, and Delete (CRUD) tasks  
✅ Flask REST API with SQLite database  
✅ React frontend using Axios for API calls  
✅ CORS-enabled backend for cross-origin communication  
✅ Simple structure — perfect for learning full-stack integration  

---

## 🏗️ Project Structure

crud-project/
├── backend/
│ ├── app.py
│ ├── models.py
│ ├── database.db
│ └── requirements.txt
└── frontend/
├── package.json
└── src/
├── App.js
├── api.js
└── components/
└── TaskList.js

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone <your-repo-url>
cd crud-project
cd backend
python -m venv venv
venv\Scripts\activate     # (Windows)
# source venv/bin/activate  # (Mac/Linux)
pip install -r requirements.txt
python app.py
Frontend (React)

Uses axios to communicate with the Flask API.

Components located under frontend/src/components/

Example:

TaskList.js handles adding, editing, and deleting tasks.

api.js defines a reusable Axios instance for API calls.

🧰 Tech Stack

Backend

Python 3.x

Flask

Flask-CORS

Flask-SQLAlchemy

SQLite

Frontend

React (CRA)

Axios

JavaScript (ES6+)

🧪 Run Tests (Optional)

If you add pytest-based tests in the backend:

cd backend
pytest -v

📸 Demo Workflow

Start Flask backend (python app.py)

Start React frontend (npm start)

Open http://localhost:3000

Add, edit, or delete tasks — changes reflect instantly in the database.

📂 Future Improvements

Add comments API (Task → Comment relationship)

Add user authentication (JWT)

Add pagination and search in React UI

Deploy full app to Render / Vercel + Railway

🧑‍💻 Author

polishetty Bala Sushmitha
📧 polishettybalasuhmitha12@gmail..com

🔗 https://www.linkedin.com/in/bala-sushmitha-polishetty-872a84285?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
 | https://github.com/B237-dot
