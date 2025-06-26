const express = require('express');
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  changeStatus
} = require('../controllers/task.controller');
const { protect } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/isAdmin.middleware');

const router = express.Router();

router.route('/')
  .post(protect,isAdmin, createTask)
  .get(protect, getAllTasks);

router.route('/:id')
  .get(protect, getTaskById)
  .put(protect,isAdmin, updateTask)
  .delete(protect,isAdmin, deleteTask);

router.patch('/:id/status', protect, changeStatus);

module.exports = router;
