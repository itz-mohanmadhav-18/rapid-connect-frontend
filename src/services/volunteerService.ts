import apiConfig, { handleApiResponse, getAuthToken } from '@/lib/api-config';

export interface Volunteer {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  location?: {
    type: string;
    coordinates: number[];
    address: string;
  };
  available?: boolean;
  specialty?: string[];
  status?: string;
}

interface APIResponse<T> {
  success: boolean;
  count?: number;
  data: T;
}

// Common headers with authorization token
const getAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No auth token found. Please log in again.');
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Get all volunteers
export const getAll = async (): Promise<Volunteer[]> => {
  const response = await fetch(`${apiConfig.API_URL}/users?role=volunteer`, {
    headers: getAuthHeaders()
  });
  
  const data = await handleApiResponse(response) as APIResponse<Volunteer[]>;
  return data.data;
};

// Get volunteer by ID
export const getById = async (id: string): Promise<Volunteer> => {
  const response = await fetch(`${apiConfig.API_URL}/users/${id}`, {
    headers: getAuthHeaders()
  });
  
  const data = await handleApiResponse(response) as APIResponse<Volunteer>;
  return data.data;
};

// Get available volunteers
export const getAvailable = async (): Promise<Volunteer[]> => {
  try {
    const volunteers = await getAll();
    // Filter volunteers who are available
    // In a real implementation, the API might have a specific endpoint for this
    return volunteers.filter(volunteer => volunteer.available !== false);
  } catch (error) {
    console.error("Error fetching available volunteers:", error);
    throw error;
  }
};

// Update volunteer status
export const updateStatus = async (id: string, available: boolean): Promise<Volunteer> => {
  const response = await fetch(`${apiConfig.API_URL}/users/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ available })
  });
  
  const data = await handleApiResponse(response) as APIResponse<Volunteer>;
  return data.data;
};

// Assign volunteer to a task
export const assignToTask = async (volunteerId: string, taskId: string, taskType: 'sos' | 'donation' | 'basecamp'): Promise<Volunteer> => {
  const response = await fetch(`${apiConfig.API_URL}/users/${volunteerId}/assign`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ taskId, taskType })
  });
  
  const data = await handleApiResponse(response) as APIResponse<Volunteer>;
  return data.data;
};

// Get nearby volunteers within a radius
export const getNearby = async (longitude: number, latitude: number, distance: number): Promise<Volunteer[]> => {
  const response = await fetch(`${apiConfig.API_URL}/users/radius/${longitude}/${latitude}/${distance}?role=volunteer`, {
    headers: getAuthHeaders()
  });
  
  const data = await handleApiResponse(response) as APIResponse<Volunteer[]>;
  return data.data;
};

export default {
  getAll,
  getById,
  getAvailable,
  updateStatus,
  assignToTask,
  getNearby
};