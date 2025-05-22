import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TaskCard from '@components/TaskCard.jsx';
import TaskModal from '@/components/AddTaskModal.jsx';
import styles from '@styles/kandanBord.module.scss';
import { fetchTasks, updateTask } from '@store/taskSlice.js';

import {
  Plus,
  ListTodo,
  LoaderCircle,
  ListCheck
} from 'lucide-react';

import {
  DragDropContext,
  Droppable,
  Draggable
} from '@hello-pangea/dnd';

const KanbanBoard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks?.tasks || []);
  const loading = useSelector((state) => state.tasks?.loading);
  const error = useSelector((state) => state.tasks?.error);
  const { role = 'user', user = {} } = useSelector((state) => state.auth || {});

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const columns = ['todo', 'inprogress', 'done'];

  // Helper to get tasks grouped by status
  const tasksByStatus = columns.reduce((acc, status) => {
    acc[status] = tasks.filter(
      (task) =>
        task &&
        task.status === status &&
        (role === 'admin' || (user?.id && task.user_id === user.id))
    );
    return acc;
  }, {});

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const getIcon = (status) => {
    switch (status) {
      case 'todo':
        return <ListTodo className={styles.columnIcon} />;
      case 'inprogress':
        return <LoaderCircle className={styles.columnIcon} />;
      case 'done':
        return <ListCheck className={styles.columnIcon} />;
      default:
        return null;
    }
  };

  // Drag end handler to update task status
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId;
    const taskToUpdate = tasks.find((task) => String(task.id) === draggableId);
    if (!taskToUpdate) return;

    // Prepare full payload with all required fields + new status
    const updatedTaskData = {
      title: taskToUpdate.title,
      description: taskToUpdate.description,
      date_start: taskToUpdate.date_start,
      date_end: taskToUpdate.date_end,
      priority: taskToUpdate.priority,
      user_id: taskToUpdate.user_id,
      status: newStatus,
    };

    try {
      await dispatch(updateTask({ id: taskToUpdate.id, data: updatedTaskData })).unwrap();
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  return (
    <div className={styles.board}>
      {role === 'admin' && (
        <button
          type="button"
          className={styles.addTaskButton}
          onClick={openModal}
          aria-label="Add a new task"
        >
          <Plus aria-hidden="true" /> Add Task
        </button>
      )}

      {loading && <div className={styles.loading}>Loading tasks...</div>}
      {error && <div className={styles.error}>Error: {error}</div>}

      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map((col) => (
          <Droppable key={col} droppableId={col}>
            {(provided, snapshot) => (
              <div
                className={styles.column}
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  background: snapshot.isDraggingOver ? '#e3fcef' : undefined,
                  transition: 'background-color 0.2s ease',
                }}
              >
                <h2 className={styles.columnTitle}>
                  {getIcon(col)}
                  {col.toUpperCase()}
                </h2>

                {tasksByStatus[col].map((task, index) =>
                  task ? (
                    <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            userSelect: 'none',
                            marginBottom: 8,
                            boxShadow: snapshot.isDragging ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                          }}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ) : null
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>

      <TaskModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default KanbanBoard;
