import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import TaskCard from '@components/TaskCard.jsx';
import TaskModal from '@components/TaskModal.jsx';  
import styles from '@styles/kandanBord.module.scss';

const KanbanBoard = () => {
  const tasks = useSelector((state) => state.tasks?.tasks || []);
  const { role = 'user', user = {} } = useSelector((state) => state.auth || {});

  const [isModalOpen, setIsModalOpen] = useState(false);

  const filterTasks = (status) => {
    return tasks.filter((task) => {
      return task.status === status && (role === 'admin' || task.user_id === user.id);
    });
  };

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

      {columns.map((col) => (
        <div key={col} className={styles.column}>
          <h2>{col.toUpperCase()}</h2>
          {filterTasks(col).map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ))}

      <TaskModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default KanbanBoard;
