
import React from "react";
import { Phone, Mail, MapPin, Clock, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer: React.FC = () => {
  return (
    <footer className="bg-info text-white pt-8 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/3 mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" /> 
              Rapid Aid Connect
            </h3>
            <p className="text-sm text-white/80 mb-4">
              A platform connecting disaster victims with relief resources, volunteers, and real-time information.
            </p>
            <div className="flex space-x-2">
              <Button size="sm" variant="secondary" className="text-xs px-2">About</Button>
              <Button size="sm" variant="secondary" className="text-xs px-2">Privacy</Button>
              <Button size="sm" variant="secondary" className="text-xs px-2">Terms</Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/3 mb-6">
            <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-emergency" />
                <span>Emergency: 911</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-emergency" />
                <span>Disaster Hotline: 1-800-DISASTER</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>help@rapidaidconnect.org</span>
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>National Emergency Operations Center</span>
              </li>
              <li className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>24/7 Operations</span>
              </li>
            </ul>
          </div>
          
          <div className="w-full md:w-1/3 mb-6">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="flex items-center hover:underline">
                  <ExternalLink className="h-3 w-3 mr-2" />
                  <span>Weather Alerts</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center hover:underline">
                  <ExternalLink className="h-3 w-3 mr-2" />
                  <span>Evacuation Routes</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center hover:underline">
                  <ExternalLink className="h-3 w-3 mr-2" />
                  <span>Volunteer Registration</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center hover:underline">
                  <ExternalLink className="h-3 w-3 mr-2" />
                  <span>Donation Centers</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center hover:underline">
                  <ExternalLink className="h-3 w-3 mr-2" />
                  <span>Disaster Preparedness Guide</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/20 text-center text-xs text-white/60">
          <p>&copy; 2025 Rapid Aid Connect. All rights reserved.</p>
          <p className="mt-1">This is a demonstration application. In a real emergency, always follow official instructions.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
