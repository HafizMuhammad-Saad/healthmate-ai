import AIChat from './AiChat';
import { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';

const FloatingAIChat = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="w-80 md:w-96 bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-purple-600 text-white px-4 py-2 flex justify-between items-center">
            <h3 className="text-lg font-bold">HealthMate AI</h3>
            <button onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-2 h-96 overflow-y-auto">
            <AIChat />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-all"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default FloatingAIChat;
