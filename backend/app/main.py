from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine

from .routers import (
    auth,
    projects,
    help_requests,
    student_requests,
    dashboard,
    users_router,
    messages,
)

# Create any missing database tables.
# Existing tables and data are not deleted.
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="ProjectForge API",
    description="Engineering Project Resource Hub API",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Routers
# ============================================================

app.include_router(auth.router)

app.include_router(projects.router)

app.include_router(help_requests.router)

app.include_router(student_requests.router)

app.include_router(dashboard.router)

app.include_router(users_router.router)

app.include_router(messages.router)


# ============================================================
# Health Check
# ============================================================

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "ProjectForge API"
    }