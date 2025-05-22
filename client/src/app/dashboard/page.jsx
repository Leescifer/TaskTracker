'use client';
import React, { useEffect, useState } from 'react';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import {
  useRouter,
  usePathname
} from 'next/navigation';
import {
  MainContainer,
  MenuContainer,
  ContentContainer,
  TopContainer,
  UserContainer,
  Content
} from '@components/layoutComponents.jsx';
import styles from '@styles/dashboard.module.scss';
import MenuButton from '@/components/Menu.jsx';
import Logo from '@components/Logo.jsx';
import Link from 'next/link';
import { logout as logoutAction } from '@/store/auth.js';

import KanbanBoard from '@/components/KanbanBoard.jsx';

// Define the admin and user menus
const adminMenu = [
  { title: 'Dashboard', path: '/dashboard', visible: true },
  { title: 'Manage Users', path: '/manage-users', visible: true },
  { title: 'Logout', path: '/logout', visible: true }
];

const userMenu = [
  { title: 'Profile', path: '/profile', visible: true },
  { title: 'Logout', path: '/logout', visible: true }
];

// Dashboard Component
const Dashboard = () => {
  const [open, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const { token: authToken, loading, role: userRole } = useSelector((state) => state.auth);

  const toggleMenu = () => setIsOpen(!open);
  const closeMenu = () => setIsOpen(false);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Redirect to login if not authenticated
  // useEffect(() => {
  //   if (!authToken && !loading) {
  //     router.push("/auth");
  //   }
  // }, [authToken, loading, router]);

  // When authToken becomes null after logout, redirect to /auth
  useEffect(() => {
    if (!authToken && !loading) {
      router.push('/auth');
    }
  }, [authToken, loading, router]);

  // Choose menu based on user role
  const menus = userRole === 'admin' ? adminMenu : userMenu;

  // Logout handler
const handleLogout = async () => {
  closeMenu();
  await dispatch(logoutAction()).unwrap();  
  router.push('/auth');
};

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
                onClick={handleLogout}
                className={styles.navItem}
                style={{ cursor: 'pointer' }}
              >
                <span>{menu.title}</span>
              </div>
            ) : (
              <Link
                key={index}
                href={menu.path}
                onClick={closeMenu}
                className={`${styles.navItem} ${pathname === menu.path ? styles.active : ''}`}
              >
                <span>{menu.title}</span>
              </Link>
            )
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
              Hello, <span className={styles.titleSpan}>{userRole || 'User'}</span>!
            </h1>
            <p className={styles.titleDescription}>Keep track of your task.</p>
          </div>

          <UserContainer>
            {/* You can add user info or logout button here if needed */}
          </UserContainer>

        </TopContainer>

        <Content>
          <div className={styles.boardContainer}>
            <KanbanBoard />
          </div>
        </Content>
      </ContentContainer>
    </MainContainer>
  );
};

export default Dashboard;
