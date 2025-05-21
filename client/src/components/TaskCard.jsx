import React from 'react';
import styles from '@styles/TaskCard.module.scss';

const TaskCard = ({ task }) => {
  return (
    <div className={styles.card}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Start: {task.date_start}</p>
      <p>End: {task.date_end}</p>
    </div>
  );
};

export default TaskCard;