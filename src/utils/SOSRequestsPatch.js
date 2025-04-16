/*
 * INTEGRATION INSTRUCTIONS FOR ResponderSOSRequests.jsx
 * 
 * This patch file contains instructions to fix the "cannot read properties of undefined (reading 'toString')" error
 * when assigning volunteers via the response team dashboard. Follow these steps to integrate the fix:
 */

// 1. Import the utility functions at the top of ResponderSOSRequests.jsx:
import { safelyAssignVolunteer, safelyResolveRequest } from '@/utils/responseTeamUtils';

// 2. Replace the handleAssignVolunteer function with:
const handleAssignVolunteer = async (requestId, volunteerId) => {
  const volunteer = volunteers.find(v => v.id === volunteerId);
  if (!volunteer) return;
  
  const result = await safelyAssignVolunteer(requestId, volunteerId, user, toast);
  
  if (result.success) {
    // Update the local state
    setRequests(prevRequests => 
      prevRequests.map(req => {
        if (req.id === requestId) {
          return { 
            ...req, 
            status: "assigned",
            assignedVolunteer: user?.name || "Assigned"
          };
        }
        return req;
      })
    );
    
    setVolunteers(prevVolunteers =>
      prevVolunteers.map(vol => {
        if (vol.id === volunteerId) {
          return { ...vol, available: false };
        }
        return vol;
      })
    );
    
    setAssigningVolunteer(null);
    
    toast({
      title: "SOS Request Assigned",
      description: `${volunteer.name} has been assigned to this emergency.`,
    });
  }
};

// 3. Replace the handleResolveRequest function with:
const handleResolveRequest = async (requestId) => {
  const request = requests.find(req => req.id === requestId);
  if (!request) return;
  
  const result = await safelyResolveRequest(requestId, request.originalData, toast);
  
  if (result.success) {
    // Update the local state
    setRequests(prevRequests => 
      prevRequests.map(req => {
        if (req.id === requestId) {
          return { ...req, status: "resolved" };
        }
        return req;
      })
    );
    
    toast({
      title: "Emergency Resolved",
      description: "The SOS request has been marked as resolved.",
    });
  }
};