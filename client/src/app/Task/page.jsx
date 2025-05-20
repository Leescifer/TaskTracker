"use client"
import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@store/task.js';
import { useTasks } from '@hooks/useTasks.js';

// Mocked users - ideally this would be fetched from your API
const mockUsers = [
  { id: 1, name: 'User One', role: 'user' },
  { id: 2, name: 'User Two', role: 'user' },
  { id: 3, name: 'Admin', role: 'admin' },
];

const TasksPage = () => {
  const { tasks, loading, error, addTask, removeTask } = useTasks();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date_start: '',
    date_end: '',
    user_id: '', // start empty
  });

  useEffect(() => {
    // Simulate fetching users and filtering for role = 'user'
    const userOnly = mockUsers.filter(u => u.role === 'user');
    setUsers(userOnly);
    // Set default selected user
    if (userOnly.length > 0) {
      setForm(prev => ({ ...prev, user_id: userOnly[0].id }));
    }
  }, []);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await addTask(form);
      setForm({
        title: '',
        description: '',
        date_start: '',
        date_end: '',
        user_id: users[0]?.id || '',
      });
    } catch (err) {
      alert('Error creating task: ' + err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeTask(id);
    } catch (err) {
      alert('Error deleting task: ' + err);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Admin Task Assignment</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
        <input
          type="date"
          name="date_start"
          value={form.date_start}
          onChange={handleChange}
          required
          style={{ marginRight: 8 }}
        />
        <input
          type="date"
          name="date_end"
          value={form.date_end}
          onChange={handleChange}
          required
        />
        <br />

        <label style={{ marginTop: 12, display: 'block' }}>
          Assign to user:
        </label>
        <select
          name="user_id"
          value={form.user_id}
          onChange={handleChange}
          required
          style={{ padding: 8, width: '100%', marginBottom: 12 }}
        >
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} (ID: {user.id})
            </option>
          ))}
        </select>

        <button type="submit" style={{ padding: '8px 16px' }}>
          Add Task
        </button>
      </form>

      {loading && <p>Loading tasks...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {tasks.length === 0 && !loading && <p>No tasks found.</p>}

      {tasks.map(task => (
        <div
          key={task.id}
          style={{ border: '1px solid #ccc', padding: 12, marginBottom: 8 }}
        >
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>
            Start: {task.date_start} — End: {task.date_end}
          </p>
          <p>Assigned to user ID: {task.user_id}</p>
          <button
            onClick={() => handleDelete(task.id)}
            style={{ color: 'red' }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default function WrappedTasksPage() {
  return (
    <Provider store={store}>
      <TasksPage />
    </Provider>
  );
}
