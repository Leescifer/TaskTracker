import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TaskCard from '@components/TaskCard.jsx';
import TaskModal from '@/components/AddTaskModal.jsx';
import styles from '@styles/kandanBord.module.scss';
import { fetchTasks } from '../store/taskSlice';

const KanbanBoard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks?.tasks || []);
  const loading = useSelector((state) => state.tasks?.loading);
  const error = useSelector((state) => state.tasks?.error);
  const { role = 'user', user = {} } = useSelector((state) => state.auth || {});

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add useEffect to fetch tasks when component mounts
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const filterTasks = (status) =>
    tasks.filter(
      (task) =>
        task &&
        task.status === status &&
        (role === 'admin' || (user?.id && task.user_id === user.id))
    );

  const columns = ['todo', 'inprogress', 'done'];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.board}>
      {/* Show Add Task button only for admin */}
      {role === 'admin' && (
        <button className={styles.addTaskButton} onClick={openModal}>
          + Add Task
        </button>
      )}

      {/* Show loading indicator */}
      {loading && <div className={styles.loading}>Loading tasks...</div>}

      {/* Show error message if fetch failed */}
      {error && <div className={styles.error}>Error: {error}</div>}

      {/* Display columns and tasks */}
      {columns.map((col) => (
        <div key={col} className={styles.column}>
          <h2>{col.toUpperCase()}</h2>
          {filterTasks(col).map((task) =>
            task ? <TaskCard key={task.id} task={task} /> : null
          )}
        </div>
      ))}

      <TaskModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default KanbanBoard;