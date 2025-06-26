import { useEffect, useState } from "react";

import sendMessageWithStream from "./services/chatService";

import Sidebar from "./layouts/sidebar";
import Content from "./layouts/content";

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
        <Sidebar />
        <Content
          messages={messages}
          setMessages={setMessages}
          typing={typing}
          setTyping={setTyping}
          sendMessageWithStream={sendMessageWithStream}
        />
      </div>
    </>
  )
}

export default App
