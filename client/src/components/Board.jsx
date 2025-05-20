"use client";
import styles from "@/styles/board.module.scss";

import React, { useState } from 'react';

const initialTasks = {
    todo: [
        {
            id: "1",
            text: "Tasl 1",
        }
    ],
      inPorgress: [
        {
            id: "2",
            text: "Tasl 2",
        }
    ],
      done: [
        {
            id: "3",
            text: "Task 3",
        }
    ],
}

const Board = () => {
    const [tasks, setTasks] = useState(initialTasks);
    const [menuOpenFor, setMenuOpenFor] = useState(false);

    const columns = {
        todo: "To Do",
        inPorgress: "In Progress",
        done: "Done",
    };

    const toggleMenu = () => {
        setMenuOpenFor((prev) => (prev === taskId ? null : taskId));
    }
    
   const moveTask = (taskId, fromColumn, toColumn) => {
    if (fromColumn === toColumn) return;

    setTasks((prev) => {
      const newTasks = { ...prev };

      // Find task
      const task = newTasks[fromColumn].find((t) => t.id === taskId);
      if (!task) return prev;

      // Remove from old column
      newTasks[fromColumn] = newTasks[fromColumn].filter((t) => t.id !== taskId);

      // Add to new column
      newTasks[toColumn] = [...newTasks[toColumn], task];

      return newTasks;
    });

    setMenuOpenFor(null);
  };


    return(
       <div className={styles.board}>
      {Object.entries(columns).map(([columnKey, columnName]) => (
        <div key={columnKey} className={styles.column}>
          <h2 className={styles.title}>{columnName}</h2>
          <div className={styles.taskList}>
            {tasks[columnKey].map((task) => (
              <div key={task.id} className={styles.task}>
                <div className={styles.taskText}>{task.text}</div>
                <div className={styles.taskActions}>
                  <button
                    className={styles.menu}
                    onClick={() => toggleMenu(task.id)}
                    aria-label="Open menu"
                  >
                    ⋮
                  </button>
                  {menuOpenFor === task.id && (
                    <div className={styles.taskMenu}>
                      {Object.entries(columns)
                        .filter(([key]) => key !== columnKey)
                        .map(([key, name]) => (
                          <button
                            key={key}
                            className={styles.menuItem}
                            onClick={() => moveTask(task.id, columnKey, key)}
                          >
                            Move to {name}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    );
 };

 export default Board;