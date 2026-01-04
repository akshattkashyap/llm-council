import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


export default function Stage3({ finalResponse }) {
  if (!finalResponse) {
    return null;
  }

  return (
    <div className="my-6 p-5 bg-[#f0fff0] rounded-lg border border-[#c8e6c8]">
      <h3 className="mb-4 text-text text-base font-semibold">Stage 3: Final Council Answer</h3>
      <div className="bg-white p-5 rounded-md border border-[#c8e6c8]">
        <div className="text-[#2d8a2d] text-xs font-mono mb-3 font-semibold">
          Chairman: {finalResponse.model.split('/')[1] || finalResponse.model}
        </div>
        <div className="text-text leading-relaxed text-[15px] prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{finalResponse.response}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
