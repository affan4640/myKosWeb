import React from 'react';

const ChatList = ({ conversations = [], activeChatId, onChatClick }) => {
  const sorted = [...conversations].sort((a, b) => {
    const aId = a.last_message?.id ?? 0;
    const bId = b.last_message?.id ?? 0;
    return bId - aId;
  });

  return (
    <div className="w-1/3 border-r bg-white p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Chat Penyewa</h2>

      {sorted.length === 0 && (
        <div className="text-center mt-10">
          <p className="text-sm text-gray-500">Belum ada pesan masuk.</p>
        </div>
      )}

      {sorted.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onChatClick(chat.id)}
          className={`p-4 mb-2 rounded-lg cursor-pointer transition-colors ${
            activeChatId === chat.id
              ? 'bg-green-100 border border-green-500'
              : 'bg-white border hover:bg-gray-50'
          }`}
        >
          <p className="font-bold text-gray-800">
            {chat.user_one?.name || 'Penyewa'}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {chat.last_message?.message || 'Belum ada pesan'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ChatList;