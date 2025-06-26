const Task = require('../models/task.model');

// @desc    Create new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      createdBy: req.user._id
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get all tasks (with pagination)
exports.getAllTasks = async (req, res) => {
  try {
    let tasks;

    // Admin gets all tasks
    if (req.user && req.user.role === 'admin') {
      tasks = await Task.find().populate('assignedTo', 'name email');
    } else {
      // Normal user gets only their tasks
      tasks = await Task.find({ assignedTo: req.user._id }).populate('assignedTo', 'name email');
    }

    res.status(200).json({ tasks });
  } catch (err) {
    console.error("getAllTasks error:", err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

// @desc    Get single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo createdBy', 'name email');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (
  req.user.role !== 'admin' &&
  task.createdBy.toString() !== req.user._id.toString() &&
  task.assignedTo.toString() !== req.user._id.toString()
) {
  return res.status(403).json({ message: 'Not authorized to view this task' });
}

    res.json({task});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // ✅ Allow creator or admin
    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const { title, description, dueDate, priority, assignedTo, status } = req.body;

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.assignedTo = assignedTo || task.assignedTo;
    task.status = status || task.status;

    const updatedTask = await task.save();

    res.json({ task: updatedTask });
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ message: err.message });
  }
};


// @desc    Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // ✅ allow admin OR creator to delete
    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne(); // Replaced deprecated `.remove()` with `.deleteOne()`
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// @desc    Change task status (e.g., pending → completed)
exports.changeStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only assigned user can change status' });
    }

    task.status = req.body.status || 'pending';
    await task.save();

    res.json({ message: 'Task status updated', task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
