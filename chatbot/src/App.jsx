import { useEffect, useState } from "react";

import ChatbotBody from "./components/ChatbotBody";

import "./app.css"
import ChatbotInput from "./components/ChatbotInput";
import sendMessageWithStream from "./services/chatService";

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const container = document.querySelector(".chatbot-body");
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);

  return (
    <>
      <div className="layout-container">
        <div className="layout-sidebar">
          <div className="layout-sidebar-header">
            <h2>Chatbot</h2>
          </div>
          <div className="layout-sidebar-content">
            <ul>
              <li>Home</li>
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <div className="layout-content">
          <div className="layout-header">
            <h1>Chatbot Application</h1>
          </div>
          <div className="chatbot-container">
            <ChatbotBody
              messages={messages}
              isTyping={typing}
            />
            <div className="w-full flex justify-center">
              <ChatbotInput
                sendMessageWithStream={sendMessageWithStream}
                setMessages={setMessages}
                messages={messages}
                setTyping={setTyping}
              />
            </div>
            <p className="layout-content-note">Powered by Llama3</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
