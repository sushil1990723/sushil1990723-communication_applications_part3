import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/chatlist.css';

function GroupChat() {
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [loggedInUser, setLoggedInUser] = useState({ fullname: '' });
  const logdinuserEmail = localStorage.getItem('loggedInUser');
  useEffect(() => {
    // Fetch chat history from the server
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get('http://localhost:3001/chats');
        setChatHistory(response.data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    // Fetch logged-in user details
    const fetchLoggedInUser = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users'); // Adjust the API endpoint as needed
        setLoggedInUser(response.data);
      } catch (error) {
        console.error('Error fetching logged-in user:', error);
      }
    };

    fetchChatHistory();
    fetchLoggedInUser();
  }, []);

  const handleSendMessage = async () => {
    const message = input.trim();
    if (message) {
      const dateTime = new Date().toISOString(); // ISO format for the timestamp
      const newMessage = { dateTime, fullname: logdinuserEmail, userChatMessage: message };

      try {
        const response = await axios.post('http://localhost:3001/chats', newMessage);
        setChatHistory([...chatHistory, response.data]);
        setInput('');
      } catch (error) {
        console.error('Error sending chat message:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div className="group-chat">
      <h1 className="pt-2 pb-3 text-center">Group Chat</h1>

      <div id="chat" className="chat">
        {chatHistory.map((chat, index) => (
          <div key={index} className="message">
            <strong>{chat.fullname}:</strong> <span>{chat.message}</span>
            <div className="timestamp">{new Date(chat.datetime).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="input-group">
        <input type="text" id="input" className="inputname" placeholder="Type your message here..." value={input} onChange={handleInputChange} />
        <button id="sendBtn" className="sendBtn" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default GroupChat;
