

import React, { useState } from 'react';
import { FileText, CheckCircle, Archive, Database, Info, Search, Cpu, Layers, Sliders } from 'lucide-react';
import { KnowledgeBaseVersion, ThresholdSettings } from '../types';
import { PROJECT_SPECS } from '../constants';

type AdminTab = 'files' | 'specs' | 'settings';

interface AdminPanelProps {
  settings: ThresholdSettings;
  onUpdateSettings: (newSettings: ThresholdSettings) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ settings, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('files');
  const [versions] = useState<KnowledgeBaseVersion[]>([
    {
      id: "KB-20240320",
      version: "v1.0",
      fileName: "Project_Association_Table_V1.0.pdf",
      uploadDate: "2024-03-20",
      status: "active",
      recordCount: 2
    },
    {
      id: "KB-20240315",
      version: "v2.1",
      fileName: "Maintenance_Manual_2024_Q1.pdf",
      uploadDate: "2024-03-15",
      status: "active",
      recordCount: 128
    },
    {
      id: "KB-20240110",
      version: "v2.0",
      fileName: "Legacy_Repair_Guide_v2.pdf",
      uploadDate: "2024-01-10",
      status: "archived",
      recordCount: 95
    },
    {
      id: "KB-20231105",
      version: "v1.5",
      fileName: "Initial_Dataset_Export.csv",
      uploadDate: "2023-11-05",
      status: "archived",
      recordCount: 42
    }
  ]);

  const handleRangeChange = (key: keyof ThresholdSettings, value: number) => {
    onUpdateSettings({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
       {/* Info Card */}
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Database size={20} className="text-brand-600" />
          資料庫狀態概覽
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          此區域顯示目前系統掛載的資料集。系統支援「跨專案推論」，當新產品發生問題時，會自動查找共用關鍵零件（如 Main Chip）的舊產品維修紀錄。
        </p>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
             <Info className="text-orange-500 mt-0.5" size={18} />
             <div>
                 <h4 className="text-sm font-bold text-orange-800">上傳功能已停用</h4>
                 <p className="text-sm text-orange-700 mt-1">
                    後台介面暫不開放檔案上傳功能。請聯絡 IT 部門進行資料庫更新。
                 </p>
             </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('files')}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'files' 
              ? 'border-brand-600 text-brand-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <Archive size={16} /> 異常處理資料庫 (檔案)
          </span>
        </button>
        <button
          onClick={() => setActiveTab('specs')}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'specs' 
              ? 'border-brand-600 text-brand-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <Cpu size={16} /> 專案關聯表格 (規格)
          </span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'settings' 
              ? 'border-brand-600 text-brand-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <Sliders size={16} /> 參數設定
          </span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'files' && (
        <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">版本號</th>
                    <th className="px-6 py-4 font-semibold">檔案名稱</th>
                    <th className="px-6 py-4 font-semibold">上傳日期</th>
                    <th className="px-6 py-4 font-semibold">資料筆數</th>
                    <th className="px-6 py-4 font-semibold">狀態</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {versions.map((ver) => (
                    <tr key={ver.id} className={`transition-colors ${ver.status === 'active' ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                        <FileText size={16} className={ver.status === 'active' ? 'text-brand-600' : 'text-gray-400'} />
                        <span className={`font-medium ${ver.status === 'active' ? 'text-brand-700' : 'text-gray-900'}`}>{ver.version}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className={ver.status === 'active' ? 'text-gray-900 font-medium' : 'text-gray-600'}>
                            {ver.fileName}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{ver.uploadDate}</td>
                    <td className="px-6 py-4 text-gray-600">
                        {ver.recordCount > 0 ? `${ver.recordCount} 筆` : '-'}
                    </td>
                    <td className="px-6 py-4">
                        {ver.status === 'active' && (
                        <div className="flex flex-col gap-1">
                            <span className="inline-flex w-fit items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle size={10} /> 使用中
                            </span>
                            <span className="inline-flex w-fit items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-700">
                                <Search size={10} /> 搜尋索引來源
                            </span>
                        </div>
                        )}
                        {ver.status === 'archived' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            <Archive size={10} /> 封存
                        </span>
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
      )}

      {activeTab === 'specs' && (
        <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-blue-50 border-b border-blue-100 text-sm text-blue-800 flex items-center gap-2">
                <Info size={16} />
                <span>此表格用於 AI 推論。當查詢的專案無紀錄時，AI 將尋找具有相同 <strong>Main Chip</strong> 的專案進行推薦。</span>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">專案名稱</th>
                    <th className="px-6 py-4 font-semibold">Main Chip (關鍵關聯鍵)</th>
                    <th className="px-6 py-4 font-semibold">Platform</th>
                    <th className="px-6 py-4 font-semibold">描述</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {PROJECT_SPECS.map((spec, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-800">
                        {spec.projectName}
                    </td>
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                            <Cpu size={14} />
                            {spec.mainChip}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                         <Layers size={16} className="text-gray-400"/>
                         {spec.platform}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                        {spec.description}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm border border-gray-200 p-8">
            <div className="max-w-3xl">
                <h3 className="text-lg font-bold text-gray-900 mb-6">AI 搜尋關聯度設定</h3>
                
                <div className="space-y-8">
                    {/* High Threshold */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                (4-1) 專案內解決方案 門檻值 (Strict)
                            </label>
                            <span className="text-2xl font-bold text-green-600">{settings.high}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="50" 
                            max="99" 
                            value={settings.high}
                            onChange={(e) => handleRangeChange('high', parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                        />
                        <p className="text-xs text-gray-500">
                            設定為 {settings.high}% 表示：AI 判斷相似度高於 {settings.high}% 且為同專案的紀錄，將顯示於「專案內解決方案」區塊。
                            <br/>建議值：80% - 90%。
                        </p>
                    </div>

                    <hr className="border-gray-100"/>

                    {/* Medium Threshold */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                (4-2) 共通/關聯解決方案 門檻值 (Medium)
                            </label>
                            <span className="text-2xl font-bold text-yellow-600">{settings.medium}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="30" 
                            max={settings.high - 1} 
                            value={settings.medium}
                            onChange={(e) => handleRangeChange('medium', parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                        />
                         <p className="text-xs text-gray-500">
                            設定為 {settings.medium}% 表示：AI 判斷相似度介於 {settings.medium}% ~ {settings.high-1}% 的紀錄 (通常包含跨專案推論)，將顯示於「共通/關聯解決方案」區塊。
                            <br/>建議值：60% - 75%。
                        </p>
                    </div>
                </div>

                <div className="mt-8 bg-gray-50 p-4 rounded-lg text-sm text-gray-600 border border-gray-200">
                    <p className="font-bold mb-1">注意:</p>
                    <p>調整此數值會即時影響「維修查詢」的搜尋結果分類方式以及 AI 的評分標準。</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};