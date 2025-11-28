
export enum DefectCategory {
  HARDWARE = "硬體故障",
  SOFTWARE = "軟體異常",
  NETWORK = "網路連線",
  MECHANICAL = "機構損壞",
  USER_ERROR = "操作錯誤",
  POWER = "電源問題",
  FLASH_ERROR = "燒錄異常",
  IMAGE_DEFECT = "影像異常",
  TEST_FAIL = "測試失敗"
}

export interface RepairRecord {
  id: string;
  projectName: string;
  categories: DefectCategory[];
  problemDescription: string;
  solution: string;
  date: string;
}

export interface ProjectSpecification {
  projectName: string;
  mainChip: string;
  platform: string;
  description?: string;
}

export interface AnalyzedRecord extends RepairRecord {
  similarityScore: number;
  matchReason: string;
}

export interface SearchParams {
  projectName: string;
  projectModel?: string;
  selectedCategories: DefectCategory[];
  description: string;
}

export interface ThresholdSettings {
  high: number;
  medium: number;
}

export interface AnalysisResponse {
  results: {
    id: string;
    score: number;
    reason: string;
  }[];
}

export interface KnowledgeBaseVersion {
  id: string;
  version: string;
  fileName: string;
  uploadDate: string;
  status: 'active' | 'archived' | 'processing';
  recordCount: number;
}