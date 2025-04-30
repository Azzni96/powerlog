import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ManageUsers from '../screens/ManageUsers';
import ManageWorkouts from '../screens/ManageWorkouts';
import ManageFood from '../screens/ManageFood';

import Dashboard from '../screens/AdminDashboard';




export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<ManageUsers />} />
        <Route path="/workouts" element={<ManageWorkouts />} />
        <Route path="/food" element={<ManageFood />} />
      </Routes>
    </Router>
  );
}
