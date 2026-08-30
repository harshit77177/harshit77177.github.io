"""Lecture 5 task: a RESTful Student Management API."""

from typing import Optional

import uvicorn
from fastapi import FastAPI, HTTPException, Query, status
from pydantic import BaseModel, Field

app = FastAPI(title="Student Management API", version="1.0.0")


class Student(BaseModel):
    id: int
    name: str
    branch: str


class StudentCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    branch: str = Field(min_length=1, max_length=50)


students: list[Student] = [
    Student(id=1, name="Aarav", branch="CSE"),
    Student(id=2, name="Diya", branch="ECE"),
    Student(id=3, name="Rohan", branch="IT"),
]
next_id = 4


@app.get("/", tags=["Health"])
def read_root() -> dict[str, str]:
    return {"message": "Student Management API is running"}


@app.get("/students", response_model=list[Student], tags=["Students"])
def list_students(
    branch: Optional[str] = Query(default=None, min_length=1),
) -> list[Student]:
    """Return every student, or only students from one branch."""
    if branch is None:
        return students
    return [student for student in students if student.branch.casefold() == branch.casefold()]


@app.get("/students/{student_id}", response_model=Student, tags=["Students"])
def get_student(student_id: int) -> Student:
    for student in students:
        if student.id == student_id:
            return student
    raise HTTPException(status_code=404, detail="Student not found")


@app.post(
    "/students",
    response_model=Student,
    status_code=status.HTTP_201_CREATED,
    tags=["Students"],
)
def create_student(student: StudentCreate) -> Student:
    global next_id
    new_student = Student(id=next_id, **student.model_dump())
    students.append(new_student)
    next_id += 1
    return new_student


@app.put("/students/{student_id}", response_model=Student, tags=["Students"])
def update_student(student_id: int, student: StudentCreate) -> Student:
    for index, existing_student in enumerate(students):
        if existing_student.id == student_id:
            updated_student = Student(id=student_id, **student.model_dump())
            students[index] = updated_student
            return updated_student
    raise HTTPException(status_code=404, detail="Student not found")


@app.delete(
    "/students/{student_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Students"]
)
def delete_student(student_id: int) -> None:
    for index, student in enumerate(students):
        if student.id == student_id:
            students.pop(index)
            return None
    raise HTTPException(status_code=404, detail="Student not found")


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True)
