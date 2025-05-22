import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Trash2, EllipsisVertical  } from 'lucide-react';
import DeleteTaskModal from './DeleteTaskModal';
import styles from '@styles/TaskCard.module.scss';

const TaskCard = ({ task }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { role = 'user' } = useSelector((state) => state.auth || {});

  if (!task) {
    return <div className={styles.card}>Invalid task data</div>;
  }

  const openModal = () => setShowDeleteModal(true);
  const closeModal = () => setShowDeleteModal(false);

  return (
    <div className={styles.card}>
      {role === 'admin' && (
        <button className={styles.deleteBtn} onClick={openModal} title="Delete Task">
          <Trash2 />
        </button>
      )}

      {role === 'user' && (
        <button className={styles.elipse}>
           <EllipsisVertical />
        </button>
      )}

      <h2 className={styles.title}>{task.title || 'Untitled Task'}</h2>
      <p>{task.description || 'No description'}</p>
      <p>Start: {task.date_start || 'Not set'}</p>
      <p>End: {task.date_end || 'Not set'}</p>
      <p>Status: {task.status || 'Unknown'}</p>

      <DeleteTaskModal
        isOpen={showDeleteModal}
        onClose={closeModal}
        taskId={task.id}
      />
    </div>
  );
};

export default TaskCard;
