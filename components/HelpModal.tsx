import React from 'react';
import { Info, X } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in">
        <div className="bg-brand-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Info size={24} />
            <h2 className="text-xl font-bold">維修問題查詢系統 使用說明</h2>
          </div>
          <button onClick={onClose} className="hover:bg-brand-700 p-1 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-4 text-gray-700 overflow-y-auto max-h-[70vh]">
          <p className="font-medium text-lg">
            ℹ️ 至少輸入專案、不良類別、問題描述任一內容即可進行對應的搜尋。
          </p>
          
          <ul className="space-y-3 list-disc pl-5">
            <li>
              <span className="font-bold text-gray-900">📌 專案名稱:</span> 可輸入專案名稱，系統會查詢該專案相關維修記錄。
            </li>
            <li>
              <span className="font-bold text-gray-900">🛠 不良類別:</span> 可選擇多個不良類別，以篩選特定類型的維修問題。
            </li>
            <li>
              <span className="font-bold text-gray-900">🔍 維修問題描述:</span> 可輸入問題描述，系統將根據使用者輸入的問題描述查找相似內容的維修案例。
            </li>
          </ul>

          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-brand-500 mt-4">
            <p className="text-sm text-brand-900">
              專案與不良類別篩選條件設定越明確，且維修問題描述越清楚，越能查詢到符合維修需求的內容。
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="font-bold text-gray-900 mb-2">完整方法：</p>
            <p className="text-gray-600">
              輸入專案 + 不良類別 + 問題描述 = 查詢維修資料庫內使用者選擇的不良類別中，與使用者問題描述相關的維修內容，呈現在專案內/共通/其他專案的框中。
            </p>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
          >
            了解
          </button>
        </div>
      </div>
    </div>
  );
};