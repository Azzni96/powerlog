import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Update interface to match the actual User_Profiles table structure
interface UserProfile {
  id?: number;
  user_id: number;
  gender: string;
  age: number;
  height: number;
  weight: number;
  workout_days: number;
  calorie_target: number;
  created_at?: string;
  updated_at?: string;
  // Add user information that we need to display
  user?: {
    Username: string;
    Email: string;
    User_level: string;
  }
}

const ManageProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states - update to match profile fields
  const [gender, setGender] = useState('');
  const [age, setAge] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [workoutDays, setWorkoutDays] = useState<number>(0);
  const [calorieTarget, setCalorieTarget] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);

  // Get user info from localStorage to display username, email
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Keep the API endpoint the same
      const response = await axios.get<UserProfile>('http://localhost:3000/api/user-profiles', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const profileData = response.data;
      setProfile(profileData);

      // Initialize form values with profile data
      if (profileData) {
        setGender(profileData.gender || '');
        setAge(profileData.age || 0);
        setHeight(profileData.height || 0);
        setWeight(profileData.weight || 0);
        setWorkoutDays(profileData.workout_days || 0);
        setCalorieTarget(profileData.calorie_target || 0);
      }

    } catch (error: any) {
      console.error('Error fetching profile:', error);
      setError('Profile not found. You may need to create one first.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Update payload to match the expected fields
      const payload = {
        gender,
        age,
        height,
        weight,
        workout_days: workoutDays,
        calorie_target: calorieTarget
      };

      await axios.put(
        'http://localhost:3000/api/user-profiles',
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update local state with the new profile data
      setProfile({
        ...profile!,
        gender,
        age,
        height,
        weight,
        workout_days: workoutDays,
        calorie_target: calorieTarget
      });

      setSuccess('Profile updated successfully!');
      setIsEditing(false);

    } catch (error: any) {
      console.error('Error updating profile:', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Failed to update profile. Please try again.');
      }
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Create new profile
      const payload = {
        gender,
        age,
        height,
        weight,
        workout_days: workoutDays,
        calorie_target: calorieTarget
      };

      await axios.post(
        'http://localhost:3000/api/user-profiles',
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess('Profile created successfully!');

      // Refresh the profile data
      fetchUserProfile();

    } catch (error: any) {
      console.error('Error creating profile:', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Failed to create profile. Please try again.');
      }
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm('Are you sure you want to delete your profile? This cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.delete('http://localhost:3000/api/user-profiles', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfile(null);
      setSuccess('Profile deleted successfully');

    } catch (error: any) {
      console.error('Error deleting profile:', error);
      setError(error.response?.data?.error || 'Failed to delete profile');
    }
  };

  const goBack = () => {
    navigate('/admin-dashboard');
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <h2>Profile Management</h2>
        <p>Loading profile...</p>
      </div>
    );
  }

  // Create profile form when no profile exists
  if (!profile) {
    return (
      <div className="admin-dashboard">
        <h2>Profile Management</h2>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div className="profile-container">
          <div className="profile-header">
            <h3>Create Your Profile</h3>
          </div>

          <form onSubmit={handleCreateProfile} className="edit-user-form">
            <div className="form-group">
              <label>Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value))}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Workout Days per Week</label>
              <input
                type="number"
                value={workoutDays}
                onChange={(e) => setWorkoutDays(parseInt(e.target.value))}
                min="0"
                max="7"
                required
              />
            </div>

            <div className="form-group">
              <label>Daily Calorie Target</label>
              <input
                type="number"
                value={calorieTarget}
                onChange={(e) => setCalorieTarget(parseInt(e.target.value))}
                min="0"
                required
              />
            </div>

            <div className="button-group">
              <button type="submit" className="btn update-btn">
                Create Profile
              </button>
            </div>
          </form>
        </div>

        <button onClick={goBack} className="btn">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h2>Profile Management</h2>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="profile-container">
        <div className="profile-header">
          <h3>Your Profile</h3>
          <div>
            <button
              className="btn"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDeleteProfile}
            >
              Delete Profile
            </button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="edit-user-form">
            <div className="form-group">
              <label>Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value))}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Workout Days per Week</label>
              <input
                type="number"
                value={workoutDays}
                onChange={(e) => setWorkoutDays(parseInt(e.target.value))}
                min="0"
                max="7"
                required
              />
            </div>

            <div className="form-group">
              <label>Daily Calorie Target</label>
              <input
                type="number"
                value={calorieTarget}
                onChange={(e) => setCalorieTarget(parseInt(e.target.value))}
                min="0"
                required
              />
            </div>

            <div className="button-group">
              <button type="submit" className="btn update-btn">
                Update Profile
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="profile-field">
              <span className="field-label">Username:</span>
              <span className="field-value">{user.username}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Email:</span>
              <span className="field-value">{user.email}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Gender:</span>
              <span className="field-value">{profile.gender}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Age:</span>
              <span className="field-value">{profile.age}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Height:</span>
              <span className="field-value">{profile.height} cm</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Weight:</span>
              <span className="field-value">{profile.weight} kg</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Workout Days/Week:</span>
              <span className="field-value">{profile.workout_days}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Calorie Target:</span>
              <span className="field-value">{profile.calorie_target}</span>
            </div>
          </div>
        )}
      </div>

      <button onClick={goBack} className="btn">
        Back to Dashboard
      </button>
    </div>
  );
};

export default ManageProfile;
