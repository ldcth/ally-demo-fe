import { ModelApi } from "@/services";
import { useState, useEffect, useRef } from "react"; // Add these imports

interface ChatMessage {
  content: string;
  isUser: boolean;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null); // Add this ref

  // Add this useEffect
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add this function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!input.trim()) return;

  //   // Add user message
  //   const userMessage: ChatMessage = { content: input, isUser: true };
  //   setMessages((prev) => [...prev, userMessage]);
  //   const lastMessage = input;
  //   console.log(lastMessage);
  //   setInput("");
  //   // const response = await ModelApi.getChatAnswer({ content: lastMessage });
  //   const response = await ModelApi.getIntentAnswer({ content: lastMessage });

  //   // TODO: Add API call to get bot response
  //   const botMessage: ChatMessage = {
  //     // content: "I am a chatbot. I will respond here.",
  //     content: response.data.intent,
  //     isUser: false,
  //   };
  //   setMessages((prev) => [...prev, botMessage]);
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: ChatMessage = { content: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    const lastMessage = input;
    setInput("");
    const response = await ModelApi.getIntentAnswer({ content: lastMessage });

    // Format the response data and convert **text** to bold
    let formattedContent = response.data.intent;
    if (typeof formattedContent === "string") {
      // Handle single string case
      formattedContent = formattedContent.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
      );
    } else if (Array.isArray(formattedContent)) {
      // Handle array case
      formattedContent = formattedContent
        .map((item) => {
          const boldText = item.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
          );
          return `- ${boldText}`;
        })
        .join("\n");
    }

    const botMessage: ChatMessage = {
      content: formattedContent,
      isUser: false,
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="h-[calc(100vh-10rem)] overflow-y-auto mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${message.isUser ? "text-right" : "text-left"}`}
            >
              {/* <div
                className={`inline-block p-3 rounded-lg ${
                  message.isUser
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {message.content}
              </div> */}
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.isUser
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                style={{ whiteSpace: "pre-line" }}
                dangerouslySetInnerHTML={{ __html: message.content }}
              />
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Add this div */}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
