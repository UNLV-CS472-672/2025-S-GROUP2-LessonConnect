# LessonConnect
| Pipeline | Status | Coverage |
|----------|--------|----------|
| **Frontend (React + Vite)** | [![Frontend CI](https://github.com/UNLV-CS472-672/2025-S-GROUP2-LessonConnect/actions/workflows/reactjs_ci_cd.yml/badge.svg)](https://github.com/UNLV-CS472-672/2025-S-GROUP2-LessonConnect/actions/workflows/reactjs_ci_cd.yml) | [![Codecov Frontend](https://codecov.io/gh/UNLV-CS472-672/2025-S-GROUP2-LessonConnect/branch/main/graphs/badge.svg)](https://app.codecov.io/gh/UNLV-CS472-672/2025-S-GROUP2-LessonConnect) |
| **Backend (Django + DRF)** | [![Backend CI](https://github.com/UNLV-CS472-672/2025-S-GROUP2-LessonConnect/actions/workflows/django_ci_cd.yml/badge.svg)](https://github.com/UNLV-CS472-672/2025-S-GROUP2-LessonConnect/actions/workflows/django_ci_cd.yml) | [![Codecov Backend](https://codecov.io/gh/UNLV-CS472-672/2025-S-GROUP2-LessonConnect/branch/main/graphs/badge.svg)](https://app.codecov.io/gh/UNLV-CS472-672/2025-S-GROUP2-LessonConnect) |

---
## Project Description
**LessonConnect** streamlines communication, scheduling, and resource sharing for private tutors, students, and parents. Focused on one-on-one or small group tutoring, it features tailored messaging, parental oversight, and an integrated calendar—making it a modern, targeted alternative to general platforms like Google Classroom or Canvas.

## 🔑 Key Features

- **Real-Time Messaging (Channels + Redis)**  
  Chat with read receipts and attachments for individual or group sessions using Django Channels for WebSocket-based updates.

- **Scheduling & Booking**  
  Calendar-driven scheduling and rescheduling, including confirmations and parental approval flows.

- **Resource Sharing**  
  Tutors can upload PDFs, videos, and documents. Students can submit homework and quizzes.

- **Pomodoro Timer & Productivity Tools**  
  Helps students stay focused and prevent burnout with integrated time management tools.

- **Parental Oversight**  
  Parents access logs, messaging transcripts, and scheduling history for accountability.

- **Scalable Architecture**  
  Django backend with Redis and Celery for real-time and async tasks; deployment-ready for cloud platforms.

---

## 🏗️ Architecture Overview

**Frontend**
- Built with: `React` + `Vite`
- Styling: `TailwindCSS` + `Bootstrap`
- Tooling: `ESLint` for consistency
- Runs at: `http://localhost:5173/`

**Backend**
- Built with: `Django (5.1.6)` + Django REST Framework
- Database: `SQLite` (dev) → `PostgreSQL` (prod-ready)
- Real-Time: `Django Channels`, `Redis`
- Async Tasks: `Celery`
- External Media Storage: `cloudinary`

> 🔧 Architecture Diagram: _See `/diagrams/architecture/lessonconnect-architecture.png` (upload diagram in this folder)_

---

## ⚙️ Setup Instructions

### 🖥️ Frontend: React + Vite

**Prerequisites**
- Node.js
- IDE (e.g., VSCode)

**Install & Run**
```bash
# 1. Clone the repo
git clone https://github.com/UNLV-CS472-672/2025-S-GROUP2-LessonConnect.git

# 2. Enter frontend directory
cd 2025-S-GROUP2-LessonConnect/frontend

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```
Runs at: `http://localhost:5173/`

---

### 🛠️ Backend: Django + SQLite

**Prerequisites**
- Python 3.8+
- pip
- Optional: Redis for local testing

**Setup (Linux/macOS)**
```bash
cd 2025-S-GROUP2-LessonConnect/backend
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

**Setup (Windows PowerShell)**
```powershell
cd 2025-S-GROUP2-LessonConnectackend
python -m venv env
env\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Run**
```bash
# Run migrations
python manage.py migrate

# Create admin (optional)
python manage.py createsuperuser

# Start the server
python manage.py runserver
```

Visit: `http://127.0.0.1:8000/`

---

## 🔁 Real-Time Messaging (Optional)

To test live chat locally:

1. Start Redis server (`redis-server`)
2. Ensure `settings.py` uses:
```python
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {"hosts": [("127.0.0.1", 6379)]},
    }
}
```
3. Run the dev server again to test chat.

---

## 📦 Dependencies (Partial List)

| Dependency               | Purpose                              |
|--------------------------|--------------------------------------|
| `Django==5.1.6`          | Core framework                       |
| `channels[daphne]`       | Real-time WebSocket support          |
| `channels-redis`         | Redis-based channel layer            |
| `celery`, `django-celery-*` | Async tasks + scheduled jobs     |
| `redis`                  | Real-time messaging                  |
| `psycopg2-binary`        | PostgreSQL support (for deployment)                  |
| `cloudinary`   | Cloud file storage                   |
| `python-dotenv`          | Environment variable handling        |

---

## 🧪 Testing & CI/CD

- Linting via ESLint (frontend) and flake8 (backend)
- Test coverage tools integrated
- CI workflow blocks PRs unless:
  - All tests pass
  - Linting is clean
  - PR is linked to an Issue

---

## 🤝 Contribution Guidelines

### Pull Requests
- Link all PRs to an issue
- Include a design diagram in `/diagrams/<feature-name>/`
- Follow AI-generated code annotation format:
```python
# ai-gen start (ChatGPT-4, 1)
def example():
    pass
# ai-gen end
```

### Branch Naming
Use clear, descriptive branch names:
- `feature/calendar-sync`
- `fix/login-crash`
- `test/user-auth-flow`

---

## 📂 Repo Structure
```
LessonConnect/
├── backend/            # Django app
├── frontend/           # React app
├── diagrams/
│   ├── use-cases/
│   ├── sequence/
│   └── architecture/
└── README.md
```

---

## 📬 Contact & Support
- 📧 Email: [support@lessonconnect.com](mailto:support@lessonconnect.com)
- 🐛 Issues: [GitHub Issues](https://github.com/UNLV-CS472-672/2025-S-GROUP2-LessonConnect/issues)

---

## 📄 License 
_This project is licensed under the MIT License. See `LICENSE.md` for more info._