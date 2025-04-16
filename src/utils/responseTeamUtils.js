import * as sosService from '../services/sosService';
import * as volunteerService from '../services/volunteerService';

/**
 * Safely assigns a volunteer to an SOS request
 * 
 * @param {string} requestId - The ID of the SOS request
 * @param {string} volunteerId - The ID of the volunteer
 * @param {object} userData - The current user's data
 * @param {function} toast - Toast notification function
 * @returns {Promise<object>} - Result object with success status and message
 */
export const safelyAssignVolunteer = async (requestId, volunteerId, userData, toast) => {
  try {
    // Validate inputs
    if (!requestId || !volunteerId) {
      return { 
        success: false, 
        message: "Missing request or volunteer ID" 
      };
    }

    // Check if user is authenticated
    if (!userData || !userData.id) {
      toast?.({
        title: "Authentication Error",
        description: "You must be logged in to assign volunteers.",
        variant: "destructive",
      });
      return { 
        success: false, 
        message: "User not authenticated" 
      };
    }

    // Update the request status in the API
    await sosService.update(requestId, {
      status: "assigned",
      assignedTo: userData.id // Assign to current responder
    });
    
    // Update the volunteer status in the API
    try {
      await volunteerService.updateStatus(volunteerId, false); // Mark as unavailable
      await volunteerService.assignToTask(volunteerId, requestId, 'sos');
    } catch (error) {
      console.error("Error updating volunteer status:", error);
      // Continue anyway - we've already updated the SOS request
      toast?.({
        title: "Partial Success",
        description: "Request assigned, but volunteer status update failed.",
        variant: "default",
      });
    }
    
    return { 
      success: true, 
      message: "Volunteer successfully assigned" 
    };
  } catch (error) {
    console.error("Error in safelyAssignVolunteer:", error);
    toast?.({
      title: "Failed to assign request",
      description: error.message || "An unknown error occurred",
      variant: "destructive",
    });
    return { 
      success: false, 
      message: error.message || "Unknown error occurred" 
    };
  }
};

/**
 * Safely resolves an SOS request
 * 
 * @param {string} requestId - The ID of the SOS request
 * @param {object} requestData - The request data containing assignedTo info
 * @param {function} toast - Toast notification function
 * @returns {Promise<object>} - Result object with success status and message
 */
export const safelyResolveRequest = async (requestId, requestData, toast) => {
  try {
    // Validate inputs
    if (!requestId) {
      return { 
        success: false, 
        message: "Missing request ID" 
      };
    }

    // Update the request status in the API
    await sosService.update(requestId, {
      status: "resolved",
      resolvedAt: new Date().toISOString()
    });
    
    // If there was an assigned volunteer, update their status
    if (requestData && requestData.assignedTo && requestData.assignedTo._id) {
      try {
        await volunteerService.updateStatus(requestData.assignedTo._id, true); // Mark as available again
      } catch (error) {
        console.error("Error updating volunteer status:", error);
        // Continue anyway - we've already resolved the SOS request
      }
    }
    
    return { 
      success: true, 
      message: "Request successfully resolved" 
    };
  } catch (error) {
    console.error("Error in safelyResolveRequest:", error);
    toast?.({
      title: "Failed to resolve request",
      description: error.message || "An unknown error occurred",
      variant: "destructive",
    });
    return { 
      success: false, 
      message: error.message || "Unknown error occurred" 
    };
  }
};

export default {
  safelyAssignVolunteer,
  safelyResolveRequest
};