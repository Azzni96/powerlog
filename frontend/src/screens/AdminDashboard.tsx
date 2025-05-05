// src/screens/AdminDashboard.tsx
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  /* ----- Logout ----- */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Admin Dashboard</h2>

        {/* AdminNavbar.tsx */}
  <div className="admin-nav">
    <button className="btn-base" onClick={() => navigate('/manage-users')}>
      👤 Manage Users
    </button>
    <button className="btn-base" onClick={() => navigate('/manage-workouts')}>
      🏋️ Manage Workouts
    </button>
    <button className="btn-base" onClick={() => navigate('/manage-food')}>
      🍎 Manage Food
    </button>
    <button className="btn-base" onClick={() => navigate('/manage-bmi')}>
      📊 Manage BMI
    </button>
    <button className="btn-base btn-danger" onClick={handleLogout}>
    🚪 Logout
    </button>
  </div>
</div>
  );
};

export default AdminDashboard;