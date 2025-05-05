import { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<'none' | 'login' | 'signup'>('none');

  return (
    <div className="home-container">
      <nav className="navbar">
        <h2>PowerLog</h2>
        <ul>
          <li>
            <button
              className={`link ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
          </li>
          <li>
            <button
              className={`link ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </li>
        </ul>
      </nav>

      <div className="content">
        {activeTab === 'none' && (
          <div className="welcome-section">
            <h1>Welcome to PowerLog</h1>
            <p>Your ultimate fitness tracking solution. Please login or sign up to continue.</p>
          </div>
        )}
        {activeTab === 'login' && <Login />}
        {activeTab === 'signup' && <Signup onSuccess={() => setActiveTab('login')} />}
      </div>
    </div>
  );
};

export default HomePage;
