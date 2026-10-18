# Student & Course Manager

A full-stack web application to manage students and the courses they are enrolled in.
Both entities support Create, Read, Update and Delete (CRUD).

## Technologies
- React 18 (Vite) – components, state, props, event handlers (frontend, `frontend/`)
- Bootstrap 5 + custom CSS (`frontend/src/styles.css`) – layout, forms, tables, buttons
- Spring Boot 3 (Java 17) – REST controllers, service classes, Spring Data JPA (`backend/`)
- H2 file database by default (MySQL supported by changing `application.properties`)
- Tools: Eclipse (backend), VS Code (frontend), Postman (API testing), browser developer tools

## Prerequisites
- Java 17 or newer, Node.js 18 or newer
- Eclipse (with built-in Maven support) or any Maven setup

## Run the backend (port 8080)
1. Eclipse: File > Import > Maven > Existing Maven Projects > choose the `backend` folder.
2. Right-click `StudentManagerApplication.java` > Run As > Java Application.
3. Check http://localhost:8080/api/courses in a browser – you should see JSON.

## Run the frontend (port 5173)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## REST API
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/students, /api/courses | List records |
| GET | /api/students/{id}, /api/courses/{id} | Get one record |
| POST | /api/students, /api/courses | Create a record |
| PUT | /api/students/{id}, /api/courses/{id} | Update a record |
| DELETE | /api/students/{id}, /api/courses/{id} | Delete a record |

Example body for POST /api/students:
`{ "name": "Meera", "email": "meera@example.com", "courseId": 1 }`

## Database
Tables `courses` and `students`. `students.course_id` is a foreign key to `courses.id`
(one course has many students). View data at http://localhost:8080/h2-console
(JDBC URL `jdbc:h2:file:./data/studentdb`, user `sa`, empty password).

## API / base URL configuration
- Frontend: the API base URL is set in `frontend/src/api.js` (`http://localhost:8080/api`).
- Backend: the port and database settings are in `backend/src/main/resources/application.properties`
  (`server.port=8080`, H2 file database `jdbc:h2:file:./data/studentdb`).
- CORS: the backend allows requests from `http://localhost:5173` (see `WebConfig.java`).

## Test credentials
- The application itself has no login.
- H2 console (development only): JDBC URL `jdbc:h2:file:./data/studentdb`, user `sa`, empty password.
- No real passwords, API keys or access tokens are included in this project.

## Sample data
Three courses and two students are added automatically the first time the backend starts.

## Known limitations
- No login/authentication.
- A course that still has students cannot be deleted (the API returns an error message).
