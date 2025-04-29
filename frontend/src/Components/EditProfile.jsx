import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCamera, FaEye, FaLock, FaBell, FaSignInAlt } from 'react-icons/fa';
import '../Styles/EditProfile.css';
import userIcon from "/assets/images/UNLV_pic.png";
import { getProfileData, saveProfileData, initializeProfileData, getProfileDataSync } from '../utils/profileData';
import { isLoggedIn, refreshAuthToken } from '../utils/auth';

const EditProfile = () => {
  const navigate = useNavigate();
  
  // Authentication state
  const [authenticated, setAuthenticated] = useState(isLoggedIn());
  
  // Add loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check authentication and redirect if needed
  useEffect(() => {
    if (!authenticated) {
      // You can uncomment the navigate line when you have a login page
      // navigate('/login');
    }
  }, [authenticated, navigate]);
  
  // Initialize profile data if not already set
  useEffect(() => {
    const initProfile = async () => {
      try {
        await initializeProfileData();
      } catch (err) {
        console.error("Error initializing profile data:", err);
      }
    };
    
    if (authenticated) {
      initProfile();
    }
  }, [authenticated]);
  
  // Get profile data from API with localStorage fallback
  const [userData, setUserData] = useState(() => getProfileDataSync());
  const [profileImagePreview, setProfileImagePreview] = useState(userData.profileImage || userIcon);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Fetch profile data from API
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!authenticated) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Try to refresh token first if needed
        await refreshAuthToken();
        
        const data = await getProfileData();
        setUserData(data);
        setProfileImagePreview(data.profileImage || userIcon);
        setError(null);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        
        if (err.message && err.message.includes('401')) {
          setError("Your session has expired. Please log in again.");
          setAuthenticated(false);
        } else {
          setError("Failed to load profile data. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [authenticated]);

  // Handle profile image change
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setProfileImagePreview(result);
        // Update image in userData
        setUserData(prev => ({
          ...prev,
          profileImage: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle privacy toggle change
  const handlePrivacyChange = (setting) => {
    setUserData(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [setting]: !prev.privacy[setting]
      }
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!authenticated) {
      alert("You need to be logged in to save profile changes.");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Try to refresh token first if needed
      await refreshAuthToken();
      
      // Save to API and localStorage
      const success = await saveProfileData(userData);
      
      if (!success) {
        throw new Error('Failed to save profile data');
      }

      // Show success message
      setSaveSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
        // Navigate back to profile
        navigate('/profile');
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.message && error.message.includes('401')) {
        alert('Your session has expired. Please log in again.');
        setAuthenticated(false);
      } else {
        alert('There was an error saving your profile. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Navigate back to profile without saving
  const handleCancel = () => {
    navigate('/profile');
  };
  
  // Handle Login button click
  const handleLoginClick = () => {
    navigate('/login');
  };
  
  // Show loading message when data is being fetched
  if (isLoading) {
    return (
      <div className="edit-profile-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading profile data...</p>
      </div>
    );
  }
  
  // If not authenticated, show login prompt
  if (!authenticated) {
    return (
      <div className="edit-profile-error">
        <h3>Authentication Required</h3>
        <p>You need to be logged in to edit your profile.</p>
        <button 
          className="btn btn-primary" 
          onClick={handleLoginClick}
        >
          <FaSignInAlt /> Log In
        </button>
      </div>
    );
  }
  
  // Show error message if there was a problem
  if (error) {
    return (
      <div className="edit-profile-error">
        <p className="text-danger">{error}</p>
        <button 
          className="btn btn-primary" 
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="edit-profile-page">
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <div className="edit-profile-header">
          <h2>Edit Profile</h2>
          <button 
            className="edit-profile-back-btn" 
            onClick={handleCancel}
          >
            <FaArrowLeft /> <span>Back to Profile</span>
          </button>
        </div>
        
        {saveSuccess && (
          <div className="save-success-message">
            Profile updated successfully!
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="edit-profile-content">
          {/* Profile Image Section */}
          <div className="profile-image-section">
            <div className="profile-image-container">
              <img 
                src={profileImagePreview} 
                alt="Profile" 
                className="profile-image"
              />
              <label className="profile-image-upload">
                <FaCamera />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            <div className="profile-image-instructions">
              Click the camera icon to upload a new profile photo. Square images work best.
            </div>
          </div>
          
          {/* Personal Information */}
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  value={userData.firstName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  value={userData.lastName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  value={userData.username} 
                  onChange={handleChange} 
                  required 
                />
                <div className="input-hint">
                  This will be displayed on your profile
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input 
                  type="text" 
                  id="location" 
                  name="location" 
                  value={userData.location} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="birthdate">Date of Birth</label>
                <input 
                  type="date" 
                  id="birthdate" 
                  name="birthdate" 
                  value={userData.birthdate} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={userData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={userData.phone} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>
          
          {/* Bio */}
          <div className="form-section">
            <h3>Bio</h3>
            <div className="form-group">
              <label htmlFor="bio">About Me</label>
              <textarea 
                id="bio" 
                name="bio" 
                value={userData.bio} 
                onChange={handleChange} 
                placeholder="Tell us a bit about yourself..."
              />
              <div className="input-hint">
                Max 300 characters
              </div>
            </div>
          </div>
          
          <div className="form-divider"></div>
          
          {/* Privacy Settings */}
          <div className="form-section">
            <h3>Privacy Settings</h3>
            <div className="privacy-settings">
              <div className="privacy-option">
                <div className="privacy-option-header">
                  <div className="privacy-option-icon">
                    <FaEye />
                  </div>
                  <h4 className="privacy-option-title">Profile Visibility</h4>
                </div>
                <p className="privacy-option-description">
                  Allow others to view your full profile details
                </p>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={userData.privacy?.profileVisibility} 
                    onChange={() => handlePrivacyChange('profileVisibility')} 
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="privacy-option">
                <div className="privacy-option-header">
                  <div className="privacy-option-icon">
                    <FaLock />
                  </div>
                  <h4 className="privacy-option-title">Activity Visibility</h4>
                </div>
                <p className="privacy-option-description">
                  Show your learning activities to other users
                </p>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={userData.privacy?.activityVisibility} 
                    onChange={() => handlePrivacyChange('activityVisibility')} 
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="privacy-option">
                <div className="privacy-option-header">
                  <div className="privacy-option-icon">
                    <FaBell />
                  </div>
                  <h4 className="privacy-option-title">Email Notifications</h4>
                </div>
                <p className="privacy-option-description">
                  Receive updates about courses and messages
                </p>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={userData.privacy?.emailNotifications} 
                    onChange={() => handlePrivacyChange('emailNotifications')} 
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="button-group">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-save" 
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default EditProfile;
