

import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_DATABASE, PROJECT_SPECS } from "../constants";
import { SearchParams, AnalysisResponse, ThresholdSettings } from "../types";

export const analyzeRepairRequest = async (
  searchParams: SearchParams,
  settings: ThresholdSettings
): Promise<AnalysisResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are a Senior Maintenance Engineer AI Expert.
    
    # Context
    You have access to two datasets:
    1. **Project Specs Table** (Defines project hardware, e.g., Main Chip, Model):
       ${JSON.stringify(PROJECT_SPECS)}
    
    2. **Repair Database** (Historical anomalies and solutions):
       ${JSON.stringify(MOCK_DATABASE)}

    # User Request
    - Project Name: "${searchParams.projectName}"
    - Project Model: "${searchParams.projectModel || 'N/A'}"
    - Categories: [${searchParams.selectedCategories.join(", ")}]
    - Description: "${searchParams.description}"

    # Task & Inference Logic
    1. **Direct Match Analysis**: Compare the User Request against the Repair Database. Focus on "Description" and "Categories".
    
    2. **Component-Based Inference (Crucial for New Products)**: 
       - If the "Project Name" in the User Request DOES NOT exist in the Repair Database, OR if results are scarce:
       - Look up the Project in the **Project Specs Table**.
       - Identify its 'Main Chip' OR 'Model' (from description).
       - Find OTHER projects in the Project Specs Table that share the SAME 'Main Chip' or 'Model'.
       - If a shared component/model project is found, find *its* records in the Repair Database.
       - These records are highly relevant (Common Solution via Shared Component).
       
    3. **Scoring Rules (0-100)**:
       - **${settings.high}-100**: Exact project match AND High symptom similarity.
       - **${settings.medium}-${settings.high - 1}**: Different Project BUT Shared Main Chip/Model (Inference) AND High symptom similarity OR General common issues.
       - **<${settings.medium}**: Low relevance.

    4. **Output Requirement**:
       - Return a JSON object with a list of results.
       - **"reason" field**: If the result is based on Component Inference, you MUST state: "Inferred: [User Project] shares [Chip/Model] with [Old Project]."

    Constraint: Return ONLY valid JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  score: { type: Type.INTEGER },
                  reason: { type: Type.STRING }
                },
                required: ["id", "score", "reason"]
              }
            }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");
    
    return JSON.parse(resultText) as AnalysisResponse;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};