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
    product_name VARCHAR(150) NOT NULL,
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

DESCRIBE product_submissions;
DESCRIBE product_entries;
DESCRIBE product_images;

SELECT * FROM product_submissions;
SELECT * FROM product_entries;
SELECT image_id, submission_id, image_classification
FROM product_images;

SELECT
    s.submission_id AS submission_id,
    s.market_name,
    p.product_name,
    p.price,
    p.image_id,
    i.image_classification
FROM product_submissions s
JOIN product_entries p
    ON s.submission_id = p.submission_id
LEFT JOIN product_images i
    ON p.image_id = i.image_id
ORDER BY s.submission_id DESC;