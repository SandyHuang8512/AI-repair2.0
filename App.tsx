
import React, { useState } from 'react';
import { Search, RotateCcw, HelpCircle, Wrench, Loader2, Database, LayoutDashboard, FileText } from 'lucide-react';
import { DEFECT_CATEGORIES, MOCK_DATABASE } from './constants';
import { DefectCategory, AnalyzedRecord, ThresholdSettings } from './types';
import { analyzeRepairRequest } from './services/geminiService';
import { HelpModal } from './components/HelpModal';
import { ResultCard } from './components/ResultCard';
import { AdminPanel } from './components/AdminPanel';

type ViewMode = 'search' | 'admin';

const App: React.FC = () => {
  // View State
  const [currentView, setCurrentView] = useState<ViewMode>('search');

  // Settings State (Default High to 80 as requested)
  const [thresholdSettings, setThresholdSettings] = useState<ThresholdSettings>({
    high: 80,
    medium: 60
  });

  // Search State
  const [projectName, setProjectName] = useState('');
  const [projectModel, setProjectModel] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<DefectCategory[]>([]);
  const [description, setDescription] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{
    inProject: AnalyzedRecord[];
    common: AnalyzedRecord[];
    other: AnalyzedRecord[];
  } | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  // Handlers
  const toggleCategory = (cat: DefectCategory) => {
    setSelectedCategories(prev => 
      prev.includes(cat) 
        ? prev.filter(c => c !== cat) 
        : [...prev, cat]
    );
  };

  const handleClear = () => {
    setProjectName('');
    setProjectModel('');
    setSelectedCategories([]);
    setDescription('');
    setResults(null);
  };

  const handleSearch = async () => {
    if (!projectName.trim() && selectedCategories.length === 0 && !description.trim()) {
      alert("請至少輸入一項搜尋條件");
      return;
    }

    setIsSearching(true);
    setResults(null);

    try {
      // 1. Get Similarity Analysis from Gemini
      const analysis = await analyzeRepairRequest({
        projectName,
        projectModel,
        selectedCategories,
        description
      }, thresholdSettings);

      // 2. Map analysis results to full database records
      const analyzedRecords: AnalyzedRecord[] = analysis.results.map(res => {
        const original = MOCK_DATABASE.find(db => db.id === res.id);
        if (!original) return null;
        return {
          ...original,
          similarityScore: res.score,
          matchReason: res.reason
        };
      }).filter((r): r is AnalyzedRecord => r !== null);

      // 3. Sort records by score descending
      analyzedRecords.sort((a, b) => b.similarityScore - a.similarityScore);

      // 4. Bucketing Logic based on dynamic thresholds
      const inProject: AnalyzedRecord[] = [];
      const common: AnalyzedRecord[] = [];
      const other: AnalyzedRecord[] = [];

      analyzedRecords.forEach(record => {
        // Normalize strings for comparison
        const isSameProject = projectName.trim() && record.projectName.toLowerCase().includes(projectName.trim().toLowerCase());
        
        if (record.similarityScore >= thresholdSettings.high && isSameProject) {
            // (4-1) 專案內解決方案
            inProject.push(record);
        } else if (record.similarityScore >= thresholdSettings.medium) {
            // (4-2) 共通解決方案
            common.push(record);
        } else {
            // (4-3) 其他專案解決方案
            other.push(record);
        }
      });

      setResults({ inProject, common, other });

    } catch (error) {
      console.error(error);
      alert("搜尋失敗，請稍後再試或檢查 API Key。");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900">
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-brand-600 p-2 rounded-lg text-white">
                <Wrench size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">AI 維修助理</h1>
          </div>
          
          <div className="flex items-center gap-4">
             {/* View Switcher */}
             <div className="hidden sm:flex bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setCurrentView('search')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    currentView === 'search' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Search size={16} />
                  維修查詢
                </button>
                <button 
                  onClick={() => setCurrentView('admin')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    currentView === 'admin' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Database size={16} />
                  後台維護
                </button>
             </div>

            <button 
              onClick={() => setShowHelp(true)}
              className="flex items-center gap-2 text-gray-500 hover:text-brand-600 transition-colors px-3 py-1.5 rounded-md hover:bg-gray-50"
            >
              <HelpCircle size={18} />
              <span className="hidden sm:inline text-sm font-medium">使用說明</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {currentView === 'admin' ? (
            <AdminPanel settings={thresholdSettings} onUpdateSettings={setThresholdSettings} />
          ) : (
            <div className="space-y-8 animate-fade-in">
              
              {/* Data Source Indicator */}
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                    <Database size={14} className="text-brand-500" />
                    <span className="font-medium">資料來源：</span>
                    <span className="font-mono text-gray-800">Maintenance_Manual_2024_Q1.pdf (v2.1) + Project Specs</span>
                 </div>
              </div>

              {/* Search Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                {/* Input Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Col: Project Name & Model */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                        (1) 專案名稱
                        </label>
                        <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="例如: ZE4A, ZE5-NewGen"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                        專案機型
                        </label>
                        <input
                        type="text"
                        value={projectModel}
                        onChange={(e) => setProjectModel(e.target.value)}
                        placeholder="例如: IP Cam, AP Router"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
                        />
                    </div>
                  </div>

                  {/* Middle Col: Categories */}
                  <div className="lg:col-span-9 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      (2) 選擇不良類別 <span className="text-gray-400 font-normal text-xs">(可多選)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DEFECT_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                            selectedCategories.includes(cat)
                              ? 'bg-brand-600 text-white border-brand-600 shadow-md transform scale-105'
                              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Row: Description */}
                  <div className="lg:col-span-12 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      (3) 維修問題描述
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="請詳細描述問題狀況..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-2 border-t border-gray-100 mt-4">
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSearching ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                    (5) 搜尋
                  </button>
                  
                  <button
                    onClick={handleClear}
                    disabled={isSearching}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all"
                  >
                    <RotateCcw size={18} />
                    (6) 清空
                  </button>
                </div>
                
                {/* System Note */}
                 <div className="text-xs text-gray-400 flex items-center gap-1">
                    (8) 系統備註: 搜尋結果由 AI 模型 (Gemini) 分析語意相似度後產生。若為新產品，將自動推論共用零件之舊專案紀錄。
                 </div>
              </div>

              {/* Results Section */}
              {results && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
                  
                  {/* Column 1: In Project > High */}
                  <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
                     <div className="p-4 bg-green-50 border-b border-green-100">
                        <h2 className="font-bold text-green-800 flex items-center gap-2">
                            <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                            (4-1) 專案內解決方案
                            <span className="text-xs bg-white px-2 py-0.5 rounded-full border border-green-200 ml-auto text-green-700 font-mono">{thresholdSettings.high}%</span>
                        </h2>
                     </div>
                     <div className="p-4 space-y-4 bg-gray-50/30 flex-grow min-h-[300px]">
                        {results.inProject.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 text-sm">無符合條件的高相似度專案記錄</div>
                        ) : (
                            results.inProject.map(record => <ResultCard key={record.id} record={record} settings={thresholdSettings} />)
                        )}
                     </div>
                  </div>

                  {/* Column 2: Common Medium-High */}
                  <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-yellow-100 overflow-hidden">
                     <div className="p-4 bg-yellow-50 border-b border-yellow-100">
                        <h2 className="font-bold text-yellow-800 flex items-center gap-2">
                            <div className="w-2 h-6 bg-yellow-500 rounded-full"></div>
                            (4-2) 共通/關聯解決方案
                            <span className="text-xs bg-white px-2 py-0.5 rounded-full border border-yellow-200 ml-auto text-yellow-700 font-mono">{thresholdSettings.medium}-{thresholdSettings.high}%</span>
                        </h2>
                     </div>
                     <div className="p-4 space-y-4 bg-gray-50/30 flex-grow min-h-[300px]">
                        {results.common.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 text-sm">無符合條件的共通記錄</div>
                        ) : (
                            results.common.map(record => <ResultCard key={record.id} record={record} settings={thresholdSettings} />)
                        )}
                     </div>
                  </div>

                  {/* Column 3: Other < Medium */}
                  <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                     <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <h2 className="font-bold text-gray-700 flex items-center gap-2">
                            <div className="w-2 h-6 bg-gray-400 rounded-full"></div>
                            (4-3) 其他專案/參考
                            <span className="text-xs bg-white px-2 py-0.5 rounded-full border border-gray-300 ml-auto text-gray-600 font-mono">&lt;{thresholdSettings.medium}%</span>
                        </h2>
                     </div>
                     <div className="p-4 space-y-4 bg-gray-50/30 flex-grow min-h-[300px]">
                        {results.other.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 text-sm">無其他參考記錄</div>
                        ) : (
                            results.other.map(record => <ResultCard key={record.id} record={record} settings={thresholdSettings} />)
                        )}
                     </div>
                  </div>

                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;