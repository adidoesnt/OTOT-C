const express = require("express");
const cookieSession = require("cookie-session");
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

app.get("/pokemon", (req, res) => {
  if (req.session.token) {
    return res.status(200).json(pokemon);
  } else {
    return res.status(403).send({ message: "You are not logged in!" });
  }
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

app.listen(3000);
