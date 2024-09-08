import React, { useState } from 'react';
import axios from 'axios';

function TaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addTask = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true
    axios.post('http://localhost:3001/tasks', { title, description })
      .then((response) => {
        onTaskAdded(response.data);
        setTitle('');
        setDescription('');
        setError('');
      })
      .catch((error) => {
        if (error.response && error.response.data.errors) {
          setError(error.response.data.errors.map(err => err.msg).join(', '));
        } else {
          setError('An error occurred while adding the task.');
          console.error("Error adding task:", error);
        }
      })
      .finally(() => {
        setLoading(false); // Set loading state to false after request
      });
  };

  return (
    <form onSubmit={addTask}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        required
        aria-label="Task title"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description"
        required
        aria-label="Task description"
      />
      <button className="add-task" type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Task'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default TaskForm;
