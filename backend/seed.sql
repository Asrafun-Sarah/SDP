-- Optional sample data so the app has something to show right after setup.
-- Run this AFTER schema.sql. Passwords below are the bcrypt hash of "password123".

INSERT INTO users (full_name, email, password_hash, department, academic_year, bio) VALUES
('Sarah Ahmed', 'sarah@example.com', '$2b$10$examplehashexamplehashexamplehashexampleh', 'ECE', '2nd Year', 'Interested in embedded systems.'),
('Rafiul Islam', 'rafiul@example.com', '$2b$10$examplehashexamplehashexamplehashexampleh', 'CSE', '3rd Year', 'Working mostly on web and mobile apps.')
ON CONFLICT (email) DO NOTHING;

INSERT INTO technologies (name) VALUES
('Arduino'), ('C++'), ('ESP32'), ('Python'), ('JavaScript'), ('Sensors'), ('Raspberry Pi')
ON CONFLICT (name) DO NOTHING;

INSERT INTO projects (user_id, title, description, department, course, academic_year, project_type, report_file_url, source_code_url, presentation_url) VALUES
(1, 'Smart Home Automation', 'A smart home system developed using Arduino and sensors to control lights and appliances remotely.', 'ECE', 'Microprocessor', '2026', 'Hardware', NULL, NULL, NULL),
(1, 'IoT Temperature Monitoring', 'A temperature monitoring system using ESP32 that logs readings and displays them on a simple dashboard.', 'ECE', 'Embedded Systems', '2026', 'Hardware', NULL, NULL, NULL),
(2, 'Line Following Robot', 'A robot that follows a line using IR sensors and a simple control algorithm written in C++.', 'CSE', 'Robotics', '2025', 'Hardware', NULL, NULL, NULL);

INSERT INTO project_technologies (project_id, technology_id)
SELECT p.id, t.id FROM projects p, technologies t
WHERE (p.title = 'Smart Home Automation' AND t.name IN ('Arduino', 'C++', 'Sensors'))
   OR (p.title = 'IoT Temperature Monitoring' AND t.name IN ('Arduino', 'ESP32'))
   OR (p.title = 'Line Following Robot' AND t.name IN ('C++', 'Sensors'));
