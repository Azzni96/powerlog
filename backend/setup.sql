
-- Drop and recreate database
DROP DATABASE IF EXISTS powerlog;
CREATE DATABASE IF NOT EXISTS powerlog;
USE powerlog;

-- 1. Users Table
Expand
sql.txt
7 KB
@ide  @Jay <3  @Waltteri  nyt uusi versioi sql
yritä nyt tarkistaa jos sitä on hyvää tai ei
Waltteri — 09/04/2025 22:39
Checkkaan huomen
﻿
-- Drop and recreate database
DROP DATABASE IF EXISTS powerlog;
CREATE DATABASE IF NOT EXISTS powerlog;
USE powerlog;

-- 1. Users Table
CREATE TABLE Users (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    User_level ENUM('Admin', 'Customer', 'Owner') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. WorkoutForms Table
CREATE TABLE WorkoutForms (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(100),                        -- uusi: kategoria (esim. "PPL", "UPPER/LOWER", "FULLBODY")
    workout_program VARCHAR(255) NOT NULL,        -- ohjelman nimi (esim. "Perusvoima 1")
    exercise_name VARCHAR(255) NOT NULL,          -- uusi: yksittäisen liikkeen nimi (esim. "Kyykky", "Penkkipunnerrus")
    times_performed INT NOT NULL CHECK (times_performed >= 1 AND times_performed <= 100),
    weight_kg DECIMAL(5, 2) NOT NULL,
    sets ENUM('3X', '2X') NOT NULL,
    description TEXT,
    duration_minutes INT,
    difficulty ENUM('easy','medium','hard'),
    video VARCHAR(255),
    photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- 3. Workouts Table
CREATE TABLE Workouts (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    workout_form_id INT,
    workout_program VARCHAR(255) NOT NULL,
    exercise_name VARCHAR(255) NOT NULL,   
    times_performed INT NOT NULL CHECK (times_performed >= 1 AND times_performed <= 100),
    weight_kg DECIMAL(5, 2) NOT NULL,
    sets ENUM('3X', '2X') NOT NULL,
    description TEXT,
    duration_minutes INT,
    difficulty ENUM('easy','medium','hard'),
    video VARCHAR(255),
    photo VARCHAR(255),
    is_done ENUM('yes', 'no') DEFAULT 'no',
    completion_time TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(Id),
    FOREIGN KEY (workout_form_id) REFERENCES WorkoutForms(Id)
);

-- 4. Food Table
CREATE TABLE Food (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    meals_per_day INT CHECK (meals_per_day >= 1 AND meals_per_day <= 10),
    meal_time TIME,
    meal_type VARCHAR(255),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(Id)
);

-- 5. BMI Table
CREATE TABLE BMI (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    weight DECIMAL(5, 2) NOT NULL,
    height DECIMAL(5, 2) NOT NULL,
    bmi_value DECIMAL(5, 2) AS (weight / (height * height)) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(Id)
);

-- 6. FormsQuestions Table
CREATE TABLE FormsQuestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    max INT DEFAULT 1,
    answer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. FormsAnswers Table
CREATE TABLE FormsAnswers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    answer_text VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES FormsQuestions(id) ON DELETE CASCADE
);

-- 8. FormAnswers Table
CREATE TABLE FormAnswers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    form_question_id INT,
    Answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_question_id) REFERENCES FormsQuestions(id) ON DELETE CASCADE
);

-- 9. UserProfiles Table
CREATE TABLE User_Profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    gender VARCHAR(10),
    age INT,
    height INT,
    weight INT,
    workout_days INT,
    calorie_target INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);