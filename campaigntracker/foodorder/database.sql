CREATE DATABASE food_order;

USE food_order;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(100)
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    item VARCHAR(100),
    price INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);