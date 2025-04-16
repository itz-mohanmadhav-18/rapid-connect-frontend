import apiConfig, { handleApiResponse, getAuthToken } from '@/lib/api-config';

export interface Resource {
  name: string;
  quantity: number;
  unit: string;
}

export interface BaseCamp {
  id: string;
  name: string;
  location: {
    coordinates: number[];
    address: string;
  };
  capacity: number;
  occupancy: number;
  resources: Resource[];
  volunteers: string[];
  createdAt: string;
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

// Get all base camps
export const getAll = async (): Promise<BaseCamp[]> => {
  const response = await fetch(`${apiConfig.API_URL}/basecamps`, {
    headers: getAuthHeaders()
  });
  
  const data = await handleApiResponse(response);
  return data.data;
};

// Get base camp by ID
export const getById = async (id: string): Promise<BaseCamp> => {
  const response = await fetch(`${apiConfig.API_URL}/basecamps/${id}`, {
    headers: getAuthHeaders()
  });
  
  const data = await handleApiResponse(response);
  return data.data;
};

// Create a new base camp (responders only)
export const create = async (campData: Omit<BaseCamp, 'id' | 'createdAt'>): Promise<BaseCamp> => {
  const response = await fetch(`${apiConfig.API_URL}/basecamps`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(campData)
  });
  
  const data = await handleApiResponse(response);
  return data.data;
};

// Update a base camp
export const update = async (id: string, updateData: Partial<BaseCamp>): Promise<BaseCamp> => {
  const response = await fetch(`${apiConfig.API_URL}/basecamps/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData)
  });
  
  const data = await handleApiResponse(response);
  return data.data;
};

// Update resources in a base camp
export const updateResources = async (id: string, resources: Resource[]): Promise<BaseCamp> => {
  const response = await fetch(`${apiConfig.API_URL}/basecamps/${id}/resources`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ resources })
  });
  
  const data = await handleApiResponse(response);
  return data.data;
};

// Assign volunteer to a base camp
export const assignVolunteer = async (campId: string, volunteerId: string): Promise<BaseCamp> => {
  const response = await fetch(`${apiConfig.API_URL}/basecamps/${campId}/volunteers`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ volunteerId })
  });
  
  const data = await handleApiResponse(response);
  return data.data;
};

// Remove volunteer from a base camp
export const removeVolunteer = async (campId: string, volunteerId: string): Promise<BaseCamp> => {
  const response = await fetch(`${apiConfig.API_URL}/basecamps/${campId}/volunteers/${volunteerId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  const data = await handleApiResponse(response);
  return data.data;
};

// Get nearby base camps
export const getNearby = async (longitude: number, latitude: number, distance: number): Promise<BaseCamp[]> => {
  const response = await fetch(`${apiConfig.API_URL}/basecamps/radius/${longitude}/${latitude}/${distance}`, {
    headers: getAuthHeaders()
  });
  
  const data = await handleApiResponse(response);
  return data.data;
};

export default {
  getAll,
  getById,
  create,
  update,
  updateResources,
  assignVolunteer,
  removeVolunteer,
  getNearby
};