DROP DATABASE IF EXISTS powerlog;
CREATE DATABASE IF NOT EXISTS powerlog;

USE powerlog;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    user_level ENUM('admin', 'owner', 'customer') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
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

-- 2. FormQuestions Table (only Admin can add questions - enforced at application level)
CREATE TABLE FormQuestions (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Question VARCHAR(255) NOT NULL,
    Answer VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- No user_id/added_by - control handled in backend
);

-- 3. WorkoutForms Table (only Admin can add entries - enforced at application level)
CREATE TABLE WorkoutForms (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    workout_program VARCHAR(255) NOT NULL,
    times_performed INT NOT NULL CHECK (times_performed >= 1 AND times_performed <= 100),
    weight_kg DECIMAL(5, 2) NOT NULL,
    sets ENUM('3X', '2X') NOT NULL,
    video VARCHAR(255),
    photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    -- No user_id - only Admin adds via backend
);

-- 4. FormAnswers Table
CREATE TABLE FormAnswers (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    form_question_id INT,
    Answer TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(Id),
    FOREIGN KEY (form_question_id) REFERENCES FormQuestions(Id)
);

-- 5. Workouts Table (assigned to users - track if done)
CREATE TABLE Workouts (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    workout_form_id INT,
    workout_program VARCHAR(255) NOT NULL,
    times_performed INT NOT NULL CHECK (times_performed >= 1 AND times_performed <= 100),
    weight_kg DECIMAL(5, 2) NOT NULL,
    sets ENUM('3X', '2X') NOT NULL,
    video VARCHAR(255),
    photo VARCHAR(255),
    is_done ENUM('yes', 'no') DEFAULT 'no',
    completion_time TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(Id),
    FOREIGN KEY (workout_form_id) REFERENCES WorkoutForms(Id)
);

-- 6. Food Table
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

-- 7. BMI Table
CREATE TABLE BMI (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    weight DECIMAL(5, 2) NOT NULL,
    height DECIMAL(5, 2) NOT NULL,
    bmi_value DECIMAL(5, 2) AS (weight / (height * height)) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(Id)
);

