const router = require("express").Router();
const taskController = require("../controllers/task.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.get("/dashboard", verifyToken, taskController.getDashboard);
router.post("/add", verifyToken, taskController.addTask);
router.get("/delete/:id", verifyToken, taskController.deleteTask);
router.get("/complete/:id", verifyToken, taskController.markCompleted);

module.exports = router;
