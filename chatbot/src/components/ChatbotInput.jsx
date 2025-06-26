import { useState } from "react";
import "../styles/chatbot.css"

export default function ChatbotInput({ sendMessageWithStream, setMessages, messages, setTyping }) {
    const [input, setInput] = useState("");

    return (
        <input
            className="chatbot-input"
            placeholder="Ask anything"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={async (e) => {
                if (e.key === "Enter" && input) {

                    const userMessage = { role: "user", content: input };
                    const updatedMessages = [...messages, userMessage];

                    setMessages(updatedMessages);
                    setInput("");

                    await sendMessageWithStream(updatedMessages, setMessages, setTyping);
                }
            }}
        />
    )
}