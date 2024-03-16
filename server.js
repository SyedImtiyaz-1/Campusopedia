const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 4000;
app.use(cookieParser());

// Connect to the SQLite database
const db = new sqlite3.Database("data.db");
const db2 = new sqlite3.Database("info.db");

// Create a table for users if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
    )
`);

db2.run(`
    CREATE TABLE IF NOT EXISTS data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        status TEXT,
        dateTime TEXT
    )
`);
// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(__dirname + "/public"));

// Registration endpoint
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  console.log("Received data:", name, email, password); // Add this line for logging

  // Insert the user into the database
  db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error registering user");
      }
      res.status(201).send("User registered successfully");
      res.redirect("/login.html"); // Redirect to the login page
    }
  );
});

// Login endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists in the database
  db.get(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error logging in");
      }
      if (!row) {
        return res.status(401).send("Invalid email or password");
      }

      // Set session variable or cookie to indicate user is logged in
      res.cookie("loggedIn", true);
      // Set another cookie to store the username
      res.cookie("username", row.name);

      // Redirect to the attendance page after successful login
      res.redirect("/index.html");
    }
  );
});

// Route to handle attendance data
app.post("/attendance", (req, res) => {
  const { status, dateTime } = req.body;
  const username = req.cookies.username; // Retrieve username from cookie
  if (!username) {
    return res.status(401).send("User not authenticated");
  }

  // Insert attendance data into the database
  db2.run(
    "INSERT INTO data (username, status, dateTime) VALUES (?, ?, ?)",
    [username, status, dateTime],
    (err) => {
      if (err) {
        console.error("Error marking attendance:", err);
        return res.status(500).send("Error marking attendance");
      }
      console.log("Attendance marked successfully");
      // res.sendStatus(200); // Send success response
      res.redirect("/attendance.html");
    }
  );
});

// Endpoint to handle chatbot question
app.post("/ask", (req, res) => {
  const { question } = req.body;

  // Example logic to generate a response based on the question
  let response;
  switch (question.toLowerCase()) {
    case "hi":
      response = "Hello, How can I help you today ?";
      break;
    case "what is javascript?":
      response = "JavaScript is a programming language commonly used for web development.";
      break;
    case "how does express work?":
      response = "Express is a web application framework for Node.js used for building web applications and APIs.";
      break;
    case "which book is the best ?":
      response = "Alchemist is the best selling and a great book. Consider reading that one.";
      break;
    case "which technology is used to build this application":
      response = "HTML, CSS, JavaScript, Sqlite3, Node, Express";
      break;
    case "top 3 books ?":
        response = "Alchemist, Frankenstein, Girl At War, A Little Princess";
        break;
    case "what is campusopedia ?":
        response = "Campusopedia is a website which suggest us the best books to read and learn new things from it. It founded by the Final Year Students in March 2024. It also allows user to make a consistency by making presenty.";
        break;
    default:
      response = "Sorry, I didn't understand that question.";
  }

  res.json({ response });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
