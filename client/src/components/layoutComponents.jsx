import React from 'react';
import styles from '@styles/dashboard.module.scss';

// UI Components
export const MainContainer = ({ children }) => (
  <div className={styles.mainContainer}>{children}</div>
);

export const MenuContainer = ({ children, open }) => (
  <div className={`${styles.menuContainer} ${open ? styles.open : ''}`}>{children}</div>
);

export const ContentContainer = ({ children }) => (
  <div className={styles.contentContainer}>{children}</div>
);

export const TopContainer = ({ children }) => (
  <div className={styles.topContainer}>{children}</div>
);

export const UserContainer = ({ children }) => (
  <div className={styles.userContainer}>{children}</div>
);

export const Content = ({ children }) => (
  <div className={styles.content}>{children}</div>
);