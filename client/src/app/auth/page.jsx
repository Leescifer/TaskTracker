'use client';
import React, { useEffect, useState } from "react";
import styles from '@styles/authentication.module.scss';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { signin, signup } from '@store/auth.js';
import toast from 'react-hot-toast';

const Auth = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { token, loading } = useSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    password: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (token && !loading) {
      router.push('/dashboard');
    }
  }, [token, loading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const action = isLogin
        ? signin({ email: formData.email, password: formData.password })
        : signup(formData);

      const res = await dispatch(action);

      if (res.meta.requestStatus === 'rejected') {
        setError(res.payload || 'Authentication failed.');
      } else {
        toast.success(`${isLogin ? 'Signed in' : 'Signed up'} successfully`);
      }

    } catch (err) {
      setError('Authentication failed. Please try again.');
      console.error(err);
    }
  };

  const toggleAuthMode = () => {
    setFormData({
      name: '',
      email: '',
      role: 'user',
      password: ''
    });
    setError('');
    setIsLogin((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      {/* Left Panel */}
      <div className={styles.left}>
        <div className={styles.left}>
        <img src="/image/task.png" alt="" className={styles.leftImage} />
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>

      {/* Right Panel */}
      <div className={styles.right}>
        <div className={styles.box}>
          <h2 className={styles.title}>{isLogin ? 'Sign in' : 'Sign up'}</h2>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Username"
                value={formData.name}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
              required
            />

            {!isLogin && (
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={styles.selector}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            )}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="off"
              required
            />

            <button type="submit" className={styles.button}>
              {isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </form>

          <p className={styles.changeAuthentication}>
            {isLogin ? "Don't have an account yet? " : 'Already have an account? '}
            <span onClick={toggleAuthMode} className={styles.span}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
