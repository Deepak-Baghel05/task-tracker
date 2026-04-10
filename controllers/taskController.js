const Task = require("../models/Task");

const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo } = req.body;

        const newTask = new Task({
            title,
            description,
            assignedTo,
            createdBy: req.session.userId,
            status: 'pending'
        });

        await newTask.save();

        res.redirect('/tasks'); // ✅ IMPORTANT

    } catch (err) {
        console.log(err);
        res.send('Error creating task');
    }
};

const User = require("../models/User");


const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "username")
      .populate("createdBy", "username");

    console.log("Fetched Tasks:", tasks); // ✅ DEBUGGING

    const users = await User.find();

    // ✅ Progress
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    // ✅ USER PERFORMANCE
    let userStats = {};

    tasks.forEach((task) => {
      if (task.assignedTo) {
        const name = task.assignedTo.username;

        if (!userStats[name]) {
          userStats[name] = 0;
        }

        if (task.status === "completed") {
          userStats[name]++;
        }
      }
    });

    const pendingCount = tasks.filter((t) => t.status === "pending").length;
    const progressCount = tasks.filter(
      (t) => t.status === "in-progress",
    ).length;
    const completedCount = tasks.filter((t) => t.status === "completed").length;
    res.render("dashboard", {
      tasks,
      users,
      total,
      completed,
      progress,
      userStats,
      pendingCount,
      progressCount,
      completedCount,
    });
  } catch (err) {
    res.send("Error");
  }
};


const updateTaskStatus = async (req, res) => {
  const { status } = req.body;

  try {
    await Task.findByIdAndUpdate(req.params.id, { status });
    res.redirect("/tasks");
  } catch (err) {
    res.send("Error");
  }
};

const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    // your delete logic
    res.send("Task deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
}; // ✅ IMPORTANT
