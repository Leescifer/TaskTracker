'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext.jsx';
import { useRouter, usePathname } from 'next/navigation';
import styles from '@styles/dashboard.module.scss';
import MenuButton from '@/components/Menu.jsx';
import Logo from '@components/Logo.jsx';
import Link from 'next/link';

// Define the admin and user menus
const adminMenu = [
  { title: 'Dashboard', path: '/dashboard', visible: true },
  { title: 'New Task', path: '/task', visible: true },
  { title: 'Manage Users', path: '/manage-users', visible: true },
  { title: 'Logout', path: '/logout', visible: true }
];

const userMenu = [
  { title: 'Profile', path: '/profile', visible: true },
  { title: 'View Tasks', path: '/tasks', visible: true },
  { title: 'Logout', path: '/logout', visible: true }
];

// UI Components
const MainContainer = ({ children }) => (
  <div className={styles.mainContainer}>{children}</div>
);

const MenuContainer = ({ children, open }) => (
  <div className={`${styles.menuContainer} ${open ? styles.open : ''}`}>{children}</div>
);

const ContentContainer = ({ children }) => (
  <div className={styles.contentContainer}>{children}</div>
);

const TopContainer = ({ children }) => (
  <div className={styles.topContainer}>{children}</div>
);

const UserContainer = ({ children }) => (
  <div className={styles.userContainer}>{children}</div>
);

const Content = ({ children }) => (
  <div className={styles.content}>{children}</div>
);

// Dashboard Component
const Dashboard = () => {
  const [open, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { authToken, loading, logout, userRole } = useAuth();  // Get user role from context

  const toggleMenu = () => setIsOpen(!open);
  const closeMenu = () => setIsOpen(false);

  // Close the menu when 'Escape' is pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authToken && !loading) {
      router.push("/auth");
    }
  }, [authToken, loading]);

  // Determine the menu based on the user's role
  const menus = userRole === 'admin' ? adminMenu : userMenu;  // Make sure these are defined

  return (
    <MainContainer>
      <div className={`${styles.overlay} ${open ? styles.show : ''}`} onClick={closeMenu}></div>

      <MenuContainer open={open}>
        <div className={styles.adminLogo}>
          <Logo />
        </div>
        <nav className={styles.navMenu}>
          {menus.filter(menu => menu.visible).map((menu, index) => (
            menu.title === 'Logout' ? (
              <div
                key={index}
                onClick={() => {
                  closeMenu();
                  logout();
                }}
                className={styles.navItem}
                style={{ cursor: 'pointer' }}
              >
                <span>{menu.title}</span>
              </div>
            ) :
            
              <Link
                key={index}
                href={menu.path}
                onClick={closeMenu}
                className={`${styles.navItem} ${pathname === menu.path ? styles.active : ''}`}
              >
                <span>{menu.title}</span>
              </Link>
          ))}
        </nav>
      </MenuContainer>

      <ContentContainer>
        <TopContainer>
          <div className={styles.topMenuButton}>
            <MenuButton open={open} onClick={toggleMenu} />
          </div>

          <div className={styles.titleName}>
            <h1 className={styles.title}>
              Hello, <span className={styles.titleSpan}>{userRole}</span>!
            </h1>
            <p className={styles.titleDescription}>Keep track of your task.</p>
          </div>

          <UserContainer>
            {/* Add avatar, settings, etc. */}
          </UserContainer>
        </TopContainer>

        <Content>
          {/* Page content will go here */}
        </Content>
      </ContentContainer>
    </MainContainer>
  );
};

export default Dashboard;
