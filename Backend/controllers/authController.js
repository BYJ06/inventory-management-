const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connection = require("../config/database");

const registerUser = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }
  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: "Error hashing password" });
    }

    // The role is NOT taken from the request: everyone starts as "user"
    // (the DB default). Promote admins manually in MySQL.
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    connection.query(sql, [name, email, hashedPassword], (error) => {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "Email already registered" });
        }
        console.error(error);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(201).json({ message: "User registered successfully" });
    });
  });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  connection.query(sql, [email], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Database error" });
    }

    // Same message for "no such email" and "wrong password"
    // so attackers can't find out which emails exist.
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: "Error comparing passwords" });
      }
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ message: "Login successful", token, role: user.role });
    });
  });
};

module.exports = { registerUser, loginUser };
