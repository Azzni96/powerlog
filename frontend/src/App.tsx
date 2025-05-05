import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './screens/Home';
import Login from './screens/Login';
import Signup from './screens/Signup';
import AdminDashboard from './screens/AdminDashboard';
import ManageUsers from './screens/ManageUsers';
import ManageWorkouts from './screens/ManageWorkouts';

const App = () => {
  // Simple auth check function
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  // Placeholder component for routes that aren't implemented yet
  const UnderConstruction = ({ feature }: { feature: string }) => (
    <div className="admin-dashboard">
      <h2>{feature} Management</h2>
      <p>This page is currently under construction. Our hardworking engineers are on it. So don't sweat because of this. Sweat at the gym.</p>
      <button onClick={() => window.history.back()} className="btn">
        Go Back
      </button>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* Use actual ManageUsers component instead of placeholder */}
        <Route
          path="/manage-users"
          element={
            <ProtectedRoute>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-workouts"
          element={
            <ProtectedRoute>
              <ManageWorkouts/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-food"
          element={
            <ProtectedRoute>
              <UnderConstruction feature="Food" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-bmi"
          element={
            <ProtectedRoute>
              <UnderConstruction feature="BMI" />
            </ProtectedRoute>
          }
        />
        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
