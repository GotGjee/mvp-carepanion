// API Service for Carepanion Backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Types
export interface LoginResponse {
  access_token: string;
  token_type: string;
  is_new_user: boolean;
}

export interface ProfileData {
  gender: string;
  age_bracket: string;
  hearing_ability: string;
  nationality: string;
}

export interface ProfileResponse {
  wallet_address: string;
  gender: string | null;
  age_bracket: string | null;
  hearing_ability: string | null;
  nationality: string | null;
}

export interface AudioResponse {
  id: number;
  file_url: string;
  duration_seconds: number | null;
}

export interface LabelSubmission {
  audio_id: number;
  comfort_level: number;
  clarity: number;
  speaking_rate: "Slow" | "Medium" | "Fast";
  perceived_empathy: "Low" | "Medium" | "High";
  notes?: string;
}

export interface LabelResponse {
  status: string;
  label_id: number;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper function to create auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// API Functions

/**
 * Login with wallet address
 */
export const login = async (walletAddress: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ wallet_address: walletAddress })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Login failed');
  }

  const data = await response.json();
  
  // Store token in localStorage
  localStorage.setItem('auth_token', data.access_token);
  localStorage.setItem('wallet_address', walletAddress);
  
  return data;
};

/**
 * Get current user profile
 */
export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/profile/me`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch profile');
  }

  return await response.json();
};

/**
 * Setup/Update user profile
 */
export const setupProfile = async (profileData: ProfileData): Promise<{ status: string; user: ProfileResponse }> => {
  const response = await fetch(`${API_BASE_URL}/api/profile/setup`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to setup profile');
  }

  return await response.json();
};

/**
 * Get next unlabeled audio
 */
export const getNextAudio = async (): Promise<AudioResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/audio/next`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('No more audio files available to label');
    }
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch audio');
  }

  return await response.json();
};

/**
 * Submit label for audio
 */
export const submitLabel = async (labelData: LabelSubmission): Promise<LabelResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/labels`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(labelData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to submit label');
  }

  return await response.json();
};

/**
 * Logout user
 */
export const logout = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('wallet_address');
};