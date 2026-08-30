"""Lecture 5 lab exercise: a RESTful Course Management API."""

from typing import Optional

from fastapi import FastAPI, HTTPException, Query, status
from pydantic import BaseModel, Field

app = FastAPI(title="Course Management API", version="1.0.0")


class Course(BaseModel):
    id: int
    title: str
    credits: int
    department: str


class CourseCreate(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    credits: int = Field(ge=1, le=10)
    department: str = Field(min_length=1, max_length=50)


courses: list[Course] = [
    Course(id=1, title="Data Structures", credits=4, department="CSE"),
    Course(id=2, title="Digital Electronics", credits=3, department="ECE"),
    Course(id=3, title="Database Systems", credits=4, department="CSE"),
]
next_id = 4


@app.get("/courses", response_model=list[Course], tags=["Courses"])
def list_courses(
    department: Optional[str] = Query(default=None, min_length=1),
) -> list[Course]:
    if department is None:
        return courses
    return [course for course in courses if course.department.casefold() == department.casefold()]


@app.get("/courses/{course_id}", response_model=Course, tags=["Courses"])
def get_course(course_id: int) -> Course:
    for course in courses:
        if course.id == course_id:
            return course
    raise HTTPException(status_code=404, detail="Course not found")


@app.post("/courses", response_model=Course, status_code=status.HTTP_201_CREATED, tags=["Courses"])
def create_course(course: CourseCreate) -> Course:
    global next_id
    new_course = Course(id=next_id, **course.model_dump())
    courses.append(new_course)
    next_id += 1
    return new_course


@app.put("/courses/{course_id}", response_model=Course, tags=["Courses"])
def update_course(course_id: int, course: CourseCreate) -> Course:
    for index, existing_course in enumerate(courses):
        if existing_course.id == course_id:
            updated_course = Course(id=course_id, **course.model_dump())
            courses[index] = updated_course
            return updated_course
    raise HTTPException(status_code=404, detail="Course not found")


@app.delete("/courses/{course_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Courses"])
def delete_course(course_id: int) -> None:
    for index, course in enumerate(courses):
        if course.id == course_id:
            courses.pop(index)
            return None
    raise HTTPException(status_code=404, detail="Course not found")
