
import { useEffect } from 'react';

// Default chatbot ID that can be overridden
const DEFAULT_CHATBOT_ID = 'v4poIAqiMGSlw4aA3KfCW';

interface ChatbaseOptions {
  chatbotId?: string;
  domain?: string;
}

declare global {
  interface Window {
    Chatbase?: {
      open: () => void;
      close: () => void;
    };
  }
}

export function useChatbase({ chatbotId = DEFAULT_CHATBOT_ID, domain = 'www.chatbase.co' }: ChatbaseOptions = {}) {
  useEffect(() => {
    // Load Chatbase script when hook is used
    const script = document.createElement('script');
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "chatbase-embed-script";
    script.defer = true;
    script.setAttribute('chatbotId', chatbotId);
    script.setAttribute('domain', domain);
    
    // Check if script already exists
    if (!document.getElementById('chatbase-embed-script')) {
      document.body.appendChild(script);
    }
    
    return () => {
      // Only clean up if component using this hook is the last one
      // This prevents removing the script if multiple components use the hook
      const chatbaseComponents = document.querySelectorAll('[data-chatbase-component]');
      if (chatbaseComponents.length <= 1) {
        document.getElementById('chatbase-embed-script')?.remove();
      }
    };
  }, [chatbotId, domain]);

  const openChat = () => {
    if (window.Chatbase) {
      window.Chatbase.open();
    }
  };

  const closeChat = () => {
    if (window.Chatbase) {
      window.Chatbase.close();
    }
  };

  return { openChat, closeChat };
}
