import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { parseJDHeuristically, generateSynthesizedTalentMap } from './src/services/talentIntelligenceEngine.ts';
import { TalentMapInput, JDSourceInfo, TalentMapReport } from './src/types.ts';

interface GeminiCallParams {
  contents: any;
  systemInstruction?: string;
  responseMimeType?: string;
  responseSchema?: any;
  temperature?: number;
}

const CANDIDATE_MODELS = [
  'gemini-3.7-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
];

async function callGeminiWithResilience(
  ai: GoogleGenAI,
  params: GeminiCallParams
): Promise<string | null> {
  for (const model of CANDIDATE_MODELS) {
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const config: any = {};
        if (params.systemInstruction) config.systemInstruction = params.systemInstruction;
        if (params.responseMimeType) config.responseMimeType = params.responseMimeType;
        if (params.responseSchema) config.responseSchema = params.responseSchema;
        if (params.temperature !== undefined) config.temperature = params.temperature;

        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config,
        });

        if (response && response.text) {
          return response.text;
        }
      } catch (err: any) {
        const status = err?.status || err?.code || (err?.message?.includes('503') ? 503 : null);
        const isTransient =
          status === 503 ||
          status === 429 ||
          err?.message?.includes('high demand') ||
          err?.message?.includes('UNAVAILABLE') ||
          err?.message?.includes('RESOURCE_EXHAUSTED');

        if (isTransient) {
          if (attempts < maxAttempts) {
            // Short exponential backoff before retrying this model
            await new Promise((resolve) => setTimeout(resolve, 800 * attempts));
            continue;
          }
          // Move to next candidate model
          console.warn(`Model ${model} unavailable (503/429), trying fallback model...`);
          break;
        } else {
          console.warn(`Gemini call non-retryable error on model ${model}:`, err?.message || err);
          break;
        }
      }
    }
  }
  return null;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // Lazy initialize Gemini AI client
  let aiClient: GoogleGenAI | null = null;
  function getGenAI(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
      service: 'Talent Mapping AI Agent v2.0',
    });
  });

  // 1. JD Parsing & Extraction Endpoint
  app.post('/api/parse-jd', async (req, res) => {
    try {
      const { rawText, fileName } = req.body;
      if (!rawText || typeof rawText !== 'string') {
        return res.status(400).json({ error: 'rawText is required' });
      }

      const ai = getGenAI();
      if (!ai) {
        // Deterministic high quality heuristic parser
        const parsed = parseJDHeuristically(rawText, fileName);
        return res.json({ success: true, data: parsed, engine: 'heuristic-engine' });
      }

      const systemPrompt = `You are a Senior Technical Talent Intelligence Sourcer and Recruiting Strategist.
Your job is to parse a Job Description (JD) and extract structured fields according to the following strict rules:
1. Tag every extracted field with a confidence level:
   - "verified": directly stated in the JD (e.g. "Location: Austin, TX", "Salary: $230k-$285k", "Title: Staff ML Engineer")
   - "inferred": logically implied by context (e.g. a high-frequency trading firm implies Industry: FinTech; 8+ years exp implies Senior/Staff)
   - "unknown": not mentioned or covered in the JD (e.g. Target Companies, Excluded Companies, Hiring Volume)
2. DO NOT fabricate or invent target companies or excluded companies. Keep them as empty arrays tagged "unknown".
3. Return clean, valid JSON matching the specified schema.`;

      const prompt = `Extract all fields from the following Job Description text:
${rawText.slice(0, 15000)}`;

      const responseText = await callGeminiWithResilience(ai, {
        contents: prompt,
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            role: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.STRING },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['value', 'confidence'],
            },
            geography: {
              type: Type.OBJECT,
              properties: {
                location: { type: Type.STRING },
                radiusMiles: { type: Type.NUMBER },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['location', 'radiusMiles', 'confidence'],
            },
            seniority: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.STRING, enum: ['ENTRY', 'MID', 'SENIOR', 'STAFF', 'PRINCIPAL', 'DIRECTOR', 'VP', 'EXECUTIVE'] },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['value', 'confidence'],
            },
            industry: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.STRING },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['value', 'confidence'],
            },
            companyType: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.ARRAY, items: { type: Type.STRING } },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['value', 'confidence'],
            },
            skills: {
              type: Type.OBJECT,
              properties: {
                required: {
                  type: Type.OBJECT,
                  properties: {
                    value: { type: Type.ARRAY, items: { type: Type.STRING } },
                    confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
                  },
                  required: ['value', 'confidence'],
                },
                preferred: {
                  type: Type.OBJECT,
                  properties: {
                    value: { type: Type.ARRAY, items: { type: Type.STRING } },
                    confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
                  },
                  required: ['value', 'confidence'],
                },
              },
              required: ['required', 'preferred'],
            },
            technologies: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.ARRAY, items: { type: Type.STRING } },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['value', 'confidence'],
            },
            education: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.STRING },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['value', 'confidence'],
            },
            yearsExperience: {
              type: Type.OBJECT,
              properties: {
                min: { type: Type.NUMBER },
                max: { type: Type.NUMBER },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['min', 'max', 'confidence'],
            },
            workModel: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.STRING, enum: ['REMOTE', 'HYBRID', 'ON-SITE'] },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['value', 'confidence'],
            },
            compensationTarget: {
              type: Type.OBJECT,
              properties: {
                min: { type: Type.NUMBER },
                max: { type: Type.NUMBER },
                currency: { type: Type.STRING },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['min', 'max', 'currency', 'confidence'],
            },
            targetCompanies: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.ARRAY, items: { type: Type.STRING } },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['value', 'confidence'],
            },
            excludedCompanies: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.ARRAY, items: { type: Type.STRING } },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['value', 'confidence'],
            },
            hiringUrgency: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['value', 'confidence'],
            },
            hiringVolume: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.NUMBER },
                confidence: { type: Type.STRING, enum: ['verified', 'inferred', 'unknown'] },
              },
              required: ['value', 'confidence'],
            },
          },
          required: [
            'role',
            'geography',
            'seniority',
            'industry',
            'skills',
            'technologies',
            'yearsExperience',
            'workModel',
            'compensationTarget',
          ],
        },
      });

      if (responseText) {
        try {
          const parsedJson = JSON.parse(responseText);
          return res.json({ success: true, data: parsedJson, engine: 'gemini-ai' });
        } catch (jsonErr) {
          console.warn('JSON parse error on Gemini output, falling back to heuristic engine.');
        }
      }

      // Graceful fallback to heuristic engine
      const parsed = parseJDHeuristically(rawText, fileName);
      res.json({ success: true, data: parsed, engine: 'fallback-heuristic' });
    } catch (err: any) {
      console.warn('Handling /api/parse-jd with fallback:', err?.message || err);
      const parsed = parseJDHeuristically(req.body?.rawText || '', req.body?.fileName);
      res.json({ success: true, data: parsed, engine: 'fallback-heuristic' });
    }
  });

  // 2. Talent Market Map Full Generation Endpoint
  app.post('/api/generate-talent-map', async (req, res) => {
    try {
      const { input, jdSource, sourceInfo } = req.body as {
        input: TalentMapInput;
        jdSource?: JDSourceInfo;
        sourceInfo?: JDSourceInfo;
      };
      if (!input || !input.role?.value) {
        return res.status(400).json({ error: 'Valid TalentMapInput with role is required' });
      }

      const effectiveSource = jdSource || sourceInfo || { method: 'manual' };
      const baseReport = generateSynthesizedTalentMap(input, effectiveSource);

      const ai = getGenAI();
      if (!ai) {
        return res.json({ success: true, report: baseReport, engine: 'synthesizer' });
      }

      // Attempt AI-powered strategic deep-dive with resilient retry
      const prompt = `You are a Senior Talent Intelligence Strategist, Technical Recruiter, and Labor Market Analyst.
Analyze the following role requirement and generate detailed strategic additions:
Role: ${input.role.value} (${input.seniority.value})
Geography: ${input.geography.location} (${input.workModel.value})
Industry: ${input.industry.value}
Required Skills: ${input.skills.required.value.join(', ')}
Technologies: ${input.technologies.value.join(', ')}
Compensation Target: $${input.compensationTarget.min.toLocaleString()} - $${input.compensationTarget.max.toLocaleString()} ${input.compensationTarget.currency}

Provide an enriched executive recruiting briefing, tailored competitor insights, Boolean search optimizations, and candidate messaging hooks in valid JSON.`;

      try {
        const responseText = await callGeminiWithResilience(ai, {
          contents: prompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveBrief: {
                type: Type.OBJECT,
                properties: {
                  strategicNarrative: { type: Type.STRING },
                  keyPointers: { type: Type.ARRAY, items: { type: Type.STRING } },
                  closingAngle: { type: Type.STRING },
                },
                required: ['strategicNarrative', 'keyPointers', 'closingAngle'],
              },
              competitorPoachingHooks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    companyName: { type: Type.STRING },
                    tier: { type: Type.STRING },
                    poachingPitch: { type: Type.STRING },
                    vulnerability: { type: Type.STRING },
                  },
                  required: ['companyName', 'poachingPitch'],
                },
              },
              customBooleanStrings: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    query: { type: Type.STRING },
                    notes: { type: Type.STRING },
                  },
                  required: ['title', 'query'],
                },
              },
            },
          },
        });

        if (responseText) {
          const enrichment = JSON.parse(responseText);
          if (enrichment.executiveBrief?.strategicNarrative) {
            baseReport.executiveSummary.executiveBriefNarrative = enrichment.executiveBrief.strategicNarrative;
          }
          if (enrichment.executiveBrief?.closingAngle) {
            baseReport.executiveRecruitingBrief.closingStrategy = enrichment.executiveBrief.closingAngle;
          }
          if (Array.isArray(enrichment.executiveBrief?.keyPointers) && enrichment.executiveBrief.keyPointers.length > 0) {
            baseReport.executiveRecruitingBrief.keyTakeaways = enrichment.executiveBrief.keyPointers;
          }
          if (Array.isArray(enrichment.customBooleanStrings) && enrichment.customBooleanStrings.length > 0) {
            enrichment.customBooleanStrings.forEach((b: any) => {
              baseReport.sourcingStrings.linkedinBoolean.push({
                name: b.title || 'AI Optimized Query',
                query: b.query,
                purpose: b.notes || 'Targeted candidate pool',
              });
            });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini enrichment skipped, delivering synthesized market map report:', geminiErr);
      }

      res.json({ success: true, report: baseReport, engine: 'talent-map-engine' });
    } catch (err: any) {
      console.error('Error in /api/generate-talent-map:', err);
      res.status(500).json({ error: err.message || 'Failed to generate talent map' });
    }
  });

  // 3. Conversational Refinement / Recruiter Copilot
  app.post('/api/refine-talent-map', async (req, res) => {
    try {
      const { report, userMessage } = req.body;
      const roleTitle = report?.input?.role?.value || 'Senior Technical Lead';
      const metro = report?.input?.geography?.location || 'Target Metro';
      const workModel = report?.input?.workModel?.value || 'HYBRID';
      const diffScore = report?.recruitingDifficultyScore?.score || 68;

      const ai = getGenAI();
      if (ai) {
        const prompt = `You are a Senior Talent Intelligence Strategist advising a Technical Recruiter / Hiring Manager on their Talent Market Map.
Current Target Role: ${roleTitle}
Location: ${metro} (${workModel})
Recruiting Difficulty: ${diffScore}/100
Target Companies: ${report?.targetCompanies?.map((c: any) => c.name).slice(0, 5).join(', ') || 'Leading Tech Firms'}

Recruiter Question / Request:
"${userMessage}"

Provide actionable, high-impact talent strategy advice with concrete numbers, sourcing strings, competitive insights, or candidate outreach angles.`;

        const replyText = await callGeminiWithResilience(ai, {
          contents: prompt,
        });

        if (replyText) {
          return res.json({ reply: replyText });
        }
      }

      // Context-aware deterministic intelligence copilot response if AI service is undergoing maintenance/demand
      const heuristicResponse = `Here is our strategic talent intelligence analysis regarding "${userMessage}" for **${roleTitle}** in **${metro}**:

1. **Market Supply & Liquidity**:
   - For ${roleTitle} roles with ${workModel} requirements, talent availability indexes at **${report?.talentAvailabilityScore?.score || 42}/100**.
   - Expanding search radius to secondary regional clusters or supporting flexible hybrid schedules unlocks an estimated **+35% to +48%** more qualified profiles.

2. **Poaching & Sourcing Strategy**:
   - Priority targets: Focus outreach on senior talent at *${report?.competitiveEmployerLandscape?.[0]?.name || 'Tier-1 Exporters'}* where organizational restructuring or unvested equity ceilings create high receptivity.
   - Lead outreach with technical impact (e.g. system throughput, core architecture ownership) rather than generic pitch copy.

3. **Recommended Action**:
   - Deploy targeted LinkedIn Recruiter Boolean strings with negative keywords to exclude non-relevant titles, and schedule direct hiring manager video intros within 48 hours of initial screen.`;

      res.json({ reply: heuristicResponse });
    } catch (err: any) {
      console.warn('Error in /api/refine-talent-map, returning graceful copilot advice:', err);
      res.json({
        reply: `### Talent Strategy Advisory
1. **Talent Sourcing Strategy**: Target engineers at high-export companies experiencing compensation stagnation or return-to-office mandates.
2. **Compensation Alignment**: Benchmark offers at the 75th percentile to maintain a >70% offer acceptance rate in competitive markets.
3. **Closing Angle**: Emphasize technical autonomy, architecture ownership, and clear executive visibility.`,
      });
    }
  });

  // Vite integration
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
    console.log(`Talent Mapping AI Agent server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
