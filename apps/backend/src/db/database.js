const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("./models/user");
const { createUser, createSession } = require("./models/database");

async function signup(req, res) {
  const { username, password } = req.body;
  const salt = await bcryptjs.genSalt(16);
  const hash = await bcryptjs.hash(password, salt);
  const newUser = await createUser({
    username,
    password: hash,
  });
  newUser.save(() => {
    return res
      .status(201)
      .send({ message: "User registered" });
  });
}

async function login(req, res) {
  const { username, password } = req.body;
  userModel
    .findOne({
      username,
    })
    .exec((err, user) => {
      const correctPassword = bcryptjs.compareSync(password, user.password);
      if (!correctPassword) {
        return res.status(401).send({ message: "Incorrect password" });
      }
      const token = jwt.sign({ id: user._id }, "JWT_SECRET", {
        // generate secret and store in env variable
        expiresIn: 86400, // 24 hours
      });
      req.session.token = token;
      return res.status(200).send({
        username: user.username,
        id: user._id,
        message: "You've been logged in!",
      });
    });
}

async function logout(req, res) {
  const newSession = await createSession({
    token: req.session.token,
  });
  newSession.save(() => {
    req.session = null;
    return res.status(201).send({ message: "Current session blacklisted" });
  });
}

module.exports = {
  login,
  signup,
  logout,
};
