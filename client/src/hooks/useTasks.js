"use client"
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, deleteTask } from '@store/task';
import { useEffect } from 'react';

export function useTasks() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector(state => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const addTask = (taskData) => dispatch(createTask(taskData)).unwrap();
  const removeTask = (id) => dispatch(deleteTask(id)).unwrap();

  return {
    tasks: list,
    loading,
    error,
    addTask,
    removeTask,
  };
}
