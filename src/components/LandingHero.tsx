
import React from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useNavigate } from "react-router-dom";
import { useChatbase } from "@/hooks/useChatbase";
import { Footer } from "@/components/Footer";

export function LandingHero() {
  const navigate = useNavigate();
  const { openChat } = useChatbase({ chatbotId: 'v4poIAqiMGSlw4aA3KfCW' });
  
  return (
    <div className="min-h-screen flex flex-col" data-chatbase-component>
      {/* Main content */}
      <div className="relative flex-grow flex flex-col items-center justify-center overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-teal-50" />
        
        {/* Animated circle patterns */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute w-96 h-96 rounded-full bg-indigo-100/50 -top-20 -left-20 animate-pulse" style={{ animationDuration: '15s' }} />
          <div className="absolute w-96 h-96 rounded-full bg-teal-100/50 bottom-0 right-0 animate-pulse" style={{ animationDuration: '20s' }} />
          <div className="absolute w-64 h-64 rounded-full bg-amber-100/50 top-1/2 left-1/4 animate-pulse" style={{ animationDuration: '25s' }} />
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-6 sm:px-10 max-w-4xl mx-auto">
          <Logo size="large" />
          
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">
            Your Trusted Service Partner
          </h1>
          
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Connecting you with verified professionals for all your home and personal service needs.
          </p>
          
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto">
            <Button 
              className="text-lg py-6 bg-cura-primary hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-200"
              onClick={() => navigate("/consumer/login")}
            >
              Need a Service
            </Button>
            
            <Button 
              className="text-lg py-6 bg-cura-secondary hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-200"
              onClick={() => navigate("/provider/login")}
            >
              Provide a Service
            </Button>
          </div>
        </div>
        
        {/* Help button */}
        <div className="fixed bottom-6 right-6 z-20">
          <Button 
            className="w-16 h-16 rounded-full shadow-lg bg-amber-400 hover:bg-amber-500 flex items-center justify-center"
            onClick={openChat}
            aria-label="Get help"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 14.042 3 12.574 3 11c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </Button>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
