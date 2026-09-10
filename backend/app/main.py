from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import auth, projects, help_requests

import os


# Create database tables if they do not already exist
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="ProjectForge API",
    description="University Student Engineering Project Hub API",
    version="1.0.0"
)


# CORS configuration
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
origins = [
    o.strip()
    for o in allowed_origins_env.split(",")
    if o.strip()
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API routers
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(help_requests.router)


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "ProjectForge API"
    }