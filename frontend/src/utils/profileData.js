// Default user profile data
const defaultProfileData = {
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  email: 'john.doe@example.com',
  phone: '(555) 987-6543',
  bio: 'Frontend Developer. Passionate about UI/UX and React.',
  location: 'New York, USA',
  birthdate: '1990-04-12',
  joined: 'January 2022',
  profileImage: '/assets/images/UNLV_pic.png',
  privacy: {
    profileVisibility: true,
    activityVisibility: true,
    emailNotifications: true
  }
};

// Get profile data from localStorage or use default
export const getProfileData = () => {
  const storedData = localStorage.getItem('profileData');
  
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error('Error parsing profile data from localStorage:', error);
      return defaultProfileData;
    }
  }
  
  return defaultProfileData;
};

// Save profile data to localStorage
export const saveProfileData = (data) => {
  try {
    localStorage.setItem('profileData', JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving profile data to localStorage:', error);
    return false;
  }
};

// Initialize profile data if not already set
export const initializeProfileData = () => {
  if (!localStorage.getItem('profileData')) {
    saveProfileData(defaultProfileData);
  }
};

// Update specific profile fields
export const updateProfileData = (updatedData) => {
  const currentData = getProfileData();
  const newData = { ...currentData, ...updatedData };
  return saveProfileData(newData);
}; 