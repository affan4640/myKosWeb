import React, { useState, useCallback } from 'react';
import { usePage } from '@inertiajs/react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

export default function ChatDashboard({ conversations = [] }) {
  const { auth } = usePage().props;
  const myOwnerId = auth.user.id;

  const [messages, setMessages] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [inputText, setInputText] = useState('');

  const fetchMessages = useCallback(async (chatId) => {
    try {
      const response = await fetch(`/owner/messages/${chatId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleChatClick = async (chatId) => {
    setActiveChatId(chatId);
    await fetchMessages(chatId);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    try {
      await fetch('/owner/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute('content'),
        },
        body: JSON.stringify({
          conversation_id: activeChatId,
          message: inputText,
        }),
      });
      setInputText('');
      await fetchMessages(activeChatId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-[80vh] bg-gray-50 border rounded-lg overflow-hidden w-full">
      <ChatList
        conversations={conversations}
        onChatClick={handleChatClick}
        activeChatId={activeChatId}
      />
      <ChatWindow
        messages={messages}
        activeChatId={activeChatId}
        inputText={inputText}
        setInputText={setInputText}
        onSendMessage={handleSendMessage}
        myOwnerId={myOwnerId}
        fetchMessages={fetchMessages}
      />
    </div>
  );
}