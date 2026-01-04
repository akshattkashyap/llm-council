import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


export default function Stage1({ responses }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!responses || responses.length === 0) {
    return null;
  }

  return (
    <div className="my-6 p-5 bg-[#fafafa] rounded-lg border border-[#e0e0e0]">
      <h3 className="mb-4 text-text text-base font-semibold">Stage 1: Individual Responses</h3>

      <div className="flex gap-2 mb-4 flex-wrap">
        {responses.map((resp, index) => (
          <button
            key={index}
            className={`px-4 py-2 bg-white border border-[#d0d0d0] rounded-t-md text-[#666] cursor-pointer text-sm transition-all hover:bg-[#f0f0f0] hover:text-text hover:border-[#4a90e2] ${activeTab === index ? 'bg-white text-[#4a90e2] border-[#4a90e2] border-b-white font-semibold' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {resp.model.split('/')[1] || resp.model}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded-md border border-[#e0e0e0]">
        <div className="text-[#888] text-xs mb-3 font-mono">{responses[activeTab].model}</div>
        <div className="text-text leading-relaxed prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{responses[activeTab].response}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
