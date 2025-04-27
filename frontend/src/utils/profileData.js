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

// API endpoints - including both relative and absolute versions for testing
const PROFILE_ENDPOINT_REL = `/users/user-profile/`;
const PROFILE_ENDPOINT_ABS = `http://localhost:8000/users/user-profile/`;

// Helper function to get the authentication token
const getAuthToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.warn('Authentication token not found');
  }
  return token;
};

// Get profile data from API, fallback to localStorage if offline
export const getProfileData = async () => {
  try {
    // Get authentication token
    const token = getAuthToken();
    console.log('Fetching profile with token:', token);
    
    if (!token) {
      // If no token is available, fall back to localStorage immediately
      console.log('No token available, falling back to localStorage');
      throw new Error('No authentication token available');
    }
    
    // Try both relative and absolute URLs with both auth types
    const endpoints = [
      { 
        url: PROFILE_ENDPOINT_ABS, 
        headers: { 'Authorization': `Bearer ${token}` },
        name: 'Absolute URL with Bearer'
      },
      { 
        url: PROFILE_ENDPOINT_REL, 
        headers: { 'Authorization': `Bearer ${token}` },
        name: 'Relative URL with Bearer'
      },
      { 
        url: PROFILE_ENDPOINT_ABS, 
        headers: { 'Authorization': `Token ${token}` },
        name: 'Absolute URL with Token prefix'
      },
      { 
        url: PROFILE_ENDPOINT_REL, 
        headers: { 'Authorization': `Token ${token}` },
        name: 'Relative URL with Token prefix'
      }
    ];
    
    let data = null;
    let lastError = null;
    
    // Try each endpoint until one works
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint.name} - ${endpoint.url}`);
        
        const resp = await fetch(endpoint.url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...endpoint.headers
          },
          credentials: 'include'
        });
        
        console.log(`${endpoint.name} response status:`, resp.status);
        
        if (resp.ok) {
          data = await resp.json();
          console.log(`Success with ${endpoint.name}:`, data);
          break;
        } else {
          console.warn(`Failed with ${endpoint.name}: ${resp.status}`);
        }
      } catch (err) {
        console.warn(`Error with ${endpoint.name}:`, err.message);
        lastError = err;
      }
    }
    
    if (!data) {
      throw lastError || new Error('All endpoints failed');
    }
    
    console.log('API Response data:', data);
    
    // The data format depends on the user's role (student, tutor, parent)
    // Let's handle all possible formats
    const transformedData = {
      firstName: data.profile?.user?.first_name || '',
      lastName: data.profile?.user?.last_name || '',
      username: data.profile?.user?.username || '',
      email: data.profile?.user?.email || '',
      // Handle different profile types
      phone: data.phone_number || data.emergency_contact_phone_number || data.profile?.phone_number || '',
      bio: data.bio || '',
      // Location might be stored differently depending on the profile type
      location: data.city ? `${data.city}, ${data.state || ''}` : '',
      birthdate: data.profile?.date_of_birth || data.birthdate || '',
      joined: 'January 2022', // Default joined date if not available
      profileImage: data.profile_picture?.url || '/assets/images/UNLV_pic.png',
      privacy: {
        profileVisibility: true,
        activityVisibility: true,
        emailNotifications: true
      },
      status: data.status || ''
    };
    
    // Log the specific fields to help debugging
    console.log('Extracted firstName:', data.profile?.user?.first_name);
    console.log('Extracted lastName:', data.profile?.user?.last_name);
    console.log('Extracted username:', data.profile?.user?.username);
    console.log('Extracted email:', data.profile?.user?.email);
    
    // Save to localStorage as a cache
    localStorage.setItem('profileData', JSON.stringify(transformedData));
    
    return transformedData;
  } catch (error) {
    console.warn('Failed to fetch profile from API, falling back to localStorage:', error);
    
    // Fallback to localStorage
    const storedData = localStorage.getItem('profileData');
    
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (parseError) {
        console.error('Error parsing profile data from localStorage:', parseError);
        return defaultProfileData;
      }
    }
    
    return defaultProfileData;
  }
};

// Sync version for immediate use (will be deprecated once fully migrated to API)
export const getProfileDataSync = () => {
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

// Transform frontend data model to Django backend format
const transformToBackendFormat = (data) => {
  // Structure depends on the user's role (student, tutor, parent)
  // This is a simple example for tutor role
  return {
    profile: {
      user: {
        first_name: data.firstName,
        last_name: data.lastName,
        username: data.username,
        email: data.email
      }
    },
    phone: data.phone,
    bio: data.bio,
    // Parse city, state from location
    ...(data.location && {
      city: data.location.split(',')[0]?.trim(),
      state: data.location.split(',')[1]?.trim() || ''
    }),
    status: data.status
  };
};

// Save profile data to API and localStorage
export const saveProfileData = async (data) => {
  try {
    // Get authentication token
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    // Transform the data to match Django's expected format
    const backendData = transformToBackendFormat(data);
    
    // Try both auth types and both URLs
    const endpoints = [
      { 
        url: PROFILE_ENDPOINT_ABS, 
        headers: { 'Authorization': `Bearer ${token}` },
        name: 'Absolute URL with Bearer'
      },
      { 
        url: PROFILE_ENDPOINT_REL, 
        headers: { 'Authorization': `Bearer ${token}` },
        name: 'Relative URL with Bearer'
      },
      { 
        url: PROFILE_ENDPOINT_ABS, 
        headers: { 'Authorization': `Token ${token}` },
        name: 'Absolute URL with Token prefix'
      },
      { 
        url: PROFILE_ENDPOINT_REL, 
        headers: { 'Authorization': `Token ${token}` },
        name: 'Relative URL with Token prefix'
      }
    ];
    
    let successfulResponse = false;
    let lastError = null;
    
    // Try each endpoint until one works
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying PATCH to endpoint: ${endpoint.name} - ${endpoint.url}`);
        
        const resp = await fetch(endpoint.url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...endpoint.headers
          },
          credentials: 'include',
          body: JSON.stringify(backendData)
        });
        
        console.log(`${endpoint.name} response status:`, resp.status);
        
        if (resp.ok) {
          successfulResponse = true;
          console.log(`Success with ${endpoint.name}`);
          break;
        } else {
          console.warn(`Failed with ${endpoint.name}: ${resp.status}`);
        }
      } catch (err) {
        console.warn(`Error with ${endpoint.name}:`, err.message);
        lastError = err;
      }
    }
    
    if (!successfulResponse) {
      throw lastError || new Error('All endpoints failed');
    }
    
    // Then save to localStorage as a cache
    localStorage.setItem('profileData', JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving profile data:', error);
    
    // If API fails but localStorage succeeds, return false to indicate partial success
    try {
      localStorage.setItem('profileData', JSON.stringify(data));
      console.warn('Saved to localStorage but failed to save to API');
    } catch (localError) {
      console.error('Failed to save to localStorage as well:', localError);
      return false;
    }
    
    return false;
  }
};

// Initialize profile data from API or use default
export const initializeProfileData = async () => {
  try {
    // Check if we already have profile data
    const existingData = localStorage.getItem('profileData');
    
    if (existingData) {
      return JSON.parse(existingData);
    }
    
    // If no data, fetch from API
    return await getProfileData();
  } catch (_) {
    // Return default data if any error occurs
    return defaultProfileData;
  }
};

// Update specific profile fields
export const updateProfileData = async (updatedData) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    const currentData = getProfileDataSync();
    const newData = { ...currentData, ...updatedData };
    
    // Transform only the updated fields for backend
    const backendData = transformToBackendFormat(newData);
    
    // Try both auth types and both URLs
    const endpoints = [
      { 
        url: PROFILE_ENDPOINT_ABS, 
        headers: { 'Authorization': `Bearer ${token}` },
        name: 'Absolute URL with Bearer'
      },
      { 
        url: PROFILE_ENDPOINT_REL, 
        headers: { 'Authorization': `Bearer ${token}` },
        name: 'Relative URL with Bearer'
      },
      { 
        url: PROFILE_ENDPOINT_ABS, 
        headers: { 'Authorization': `Token ${token}` },
        name: 'Absolute URL with Token prefix'
      },
      { 
        url: PROFILE_ENDPOINT_REL, 
        headers: { 'Authorization': `Token ${token}` },
        name: 'Relative URL with Token prefix'
      }
    ];
    
    let successfulResponse = false;
    let lastError = null;
    
    // Try each endpoint until one works
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying PATCH to endpoint: ${endpoint.name} - ${endpoint.url}`);
        
        const resp = await fetch(endpoint.url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...endpoint.headers
          },
          credentials: 'include',
          body: JSON.stringify(backendData)
        });
        
        console.log(`${endpoint.name} response status:`, resp.status);
        
        if (resp.ok) {
          successfulResponse = true;
          console.log(`Success with ${endpoint.name}`);
          break;
        } else {
          console.warn(`Failed with ${endpoint.name}: ${resp.status}`);
        }
      } catch (err) {
        console.warn(`Error with ${endpoint.name}:`, err.message);
        lastError = err;
      }
    }
    
    if (!successfulResponse) {
      throw lastError || new Error('All endpoints failed');
    }
    
    // Update localStorage
    localStorage.setItem('profileData', JSON.stringify(newData));
    return true;
  } catch (error) {
    console.error('Error updating profile data:', error);
    return false;
  }
}; 