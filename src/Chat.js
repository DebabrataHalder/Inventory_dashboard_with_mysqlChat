import React, { useState, useEffect, useRef } from 'react';

const chatStyles = {
  position: 'fixed',
  bottom: '30px',
  left: '30px',
  zIndex: 1000,
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  boxSizing: 'border-box',
};

const chatButtonStyles = {
  backgroundColor: 'white',
  color: '#2c3e50',
  padding: '15px 30px',
  borderRadius: '30px',
  border: '2px solid #2c3e50',
  cursor: 'pointer',
  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  fontSize: '1rem',
  fontWeight: '600',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const connectionFormStyles = {
  backgroundColor: 'white',
  width: '350px',
  maxWidth: '90vw',
  borderRadius: '15px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  padding: '20px',
  marginBottom: '15px',
  boxSizing: 'border-box',
};

const inputFieldStyles = {
  width: '100%',
  padding: '10px 15px',
  marginBottom: '10px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  fontSize: '1rem',
  boxSizing: 'border-box',
};

const testButtonStyles = {
  backgroundColor: '#27ae60',
  color: 'white',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginBottom: '10px',
};

const chatWindowStyles = {
  backgroundColor: 'white',
  width: '350px',
  maxWidth: '90vw',
  borderRadius: '15px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  marginBottom: '15px',
  transformOrigin: 'bottom left',
  animation: 'scaleIn 0.2s ease-out',
  boxSizing: 'border-box',
};

const chatHeaderStyles = {
  backgroundColor: '#2c3e50',
  color: 'white',
  padding: '20px',
  borderRadius: '15px 15px 0 0',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  boxSizing: 'border-box',
};

const chatBodyStyles = {
  height: '400px',
  overflowY: 'auto',
  padding: '20px',
  background: '#f9f9f9',
  boxSizing: 'border-box',
};

const messageStyles = {
  marginBottom: '15px',
  padding: '12px 18px',
  borderRadius: '20px',
  fontSize: '0.95rem',
  lineHeight: '1.4',
  transition: 'opacity 0.2s ease',
  maxWidth: '80%',
  wordBreak: 'break-word',
  boxSizing: 'border-box',
};

const userMessageStyles = {
  ...messageStyles,
  backgroundColor: '#3498db',
  color: 'white',
  marginLeft: 'auto',
  borderBottomRightRadius: '5px',
};

const botMessageStyles = {
  ...messageStyles,
  backgroundColor: '#ffffff',
  color: '#333',
  marginRight: 'auto',
  borderBottomLeftRadius: '5px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
};

const inputContainerStyles = {
  padding: '15px 20px',
  background: '#fff',
  borderTop: '1px solid #eee',
  display: 'flex',
  gap: '10px',
  boxSizing: 'border-box',
};

const inputStyles = {
  flex: 1,
  padding: '12px 18px',
  border: '1px solid #ddd',
  borderRadius: '25px',
  fontSize: '0.95rem',
  transition: 'all 0.3s ease',
  boxSizing: 'border-box',
};

const sendButtonStyles = {
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  borderRadius: '25px',
  padding: '12px 20px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontWeight: '600',
};

const keyframes = `
  @keyframes scaleIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [credentials, setCredentials] = useState({
    host: 'sql12.freesqldatabase.com',
    port: '3306',
    user: 'sql12769385',
    password: 'wgEP5R4aeY',
    database: 'sql12769385',
  });
  const [connectionStatus, setConnectionStatus] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I help you today?', isUser: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const convertMessagesToChatHistory = () => {
    return messages.map(msg => ({
      role: msg.isUser ? "Human" : "AI",
      content: msg.text,
    }));
  };

  const testConnection = async () => {
    setIsTesting(true);
    setConnectionStatus('Building connection with MySQL DB');
    try {
      const payload = {
        ...credentials,
        model_name: "llama-3.3-70b-versatile",
        question: "Connect with DB",
        chat_history: [
          { role: "AI", content: "Hello! I'm a SQL assistant. Ask me anything about your database." }
        ],
      };

      const response = await fetch("https://inventory-dashboard-with-mysqlchat-server.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Server responded with an error");
      }

      const data = await response.json();
      if (data.response && data.response.includes("Oops!")) {
        setConnectionStatus("Connection failed: " + data.response);
      } else {
        setConnectionStatus("Connected successfully!");
        setIsConnected(true);
      }
    } catch (error) {
      setConnectionStatus("Connection failed: " + error.message);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessages = [...messages, { text: message, isUser: true }];
    setMessages(newMessages);
    const userMessage = message;
    setMessage('');
    setIsLoading(true);

    try {
      const payload = {
        ...credentials,
        model_name: "llama-3.3-70b-versatile",
        question: userMessage,
        chat_history: convertMessagesToChatHistory(),
      };

      const response = await fetch("https://inventory-dashboard-with-mysqlchat-server.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error communicating with the server");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { text: data.response, isUser: false }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Error: " + error.message, isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderConnectionForm = () => (
    <div style={connectionFormStyles}>
      <h3>Enter Database Credentials</h3>
      <input
        style={inputFieldStyles}
        type="text"
        placeholder="Host"
        value={credentials.host}
        onChange={(e) => setCredentials({ ...credentials, host: e.target.value })}
      />
      <input
        style={inputFieldStyles}
        type="text"
        placeholder="Port"
        value={credentials.port}
        onChange={(e) => setCredentials({ ...credentials, port: e.target.value })}
      />
      <input
        style={inputFieldStyles}
        type="text"
        placeholder="User"
        value={credentials.user}
        onChange={(e) => setCredentials({ ...credentials, user: e.target.value })}
      />
      <input
        style={inputFieldStyles}
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      />
      <input
        style={inputFieldStyles}
        type="text"
        placeholder="Database"
        value={credentials.database}
        onChange={(e) => setCredentials({ ...credentials, database: e.target.value })}
      />
      <button style={testButtonStyles} onClick={testConnection} disabled={isTesting}>
        {isTesting ? "Connecting..." : "Connect with DB"}
      </button>
      {connectionStatus && <p>{connectionStatus}</p>}
    </div>
  );

  return (
    <div style={chatStyles}>
      <style>{keyframes}</style>

      {isOpen && (
        <div>
          {!isConnected ? renderConnectionForm() : (
            <div style={chatWindowStyles}>
              <div style={chatHeaderStyles}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#3498db',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  💬
                </div>
                <h3 style={{ margin: 0 }}>Music Store Support</h3>
              </div>

              <div style={chatBodyStyles}>
                {messages.map((msg, index) => (
                  <div 
                    key={index}
                    style={msg.isUser ? userMessageStyles : botMessageStyles}
                  >
                    {msg.text}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div style={inputContainerStyles}>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                  placeholder="Type your message..."
                  style={inputStyles}
                  disabled={isLoading}
                />
                <button
                  onClick={() => { if (!isLoading) handleSendMessage(); }}
                  style={sendButtonStyles}
                  disabled={isLoading || !message.trim()}
                >
                  {isLoading ? '...' : '-→'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...chatButtonStyles,
          ...(isOpen && { 
            animation: 'pulse 1.5s infinite',
            backgroundColor: 'white',
            color: '#e74c3c',
            borderColor: '#e74c3c'
          })
        }}
      >
        {isOpen ? '✖ Close Chat' : '💬 Chat Support'}
      </button>
    </div>
  );
}
