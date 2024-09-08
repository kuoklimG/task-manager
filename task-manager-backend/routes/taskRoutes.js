const express = require('express');
const Task = require('../models/Task');
const { validateTask, validate } = require('../middlewares/validation');

const router = express.Router();

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Create a new task
router.post('/', validateTask, validate, async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = new Task({ title, description });
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Toggle the completion status of a task
router.patch('/:id/completed', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Toggle the completed status
    task.completed = !task.completed;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update task details
router.put('/:id', validateTask, validate, async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { title, description }, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
