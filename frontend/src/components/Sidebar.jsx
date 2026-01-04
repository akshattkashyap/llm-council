import { useState, useEffect } from 'react';


export default function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
}) {
  return (
    <div className="w-[260px] bg-[#f8f8f8] border-r border-[#e0e0e0] flex flex-col h-screen">
      <div className="p-4 border-b border-[#e0e0e0]">
        <h1 className="text-lg mb-3 text-text">LLM Council</h1>
        <button className="w-full p-2.5 bg-[#4a90e2] border border-[#4a90e2] rounded-md text-white cursor-pointer text-sm transition-colors font-medium hover:bg-[#357abd] hover:border-[#357abd]" onClick={onNewConversation}>
          + New Conversation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-[#999] text-sm">No conversations yet</div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-3 mb-1 rounded-md cursor-pointer transition-colors hover:bg-[#f0f0f0] ${
                conv.id === currentConversationId ? 'bg-[#e8f0fe] border border-[#4a90e2]' : ''
              }`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className="text-text text-sm mb-1">
                {conv.title || 'New Conversation'}
              </div>
              <div className="text-[#999] text-xs">
                {conv.message_count} messages
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
