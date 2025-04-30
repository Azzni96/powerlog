import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [nameEmail, setNameEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Input validation
    if (!nameEmail || !password) {
      setError('Email/username and password are required.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name_email: nameEmail,
        password
      };
      console.log('Request payload:', payload);

      interface LoginResponse {
        token: string;
        user: {
          user_level: string;
          [key: string]: any;
        };
      }

      const response = await axios.post('http://localhost:3000/api/user/login', payload);
      const data = response.data as LoginResponse;
      console.log('Logged in successfully:', data);

      // Check if user is admin
      if (data.user.user_level.toLowerCase() === 'admin') {
        // Store the token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setError('');
        // Redirect to admin dashboard
        navigate('/admin-dashboard');
      } else {
        // Not an admin user
        setError('Access denied. Only administrators can log in.');
        console.log('User level is not admin:', data.user.user_level);
      }
    } catch (err: any) {
      if (err.response) {
        console.error('Error response:', err.response);
        if (err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Login failed. Please check your credentials and try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Enter your email or username"
          value={nameEmail}
          onChange={(e) => setNameEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
