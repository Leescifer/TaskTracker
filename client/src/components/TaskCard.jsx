import React, { useState } from 'react';
import { useSelector } from 'react-redux';
<<<<<<< HEAD
import { Trash2, EllipsisVertical } from 'lucide-react';
=======
import { Trash2  } from 'lucide-react';
>>>>>>> f593b8cfbc8d94d49a486470b58b2042e63ead2e
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

<<<<<<< HEAD
      {role === 'user' && (
        <button className={styles.elipse}>
          <EllipsisVertical />
        </button>
      )}

=======
>>>>>>> f593b8cfbc8d94d49a486470b58b2042e63ead2e
      <h2 className={styles.title}>{task.title || 'Untitled Task'}</h2>
      <p>{task.description || 'No description'}</p>
      <p>Start: {task.date_start || 'Not set'}</p>
      <p>End: {task.date_end || 'Not set'}</p>

      {/* Meta Info: Status Badge + Avatar */}
      <div className={styles.metaInfo}>
        <span className={styles.tag}>{task.status || 'Unknown'}</span>
        {task.assignee_name && (
          <span className={styles.avatar}>
            {task.assignee_name.slice(0, 1).toUpperCase()}
          </span>
        )}
      </div>

      <DeleteTaskModal
        isOpen={showDeleteModal}
        onClose={closeModal}
        taskId={task.id}
      />
    </div>
  );
};

export default TaskCard;
