import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


function deAnonymizeText(text, labelToModel) {
  if (!labelToModel) return text;

  let result = text;
  // Replace each "Response X" with the actual model name
  Object.entries(labelToModel).forEach(([label, model]) => {
    const modelShortName = model.split('/')[1] || model;
    result = result.replace(new RegExp(label, 'g'), `**${modelShortName}**`);
  });
  return result;
}

export default function Stage2({ rankings, labelToModel, aggregateRankings }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!rankings || rankings.length === 0) {
    return null;
  }

  return (
    <div className="my-6 p-5 bg-[#fafafa] rounded-lg border border-[#e0e0e0]">
      <h3 className="mb-4 text-text text-base font-semibold">Stage 2: Peer Rankings</h3>

      <h4 className="mt-5 mb-2 text-text text-sm font-semibold first:mt-0">Raw Evaluations</h4>
      <p className="mb-3 text-[#666] text-[13px] leading-normal">
        Each model evaluated all responses (anonymized as Response A, B, C, etc.) and provided rankings.
        Below, model names are shown in <strong>bold</strong> for readability, but the original evaluation used anonymous labels.
      </p>

      <div className="flex gap-2 mb-4 flex-wrap">
        {rankings.map((rank, index) => (
          <button
            key={index}
            className={`px-4 py-2 bg-white border border-[#d0d0d0] rounded-t-md text-[#666] cursor-pointer text-sm transition-all hover:bg-[#f0f0f0] hover:text-text hover:border-[#4a90e2] ${activeTab === index ? 'bg-white text-[#4a90e2] border-[#4a90e2] border-b-white font-semibold' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {rank.model.split('/')[1] || rank.model}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded-md border border-[#e0e0e0] mb-5">
        <div className="text-[#888] text-xs font-mono mb-3">
          {rankings[activeTab].model}
        </div>
        <div className="text-text leading-relaxed text-sm prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {deAnonymizeText(rankings[activeTab].ranking, labelToModel)}
          </ReactMarkdown>
        </div>

        {rankings[activeTab].parsed_ranking &&
         rankings[activeTab].parsed_ranking.length > 0 && (
          <div className="mt-4 pt-4 border-t-2 border-[#e0e0e0]">
            <strong className="text-[#2a7ae2] text-[13px]">Extracted Ranking:</strong>
            <ol className="mt-2 pl-6 text-text">
              {rankings[activeTab].parsed_ranking.map((label, i) => (
                <li key={i} className="my-1 font-mono text-[13px]">
                  {labelToModel && labelToModel[label]
                    ? labelToModel[label].split('/')[1] || labelToModel[label]
                    : label}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {aggregateRankings && aggregateRankings.length > 0 && (
        <div className="bg-[#f0f7ff] p-4 rounded-lg mb-5 border-2 border-[#d0e7ff]">
          <h4 className="mb-3 text-[#2a7ae2] text-[15px] font-semibold">Aggregate Rankings (Street Cred)</h4>
          <p className="mb-3 text-[#666] text-[13px] leading-normal">
            Combined results across all peer evaluations (lower score is better):
          </p>
          <div className="flex flex-col gap-2">
            {aggregateRankings.map((agg, index) => (
              <div key={index} className="flex items-center gap-3 p-2.5 bg-white rounded-md border border-[#d0e7ff]">
                <span className="text-[#2a7ae2] font-bold text-base min-w-[35px]">#{index + 1}</span>
                <span className="flex-1 text-text font-mono text-sm font-medium">
                  {agg.model.split('/')[1] || agg.model}
                </span>
                <span className="text-[#666] text-[13px] font-mono">
                  Avg: {agg.average_rank.toFixed(2)}
                </span>
                <span className="text-[#999] text-xs">
                  ({agg.rankings_count} votes)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
