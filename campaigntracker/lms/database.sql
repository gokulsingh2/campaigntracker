-- Paste the contents of camapigntracker/lms/database.sql and run it
CREATE DATABASE lms;
USE lms;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT
);

CREATE TABLE enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    course_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

INSERT INTO courses (title, description) VALUES
('Web Development', 'Learn HTML, CSS, JS'),
('Python Programming', 'Beginner to Advanced'),
('Database Systems', 'SQL & DB Design');dat