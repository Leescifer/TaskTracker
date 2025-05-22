'use client';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import {
  MainContainer,
  MenuContainer,
  ContentContainer,
  TopContainer,
  UserContainer,
  Content,
} from '@components/layoutComponents.jsx';
import styles from '@styles/dashboard.module.scss';
import MenuButton from '@/components/Menu.jsx';
import Logo from '@components/Logo.jsx';
import Link from 'next/link';
import { logout as logoutAction } from '@/store/auth.js';

// Lucide Icons
import {
  LayoutDashboard as DashboardIcon,
  Users as UsersIcon,
  LogOut as LogoutIcon,
  CircleUser ,
} from 'lucide-react';

import KanbanBoard from '@/components/KanbanBoard.jsx';

// Menu configs
const adminMenu = [
  { title: 'Dashboard', path: '/dashboard', visible: true, icon: <DashboardIcon /> },
  { title: 'Users', path: '/users', visible: true, icon: <UsersIcon /> },
  { title: 'Profile', path: '/profile', visible: true, icon: <CircleUser /> },
  { title: 'Logout', path: '/logout', visible: true, icon: <LogoutIcon /> },
];

const userMenu = [
  { title: 'Dashboard', path: '/dashboard', visible: true, icon: <DashboardIcon /> },
  { title: 'Profile', path: '/profile', visible: true, icon: <CircleUser /> },
  { title: 'Logout', path: '/logout', visible: true, icon: <LogoutIcon /> },
];

const Dashboard = () => {
  const [open, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const { token: authToken, loading, role: userRole = 'user' } = useSelector((state) => state.auth);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Redirect if unauthenticated
  useEffect(() => {
    if (!authToken && !loading) {
      router.push('/auth');
    }
  }, [authToken, loading, router]);

  const menus = userRole === 'admin' ? adminMenu : userMenu;

  const handleLogout = async () => {
    closeMenu();
    await dispatch(logoutAction()).unwrap();
    // Navigation will occur via useEffect when token becomes null
  };

  return (
    <MainContainer>
      <div
        className={`${styles.overlay} ${open ? styles.show : ''}`}
        onClick={closeMenu}
      ></div>

      <MenuContainer open={open}>
        <div className={styles.adminLogo}>
          <Logo />
        </div>
        <nav className={styles.navMenu}>
          {menus.filter((menu) => menu.visible).map((menu, index) => {
            if (menu.title === 'Logout') {
              return (
                <div
                  key={index}
                  onClick={handleLogout}
                  className={styles.navItem}
                  style={{ cursor: 'pointer' }}
                >
                  <span className={styles.navLinks}>
                    {menu.icon}
                    {menu.title}
                  </span>
                </div>
              );
            }
            return (
              <Link
                key={index}
                href={menu.path}
                onClick={closeMenu}
                className={`${styles.navItem} ${
                  pathname === menu.path ? styles.active : ''
                }`}
              >
                <span className={styles.navLinks}>
                  {menu.icon}
                  {menu.title}
                </span>
              </Link>
            );
          })}
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

          <UserContainer>{/* Optional user info */}</UserContainer>
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
