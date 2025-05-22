'use client';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import {
  MainContainer,
  ContentContainer,
  Content
} from '@components/layoutComponents.jsx';
import styles from '@styles/dashboard.module.scss';
import Link from 'next/link';
import Logo from '@components/Logo.jsx';
import KanbanBoard from '@/components/KanbanBoard.jsx';
import { logout as logoutAction } from '@/store/auth.js';

const adminMenu = [
<<<<<<< HEAD
  { title: 'Dashboard', path: '/dashboard', visible: true },
  { title: 'Manage Users', path: '/manage-users', visible: true },
  { title: 'Logout', path: '/logout', visible: true }
=======
  { title: 'Dashboard', path: '/dashboard', visible: true, icon: <DashboardIcon /> },
  { title: 'Users', path: '/users', visible: true, icon: <UsersIcon /> },
  { title: 'Profile', path: '/profile', visible: true, icon: <CircleUser /> },
  { title: 'Logout', path: '/logout', visible: true, icon: <LogoutIcon /> },
>>>>>>> f593b8cfbc8d94d49a486470b58b2042e63ead2e
];

const userMenu = [

  { title: 'Logout', path: '/logout', visible: true }
];

const Dashboard = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { token: authToken, loading, role: userRole } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!authToken && !loading) {
      router.push('/auth');
    }
  }, [authToken, loading, router]);

  const menus = userRole === 'admin' ? adminMenu : userMenu;

  const handleLogout = async () => {
    await dispatch(logoutAction()).unwrap();
    router.push('/auth');
  };

  return (
    <MainContainer>
      <ContentContainer>
        {/* Top Navbar */}
        <div className={styles.topNavbar}>
          <div className={styles.leftSection}>
            <Logo />
            <div className={styles.navMenu}>
              {menus.filter(menu => menu.visible).map((menu, index) =>
                menu.title === 'Logout' ? (
                  <div
                    key={index}
                    onClick={handleLogout}
                    className={styles.navItem}
                    style={{ cursor: 'pointer' }}
                  >
                    {menu.title}
                  </div>
                ) : (
                  <Link
                    key={index}
                    href={menu.path}
                    className={`${styles.navItem} ${pathname === menu.path ? styles.active : ''}`}
                  >
                    {menu.title}
                  </Link>
                )
              )}
            </div>
          </div>

          <div className={styles.rightSection}>
            <h1 className={styles.title}>
             
            </h1>
          </div>
        </div>

<<<<<<< HEAD
        {/* Kanban Board Section */}
        <Content>
          <div className={styles.boardContainer}>
            <KanbanBoard />
          </div>
        </Content>
=======
          <UserContainer>{/* Optional user info */}</UserContainer>
        </TopContainer>

     <Content>
  <div className={styles.boardContainer}>
     <KanbanBoard />
  </div>
</Content>
>>>>>>> f593b8cfbc8d94d49a486470b58b2042e63ead2e
      </ContentContainer>
    </MainContainer>
  );
};

export default Dashboard;
