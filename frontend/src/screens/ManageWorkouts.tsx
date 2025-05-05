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

  // Local file states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Local file URLs for preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  // Keep track of url mappings for newly added workouts
  const [workoutMediaUrls, setWorkoutMediaUrls] = useState<{[key: string]: string}>({});

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [showImagesOnly, setShowImagesOnly] = useState<boolean>(false);
  const [showVideosOnly, setShowVideosOnly] = useState<boolean>(false);

  const navigate = useNavigate();

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

      let data: any = response.data;
      if (Array.isArray(data)) {
        setWorkouts(data);
      } else if (data && Array.isArray(data.rows)) {
        setWorkouts(data.rows);
      } else if (data && typeof data === 'object' && data.Id) {
        setWorkouts([data]);
      } else {
        setWorkouts([]);
      }
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

      const formData = new FormData();

      formData.append('category', newWorkout.category);
      formData.append('workout_program', newWorkout.workout_program);
      formData.append('exercise_name', newWorkout.exercise_name);
      formData.append('times_performed', String(newWorkout.times_performed));
      formData.append('weight_kg', String(newWorkout.weight_kg));
      formData.append('sets', String(newWorkout.sets));
      formData.append('description', newWorkout.description || '');
      formData.append('duration_minutes', String(newWorkout.duration_minutes));
      formData.append('difficulty', newWorkout.difficulty);
      if (imageFile) {
        formData.append('image', imageFile);
      }
      if (videoFile) {
        formData.append('video', videoFile);
      }

      console.log('Sending workout data to server...');

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
          timeout: 30000
        }
      );

      console.log('Workout created successfully:', response.data);

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

      fetchWorkouts();

    } catch (error: any) {
      console.error('Error creating workout:', error);

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
        console.error('No response received:', error.request);
        setError('No response from server. Check your connection.');
      } else {
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

      setWorkouts(workouts.filter(workout => workout.Id !== id));
      alert('Workout deleted successfully!');

    } catch (error: any) {
      console.error('Error deleting workout:', error);
      setError(error.response?.data?.error || 'Failed to delete workout');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

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

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isImage = file.type.startsWith('image/');

      if (isImage) {
        setImageFile(file);

        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);

        console.log(`Selected image: ${file.name}, size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      } else {
        alert('Please select an image file (JPEG, PNG, GIF)');
        e.target.value = '';
      }
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isVideo = file.type.startsWith('video/');

      if (isVideo) {
        setVideoFile(file);

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

    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (videoPreview) URL.revokeObjectURL(videoPreview);

      Object.values(workoutMediaUrls).forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  const goBack = () => {
    navigate('/admin-dashboard');
  };

  const renderMedia = (workout: WorkoutForm) => {
    const hasPhoto = !!workout.photo;
    const hasVideo = !!workout.video;
    return (
      <div className="workout-media media-row">
        {hasPhoto && (
          <div className="media-col">
            <img
              src={`http://localhost:3000/uploads/${workout.photo}`}
              alt={workout.exercise_name}
              className="workout-thumbnail"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
              }}
            />
          </div>
        )}
        {hasVideo && (
          <div className="media-col">
            <video controls className="workout-thumbnail">
              <source src={`http://localhost:3000/uploads/${workout.video}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        {!hasPhoto && !hasVideo && (
          <div className="workout-no-media">
            <span>No media</span>
          </div>
        )}
      </div>
    );
  };

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

  const categories = [...new Set(workouts.map(workout => workout.category))];
  const programs = selectedCategory
    ? [...new Set(workouts
        .filter(workout => workout.category === selectedCategory)
        .map(workout => workout.workout_program))]
    : [];

  const filteredWorkouts = workouts.filter(workout => {
    const matchesCategory = !selectedCategory || workout.category === selectedCategory;
    const matchesProgram = !selectedProgram || workout.workout_program === selectedProgram;
    const matchesImage = !showImagesOnly || !!workout.photo;
    const matchesVideo = !showVideosOnly || !!workout.video;
    return matchesCategory && matchesProgram && matchesImage && matchesVideo;
  });

  const toggleImagesOnly = () => {
    setShowImagesOnly(!showImagesOnly);
    if (!showImagesOnly) setShowVideosOnly(false);
  };
  const toggleVideosOnly = () => {
    setShowVideosOnly(!showVideosOnly);
    if (!showVideosOnly) setShowImagesOnly(false);
  };
  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedProgram('');
    setShowImagesOnly(false);
    setShowVideosOnly(false);
  };

  return (
    <div className="admin-dashboard">
      <h2>Manage Workout Forms</h2>

      {error && <div className="error">{error}</div>}

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
              />
              {videoFile && (
                <p className="file-selected">
                  Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                  {videoFile.size > 1024 * 1024 * 1024 &&
                    <span className="file-warning"> - File may be too large!</span>
                  }
                </p>
              )}
            </div>

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
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedProgram('');
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
