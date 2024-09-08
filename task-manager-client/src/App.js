import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import EditTaskForm from './components/EditTaskForm';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const taskRefs = useRef({});

  useEffect(() => {
    axios.get('http://localhost:3001/tasks')
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  const completeTask = (id) => {
    axios.patch(`http://localhost:3001/tasks/${id}/completed`)
      .then((response) => {
        setTasks(tasks.map(task => task._id === id ? response.data : task));
      })
      .catch((error) => console.error("Error completing task:", error));
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:3001/tasks/${id}`)
      .then(() => setTasks(tasks.filter(task => task._id !== id)))
      .catch((error) => console.error("Error deleting task:", error));
  };

  const editTask = (id) => {
    const task = tasks.find(task => task._id === id);
    setEditingTask(task);
  };

  const updateTask = (id, updatedTask) => {
    axios.put(`http://localhost:3001/tasks/${id}`, updatedTask)
      .then((response) => {
        setTasks(tasks.map(task => task._id === id ? response.data : task));
        setEditingTask(null);
      })
      .catch((error) => console.error("Error editing task:", error));
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <TaskForm onTaskAdded={addTask} />

      <ul>
        {tasks.map(task => (
          <li
            key={task._id}
            ref={el => (taskRefs.current[task._id] = el)}
            style={{ position: 'relative' }}
          >
            <div className="task-info">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Status: {task.completed ? "Completed" : "Incomplete"}</p>
              {!task.completed && (
                <button className="complete" onClick={() => completeTask(task._id)}>Complete</button>
              )}
              {task.completed && (
                <button className="incomplete" onClick={() => completeTask(task._id)}>Incomplete</button>
              )}
              <button className="delete" onClick={() => deleteTask(task._id)}>Delete</button>
              <button className="edit" onClick={() => editTask(task._id)}>Edit</button>
            </div>

            {editingTask && editingTask._id === task._id && (
              <div className="edit-form-wrapper">
                <EditTaskForm
                  task={editingTask}
                  onUpdate={(updatedTask) => updateTask(editingTask._id, updatedTask)}
                  onCancel={() => setEditingTask(null)}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
