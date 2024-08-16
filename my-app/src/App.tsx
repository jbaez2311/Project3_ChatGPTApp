import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState<string>('');

    const predefinedMessages = [
        "What type of workout is best for improving flexibility, and are there any classes near me",
        "What are common flight patterns of birds and why do they do it",
        "Help me understand the rules of pickleball and any other helpful tips"
    ];

    const handlePredefinedClick = (message: string) => {
        setInput(message);
        sendMessage(message);
    };

    const sendMessage = async (message?: string) => {
        const userMessage = message || input;
        if (!userMessage.trim()) return;

        try {
            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) {
                const error = await response.json();
                setMessages([...messages, { role: 'user', content: `Error: ${error.error || 'Unknown error'}` }]);
                return;
            }

            const data = await response.json();
            setMessages([
                ...messages,
                { role: 'user', content: userMessage },
                { role: 'agent', content: data.reply }
            ]);
            setInput('');  // Clear the input box after sending the message
        } catch (error) {
          setMessages([...messages, { role: 'user', content: `Error: ${(error as Error).message}` }]);
        }
    };

    const clearMessages = () => {
        setMessages([]);
    };

    return (
        <div className="container">
            <div className="topics-container">
                {predefinedMessages.map((msg, index) => (
                    <div key={index} className="topic-card" onClick={() => handlePredefinedClick(msg)}>
                        {msg}
                    </div>
                ))}
            </div>

            <div className="chat-container">
                <div className="chat-header">
                    <button className="broom-button" onClick={clearMessages}>
                        🧹 Clear Chat
                    </button>
                </div>
                <div className="chat-box">
                    {messages.map((msg, index) => (
                        <div key={index} className="chat-message">
                            {/* Use dangerouslySetInnerHTML to render HTML content */}
                            <span dangerouslySetInnerHTML={{ __html: msg.content }} />
                        </div>
                    ))}
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Ask me anything..."
                    />
                    <button onClick={() => sendMessage()}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default App;
