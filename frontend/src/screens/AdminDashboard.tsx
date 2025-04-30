import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Also remove user data
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="admin-nav">
        <button onClick={() => navigate('/manage-users')}>Manage Users</button>
        <button onClick={() => navigate('/manage-workouts')}>Manage Workouts</button>
        <button onClick={() => navigate('/manage-food')}>Manage Food</button>
        <button onClick={() => navigate('/manage-bmi')}>Manage BMI</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
