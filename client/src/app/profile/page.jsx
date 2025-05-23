'use client'
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "@/store/auth";
import styles from '@styles/profile.module.scss';
import Link from 'next/link';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, role, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!user) return <p>No user data found.</p>;

  return (
    <div className={styles.profileContainer}>
            <div className={styles.topBar}>
                <Link href="/dashboard" className={styles.backLink}>← Back to Dashboard</Link>
            </div>
      <h1>Welcome, {user.name}</h1>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {role}</p>

      {role === 'admin' ? (
        <div className={styles.adminPanel}>
          <h2>Admin Panel</h2>
          <p>You have access to manage users, tasks, and settings.</p>
        </div>
      ) : (
        <div className={styles.userDashboard}>
          <h2>User Dashboard</h2>
          <p>You can view and manage your own tasks.</p>
        </div>
      )}
    </div>
  )
};

export default Profile;
