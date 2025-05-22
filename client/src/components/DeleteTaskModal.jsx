// components/DeleteTaskModal.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteTask } from '@store/taskSlice';
import styles from '@styles/taskmodal.module.scss';

const DeleteTaskModal = ({ isOpen, onClose, taskId }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    dispatch(deleteTask(taskId));
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div className={styles.deleteOverlay}>
      <div className={styles.modal}>
        <h3 className={styles.confirm}>Confirm Delete</h3>
        <p className={styles.delete}>Are you sure you want to delete this task?</p>
        <div className={styles.modalActions}>
          <button className={styles.deleteBtn} onClick={handleDelete}>Delete</button>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
