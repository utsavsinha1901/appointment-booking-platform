# appointment-booking-platform

## 📘 Overview
Schedulink is a comprehensive full-stack web application designed to streamline the creation and management of appointment slots. The platform offers robust user management, flexible slot scheduling, and real-time appointment tracking, ensuring an efficient and seamless experience for both administrators and end-users.

**Technology Stack:**
- **Frontend:** React with Tailwind CSS (powered by Vite)
- **Backend:** FastAPI (Python)
- **Database:** SQLite (with future support for PostgreSQL)
- **Containerization:** Docker & Docker Compose

## 🎯 Purpose
Schedulink aims to deliver a lightweight, containerized solution for appointment management that:
- Empowers administrators and users to create and manage available slots
- Enables customers to view and book appointment times effortlessly
- Provides a responsive, accessible, and intuitive user interface
- Facilitates straightforward deployment across cloud and on-premises environments

## ✅ Key Features
- User registration with essential profile information
- Creation and listing of appointment slots
- RESTful APIs for all core functionalities
- Integrated Swagger UI for comprehensive API documentation
- Responsive frontend with real-time slot updates
- Modular and maintainable codebase for ease of development

## ⚙️ Technology Overview
| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React, Tailwind CSS, Axios, Vite  |
| Backend    | FastAPI (Python 3)                |
| Database   | SQLite                            |
| Container  | Docker, Docker Compose            |
| Tools      | Swagger (OpenAPI), Git            |

## 📁 Project Structure

```text
Schedulink_Project/
├── backend/                  # Backend service (FastAPI)
│   ├── app/                  # Application source code
│   │   ├── models.py         # Database models
│   │   ├── schemas.py        # Pydantic schemas
│   │   ├── database.py       # Database connection/configuration
│   │   └── main.py           # FastAPI entry point
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile            # Backend Docker image definition
├── frontend/                 # Frontend service (React)
│   ├── src/                  # React source code
│   │   ├── components/       # Reusable React components
│   │   ├── App.jsx           # Main React app
│   │   └── axios.js          # Axios API configuration
│   ├── package.json          # Node.js dependencies and scripts
│   └── Dockerfile            # Frontend Docker image definition
└── docker-compose.yml        # Multi-container orchestration
```

## 🛠️ Getting Started
1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd Schedulink_Project
   ```
2. **Build and start the application with Docker Compose:**
   ```sh
   docker compose up --build
   ```
3. **Access the application:**
   - Frontend: http://<host-ip>:3000
   - Backend & API Docs (Swagger): http://<host-ip>:8000/docs

## 📌 API Endpoints (FastAPI)
| Method | Endpoint   | Description           |
|--------|------------|----------------------|
| POST   | /users     | Create a new user    |
| GET    | /users     | Retrieve all users   |
| POST   | /slots     | Create a new slot    |
| GET    | /slots     | Retrieve available slots |

For detailed API documentation, visit: `http://<ip>:8000/docs`

## 🖼️ User Interface Highlights (React)

#### Figma-Style Wireframe: User Creation Form & User List
```figma
+-------------------------------------------------------------+
|                    Schedulink Dashboard                     |
+-------------------------------------------------------------+
| [Create User Form]         | [Create Appointment Slot Form] |
|----------------------------|-------------------------------|
| Name:  [__________]        | Date:    [______/______/____] |
| Email: [__________]        | Time:    [__:__]              |
| [Create User Button]       | [Create Slot Button]          |
+----------------------------+-------------------------------+

+-------------------+     +-------------------------------+
|     User List     |     |        Slot List              |
+-------------------+     +-------------------------------+
| Name      | Email |     | Date       | Time   | Status  |
|-----------|-------|     |------------|--------|---------|
| Alice     | ...   |     | 2025-08-04 | 10:00  | Open    |
| Bob       | ...   |     | 2025-08-04 | 11:00  | Booked  |
+-------------------+     +-------------------------------+
```

```figma
┌───────────────────────────────┐
│        Create User            │
│ ──────────────────────────── │
│ Name:  [           ]         │
│ Email: [           ]         │
│ [Create User Button]         │
└───────────────────────────────┘

┌───────────────────────────────┐
│         User List             │
│ ──────────────────────────── │
│ Name         | Email         │
│ ------------ | -------------│
│ Alice        | alice@...    │
│ Bob          | bob@...      │
│ ...          | ...          │
└───────────────────────────────┘
```

#### Figma-Style Wireframe: Slot Creation Form & Slot List

```figma
┌────────────────────────────────────┐
│   Create Appointment Slot          │
│ ────────────────────────────────   │
│ Date:   [           ]              │
│ Time:   [           ]              │
│ [Create Slot Button]               │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│            Slot List               │
│ ────────────────────────────────   │
│ Date       | Time   | Status       │
│ ---------- | ------ | --------     │
│ 2025-08-04 | 10:00  | Open         │
│ 2025-08-04 | 11:00  | Booked       │
│ ...        | ...    | ...          │
└────────────────────────────────────┘
```

- **Left:** User creation form and user list
- **Right:** Slot creation form and slot list
- **Responsive:** Layout adapts for mobile/desktop
- **Modern UI:** Styled with Tailwind CSS

## 📦 Deployment Options
Schedulink is deployable on:
- AWS EC2 (ensure ports 3000/8000 are open)
- DigitalOcean, Google Cloud Platform
- Docker Desktop for local development

**Planned Enhancements:**
- Implement user authentication (JWT)
- Migrate from SQLite to PostgreSQL
- Enable slot booking functionality
- Integrate email notifications
