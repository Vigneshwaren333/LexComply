import React, { useState } from 'react';

const GeminiChatbot = () => {
  // Replace this with your actual API key
  const API_KEY = 'AIzaSyAEbBXAYbf_bEEB020_s2iyd658yMfPWVQ';
  
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I help you with legal questions today?', sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Development mode flag - set to false in production
  const [debugMode, setDebugMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  
  const fetchGeminiResponse = async (userMessage) => {
    setIsLoading(true);
    setDebugInfo('');
    
    try {
      // Using the correct model from your available models list
      const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-001:generateContent';
      
      console.log('Sending request to Gemini API...');
      
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: userMessage }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        })
      });
      
      // Log the full response for debugging
      const rawData = await response.text();
      console.log('Raw API response:', rawData);
      
      // Store this for debugging display but only show in debug mode
      if (debugMode) {
        setDebugInfo(`Status: ${response.status}, Response: ${rawData.substring(0, 200)}...`);
      }
      
      let botResponse;
      try {
        const data = JSON.parse(rawData);
        console.log('Parsed data:', data);
        
        // Check for specific error conditions
        if (data.error) {
          botResponse = `API Error: ${data.error.message || 'Unknown API error'}`;
        } else if (!data.candidates || data.candidates.length === 0) {
          botResponse = "The model didn't generate any candidates. This might be due to content filtering.";
        } else if (data.candidates[0].finishReason === "SAFETY") {
          botResponse = "I couldn't provide a response due to safety guidelines. Please rephrase your question.";
        } else if (data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
          botResponse = data.candidates[0].content.parts[0].text;
        } else {
          botResponse = "Received an unexpected response format from the API.";
        }
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        botResponse = "Error: Could not parse the API response. See console for details.";
      }
      
      setMessages(prevMessages => [
        ...prevMessages,
        { text: botResponse, sender: 'bot' }
      ]);
    } catch (error) {
      console.error('Network or other error:', error);
      if (debugMode) {
        setDebugInfo(`Error: ${error.message}`);
      }
      setMessages(prevMessages => [
        ...prevMessages,
        { text: 'Sorry, I encountered an error connecting to the Gemini API. Please check your network and API key.', sender: 'bot' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const userMessage = inputText;
    setMessages(prevMessages => [
      ...prevMessages,
      { text: userMessage, sender: 'user' }
    ]);
    setInputText('');
    
    // Get bot response
    fetchGeminiResponse(userMessage);
  };

  // Toggle debug mode function
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
    if (!debugMode) {
      setDebugInfo('');
    }
  };

  return (
    <div className="flex flex-col h-96 w-full max-w-md border rounded-lg overflow-hidden shadow-lg">
      <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
        <h3 className="text-lg font-medium">Legal Assistant</h3>
        {/* Hidden in production or can be toggled with keyboard shortcut */}
        <button 
          onClick={toggleDebugMode} 
          className="text-xs text-blue-200 hover:text-white"
        >
          {debugMode ? 'Hide Debug' : 'Debug'}
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-3 rounded-lg p-3 ${
              message.sender === 'user' 
                ? 'ml-auto bg-blue-500 text-white max-w-xs' 
                : 'bg-white text-gray-800 max-w-xs'
            }`}
          >
            {message.text}
          </div>
        ))}
        {isLoading && (
          <div className="bg-white text-gray-800 rounded-lg p-3 max-w-xs">
            <span className="animate-pulse">Thinking...</span>
          </div>
        )}
        {debugMode && debugInfo && (
          <div className="text-xs text-red-500 mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-24">
            <strong>Debug Info:</strong> {debugInfo}
          </div>
        )}
      </div>
      
      <div className="border-t flex p-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask a legal question..."
          className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          className={`bg-blue-500 text-white px-4 py-2 rounded-r-lg ${isLoading ? 'opacity-50' : ''}`}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GeminiChatbot;