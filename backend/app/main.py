import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.routers import auth_router, users_router, projects_router, requests_router, dashboard_router
from app import models, auth

from contextlib import asynccontextmanager

# Automatic Database Seeder function
def startup_seed_database():
    db = SessionLocal()
    try:
        if db.query(models.User).count() == 0:
            print("[INFO] Database empty. Seeding initial engineering projects and student profiles...")
            
            # Create Sample Students
            student1 = models.User(
                full_name="Alex Chen",
                email="alex.chen@university.edu",
                department="Computer Science",
                hashed_password=auth.hash_password("student123"),
                bio="Passionate about embedded systems, robotics control, and real-time C++ applications."
            )
            student2 = models.User(
                full_name="Sarah Jenkins",
                email="sarah.j@university.edu",
                department="Robotics & Mechatronics",
                hashed_password=auth.hash_password("student123"),
                bio="3rd year robotics student specializing in ROS 2, computer vision, and autonomous navigation."
            )
            student3 = models.User(
                full_name="Marcus Vance",
                email="marcus.vance@university.edu",
                department="Electrical Engineering",
                hashed_password=auth.hash_password("student123"),
                bio="Focused on PCB design, microcontrollers (ESP32/Arduino), and IoT sensors."
            )
            student4 = models.User(
                full_name="Elena Rostova",
                email="elena.r@university.edu",
                department="Software Engineering",
                hashed_password=auth.hash_password("student123"),
                bio="Building machine learning models for signal processing and web apps using Next.js & Python."
            )
            
            db.add_all([student1, student2, student3, student4])
            db.commit()

            # Create Sample Projects across engineering categories
            p1 = models.Project(
                title="Autonomous Rover with ROS 2 & LiDAR Navigation",
                description="Designed and built a 4-wheel differential drive robot equipped with RPLIDAR A1 and ROS 2 Navigation Stack (Nav2). Achieved real-time SLAM mapping and obstacle avoidance inside the department building.",
                category="Robotics",
                technologies="ROS 2, C++, Python, LiDAR, Linux",
                github_link="https://github.com/example/ros2-autonomous-rover",
                demo_link="https://youtube.com/watch?v=demo-rover",
                author_id=student2.id
            )
            p2 = models.Project(
                title="Smart Agriculture ESP32 Node & Sensor Dashboard",
                description="IoT environmental monitoring station using ESP32 microcontroller, LoRa transceiver, soil moisture sensors, and DHT22. Transmits sensor data to a cloud dashboard for real-time visualization.",
                category="Embedded Systems",
                technologies="ESP32, C++, Arduino, LoRa, MQTT, C++",
                github_link="https://github.com/example/esp32-smart-agri",
                demo_link="https://demo.smartagri.org",
                author_id=student3.id
            )
            p3 = models.Project(
                title="AI Powered PCB Component Defect Detector",
                description="Computer vision system trained on YOLOv8 to detect surface-mount device soldering defects on printed circuit boards during manual assembly. Includes custom OpenCV preprocessing pipeline.",
                category="ML/AI",
                technologies="Python, PyTorch, OpenCV, YOLOv8, C++",
                github_link="https://github.com/example/pcb-defect-ai",
                demo_link=None,
                author_id=student4.id
            )
            p4 = models.Project(
                title="Quadruped Robot Leg Mechanism CAD & Kinematics",
                description="3D printed 3-DOF robot leg design modeled in SolidWorks. Uses inverse kinematics calculations in Python to achieve smooth trochoidal gait generation for rough terrain walking.",
                category="Mechanical/CAD",
                technologies="SolidWorks, Python, C++, 3D Printing, Kinematics",
                github_link="https://github.com/example/quadruped-leg-kinematics",
                demo_link=None,
                author_id=student1.id
            )
            p5 = models.Project(
                title="Real-Time ECG Signal Filtering Firmware",
                description="Embedded C application running on STM32 Nucleo microcontroller. Processes biopotential ECG signals using digital Butterworth IIR filter to remove 50Hz powerline interference in real time.",
                category="Embedded Systems",
                technologies="STM32, C, C++, FreeRTOS, Digital Signal Processing",
                github_link="https://github.com/example/stm32-ecg-filter",
                demo_link=None,
                author_id=student1.id
            )

            db.add_all([p1, p2, p3, p4, p5])
            db.commit()

            # Create sample help requests
            req1 = models.HelpRequest(
                project_id=p1.id,
                requester_id=student1.id,
                recipient_id=student2.id,
                message="Hi Sarah, I am working on a similar ROS 2 project for my Mechatronics course. Could you share how you configured your Nav2 costmaps for indoor obstacle avoidance?",
                status="Pending"
            )
            req2 = models.HelpRequest(
                project_id=p2.id,
                requester_id=student4.id,
                recipient_id=student3.id,
                message="Hey Marcus, loved your ESP32 IoT node! I want to integrate similar LoRa sensors into my ML telemetry pipeline. Would love 15 mins of guidance on LoRa module wiring.",
                status="Accepted"
            )
            db.add_all([req1, req2])
            db.commit()
            print("[INFO] Seed data populated successfully!")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    startup_seed_database()
    yield

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ProjectForge API",
    description="Backend API for Engineering Student Project Sharing and Collaboration Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router.router)
app.include_router(users_router.router)
app.include_router(projects_router.router)
app.include_router(requests_router.router)
app.include_router(dashboard_router.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "ProjectForge API",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8008, reload=True)

