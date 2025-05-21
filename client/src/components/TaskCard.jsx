import React from 'react';
import styles from '@styles/TaskCard.module.scss';

const TaskCard = ({ task }) => {
  // Defensive check for task object
  if (!task) {
    return <div className={styles.card}>Invalid task data</div>;
  }

  return (
    <div className={styles.card}>
      <h3>{task.title || 'Untitled Task'}</h3>
      <p>{task.description || 'No description'}</p>
      <p>Start: {task.date_start || 'Not set'}</p>
      <p>End: {task.date_end || 'Not set'}</p>
      <p>Status: {task.status || 'Unknown'}</p>
    </div>
  );
};

export default TaskCard;