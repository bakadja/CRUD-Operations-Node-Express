const express = require("express");
const routes = require("./routes/users.js");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const { body, matchedData, validationResult } = require("express-validator");
require("dotenv").config();

const app = express();
const PORT = 5600;

// Initialize session middleware with options
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 3600000,
        },
  })
);

// Middleware for user authentication
app.use("/user", (req, res, next) => {
  let token = req.session.authorization?.accessToken; // Access Token

  // Check if user is authenticated
  if (token) {
    // Verify JWT token for user authentication
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "User not authenticated" }); // Return error if token verification fails
      }
      req.user = user; // Set authenticated user data on the request object
      next(); // Proceed to the next middleware
    });

    // Return error if no access token is found in the session
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

// Parse JSON request bodies
app.use(express.json());

// User routes
app.use("/user", routes);

// Login endpoint
app.post(
  "/login",
  body("user.username")
    .isString()
    .withMessage("Username must be a string")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .trim()
    .escape(),
  body("user.password")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .trim()
    .escape(),
  (req, res) => {
    // Validate request body
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const user = matchedData(req); // Get validated user data
      try {
        // Generate JWT access token
        let accessToken = jwt.sign(
          {
            data: user,
          },
          process.env.JWT_SECRET,
          { expiresIn: 60 * 60 }
        );

        // Store access token in session
        req.session.authorization = {
          accessToken,
        };

        return res.status(200).send("User successfully logged in");
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
    return res
      .status(400)
      .json({ message: "Validation Error", errors: errors.array() });
  }
);

// Start server
app.listen(PORT, () => console.log("Server is running at port " + PORT));
