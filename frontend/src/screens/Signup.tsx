import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface SignupProps {
  onSuccess?: () => void;
}

interface SignupPayload {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  user_level: string;
}

const Signup: React.FC<SignupProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignup = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    // Input validation
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setLoading(true);
    try {
      const payload: SignupPayload = {
        name,
        email,
        password,
        confirm_password: confirmPassword,
        user_level: 'customer',
      };
      console.log('Request payload:', payload);

      const response = await axios.post('http://localhost:3000/api/user/signup', payload);
      console.log('Signed up successfully:', response.data);

      setError('');
      setSuccess('Account created successfully! Redirecting to login...');

      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Wait 2 seconds and then redirect to login
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/login');
        }
      }, 2000);
    } catch (err: any) {
      if (err.response) {
        console.error('Error response:', err.response);
        // Check both error and message fields in the response
        if (err.response.data && (err.response.data.error || err.response.data.message)) {
          setError(err.response.data.error || err.response.data.message);
        } else {
          setError('Signup failed. Please ensure all fields are correct and try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
      console.error('Signup failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Signup</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Signup'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
