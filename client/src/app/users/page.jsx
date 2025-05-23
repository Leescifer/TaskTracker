'use client';
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "@/store/auth";
import { fetchUsersByRole } from "@/store/userSlice";
import styles from '@/styles/users.module.scss';
import Link from 'next/link';

const Users = () => {
    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth || {});
    const { user, role, loading: authLoading, error: authError } = authState;

    const usersState = useSelector((state) => state.users || {});
    const { users = [], loading: usersLoading, error: usersError } = usersState;

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    useEffect(() => {
        if (role === 'admin') {
            dispatch(fetchUsersByRole());
        }
    }, [dispatch, role]);

    if (authLoading || usersLoading) return <div className={styles.loading}>Loading...</div>;
    if (authError) return <div className={styles.error}>Error: {authError}</div>;

    return (
        <div className={styles.userContainer}>
             <div className={styles.topBar}>
                <Link href="/dashboard" className={styles.backLink}>← Back to Dashboard</Link>
            </div>
            <h1 className={styles.userWelcome}>Welcome, {user?.name}</h1>
            {role === 'admin' && (
                <>
                    <h2 className={styles.title}>Users List</h2>
                    {usersError ? (
                        <p className={styles.error}>Error: {usersError}</p>
                    ) : users.length === 0 ? (
                        <p className={styles.noUsers}>No users found.</p>
                    ) : (
                        <ul className={styles.userList}>
                            {users.map((u) => (
                                <li key={u.id} className={styles.userItem}>
                                    <div className={styles.data}>
                                        <span className={styles.userEmail}>{u.email}</span>
                                        <span className={styles.userEmail}>{u.name}</span>
                                    </div>

                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
};

export default Users;
