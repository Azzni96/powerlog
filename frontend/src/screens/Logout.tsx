import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // حذف الـ token من localStorage
    localStorage.removeItem('token');
    navigate('/login'); // التوجيه إلى صفحة تسجيل الدخول بعد الخروج
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
