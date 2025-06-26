import '../styles/content.css';
import ChatbotBody from "../components/ChatbotBody";
import ChatbotInput from "../components/ChatbotInput";

export default function Content({
    messages,
    setMessages,
    typing,
    setTyping,
    sendMessageWithStream
}) {
    return (
        <div className="layout-content">
            <div className="layout-header">
                <h1>Simple Chatbot</h1>
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
                <p className="layout-content-note">The answer is depend on the model you use and configuration.</p>
            </div>
        </div>
    )
}