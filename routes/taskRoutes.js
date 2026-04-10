const express = require('express');
const router = express.Router();
const task = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/tasks', authMiddleware, task.getTasks);
router.post('/tasks', authMiddleware, task.createTask);
router.post('/tasks/:id', authMiddleware, task.updateTaskStatus);
router.delete('/tasks/:id', authMiddleware, task.deleteTask);

module.exports = router; 