const pool = require('../config/db');
const { summarizeTodos } = require('../utils/llmService');
const { sendSlackMessage } = require('../utils/slackService');


exports.getAllTodos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ message: 'Server error fetching todos' });
  }
};

exports.addTodo = async (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ message: 'Task is required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO todos (task) VALUES ($1) RETURNING *',
      [task]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding todo:', err);
    res.status(500).json({ message: 'Server error adding todo' });
  }
};

exports.updateTodo = async (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body; 
  try {
    let query = 'UPDATE todos SET ';
    const params = [];
    let paramIndex = 1;

    if (task !== undefined) {
      query += `task = $${paramIndex++}, `;
      params.push(task);
    }
    if (completed !== undefined) {
      query += `completed = $${paramIndex++}, `;
      params.push(completed);
    }

    query = query.slice(0, -2);
    query += ` WHERE id = $${paramIndex++} RETURNING *`;
    params.push(id);

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating todo:', err);
    res.status(500).json({ message: 'Server error updating todo' });
  }
};


exports.deleteTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ message: 'Server error deleting todo' });
  }
};

exports.summarizeAndSendToSlack = async (req, res) => {
  try {
    const result = await pool.query('SELECT task FROM todos WHERE completed = FALSE');
    const pendingTodos = result.rows.map(row => row.task);

    if (pendingTodos.length === 0) {
      const message = "Great job! All your to-dos are completed.";
      await sendSlackMessage(message);
      return res.json({ message: 'No pending todos to summarize. Message sent to Slack.', summary: message });
    }

    const summary = await summarizeTodos(pendingTodos);
    await sendSlackMessage(summary);

    res.json({ message: 'Summary generated and sent to Slack successfully!', summary });
  } catch (err) {
    console.error('Error summarizing and sending to Slack:', err);
    res.status(500).json({ message: 'Failed to summarize or send to Slack' });
  }
};