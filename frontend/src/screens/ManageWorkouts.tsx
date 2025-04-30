// src/screens/ManageWorkouts.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface WorkoutForm {
  Id: number;
  category: string;
  workout_program: string;
  exercise_name: string;
  times_performed: number;
  weight_kg: number;
  sets: number;
  description: string;
  duration_minutes: number;
  difficulty: string;
  video?: string;
  photo?: string;
  created_at?: string;
  updated_at?: string;
}

const ManageWorkouts = () => {
  // Updated to start with an empty array instead of hardcoded workouts
  const [workouts, setWorkouts] = useState<WorkoutForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newWorkout, setNewWorkout] = useState<Omit<WorkoutForm, 'Id'>>({
    category: '',
    workout_program: '',
    exercise_name: '',
    times_performed: 1,
    weight_kg: 0,
    sets: 3,
    description: '',
    duration_minutes: 30,
    difficulty: 'medium',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<string>('');

  // Add media view filters state
  const [showImagesOnly, setShowImagesOnly] = useState<boolean>(false);
  const [showVideosOnly, setShowVideosOnly] = useState<boolean>(false);

  // Local file states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Local file URLs for preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  // Keep track of url mappings for newly added workouts
  const [workoutMediaUrls, setWorkoutMediaUrls] = useState<{[key: string]: string}>({});

  // Get unique categories and programs
  const categories = [...new Set(workouts.map(workout => workout.category))];
  const programs = selectedCategory
    ? [...new Set(workouts
        .filter(workout => workout.category === selectedCategory)
        .map(workout => workout.workout_program))]
    : [];

  // Filter workouts based on selected category, program, and media type
  const filteredWorkouts = workouts.filter(workout => {
    // Filter by category and program
    if (selectedCategory && workout.category !== selectedCategory) {
      return false;
    }
    if (selectedProgram && workout.workout_program !== selectedProgram) {
      return false;
    }

    // Filter by media type if selected
    if (showImagesOnly && !workout.photo) {
      return false;
    }
    if (showVideosOnly && !workout.video) {
      return false;
    }

    return true;
  });

  const navigate = useNavigate();

  // Toggle media filters
  const toggleImagesOnly = () => {
    setShowImagesOnly(!showImagesOnly);
    if (!showImagesOnly) {
      setShowVideosOnly(false); // Turn off videos filter when turning on images
    }
  };

  const toggleVideosOnly = () => {
    setShowVideosOnly(!showVideosOnly);
    if (!showVideosOnly) {
      setShowImagesOnly(false); // Turn off images filter when turning on videos
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedProgram('');
    setShowImagesOnly(false);
    setShowVideosOnly(false);
  };

  // Modified to fetch workouts from backend
  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:3000/api/workout-forms', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Backend response:', response.data);

      // إذا كانت الاستجابة كائن واحد وليس مصفوفة
      const data = Array.isArray(response.data) ? response.data : [response.data];

      setWorkouts(data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError('Failed to fetch workouts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  // Create a new workout
  const createWorkout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newWorkout.workout_program || !newWorkout.exercise_name || !newWorkout.category) {
      setError('Category, program and exercise names are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Create form data with proper numeric types
      const formData = new FormData();

      // Ensure numbers are converted properly for backend
      formData.append('category', newWorkout.category);
      formData.append('workout_program', newWorkout.workout_program);
      formData.append('exercise_name', newWorkout.exercise_name);
      formData.append('times_performed', String(newWorkout.times_performed));
      formData.append('weight_kg', String(newWorkout.weight_kg));
      formData.append('sets', String(newWorkout.sets));
      formData.append('description', newWorkout.description || '');
      formData.append('duration_minutes', String(newWorkout.duration_minutes));
      formData.append('difficulty', newWorkout.difficulty);

      // Only add one file or the other, not both
      if (imageFile) {
        formData.append('file', imageFile);
        console.log('Adding image file:', imageFile.name);
      } else if (videoFile) {
        formData.append('file', videoFile);
        console.log('Adding video file:', videoFile.name);
      }

      console.log('Sending workout data to server...');

      // Debug log formData contents
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await axios.post(
        'http://localhost:3000/api/workout-forms',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          // Increase timeout to handle large files
          timeout: 30000
        }
      );

      console.log('Workout created successfully:', response.data);

      // Reset form
      setNewWorkout({
        category: '',
        workout_program: '',
        exercise_name: '',
        times_performed: 1,
        weight_kg: 0,
        sets: 3,
        description: '',
        duration_minutes: 30,
        difficulty: 'medium',
      });
      setImageFile(null);
      setVideoFile(null);
      setImagePreview(null);
      setVideoPreview(null);
      setIsCreating(false);
      setError('');

      alert('Workout form created successfully!');

      // Refresh the workouts list
      fetchWorkouts();

    } catch (error: any) {
      console.error('Error creating workout:', error);

      // Enhanced error logging
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);

        if (error.response.data?.error) {
          setError(`Server error: ${error.response.data.error}`);
        } else if (error.response.status === 413) {
          setError('File is too large. Please use a smaller file (max 50MB).');
        } else {
          setError(`Server error (${error.response.status}). Please try again.`);
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        setError('No response from server. Check your connection.');
      } else {
        // Error in setting up the request
        setError(`Request error: ${error.message}`);
      }
    }
  };

  // Delete workout
  const deleteWorkout = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.delete(`http://localhost:3000/api/workout-forms/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove from local state
      setWorkouts(workouts.filter(workout => workout.Id !== id));
      alert('Workout deleted successfully!');

    } catch (error: any) {
      console.error('Error deleting workout:', error);
      setError(error.response?.data?.error || 'Failed to delete workout');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Convert numeric fields to numbers
    if (['times_performed', 'weight_kg', 'sets', 'duration_minutes'].includes(name)) {
      setNewWorkout({
        ...newWorkout,
        [name]: Number(value)
      });
    } else {
      setNewWorkout({
        ...newWorkout,
        [name]: value
      });
    }
  };

  // Add this function to help with form setup
  const handleFileSelection = (type: 'image' | 'video') => {
    // Clear the other file type when selecting a new one
    if (type === 'image') {
      setVideoFile(null);
      setVideoPreview(null);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  // Update the image file handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isImage = file.type.startsWith('image/');

      if (isImage) {
        // Clear any video files first
        handleFileSelection('image');

        setImageFile(file);

        // Create a URL for preview
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);

        console.log(`Selected image: ${file.name}, size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      } else {
        alert('Please select an image file (JPEG, PNG, GIF)');
        e.target.value = '';
      }
    }
  };

  // Update the video file handler
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isVideo = file.type.startsWith('video/');

      if (isVideo) {
        // Clear any image files first
        handleFileSelection('video');

        setVideoFile(file);

        // Create a URL for preview
        const previewUrl = URL.createObjectURL(file);
        setVideoPreview(previewUrl);

        console.log(`Selected video: ${file.name}, size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      } else {
        alert('Please select a video file (MP4, AVI, MKV)');
        e.target.value = '';
      }
    }
  };

  useEffect(() => {
    fetchWorkouts();

    // Clean up URL objects on unmount
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (videoPreview) URL.revokeObjectURL(videoPreview);

      // Also clean up any stored media URLs
      Object.values(workoutMediaUrls).forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  const goBack = () => {
    navigate('/admin-dashboard');
  };

  // Display workout media with previews for new uploads
  const renderMedia = (workout: WorkoutForm) => {
    // If this is a workout with a photo from the backend
    if (workout.photo) {
      // For newly added images, use the stored URL from state
      if (workoutMediaUrls[workout.photo]) {
        return (
          <div className="workout-media">
          <img
            src={`http://localhost:3000/uploads/${workout.photo}`} // التأكد من أن الرابط صحيح
            alt={workout.exercise_name}
            className="workout-thumbnail"
          />
        </div>
        );
      }
      // For backend images
      else {
        return (
          <div className="workout-media">
          <video controls className="workout-thumbnail">
            <source src={`http://localhost:3000/uploads/${workout.video}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        );
      }
    }
    // If this is a workout with a video
    else if (workout.video) {
      // For newly added videos, use the stored URL from state
      if (workoutMediaUrls[workout.video]) {
        return (
          <div className="workout-media">
            <video controls className="workout-thumbnail">
              <source src={workoutMediaUrls[workout.video]} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      }
      // For backend videos
      else {
        return (
          <div className="workout-media">
            <video controls className="workout-thumbnail">
              <source src={`http://localhost:3000/uploads/${workout.video}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      }
    }
    // No media
    else {
      return (
        <div className="workout-media workout-no-media">
          <span>No media</span>
        </div>
      );
    }
  };

  // Media preview for the form
  const renderMediaPreview = () => {
    return (
      <div className="media-previews">
        {imagePreview && (
          <div className="media-preview">
            <h4>Image Preview</h4>
            <img src={imagePreview} alt="Preview" className="preview-thumbnail" />
          </div>
        )}

        {videoPreview && (
          <div className="media-preview">
            <h4>Video Preview</h4>
            <video controls className="preview-thumbnail">
              <source src={videoPreview} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <h2>Manage Workout Forms</h2>

      {error && <div className="error">{error}</div>}

      {/* Create Workout Form */}
      <button
        className="btn"
        onClick={() => setIsCreating(!isCreating)}
      >
        {isCreating ? 'Cancel' : 'Create New Workout Form'}
      </button>

      {isCreating ? (
        <div className="edit-user-form">
          <h3>Create New Workout Form</h3>
          <form onSubmit={createWorkout}>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  placeholder="Workout Category"
                  value={newWorkout.category}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Program</label>
                <input
                  type="text"
                  name="workout_program"
                  placeholder="Program Name"
                  value={newWorkout.workout_program}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Exercise Name</label>
                <input
                  type="text"
                  name="exercise_name"
                  placeholder="Exercise Name"
                  value={newWorkout.exercise_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Difficulty</label>
                <select
                  name="difficulty"
                  value={newWorkout.difficulty}
                  onChange={handleInputChange}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Sets</label>
                <input
                  type="number"
                  name="sets"
                  value={newWorkout.sets}
                  onChange={handleInputChange}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Times Performed</label>
                <input
                  type="number"
                  name="times_performed"
                  value={newWorkout.times_performed}
                  onChange={handleInputChange}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  name="weight_kg"
                  value={newWorkout.weight_kg}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  name="duration_minutes"
                  value={newWorkout.duration_minutes}
                  onChange={handleInputChange}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Upload Image (max 5MB)</label>
                <input
                  type="file"
                  onChange={handleImageFileChange}
                  accept="image/*"
                  disabled={!!videoFile} // Disable if video is selected
                />
                {imageFile && (
                  <p className="file-selected">
                    Selected: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                    {imageFile.size > 5 * 1024 * 1024 &&
                      <span className="file-warning"> - File may be too large!</span>
                    }
                  </p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Upload Video (max 50MB)</label>
              <input
                type="file"
                onChange={handleVideoFileChange}
                accept="video/*"
                disabled={!!imageFile} // Disable if image is selected
              />
              {videoFile && (
                <p className="file-selected">
                  Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                  {videoFile.size > 1024 * 1024 * 1024 &&
                    <span className="file-warning"> - File may be too large!</span>
                  }
                </p>
              )}
              {(imageFile || videoFile) &&
                <p className="file-info">Only one file (image OR video) can be uploaded at a time</p>
              }
            </div>

            {/* Show previews */}
            {(imagePreview || videoPreview) && renderMediaPreview()}

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={newWorkout.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Workout description..."
              ></textarea>
            </div>

            <button type="submit" className="btn update-btn">Create Workout</button>
          </form>
        </div>
      ) : (
        <div className="workout-filters">
          <h3>Filter Workouts</h3>

          {/* Category and Program filters */}
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedProgram(''); // Reset program when category changes
                }}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Program</label>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                disabled={!selectedCategory}
              >
                <option value="">All Programs</option>
                {programs.map(program => (
                  <option key={program} value={program}>{program}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Media type filters */}
          <div className="media-filters">
            <button
              className={`filter-btn ${showImagesOnly ? 'active' : ''}`}
              onClick={toggleImagesOnly}
            >
              Images Only
            </button>
            <button
              className={`filter-btn ${showVideosOnly ? 'active' : ''}`}
              onClick={toggleVideosOnly}
            >
              Videos Only
            </button>
            <button
              className="filter-btn reset"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>

          {/* Filter status indicators */}
          {(showImagesOnly || showVideosOnly || selectedCategory || selectedProgram) && (
            <div className="active-filters">
              <p>Active filters:</p>
              <div className="filter-tags">
                {selectedCategory && (
                  <span className="filter-tag">
                    Category: {selectedCategory}
                  </span>
                )}
                {selectedProgram && (
                  <span className="filter-tag">
                    Program: {selectedProgram}
                  </span>
                )}
                {showImagesOnly && (
                  <span className="filter-tag">
                    Media: Images
                  </span>
                )}
                {showVideosOnly && (
                  <span className="filter-tag">
                    Media: Videos
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <p>Loading workouts...</p>
      ) : (
        <>
          {filteredWorkouts.length > 0 ? (
            <div className="workouts-grid">
              {filteredWorkouts.map((workout) => (
                <div key={workout.Id} className="workout-card">
                  <div className="workout-header">
                    <h3>{workout.exercise_name}</h3>
                    <span className={`difficulty-badge difficulty-${workout.difficulty}`}>
                      {workout.difficulty}
                    </span>
                  </div>

                  {renderMedia(workout)}

                  <div className="workout-info">
                    <p><strong>Category:</strong> {workout.category}</p>
                    <p><strong>Program:</strong> {workout.workout_program}</p>

                    {/* Add media type indicator */}
                    {(workout.photo || workout.video) && (
                      <p className="media-type">
                        <strong>Media:</strong> {workout.photo ? 'Image' : ''} {workout.photo && workout.video ? '& ' : ''} {workout.video ? 'Video' : ''}
                      </p>
                    )}

                    <div className="workout-stats">
                      <div className="stat">
                        <span className="stat-value">{workout.sets}</span>
                        <span className="stat-label">Sets</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{workout.weight_kg}</span>
                        <span className="stat-label">kg</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{workout.duration_minutes}</span>
                        <span className="stat-label">min</span>
                      </div>
                    </div>
                    {workout.description && (
                      <div className="workout-description">
                        <p>{workout.description}</p>
                      </div>
                    )}
                    <div className="workout-actions">
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setNewWorkout({
                            category: workout.category,
                            workout_program: workout.workout_program,
                            exercise_name: workout.exercise_name,
                            times_performed: workout.times_performed,
                            weight_kg: workout.weight_kg,
                            sets: workout.sets,
                            description: workout.description,
                            duration_minutes: workout.duration_minutes,
                            difficulty: workout.difficulty,
                          });
                          setIsCreating(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteWorkout(workout.Id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No workouts found. {(selectedCategory || selectedProgram || showImagesOnly || showVideosOnly) ? 'Try changing your filters.' : 'Create a workout to get started.'}</p>
          )}
        </>
      )}

      <button onClick={goBack} className="btn">
        Back to Dashboard
      </button>
    </div>
  );
};

export default ManageWorkouts;
