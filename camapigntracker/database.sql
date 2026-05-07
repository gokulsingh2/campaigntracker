
-- Paste the contents of camapigntracker/database.sql and run it
CREATE DATABASE campaign_tracker;
USE campaign_tracker;

CREATE TABLE users ( ... );
CREATE TABLE campaigns ( ... );

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  source VARCHAR(100),
  medium VARCHAR(100),
  budget DECIMAL(10,2),
  user_id INT
);

CREATE TABLE clicks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  campaign_id INT,
  ip_address VARCHAR(45),
  device VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  campaign_id INT,
  conversion_type VARCHAR(100),
  revenue DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);