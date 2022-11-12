const express = require("express");
const cookieSession = require("cookie-session");
const jwt = require("jsonwebtoken");
const { login, signup, logout } = require("./db/database");
const app = express();
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_SECRET = process.env.COOKIE_SECRET;

const ROLES = {
  ROOT: process.env.ROOT_KEY,
  COMMON: undefined
}

app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    secret: COOKIE_SECRET,
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

app.get("/", verifyToken, (req, res) => {
  return res.json({
    message: 'Hello!'
  });
});

app.post("/root", verifyToken, verifyRoles([ROLES.ROOT]), (req, res) => {
  return res.json({
    message: 'Hello Root!'
  });
});

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
    jwt.verify(token, JWT_SECRET, (err) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthenticated",
        });
      } else {
        next();
      }
    });
  }
}

function verifyRoles(allowedRoles) {
  return (req, res, next) => {
    let key;
    if(req.headers && req.headers['x-api-key']) {
      key = req.headers['x-api-key']
      let role = Object.keys(ROLES).find(ROLE => ROLES[ROLE] === key);
      let found = allowedRoles.find(item => item === ROLES[role])
      if(!found) {
        return res.status(403).json({
          message: 'Unauthorised'
        })
      } else {
        next();
      }
    }
  }
}

app.listen(3000);
