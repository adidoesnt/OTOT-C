const express = require("express");
const cookieSession = require("cookie-session");
const jwt = require("jsonwebtoken");
const { login, signup, logout } = require("./db/database");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    secret: "COOKIE_SECRET",
    httpOnly: true,
  })
);

const pokemon = [
  {
    name: "bulbasaur",
    type: "grass",
  },
  {
    name: "charmander",
    type: "fire",
  },
  {
    name: "squirtle",
    type: "water",
  },
];

app.get("/pokemon", verifyToken, (req, res) => {
  return res.json(pokemon);
});

app.post("/signup", async (req, res) => {
  await signup(req, res);
});

app.post("/login", async (req, res) => {
  await login(req, res);
});

app.post("/logout", async (req, res) => {
  await logout(req, res);
});

function verifyToken(req, res, next) {
  const token = req.session.token;
  if (!token) {
    res.status(401).send({ message: "Unauthenticated" });
    return;
  } else {
    jwt.verify(token, "JWT_SECRET", (err) => {
      if (err) {
        return res.status(403).send({
          message: "Unauthorised",
        });
      } else {
        next();
      }
    });
  }
}

app.listen(3000);
