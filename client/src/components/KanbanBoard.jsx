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
  // After const columns = ['todo', 'inprogress', 'done'];
const summaryStats = {
  total: tasks.length,
  dueSoon: tasks.filter(task => new Date(task.date_end) <= new Date(Date.now() + 3 * 86400000)).length, // 3 days
  assigned: tasks.filter(task => task.user_id).length,
};


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

      <div className={styles.summaryRow}>
  <div className={styles.summaryCard}>
    <h3>Total Tasks</h3>
    <p>{summaryStats.total}</p>
  </div>
  <div className={styles.summaryCard}>
    <h3>Due Soon</h3>
    <p>{summaryStats.dueSoon}</p>
  </div>
  <div className={styles.summaryCard}>
    <h3>Assigned</h3>
    <p>{summaryStats.assigned}</p>
  </div>
</div>


      {/* Display columns and tasks */}
      {columns.map((col) => (
        <div key={col} className={styles.column}>
          <h2 className={styles.columnTitle}>
  <span className={`${styles.statusDot} ${styles[col]}`}></span>
  {col.toUpperCase()}
</h2>

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
