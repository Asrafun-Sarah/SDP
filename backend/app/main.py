from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .models import User, Project, HelpRequest
from .auth import get_password_hash
from .routers import auth, projects, help_requests

import os

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ProjectForge API",
    description="University Student Engineering Project Hub API",
    version="1.0.0"
)

allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(help_requests.router)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "ProjectForge API"}

@app.on_event("startup")
def seed_data():
    db = SessionLocal()
    try:
        if db.query(User).count() == 0:
            demo_pwd = get_password_hash("password123")
            student1 = User(
                name="Alex Chen",
                email="alex@engineering.edu",
                hashed_password=demo_pwd,
                department="Electrical & Computer Engineering",
                bio="Senior ECE student focusing on robotics and embedded microcontrollers.",
                demonstrated_skills="C++, Arduino, STM32, Circuit Design, ROS 2"
            )
            student2 = User(
                name="Sophia Rodriguez",
                email="sophia@engineering.edu",
                hashed_password=demo_pwd,
                department="Robotics & Mechatronics",
                bio="Mechatronics major interested in autonomous navigation and CAD enclosures.",
                demonstrated_skills="Python, SolidWorks, MATLAB, Computer Vision, Raspberry Pi"
            )
            db.add(student1)
            db.add(student2)
            db.commit()
            db.refresh(student1)
            db.refresh(student2)

            proj1 = Project(
                title="Autonomous Rover with ROS 2 & LiDAR Navigation",
                description="A 4-wheel drive mobile robot using ROS 2, RPLiDAR A1, and STM32 microcontroller for indoor map building and SLAM navigation.",
                category="Robotics",
                tech_stack="C++, Python, ROS 2, STM32, KiCad",
                github_url="https://github.com/example/ros2-rover",
                demo_url="https://youtube.com",
                user_id=student2.id
            )
            proj2 = Project(
                title="IoT Smart Power Meter & Voltage Monitor",
                description="Non-invasive current sensor paired with ESP32 board to log energy usage and transmit data via MQTT to a live dashboard.",
                category="Embedded Systems",
                tech_stack="C++, ESP32, MQTT, React, SQLite",
                github_url="https://github.com/example/smart-power",
                demo_url="",
                user_id=student1.id
            )
            db.add(proj1)
            db.add(proj2)
            db.commit()
            db.refresh(proj1)

            help1 = HelpRequest(
                title="SPI Bus Signal Noise on STM32F4 Board",
                description="Encountering intermittent SPI communication loss with MPU6050 sensor. Need help reviewing signal integrity or pull-up resistor values.",
                category="Circuit Design",
                status="Pending",
                project_id=proj2.id,
                user_id=student1.id
            )
            help2 = HelpRequest(
                title="SolidWorks Enclosure Tolerance Review",
                description="Looking for feedback on clearance tolerances for 3D-printed PLA snap-fit joint before sending to lab printer.",
                category="Mechanical/CAD",
                status="Pending",
                project_id=proj1.id,
                user_id=student2.id
            )
            db.add(help1)
            db.add(help2)
            db.commit()
    finally:
        db.close()
