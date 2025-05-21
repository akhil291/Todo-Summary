import React, { useState } from 'react';
import './TodoItem.css';

function TodoItem({ todo, updateTodo, deleteTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(todo.task);

  const handleToggleComplete = () => {
    updateTodo(todo.id, { completed: !todo.completed });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editedTask.trim()) {
      updateTodo(todo.id, { task: editedTask });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTask(todo.task);
    setIsEditing(false);
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <input
          type="text"
          value={editedTask}
          onChange={(e) => setEditedTask(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSaveEdit();
            if (e.key === 'Escape') handleCancelEdit();
          }}
          autoFocus
          className="edit-input"
        />
      ) : (
        <>
          <span
            onClick={handleToggleComplete}
            className={`todo-task ${todo.completed ? 'completed-task-text' : ''}`}
          >
            {todo.task}
          </span>
          <div className="todo-status">
            <span className={todo.completed ? 'status-completed' : 'status-pending'}>
              {todo.completed ? 'Completed' : 'Pending'}
            </span>
          </div>
          <div className="todo-actions">
            <button onClick={handleEdit} className="edit-button">Edit</button>
            <button onClick={() => deleteTodo(todo.id)} className="delete-button">Delete</button>
          </div>
        </>
      )}
    </li>
  );
}

export default TodoItem;