import React from 'react';
import TodoItem from './TodoItem';
import './TodoList.css'; 

function TodoList({ todos, updateTodo, deleteTodo }) {
  return (
    <div className="todo-list-container">
      <h2>Your Todos</h2>
      {todos.length === 0 ? (
        <p>No todos yet! Add some above.</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              updateTodo={updateTodo}
              deleteTodo={deleteTodo}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;