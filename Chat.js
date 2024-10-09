import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState('');

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  const joinRoom = () => {
    if (room) {
      socket.emit('joinRoom', room);
    }
  };

  const sendMessage = () => {
    if (message && room) {
      socket.emit('sendMessage', { message, room });
      setMessages((prevMessages) => [...prevMessages, `Me: ${message}`]);
      setMessage('');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Room"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
