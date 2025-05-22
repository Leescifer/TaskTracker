// components/DeleteTaskModal.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteTask } from '@store/taskSlice';
import styles from '@styles/taskmodal.module.scss';

const DeleteTaskModal = ({ isOpen, onClose, taskId }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    await dispatch(deleteTask(taskId));
    onClose(); // close the modal after deleting
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete this task?</p>
        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.deleteBtn} onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
