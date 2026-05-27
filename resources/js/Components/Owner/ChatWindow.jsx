import React, { useEffect, useRef } from 'react';

const ChatWindow = ({
  messages,
  activeChatId,
  inputText,
  setInputText,
  onSendMessage,
  myOwnerId,
  fetchMessages,
}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!activeChatId || !fetchMessages) return;
    const interval = setInterval(() => {
      fetchMessages(activeChatId);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeChatId, fetchMessages]);

  if (!activeChatId) {
    return (
      <div className="w-2/3 flex items-center justify-center text-gray-400 bg-[#F9FAF9]">
        <p>Pilih penyewa di sebelah kiri untuk mulai mengobrol</p>
      </div>
    );
  }

  return (
    <div className="w-2/3 flex flex-col bg-[#F9FAF9]">
      <div className="flex-1 p-6 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            Belum ada pesan. Mulai sapa penyewa!
          </p>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender_id === myOwnerId;
          return (
            <div
              key={msg.id}
              className={`flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-3 rounded-xl max-w-[70%] shadow-sm ${
                  isMe
                    ? 'bg-[#509C76] text-white rounded-br-none'
                    : 'bg-white border rounded-bl-none text-gray-800'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Tulis balasan..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#509C76]"
          onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
        />
        <button
          onClick={onSendMessage}
          className="bg-[#509C76] text-white px-6 py-2 rounded-lg hover:bg-green-700 font-bold transition-colors"
        >
          Kirim
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;