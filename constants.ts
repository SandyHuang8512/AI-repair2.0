

import { DefectCategory, RepairRecord, ProjectSpecification } from './types';

export const DEFECT_CATEGORIES = Object.values(DefectCategory);

// [專案關聯表格] Project Specifications and Key Components
// Used for inference when a project has no direct records.
export const PROJECT_SPECS: ProjectSpecification[] = [
  {
    projectName: "ZE4A-200025G (C223A)",
    mainChip: "Ambarella H22",
    platform: "Linux Embedded",
    description: "High-end IP Camera"
  },
  {
    projectName: "ZE4A-200901G",
    mainChip: "Ambarella H22",
    platform: "Linux Embedded",
    description: "Standard IP Camera"
  },
  {
    projectName: "ZE5-NewGen", // <--- 新產品 (資料庫無維修紀錄)
    mainChip: "Ambarella H22",  // <--- 但共用 H22 晶片
    platform: "Linux Embedded",
    description: "Next Gen Prototype"
  },
  {
    projectName: "C271B",
    mainChip: "MediaTek MT7621",
    platform: "OpenWrt",
    description: "Wireless Access Point"
  },
  {
    projectName: "Alpha-1",
    mainChip: "Snapdragon 8 Gen 2",
    platform: "Android",
    description: "Flagship Mobile"
  },
  {
    projectName: "Gamma-Future", // <--- 新產品
    mainChip: "Snapdragon 8 Gen 2", // <--- 共用 SD 8 Gen 2
    platform: "Android",
    description: "Future Foldable"
  },
  // Added from Project Association Table V1.0
  {
    projectName: "C296A",
    mainChip: "XM5T SoC",
    platform: "Unknown",
    description: "Model: XM5T-100010G"
  },
  {
    projectName: "C299A",
    mainChip: "XM5T SoC", // Shared component with C296A
    platform: "Unknown",
    description: "Model: XM5T-100010G"
  }
];

// [異常處理資料庫] A mock database of historical repair records
export const MOCK_DATABASE: RepairRecord[] = [
  {
    id: "PDF-001",
    projectName: "ZE4A-200025G (C223A)",
    categories: [DefectCategory.FLASH_ERROR, DefectCategory.SOFTWARE],
    problemDescription: "開機console出現:'error burning eeprom'不良信息; 燒錄程式出現'ERROR Connecting to the target…'。Amboot未能在5秒內運行。",
    solution: "1. 檢查DDR2 Size參數是否為128M。 2. 檢查DRAM參數。 3. 若BusID#001.DevID#022重新初始化超時，移除該失敗裝置。",
    date: "2024-03-01"
  },
  {
    id: "PDF-002",
    projectName: "General (共通)",
    categories: [DefectCategory.NETWORK, DefectCategory.HARDWARE],
    problemDescription: "RJ45燈號不亮，電腦連線icon顯示'網路電纜已拔除'，PING 192.168.123.10 失敗。系統反覆重啟。",
    solution: "插上DEBUG BD觀察CONSOLE。若出現I2C BUS ERROR (ambarella-i2c No ACK)，表示I2C信號溝通不良。檢查ambarella-i2c e8003000.i2c位址0x34或0xd0。",
    date: "2024-03-05"
  },
  {
    id: "PDF-003",
    projectName: "C249E",
    categories: [DefectCategory.POWER, DefectCategory.HARDWARE],
    problemDescription: "POE供電會重啟,導致系統一直重複開機。",
    solution: "判斷可能是D601, D607 逆向電流偏高，導致C614電壓上升~12.6V，使APD電壓>1.6V導致POE IC誤動作。解決方案：更換不良零件D601, D607二極體。",
    date: "2024-02-15"
  },
  {
    id: "PDF-004",
    projectName: "ZE4A-200901G",
    categories: [DefectCategory.IMAGE_DEFECT, DefectCategory.HARDWARE],
    problemDescription: "鏡頭光圈無法開啟,使得畫面呈一片黑。產測進行DC IRIS校正時，畫面呈黑色。",
    solution: "1. 判斷是AP1514 (Iris Driver) 性能偏差所致，VDD上升SLEW RATE異常導致DRV輸出不足，更換AP1514。 2. 若無效，更換鏡頭。",
    date: "2024-03-10"
  },
  {
    id: "PDF-005",
    projectName: "General (共通)",
    categories: [DefectCategory.TEST_FAIL, DefectCategory.HARDWARE],
    problemDescription: "BI Memtester Fail: FAILURE at offset 0x000b3668. 熱機無動作，檢查console無反應。",
    solution: "此為DDR/DSP與PC板高頻走線阻抗匹配性問題。1. 收集不良板給R/D分析調整SHMOO參數。 2. 若為單板不良，建議更換DDR (U122) 或 DSP。",
    date: "2024-01-20"
  },
  {
    id: "PDF-006",
    projectName: "C252F",
    categories: [DefectCategory.HARDWARE, DefectCategory.POWER],
    problemDescription: "電流偏高/偏大，暗部雜訊大，照燈光時周圍呈現光暈狀。",
    solution: "產測偵測SD失敗，或電流異常。檢查周邊電源電路，或更換相關Sensor模組。",
    date: "2024-02-28"
  },
  {
    id: "PDF-007",
    projectName: "C271B",
    categories: [DefectCategory.NETWORK],
    problemDescription: "POE無法連線。Gateway模式下Ping 192.168.0.30 OK，但Bridge模式下Ping NG。",
    solution: "1. 檢查MT7621電源各接腳電壓。 2. 檢查P702排針接觸性良莠，可能影響CARRIER BD SoC信號。",
    date: "2024-03-15"
  },
  {
    id: "PDF-008",
    projectName: "ZE4A-200400G",
    categories: [DefectCategory.IMAGE_DEFECT],
    problemDescription: "將鏡頭遮住,影像暗部有垂直條紋及閃爍現象。",
    solution: "檢查CMOS內部偏壓迴路的電容(VCAP)參考電壓位準，一般有4-5顆，需量測VDD相關電壓是否為1.2V。",
    date: "2024-02-10"
  },
  {
    id: "PDF-009",
    projectName: "Alpha-1",
    categories: [DefectCategory.HARDWARE, DefectCategory.POWER],
    problemDescription: "Device shuts down immediately after boot when battery is below 20%.",
    solution: "Replaced the PMIC (Power Management IC) and recalibrated the battery sensor.",
    date: "2023-10-15"
  },
  {
    id: "PDF-010",
    projectName: "Beta-X",
    categories: [DefectCategory.NETWORK],
    problemDescription: "Wi-Fi keeps dropping connection in high interference areas.",
    solution: "Adjusted antenna placement and updated Wi-Fi driver to improve signal-to-noise ratio handling.",
    date: "2024-01-10"
  },
  {
    id: "PDF-011",
    projectName: "C311", // Corrected: RTC Fail is on C311
    categories: [DefectCategory.HARDWARE, DefectCategory.POWER],
    problemDescription: "系統時間無法保存(RTC Fail)，斷電後重開機時間重置。或是量測RTC電壓異常。",
    solution: "檢查RTC迴路相關零件,包括:金電容C115, 振盪器X101及其周邊零件是否正常。\n(1).量測金電容電壓,正常約3.0V, 若太低表是異常,請更換。\n(2).檢查振盪器旁負載電容,若異常,例如短路,請更換。\n(3).更換X101。",
    date: "2024-03-20"
  },
  {
    id: "PDF-012",
    projectName: "C296A", // Added: C296 is Image Too Dark
    categories: [DefectCategory.IMAGE_DEFECT, DefectCategory.HARDWARE],
    problemDescription: "畫面異常，影像整體偏暗，調整亮度設定無效。",
    solution: "1. 檢查 Lens 光圈作動是否正常。\n2. 測量 Sensor Board 供電電壓。\n3. 若周邊電路正常，請更換 Image Sensor。",
    date: "2024-03-22"
  }
];