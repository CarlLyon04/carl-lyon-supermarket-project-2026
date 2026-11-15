# Supermarket Price Tracker

A simple web application for recording supermarket visits, logging product prices, and attaching a photo of a shelf, product, or receipt. Submissions are saved to a MySQL database.

Built with **HTML, CSS, vanilla JavaScript, Node.js, Express, and MySQL**.

## Features

- Enter the name of the supermarket visited.
- Add multiple products and prices to one submission; remove extra product rows if needed.
- Optionally select or capture a **JPEG, PNG, or WebP** photo (up to **5 MB**) and clear it before submitting.
- Associate the photo with the logged products and save the complete submission to MySQL.
- Validate form data and show a success or error message.
- Disable the Submit button while a request is in progress to avoid repeated clicks.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | HTML5, CSS3, vanilla JavaScript |
| Backend | Node.js, Express |
| Database | MySQL (accessed using `mysql2`) |
| Image storage | MySQL binary/BLOB column |
| Configuration | `dotenv` |

## Project Structure

```text
supermarket-price-app/
├── public/
│   ├── index.html       # Submission form
│   ├── style.css        # Page styling
│   └── script.js        # Form interactions and API request
├── src/
│   ├── server.js        # Express server and submission endpoint
│   └── db.js            # MySQL connection pool
├── database.sql         # Database setup script
├── .env                 # Local environment variables (not committed)
├── .gitignore
├── package.json
└── package-lock.json
```

## Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) and npm
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)

### 1. Install dependencies

From the project root, run:

```bash
npm install
```

If starting from a new `package.json`, the required packages are:

```bash
npm install express mysql2 dotenv
```

### 2. Set up MySQL

Start your local MySQL server. Create the database and tables using the project's `database.sql` file, if available, or execute your schema in MySQL Workbench.

The application uses three tables:

| Table | Purpose |
| --- | --- |
| `product_submissions` | Supermarket name and submission details |
| `product_entries` | Product names, prices, and their submission/image references |
| `product_images` | Image bytes, format, classification, and submission reference |

A submission can contain multiple product entries. One saved image can be associated with multiple entries from the same submission.

### 3. Configure environment variables

Create a `.env` file in the project root:

```dotenv
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=supermarket_app
PORT=3000
```

Replace the sample values with your local MySQL credentials and actual database name. Keep `.env` out of version control and use a dedicated database user instead of `root` for deployment.

### 4. Start the application

```bash
node src/server.js
```

Open **http://localhost:3000** in your browser.

## How to Use

1. Enter the supermarket name.
2. Enter a product name and price. Use **Add Product** to add more rows, or **Remove Product** to remove an added row.
3. Optionally choose/capture an image, select **Shelf**, **Product**, or **Receipt**, or clear the selected image.
4. Click **Submit Prices**. A successful request saves the submission and resets the form.

## Notes

- The browser sends an image as a Base64 data URL; the backend converts it to binary data and stores it in MySQL. No `uploads/` directory or Multer dependency is required.
- The project currently runs locally. A hosted deployment requires a reachable MySQL database and appropriate environment configuration.