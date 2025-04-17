import React from "react";
import { Phone, Mail, MapPin, Clock, AlertTriangle, ExternalLink, Heart, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto">
        {/* Top section with emergency info */}
        <div className="py-3 px-4 md:px-6 bg-emergency/10 border-b border-white/10 flex flex-wrap justify-between items-center">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-emergency mr-2" />
            <span className="font-medium">24/7 Emergency Hotline: <a href="tel:1-800-DISASTER" className="underline hover:text-white">1-800-DISASTER</a></span>
          </div>
          <Button variant="ghost" size="sm" className="text-xs px-3 text-white bg-emergency/20 hover:bg-emergency/30 border border-emergency/20 mt-2 md:mt-0">
            <Phone className="h-3.5 w-3.5 mr-1.5" />
            Call Emergency
          </Button>
        </div>
        
        {/* Main footer content */}
        <div className="pt-10 pb-8 px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-white/10 p-2 rounded-full mr-3">
                  <AlertTriangle className="h-5 w-5 text-emergency" /> 
                </div>
                <h3 className="text-xl font-display font-semibold">
                  Rapid Aid Connect
                </h3>
              </div>
              <p className="text-sm text-white/80">
                A comprehensive platform connecting disaster victims with relief resources, volunteers, and real-time information during emergencies.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button size="sm" variant="ghost" className="text-xs px-3 text-white bg-white/10 hover:bg-white/20">
                  About Us
                </Button>
                <Button size="sm" variant="ghost" className="text-xs px-3 text-white bg-white/10 hover:bg-white/20">
                  <Heart className="h-3.5 w-3.5 mr-1.5" />
                  Donate
                </Button>
                <Button size="sm" variant="ghost" className="text-xs px-3 text-white bg-white/10 hover:bg-white/20">
                  Privacy
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold pb-2 border-b border-white/20">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/" className="flex items-center hover:translate-x-1 transition-transform group">
                    <ExternalLink className="h-3.5 w-3.5 mr-2 text-white/70 group-hover:text-white" />
                    <span className="group-hover:text-white/100 text-white/90">Home</span>
                  </a>
                </li>
                <li>
                  <a href="#services" className="flex items-center hover:translate-x-1 transition-transform group">
                    <ExternalLink className="h-3.5 w-3.5 mr-2 text-white/70 group-hover:text-white" />
                    <span className="group-hover:text-white/100 text-white/90">Services</span>
                  </a>
                </li>
                <li>
                  <a href="#emergency" className="flex items-center hover:translate-x-1 transition-transform group">
                    <ExternalLink className="h-3.5 w-3.5 mr-2 text-white/70 group-hover:text-white" />
                    <span className="group-hover:text-white/100 text-white/90">Emergency Response</span>
                  </a>
                </li>
                <li>
                  <a href="#contact" className="flex items-center hover:translate-x-1 transition-transform group">
                    <ExternalLink className="h-3.5 w-3.5 mr-2 text-white/70 group-hover:text-white" />
                    <span className="group-hover:text-white/100 text-white/90">Contact</span>
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold pb-2 border-b border-white/20">Volunteer & Donate</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="flex items-center hover:translate-x-1 transition-transform group">
                    <Users className="h-3.5 w-3.5 mr-2 text-white/70 group-hover:text-white" />
                    <span className="group-hover:text-white/100 text-white/90">Volunteer Registration</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center hover:translate-x-1 transition-transform group">
                    <Heart className="h-3.5 w-3.5 mr-2 text-white/70 group-hover:text-white" />
                    <span className="group-hover:text-white/100 text-white/90">Donation Centers</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center hover:translate-x-1 transition-transform group">
                    <Shield className="h-3.5 w-3.5 mr-2 text-white/70 group-hover:text-white" />
                    <span className="group-hover:text-white/100 text-white/90">Disaster Preparedness Guide</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center hover:translate-x-1 transition-transform group">
                    <MapPin className="h-3.5 w-3.5 mr-2 text-white/70 group-hover:text-white" />
                    <span className="group-hover:text-white/100 text-white/90">Evacuation Routes</span>
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold pb-2 border-b border-white/20">Contact Information</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center group">
                  <div className="h-8 w-8 rounded-full bg-emergency/20 flex items-center justify-center mr-3 group-hover:bg-emergency/30 transition-colors">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="block font-medium">Emergency: 911</span>
                    <span className="text-white/70 text-xs">Available 24/7</span>
                  </div>
                </li>
                <li className="flex items-center group">
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center mr-3 group-hover:bg-white/20 transition-colors">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="block font-medium">Disaster Hotline</span>
                    <span className="text-white/70 text-xs">1-800-DISASTER</span>
                  </div>
                </li>
                <li className="flex items-center group">
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center mr-3 group-hover:bg-white/20 transition-colors">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  <span>help@rapidaidconnect.org</span>
                </li>
                <li className="flex items-center group">
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center mr-3 group-hover:bg-white/20 transition-colors">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <span>24/7 Operations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom copyright section */}
        <div className="py-6 border-t border-white/20 text-center px-4">
          <p className="text-sm text-white/60">&copy; {new Date().getFullYear()} Rapid Aid Connect. All rights reserved.</p>
          <p className="mt-1 text-xs text-white/50">This is a demonstration application. In a real emergency, always follow official instructions.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
