# Lecture 5: RESTful APIs and FastAPI

This folder covers REST design and implements the hands-on FastAPI CRUD task from the lecture slides.

## REST quick reference

| Operation | HTTP method | Student endpoint | Success status |
| --- | --- | --- | --- |
| List | `GET` | `/students` | `200 OK` |
| Read one | `GET` | `/students/{id}` | `200 OK` |
| Create | `POST` | `/students` | `201 Created` |
| Replace | `PUT` | `/students/{id}` | `200 OK` |
| Delete | `DELETE` | `/students/{id}` | `204 No Content` |

REST uses resource-based, plural-noun URLs such as `/students`, remains stateless, and returns appropriate HTTP status codes. The API documentation is generated automatically by FastAPI.

## Setup

From the project root in PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
python -m pip install -r Theory\L05-RESTful-APIs-FastAPI\requirements.txt
```

The required packages are FastAPI (validation and API framework) and Uvicorn (development server).

## Task 1: Student Management API

Run:

```powershell
cd Theory\L05-RESTful-APIs-FastAPI
..\..\.venv\Scripts\python.exe main.py
```

Visit [Swagger UI](http://127.0.0.1:5000/docs) and [ReDoc](http://127.0.0.1:5000/redoc). The API stores sample data in memory, so restarting the server resets it.

### Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/students` | List every student |
| `GET` | `/students?branch=CSE` | Filter students by branch |
| `GET` | `/students/1` | Get one student |
| `POST` | `/students` | Create a student |
| `PUT` | `/students/1` | Replace a student |
| `DELETE` | `/students/1` | Delete a student |

Example create request body:

```json
{
  "name": "Priya",
  "branch": "CSE"
}
```

## Lab exercise: Course Management API

`course_api.py` completes the course-resource lab. Run it with:

```powershell
cd Theory\L05-RESTful-APIs-FastAPI
..\..\.venv\Scripts\python.exe -m uvicorn course_api:app --reload --port 5001
```

Use `http://127.0.0.1:5001/docs`. It provides all five CRUD operations and supports `GET /courses?department=CSE`.

## Concepts used

- `BaseModel` validates request and response data.
- `list[Student]` and `Optional[str]` describe list and optional query values.
- `Query` defines the optional filter query parameter.
- `HTTPException` returns a clean `404` response when a resource is missing.
- `response_model` documents and validates outgoing data.
