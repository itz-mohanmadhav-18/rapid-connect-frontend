
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X, Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm here to help with disaster-related questions. How can I assist you?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message
    const userMessage = {
      text: message,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    
    // In a production app, this would call an actual API
    try {
      // Simulating API call with timeout
      setTimeout(() => {
        // Mock response based on keywords
        let response = "I'm not sure how to help with that. Could you provide more details?";
        
        const lowercaseMsg = message.toLowerCase();
        if (lowercaseMsg.includes("flood")) {
          response = "In case of flooding, move to higher ground immediately. Don't walk or drive through floodwaters. Six inches of water can knock you down, and one foot of moving water can sweep your vehicle away.";
        } else if (lowercaseMsg.includes("earthquake")) {
          response = "During an earthquake, drop to the ground, take cover under a sturdy desk or table, and hold on until the shaking stops. Stay away from windows and exterior walls.";
        } else if (lowercaseMsg.includes("shelter") || lowercaseMsg.includes("camp")) {
          response = "There are 38 active shelters in the area. The closest ones can be found on the map. Look for the home icons to locate them.";
        } else if (lowercaseMsg.includes("emergency") || lowercaseMsg.includes("help")) {
          response = "For immediate emergency assistance, please use the SOS button at the top of the page or call 1-800-DISASTER.";
        } else if (lowercaseMsg.includes("volunteer")) {
          response = "Thank you for your interest in volunteering! Please sign up or log in using the button in the header and select 'Volunteer' as your role.";
        } else if (lowercaseMsg.includes("donate")) {
          response = "To make donations, please sign up or log in using the button in the header and select 'Donor' as your role.";
        }
        
        setMessages((prev) => [
          ...prev,
          {
            text: response,
            isUser: false,
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <Button 
          onClick={() => setIsOpen(true)} 
          className="rounded-full h-14 w-14 p-0 bg-info shadow-lg hover:bg-info/90"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-card rounded-xl shadow-xl flex flex-col w-80 sm:w-96 h-96 border border-border">
          {/* Chat Header */}
          <div className="bg-info text-info-foreground p-3 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">Emergency Assistant</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-info/90">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-grow p-3 overflow-y-auto flex flex-col gap-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-xl ${
                    msg.isUser
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs opacity-70 text-right mt-1">
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground px-4 py-2 rounded-xl rounded-bl-none max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    <p className="text-sm">Typing...</p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!message.trim() || isLoading}
                className="bg-info hover:bg-info/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
