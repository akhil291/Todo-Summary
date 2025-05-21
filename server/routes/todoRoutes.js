const express = require('express');
const {
  getAllTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  summarizeAndSendToSlack,
} = require('../controllers/todoController');

const router = express.Router();

router.get('/', getAllTodos);
router.post('/', addTodo);
router.put('/:id', updateTodo); 
router.delete('/:id', deleteTodo);
router.post('/summarize', summarizeAndSendToSlack);

module.exports = router;