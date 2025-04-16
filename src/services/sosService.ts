import apiConfig, { handleApiResponse, getAuthToken } from '@/lib/api-config';

export interface SOSRequest {
  _id: string;
  id?: string;
  user: {
    _id: string;
    name: string;
  };
  emergency: string;
  description: string;
  location: {
    type: string;
    coordinates: number[];
    address: string;
  };
  status: string;
  assignedTo?: {
    _id: string;
    name: string;
  };
  createdAt: string;
  resolvedAt?: string;
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

// Get all SOS requests
export const getAll = async (): Promise<SOSRequest[]> => {
  const response = await fetch(`${apiConfig.API_URL}/sos`, {
    headers: getAuthHeaders()
  });
  
  const data = await handleApiResponse(response) as APIResponse<SOSRequest[]>;
  return data.data;
};

// Get SOS request by ID
export const getById = async (id: string): Promise<SOSRequest> => {
  const response = await fetch(`${apiConfig.API_URL}/sos/${id}`, {
    headers: getAuthHeaders()
  });
  
  const data = await handleApiResponse(response) as APIResponse<SOSRequest>;
  return data.data;
};

// Create a new SOS request
export interface CreateSOSRequestData {
  emergency: string;
  description: string;
  location: {
    coordinates: [number, number]; // [longitude, latitude]
    address: string;
  };
}

export const create = async (sosData: CreateSOSRequestData): Promise<SOSRequest> => {
  const response = await fetch(`${apiConfig.API_URL}/sos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(sosData)
  });
  
  const data = await handleApiResponse(response) as APIResponse<SOSRequest>;
  return data.data;
};

// Create an anonymous SOS request (no authentication required)
export interface CreateAnonymousSOSRequestData {
  emergency: string;
  description: string;
  location: {
    coordinates: [number, number]; // [longitude, latitude]
    address: string;
  };
  contactInfo: string; // Phone number or other contact information
}

export const createAnonymous = async (sosData: CreateAnonymousSOSRequestData): Promise<SOSRequest> => {
  const response = await fetch(`${apiConfig.API_URL}/sos/anonymous`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sosData)
  });
  
  const data = await handleApiResponse(response) as APIResponse<SOSRequest>;
  return data.data;
};

// Update an SOS request
export const update = async (id: string, updateData: Partial<SOSRequest>): Promise<SOSRequest> => {
  const response = await fetch(`${apiConfig.API_URL}/sos/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData)
  });
  
  const data = await handleApiResponse(response) as APIResponse<SOSRequest>;
  return data.data;
};

// Delete an SOS request
export const remove = async (id: string): Promise<void> => {
  const response = await fetch(`${apiConfig.API_URL}/sos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  await handleApiResponse(response);
};

// Get nearby SOS requests
export const getNearby = async (longitude: number, latitude: number, distance: number): Promise<SOSRequest[]> => {
  const response = await fetch(`${apiConfig.API_URL}/sos/radius/${longitude}/${latitude}/${distance}`, {
    headers: getAuthHeaders()
  });
  
  const data = await handleApiResponse(response) as APIResponse<SOSRequest[]>;
  return data.data;
};

export default {
  getAll,
  getById,
  create,
  createAnonymous,
  update,
  remove,
  getNearby
};