-- Create Database if not already created and use the database.

CREATE DATABASE IF NOT EXISTS supermarket_schema;

use supermarket_schema;

-- Create Table Supermarket Submissions if not already created.
CREATE TABLE IF NOT EXISTS product_submissions (
    submission_id INT AUTO_INCREMENT PRIMARY KEY,
    market_name VARCHAR(150) NOT NULL,
    created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--  Create Table for Captured Images if not already created.
CREATE TABLE IF NOT EXISTS product_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT NOT NULL,
    image_data MEDIUMBLOB NOT NULL,
    data_type VARCHAR(50) NOT NULL,
    image_classification ENUM("Shelf", "Product", "Receipt") NOT NULL,
    FOREIGN KEY (submission_id)
    REFERENCES product_submissions(submission_id)
    ON DELETE CASCADE
);

-- Create Table for the Product Entries
CREATE TABLE IF NOT EXISTS product_entries (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_id INT NULL,

    FOREIGN KEY (submission_id)
    REFERENCES product_submissions(submission_id)
    ON DELETE CASCADE,

    FOREIGN KEY (image_id)
    REFERENCES product_images(image_id)
    ON DELETE SET NULL,
    CHECK (price >= 0)
);

-- Show created tables
SHOW TABLES;

SELECT * FROM product_submissions;
SELECT * FROM product_entries;

SELECT * FROM product_images;