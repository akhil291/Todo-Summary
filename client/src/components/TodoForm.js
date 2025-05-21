import React, { useState } from 'react';
import './TodoForm.css';

function TodoForm({ addTodo }) {
  const [task, setTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim()) {
      addTodo(task);
      setTask('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        placeholder="Add a new todo..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="todo-input"
      />
      <button type="submit" className="add-button">Add Todo</button>
    </form>
  );
}

export default TodoForm;