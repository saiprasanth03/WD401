const db = require("../config/firebase");

exports.getDashboard = async (req, res) => {
  const snapshot = await db.collection("tasks")
    .where("userId", "==", req.user.id)
    .get();

  const tasks = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "Completed").length;
  const pending = total - completed;

  res.render("dashboard", { tasks, total, completed, pending });
};

exports.addTask = async (req, res) => {
  const { title, category, deadline, priority } = req.body;

  await db.collection("tasks").add({
    userId: req.user.id,
    title,
    category,
    deadline,
    priority,
    status: "Pending",
    createdAt: new Date()
  });

  res.redirect("/tasks/dashboard");
};

exports.deleteTask = async (req, res) => {
  await db.collection("tasks").doc(req.params.id).delete();
  res.redirect("/tasks/dashboard");
};

exports.markCompleted = async (req, res) => {
  const taskId = req.params.id;

  await db.collection("tasks").doc(taskId).update({
    status: "Completed"
  });

  res.redirect("/tasks/dashboard");
};
