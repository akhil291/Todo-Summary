import React, { useState, useEffect, useCallback } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import api from './api';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  
  const showMessage = useCallback((msg, type) => {
    setMessage(msg);
    setMessageType(type);
    const timer = setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
    return () => clearTimeout(timer); 
  }, []); 
  
  const fetchTodos = useCallback(async () => {
    try {
      const response = await api.get('/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      showMessage('Failed to fetch todos.', 'error');
    }
  }, [showMessage]); 


  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]); 

  
  const addTodo = async (task) => {
    try {
      const response = await api.post('/todos', { task });
      setTodos([...todos, response.data]);
      showMessage('Todo added successfully!', 'success');
    } catch (error) {
      console.error('Error adding todo:', error);
      showMessage('Failed to add todo.', 'error');
    }
  };

  
  const updateTodo = async (id, updatedFields) => {
    try {
      const response = await api.put(`/todos/${id}`, updatedFields);
      setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
      showMessage('Todo updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating todo:', error);
      showMessage('Failed to update todo.', 'error');
    }
  };

 
  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
      showMessage('Todo deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting todo:', error);
      showMessage('Failed to delete todo.', 'error');
    }
  };


  const summarizeAndSend = async () => {
    setMessage('');
    setMessageType('');
    try {
      const response = await api.post('/todos/summarize');
      showMessage(response.data.message, 'success');
    } catch (error) {
      console.error('Error summarizing or sending to Slack:', error);
      showMessage('Failed to summarize or send to Slack.', 'error');
    }
  };

  return (
    <div className="App">
      <h1>Todo Summary Assistant</h1>
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      <TodoForm addTodo={addTodo} />
      <button onClick={summarizeAndSend} className="summarize-button">
        Summarize & Send to Slack
      </button>
      <TodoList todos={todos} updateTodo={updateTodo} deleteTodo={deleteTodo} />
    </div>
  );
}

export default App;
