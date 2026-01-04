import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Stage1 from './Stage1';
import Stage2 from './Stage2';
import Stage3 from './Stage3';


export default function ChatInterface({
  conversation,
  onSendMessage,
  isLoading,
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col h-screen bg-white">
        <div className="flex flex-col items-center justify-center h-full text-[#666] text-center">
          <h2 className="mb-2 text-2xl text-text">Welcome to LLM Council</h2>
          <p className="m-0 text-base">Create a new conversation to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-white">
      <div className="flex-1 overflow-y-auto p-6">
        {conversation.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#666] text-center">
            <h2 className="mb-2 text-2xl text-text">Start a conversation</h2>
            <p className="m-0 text-base">Ask a question to consult the LLM Council</p>
          </div>
        ) : (
          conversation.messages.map((msg, index) => (
            <div key={index} className="mb-8">
              {msg.role === 'user' ? (
                <div className="mb-4">
                  <div className="text-xs font-semibold text-[#666] mb-2 uppercase tracking-[0.5px]">You</div>
                  <div className="bg-[#f0f7ff] p-4 rounded-lg border border-[#d0e7ff] text-text leading-relaxed max-w-[80%] whitespace-pre-wrap">
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="text-xs font-semibold text-[#666] mb-2 uppercase tracking-[0.5px]">LLM Council</div>

                  {/* Stage 1 */}
                  {msg.loading?.stage1 && (
                    <div className="flex items-center gap-3 p-4 my-3 bg-[#f9fafb] rounded-lg border border-[#e0e0e0] text-[#666] text-sm italic">
                      <div className="w-5 h-5 border-2 border-[#e0e0e0] border-t-[#4a90e2] rounded-full animate-spin"></div>
                      <span>Running Stage 1: Collecting individual responses...</span>
                    </div>
                  )}
                  {msg.stage1 && <Stage1 responses={msg.stage1} />}

                  {/* Stage 2 */}
                  {msg.loading?.stage2 && (
                    <div className="flex items-center gap-3 p-4 my-3 bg-[#f9fafb] rounded-lg border border-[#e0e0e0] text-[#666] text-sm italic">
                      <div className="w-5 h-5 border-2 border-[#e0e0e0] border-t-[#4a90e2] rounded-full animate-spin"></div>
                      <span>Running Stage 2: Peer rankings...</span>
                    </div>
                  )}
                  {msg.stage2 && (
                    <Stage2
                      rankings={msg.stage2}
                      labelToModel={msg.metadata?.label_to_model}
                      aggregateRankings={msg.metadata?.aggregate_rankings}
                    />
                  )}

                  {/* Stage 3 */}
                  {msg.loading?.stage3 && (
                    <div className="flex items-center gap-3 p-4 my-3 bg-[#f9fafb] rounded-lg border border-[#e0e0e0] text-[#666] text-sm italic">
                      <div className="w-5 h-5 border-2 border-[#e0e0e0] border-t-[#4a90e2] rounded-full animate-spin"></div>
                      <span>Running Stage 3: Final synthesis...</span>
                    </div>
                  )}
                  {msg.stage3 && <Stage3 finalResponse={msg.stage3} />}
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-center gap-3 p-4 text-[#666] text-sm">
            <div className="w-5 h-5 border-2 border-[#e0e0e0] border-t-[#4a90e2] rounded-full animate-spin"></div>
            <span>Consulting the council...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {conversation.messages.length === 0 && (
        <form className="flex items-end gap-3 p-6 border-t border-[#e0e0e0] bg-[#fafafa]" onSubmit={handleSubmit}>
          <textarea
            className="flex-1 p-3.5 bg-white border border-[#d0d0d0] rounded-lg text-text text-[15px] leading-normal outline-none resize-y min-h-[80px] max-h-[300px] focus:border-[#4a90e2] focus:ring-4 focus:ring-[#4a90e2]/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-background"
            placeholder="Ask your question... (Shift+Enter for new line, Enter to send)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={3}
          />
          <button
            type="submit"
            className="px-7 py-3.5 bg-[#4a90e2] border border-[#4a90e2] rounded-lg text-white text-[15px] font-semibold cursor-pointer transition-colors whitespace-nowrap self-end hover:bg-[#357abd] hover:border-[#357abd] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#ccc] disabled:border-[#ccc]"
            disabled={!input.trim() || isLoading}
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}
