import { useState } from "react";
import axios from "axios";

const AIChat = () => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);

      const baseURL = import.meta.env.VITE_BASE_URL;

  const handleSend = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${baseURL}/analyze/chat`,
        { message, context: chatLog.map(c => c.userMessage).join("\n") },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChatLog(prev => [
        ...prev,
        { userMessage: message, aiReply: res.data.data.reply }
      ]);
      setMessage("");
    } catch (error) {
      console.error("Chat error:", error);
      alert("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="max-h-96 overflow-y-auto space-y-2">
        {chatLog.map((c, i) => (
          <div key={i}>
            <p className="font-medium text-gray-800">You: {c.userMessage}</p>
            <p className="text-gray-600 ml-4">AI: {c.aiReply}</p>
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-1 border rounded-lg p-2"
          placeholder="Ask HealthMate AI..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChat;
