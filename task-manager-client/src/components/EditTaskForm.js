import React, { useState } from 'react';

function EditTaskForm({ task, onUpdate, onCancel }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ title, description });
  };

  return (
    <div className="edit-form-container">
      <h2>Edit Task</h2>
      <form onSubmit={handleSubmit} className="edit-task-form">
        <div>
          <label htmlFor="edit-title">Title:</label>
          <input
            id="edit-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="edit-description">Description:</label>
          <textarea
            id="edit-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
}

export default EditTaskForm;
