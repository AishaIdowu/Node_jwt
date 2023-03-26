const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the API",
  });
});

app.post("/api/posts", verifyToken, (req, res) => {

  jwt.verify(req.token, 'secretKey', (error, authData) => {
    if(error) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post created....',

        authData
      })
    }
  })

  res.json({
    message: "Post created...",
  });
});

// Token
app.post("/api/login", (req, res) => {
  // Mock user
  const user = {
    id: 1,
    username: "Aisha",
    email: "aisha@gmail.com",
  };

  jwt.sign({ user: user }, "secretKey",{expiresIn:'60s'}, (error, token) => {
    res.json({
      token,
    });
  });
});

// FORMAT OF TOKEN
// Authorzation: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is udefined
  if (typeof bearerHeader !== "undefined") {
    // split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next Middleware
    next();
  } else {
    // forbidden
    res.sendStatus(403);
  }
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`The server is on port ${PORT}`));
