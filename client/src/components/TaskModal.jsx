import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask } from '@store/taskSlice.js';
import axios from 'axios';
import Cookies from 'js-cookie';
import styles from '@styles/taskmodal.module.scss';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const TaskModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.tasks);  
  const [form, setForm] = useState({
    title: '',
    description: '',
    date_start: '',
    date_end: '',
    user_id: '',
  });
  const [users, setUsers] = useState([]);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const fetchUsers = async () => {
      try {
        const token = Cookies.get('authToken');
        const res = await axios.get(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch {
        setUsers([]);
      }
    };
    fetchUsers();
  }, [isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  const validateForm = () => {
    if (!form.title.trim()) return 'Title is required.';
    if (!form.date_start) return 'Start date is required.';
    if (!form.date_end) return 'End date is required.';
    if (new Date(form.date_end) < new Date(form.date_start)) return 'End date cannot be before start date.';
    if (!form.user_id) return 'Please assign a user.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    try {
      await dispatch(createTask({ ...form, status: 'todo' })).unwrap();
      setForm({
        title: '',
        description: '',
        date_start: '',
        date_end: '',
        user_id: '',
      });
      onClose();
    } catch (submitError) {
      setFormError(submitError || 'Failed to create task.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Create New Task</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {formError && <p style={{ color: 'red' }}>{formError}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            required
            disabled={loading}
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            disabled={loading}
          />
          <input
            type="date"
            name="date_start"
            value={form.date_start}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            type="date"
            name="date_end"
            value={form.date_end}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <select
            name="user_id"
            value={form.user_id}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Assign to User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
          <div className={styles.actions}>
            <button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Task'}
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
