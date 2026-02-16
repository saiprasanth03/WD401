require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

app.use("/", authRoutes);
app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
