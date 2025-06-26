import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import "../styles/chatbot.css"

export default function ChatbotBody({ messages, isTyping }) {
    return (
        <div className="chatbot-body">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`chatbot-message ${message.role === "user"
                        ? "user"
                        : "assistant"
                        }`}
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={oneDark}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            }
                        }}>
                        {message.content}
                    </ReactMarkdown>
                </div>
            ))}
            {isTyping && (
                <div className="chatbot-message self-start typing-indicator">
                    ...
                </div>
            )}
        </div>
    )
}