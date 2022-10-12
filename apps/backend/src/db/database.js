const jwt = require("jsonwebtoken");
const userModel = require("./models/user");
const { createUser, createSession } = require("./models/database");

async function signup(req, res) {
  const { username, password } = req.body;
  const newUser = await createUser({
    username,
    password,
  });
  newUser.save(() => {
    return res
      .status(201)
      .send({ message: "User was registered successfully!" });
  });
}

async function login(req, res) {
  const { username, password } = req.body;
  userModel
    .findOne({
      username,
    })
    .exec((err, user) => {
      const token = jwt.sign({ id: user._id }, "JWT_SECRET", {
        expiresIn: 86400, // 24 hours
      });
      req.session.token = token;
      return res.status(200).send({
        username: user.username,
        id: user.id,
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
    return res
      .status(201)
      .send({ message: "Current session blacklisted" });
  });
}

module.exports = {
  login,
  signup,
  logout,
};
