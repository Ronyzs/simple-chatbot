/**
 * Sends a message to the chat API and streams the assistant's response.
 * 
 * This function posts the current chat messages to the backend API and processes
 * the streamed response, updating the UI with the assistant's reply as it arrives.
 * 
 * @async
 * @param {Array<{role: string, content: string}>} currentMessages - The current list of chat messages.
 * @param {Function} setMessages - State setter function to update the messages array.
 * @param {Function} setTyping - State setter function to indicate whether the assistant is typing.
 * @throws {Error} Throws an error if the network response is not OK.
 */
export default async function sendMessageWithStream(currentMessages, setMessages, setTyping) {
    setTyping(true);

    const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: currentMessages }),
    });
    setTyping(false);

    if (!response.ok || !response.body) {
        setTyping(false);
        throw new Error("Network response was not ok");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let aiMessage = { role: "assistant", content: "" };
    setMessages(prev => [...prev, aiMessage]);

    let buffer = "";
    let done = false;

    while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        // Add decoded value to buffer
        buffer += decoder.decode(value || new Uint8Array(), { stream: true });

        // Split by newline
        const lines = buffer.split("\n");
        buffer = lines.pop(); // keep the last line if it's incomplete

        for (const line of lines) {
            if (!line.trim()) continue;

            try {
                const json = JSON.parse(line);
                const token = json.message?.content || "";

                aiMessage.content += token;

                // Force rerender
                setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { ...aiMessage };
                    return updated;
                });

                // Delay a bit to simulate typing
                await new Promise(resolve => setTimeout(resolve, 25));
            } catch (e) {
                console.error("JSON parse error:", e, line);
            }
        }
    }
}