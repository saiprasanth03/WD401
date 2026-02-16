const db = require("../config/firebase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.showSignup = (req, res) => {
  res.render("signup");
};

exports.showLogin = (req, res) => {
  res.render("login");
};

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.collection("users").add({
    name,
    email,
    password: hashedPassword,
    createdAt: new Date()
  });

  res.redirect("/login");
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const snapshot = await db.collection("users")
    .where("email", "==", email)
    .get();

  if (snapshot.empty) return res.send("User not found");

  const userDoc = snapshot.docs[0];
  const user = userDoc.data();

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.send("Invalid credentials");

  const token = jwt.sign(
    { id: userDoc.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, { httpOnly: true });
  res.redirect("/tasks/dashboard");
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
};
