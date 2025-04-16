import apiConfig, { handleApiResponse, getAuthToken } from '@/lib/api-config';
import { Resource } from './baseCampService';

export interface Donation {
  id: string;
  donor: {
    id: string;
    name: string;
  };
  donationType?: 'resource' | 'cash';
  amount?: number;
  paymentId?: string;
  resources: Resource[];
  baseCamp: {
    id: string;
    name: string;
    location: {
      coordinates: number[];
      address: string;
    };
  };
  status: 'pending' | 'in-transit' | 'delivered' | 'cancelled';
  scheduledDate: string;
  deliveredDate?: string;
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

// Get all donations (filtered by role)
export const getAll = async (): Promise<Donation[]> => {
  const response = await fetch(`${apiConfig.API_URL}/donations`, {
    headers: getAuthHeaders()
  });
  
  const data = await handleApiResponse(response);
  return data.data;
};

// Get donation by ID
export const getById = async (id: string): Promise<Donation> => {
  const response = await fetch(`${apiConfig.API_URL}/donations/${id}`, {
    headers: getAuthHeaders()
  });
  
  const data = await handleApiResponse(response);
  return data.data;
};

// Create a new resource donation
export const createResourceDonation = async (donationData: {
  resources: Resource[];
  baseCamp: string;
  scheduledDate: string;
}): Promise<Donation> => {
  const response = await fetch(`${apiConfig.API_URL}/donations`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      donationType: 'resource',
      ...donationData
    })
  });
  
  const data = await handleApiResponse(response);
  return data.data;
};

// Create a new cash donation
export const createCashDonation = async (donationData: {
  amount: number;
  paymentId: string;
  baseCamp: string;
  scheduledDate: string;
}): Promise<Donation> => {
  const response = await fetch(`${apiConfig.API_URL}/donations`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      donationType: 'cash',
      ...donationData
    })
  });
  
  const data = await handleApiResponse(response);
  return data.data;
};

// Update donation status
export const update = async (id: string, updateData: Partial<Donation>): Promise<Donation> => {
  const response = await fetch(`${apiConfig.API_URL}/donations/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData)
  });
  
  const data = await handleApiResponse(response);
  return data.data;
};

// Delete a donation (pending donations only)
export const remove = async (id: string): Promise<void> => {
  const response = await fetch(`${apiConfig.API_URL}/donations/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  await handleApiResponse(response);
};

// Get all donations for a specific base camp
export const getByBaseCamp = async (baseCampId: string): Promise<Donation[]> => {
  const response = await fetch(`${apiConfig.API_URL}/basecamps/${baseCampId}/donations`, {
    headers: getAuthHeaders()
  });
  
  const data = await handleApiResponse(response);
  return data.data;
};

export default {
  getAll,
  getById,
  createResourceDonation,
  createCashDonation,
  update,
  remove,
  getByBaseCamp
};