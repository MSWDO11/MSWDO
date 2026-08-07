import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'MSWDO Management System' });
});

// AI Intake Assessment Endpoint
app.post('/api/ai/assess-intake', async (req, res) => {
  try {
    const { constituentName, sector, assistanceType, monthlyIncome, familyMembersCount, situationNotes, requestedAmount, barangay } = req.body;

    const ai = getGeminiClient();

    const prompt = `You are a Senior Municipal Social Welfare and Development Officer (MSWDO) in the Philippines evaluating an Assistance to Individuals in Crisis Situations (AICS) application.

Applicant Details:
- Name: ${constituentName || 'Anonymous'}
- Sector Category: ${sector || 'Indigent'}
- Barangay: ${barangay || 'Poblacion'}
- Requested Assistance Type: ${assistanceType || 'General Crisis Assistance'}
- Monthly Household Income: PHP ${monthlyIncome || 0}
- Family Household Members: ${familyMembersCount || 1}
- Requested Amount: PHP ${requestedAmount || 0}
- Social Worker Intake Situation Notes: "${situationNotes || 'No notes provided'}"

Provide an objective, compassionate, and formal Social Worker Evaluation in JSON format with the following fields:
1. "eligibilityStatus": string ("Eligible - High Priority", "Eligible - Standard Priority", "Conditional - Requires Additional Documents", or "Ineligible")
2. "recommendedAmount": number (Recommended recommended PHP assistance amount based on DSWD/MSWDO guidelines and crisis severity, e.g. 2000 to 10000)
3. "assessmentSummary": string (A concise 3-4 sentence professional assessment statement explaining the hardship and need)
4. "requiredDocuments": array of strings (List 3-5 necessary supporting documents, e.g. "Barangay Certificate of Indigency", "Medical Certificate/Clinical Abstract", "Official Receipt / Statement of Account", "Valid Government ID")
5. "recommendedServices": array of strings (Other MSWDO sectoral programs or referrals, e.g., "Food Pack Distribution", "PhilHealth Indigent Enrollment", "Counseling Session", "OSCA Senior Citizen Booklet")
6. "urgencyLevel": string ("Emergency (Immediate 24-48hrs)", "Urgent (3-5 days)", "Standard Processing")

Ensure the response is strictly JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text || '{}';
    const assessment = JSON.parse(jsonText);
    res.json({ success: true, assessment });
  } catch (error: any) {
    console.error('Error in AI intake assessment:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to analyze intake sheet' });
  }
});

// AI Draft Social Case Study Report Endpoint
app.post('/api/ai/draft-social-case-report', async (req, res) => {
  try {
    const { constituent, intake } = req.body;

    const ai = getGeminiClient();

    const prompt = `You are a licensed Social Worker under the Municipal Social Welfare and Development Office (MSWDO). Draft an official Social Case Study Report (SCSR) for municipal approval and DSWD compliance.

Beneficiary Info:
- Full Name: ${constituent?.fullName}
- Age / Gender: ${constituent?.age} y/o, ${constituent?.gender}
- Sector: ${constituent?.sector}
- Address / Barangay: ${constituent?.barangay}, Municipality
- Occupation / Income: ${constituent?.occupation || 'Unemployed'}, PHP ${constituent?.monthlyIncome || 0}/month
- Civil Status: ${constituent?.civilStatus || 'Single'}

Intake Request:
- Assistance Type: ${intake?.assistanceType}
- Hospital/Institution/Context: ${intake?.institution || 'N/A'}
- Problem Description: ${intake?.problemDescription || intake?.situationNotes}
- Requested Amount: PHP ${intake?.requestedAmount || 0}

Please generate a structured, formal Social Case Study Report with the following sections in JSON:
1. "title": string (Official Document Title)
2. "problemPresented": string (Detailed statement of the crisis or difficulty faced by the family)
3. "familyBackground": string (Narrative regarding household composition, living conditions, and economic vulnerability)
4. "evaluativeAssessment": string (Professional social worker analysis linking the client's current situation with MSWDO/AICS intervention policies)
5. "recommendation": string (Specific recommendation for financial aid approval, specifying amount PHP and intended purpose)
6. "caseWorkerSignatureTitle": string ("Registered Social Worker (RSW) / Case Manager")

Return strictly JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const jsonText = response.text || '{}';
    const report = JSON.parse(jsonText);
    res.json({ success: true, report });
  } catch (error: any) {
    console.error('Error drafting social case study report:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate Social Case Study Report' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MSWDO Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
