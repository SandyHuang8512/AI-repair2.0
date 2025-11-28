import React from 'react';
import { AnalyzedRecord, ThresholdSettings } from '../types';
import { Tag, Wrench, Calendar, FileText, Activity } from 'lucide-react';

interface ResultCardProps {
  record: AnalyzedRecord;
  settings: ThresholdSettings;
}

export const ResultCard: React.FC<ResultCardProps> = ({ record, settings }) => {
  // Determine color coding based on similarity score and dynamic settings
  const scoreColor = 
    record.similarityScore >= settings.high ? 'bg-green-100 text-green-800 border-green-200' :
    record.similarityScore >= settings.medium ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
    'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full">
      {/* Header with Project and Score */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-start">
        <div>
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <FileText size={16} className="text-brand-500" />
            {record.projectName}
          </h3>
          <span className="text-xs text-gray-400 font-mono mt-1 block">{record.id}</span>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-bold border ${scoreColor} flex items-center gap-1`}>
            <Activity size={12} />
            {record.similarityScore}% 相似
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-2 bg-gray-50 flex flex-wrap gap-2">
        {record.categories.map((cat, idx) => (
          <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-white border border-gray-200 text-gray-600">
            <Tag size={10} />
            {cat}
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 flex-grow space-y-3">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">問題描述</p>
          <p className="text-sm text-gray-800 line-clamp-3 leading-relaxed">
            {record.problemDescription}
          </p>
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Wrench size={12} /> 解決方案
          </p>
          <p className="text-sm text-gray-700 leading-relaxed bg-blue-50 p-2 rounded border border-blue-100">
            {record.solution}
          </p>
        </div>
        
        {/* AI Reason */}
        <div className="pt-2">
            <p className="text-xs text-gray-400 italic">
               💡 AI 分析: {record.matchReason}
            </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
        <span className="flex items-center gap-1">
            <Calendar size={12} />
            {record.date}
        </span>
      </div>
    </div>
  );
};