
import React from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useChatbase } from "@/hooks/useChatbase";

interface ChatHelpProps {
  chatbotId?: string;
  buttonClassName?: string;
  iconClassName?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "custom";
  customPosition?: string;
}

export function ChatHelp({
  chatbotId,
  buttonClassName = "",
  iconClassName = "",
  position = "bottom-right",
  customPosition = "",
}: ChatHelpProps) {
  const { openChat } = useChatbase({ chatbotId });
  
  const getPositionClasses = () => {
    if (position === "custom") return customPosition;
    
    switch (position) {
      case "bottom-right":
        return "fixed bottom-6 right-6 z-50";
      case "bottom-left":
        return "fixed bottom-6 left-6 z-50";
      case "top-right":
        return "fixed top-6 right-6 z-50";
      case "top-left":
        return "fixed top-6 left-6 z-50";
      default:
        return "fixed bottom-6 right-6 z-50";
    }
  };
  
  return (
    <div className={getPositionClasses()} data-chatbase-component>
      <Button
        onClick={openChat}
        className={`w-12 h-12 rounded-full shadow-lg bg-amber-400 hover:bg-amber-500 flex items-center justify-center ${buttonClassName}`}
        aria-label="Get help"
      >
        <HelpCircle className={`w-6 h-6 ${iconClassName}`} />
      </Button>
    </div>
  );
}
