import { GoogleGenAI } from '@google/genai';

// Initialize Gemini client if API key is provided
let aiClient: GoogleGenAI | null = null;

try {
  // Check import.meta.env first or process.env
  const apiKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || 
                 (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY);
  if (apiKey) {
    aiClient = new GoogleGenAI({ apiKey });
  }
} catch {
  aiClient = null;
}

const SYSTEM_SAFETY_INSTRUCTION = `
You are the "CareReach Health Assistant", an empathetic, safety-conscious communication assistant built specifically for college & hostel students who may be unwell, away from home, and preparing to talk to a qualified medical doctor.

CRITICAL SAFETY & MEDICAL BOUNDARIES:
1. You are an ASSISTANT, NOT a medical doctor. You NEVER provide a definitive diagnosis, NEVER prescribe medications, and NEVER claim clinical certainty.
2. If the user mentions any emergency red flags (severe chest pain, difficulty breathing, coughing up blood, sudden weakness/numbness on one side, loss of consciousness, uncontrolled bleeding, severe anaphylactic allergy), IMMEDIATELY advise them to call emergency services (108 / 911 / Campus Ambulance) and inform their hostel warden.
3. Your primary roles:
   - Help the student describe vague or distressing symptoms clearly and chronologically for their doctor.
   - Explain confusing medical terms or lab report phrases in plain, reassuring language.
   - Suggest 3 to 4 thoughtful, relevant questions they can ask their doctor during consultation.
   - Summarize user inputs cleanly into structured bullet points (onset, triggers, severity, self-care tried).
4. Always conclude any clinical discussion with the disclaimer: "Please consult your CareReach doctor for definitive clinical diagnosis and treatment."
`;

const MODELS_TO_TRY = ['gemini-flash-latest', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];

export async function askHealthAssistant(
  userQuery: string,
  context?: {
    symptoms?: string[];
    description?: string;
    studentAge?: number;
    severity?: string;
  }
): Promise<string> {
  const contextText = context
    ? `\nContext on student condition: Symptoms: ${context.symptoms?.join(', ') || 'N/A'}; Details: ${context.description || 'N/A'}; Severity: ${context.severity || 'N/A'}; Age: ${context.studentAge || 20}`
    : '';

  if (aiClient) {
    for (const modelName of MODELS_TO_TRY) {
      try {
        const response = await aiClient.models.generateContent({
          model: modelName,
          contents: `${userQuery}${contextText}`,
          config: {
            systemInstruction: SYSTEM_SAFETY_INSTRUCTION,
            temperature: 0.3,
          },
        });
        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        // If quota exceeded or error, log and try next model or fallback
        console.warn(`Model ${modelName} failed or quota exceeded:`, err?.message || err);
      }
    }
  }

  // Graceful, high-quality, clinical safety rule-based fallback
  const q = userQuery.toLowerCase();
  
  if (q.includes('chest pain') || q.includes('breathe') || q.includes('breathing') || q.includes('passed out') || q.includes('bleed') || q.includes('stroke')) {
    return `⚠️ **Emergency Notice**: Symptoms like chest pain, severe breathing difficulty, sudden numbness, or heavy bleeding require immediate emergency attention. Please do NOT wait. Call emergency services (108 / 911 / Campus Ambulance) immediately and alert your hostel warden or roommate.`;
  }

  if (q.includes('question') || q.includes('ask doctor') || q.includes('prepare')) {
    return `Here are 4 structured questions you can ask your doctor during your consultation:
1. **Specific Triggers**: "Could my current symptoms be linked to hostel food, dehydration, or stress from exams?"
2. **First-Aid & Relief**: "What safe self-care measures (fluids, temperature control, resting posture) can I take right now in my hostel room?"
3. **Red-Flag Warning Signs**: "What changes in my symptoms should make me go to an emergency hospital right away tonight?"
4. **Follow-Up Needs**: "Do you recommend I get an in-person follow-up visit at the campus clinic tomorrow morning?"

*Disclaimer: CareReach Assistant provides preparation support. Always discuss your symptoms directly with the doctor.*`;
  }

  if (q.includes('fever') || q.includes('temperature') || q.includes('shivering')) {
    return `### Preparing for your Fever Consultation:
- **Measure if possible**: Note if you have a thermometer reading (e.g. 101°F) or if you feel hot with chills.
- **Hydration**: Sip room-temperature water or electrolytes/ORS in small amounts while resting.
- **Key details for your doctor**: Mention when the fever started, if you have body aches, sore throat, or nausea, and any paracetamol you took in the last 6 hours.
- **Warning signs**: If fever exceeds 103°F, is accompanied by a stiff neck, confusion, or breathing trouble, seek in-person hospital care immediately.

*Disclaimer: CareReach Assistant does not diagnose or prescribe. Please consult your matched doctor for medical advice.*`;
  }

  if (q.includes('stomach') || q.includes('vomit') || q.includes('nausea') || q.includes('diarrhea') || q.includes('food')) {
    return `### Preparing for your Stomach / Nausea Consultation:
- **Hydration check**: Are you able to keep sips of water or ORS down? Mention this to the doctor.
- **Food timeline**: Note what you ate in the hostel mess or outside in the last 24-48 hours.
- **Pain location**: Be ready to describe if the pain is crampy, dull, or sharp, and whether it's upper, lower, or all over.
- **Warning signs**: Severe sharp localized pain in the lower right abdomen, blood in vomit or stool, or inability to keep fluids down for over 12 hours require immediate clinic evaluation.

*Disclaimer: CareReach Assistant does not diagnose or prescribe. Consult your doctor for treatment.*`;
  }

  return `### CareReach Symptom Assistant
Thank you for reaching out. Here is how you can organize this for your doctor:
1. **Timeline**: Note exactly how many hours or days ago this started.
2. **Current Level**: Rate your discomfort from 1 (mild) to 10 (intense).
3. **Triggers & Prior Medication**: List anything you took (like pain relievers or antacids) and whether it helped.

*Please note: I am an AI assistant and cannot diagnose diseases or replace medical care. Connect with one of our nearby verified doctors right away.*`;
}

export interface SymptomCheckInput {
  symptoms: string[];
  duration: string;
  severity: 'mild' | 'moderate' | 'severe';
  additionalNotes?: string;
  preferredLanguage?: 'en' | 'hi' | 'ta';
}

export interface SymptomCheckResult {
  summary: string;
  possibleCauses: string[];
  immediateCare: string[];
  recommendedDoctor: string;
  urgencyLevel: 'HOME_CARE' | 'ROUTINE_APPOINTMENT' | 'SAME_DAY_URGENT' | 'EMERGENCY_NOW';
  plainSpeechText: string;
  suggestedQuestions: string[];
}

/**
 * Universal, Plain-Language Symptom Checker using Gemini API
 * Tailored for both educated and non-educated users with clear, jargon-free explanations.
 */
export async function checkSymptomsWithGemini(
  input: SymptomCheckInput
): Promise<SymptomCheckResult> {
  const languagePrompt =
    input.preferredLanguage === 'hi'
      ? 'Explain in simple conversational Hindi (Hinglish or simple Hindi).'
      : input.preferredLanguage === 'ta'
      ? 'Explain in simple conversational Tamil (Tanglish or simple Tamil).'
      : 'Explain in very simple, kind, easy-to-understand English like speaking to a friend or village elder.';

  const prompt = `
Symptom Assessment Request:
- Symptoms: ${input.symptoms.join(', ')}
- Duration: ${input.duration}
- Severity: ${input.severity}
- User notes: ${input.additionalNotes || 'None'}
- Language requirement: ${languagePrompt}

Please evaluate these symptoms and return a JSON object with this exact structure:
{
  "summary": "Short 1-2 sentence gentle explanation in very simple everyday language",
  "possibleCauses": ["Simple everyday reason 1", "Simple everyday reason 2"],
  "immediateCare": ["Easy safe home action 1 (e.g. drink clean water)", "Easy safe action 2"],
  "recommendedDoctor": "Type of doctor to see (e.g. General Physician / Campus Doctor / Dentist)",
  "urgencyLevel": "HOME_CARE" | "ROUTINE_APPOINTMENT" | "SAME_DAY_URGENT" | "EMERGENCY_NOW",
  "plainSpeechText": "Very short friendly 30-second text suitable for reading aloud via text-to-speech to someone who cannot read",
  "suggestedQuestions": ["Simple question to ask the doctor 1", "Simple question 2"]
}
`;

  if (aiClient) {
    for (const modelName of MODELS_TO_TRY) {
      try {
        const response = await aiClient.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: `You are CareReach Simple Health Guide, designed for everyday people.
Keep all language at a 5th-grade reading level.
NEVER use complex medical terms like "gastroenteritis" without calling it "stomach upset or food bug".
Never diagnose definitively. Always guide the user to consult a doctor.
If red-flag emergency symptoms are present (chest pain, trouble breathing, unconsciousness, heavy bleeding), immediately mark urgencyLevel as EMERGENCY_NOW.`,
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return {
            summary: parsed.summary || 'Here is what your symptoms usually mean in simple terms.',
            possibleCauses: Array.isArray(parsed.possibleCauses) ? parsed.possibleCauses : ['Common seasonal bug or stress'],
            immediateCare: Array.isArray(parsed.immediateCare) ? parsed.immediateCare : ['Drink water and rest in a quiet room.'],
            recommendedDoctor: parsed.recommendedDoctor || 'General Physician',
            urgencyLevel: parsed.urgencyLevel || (input.severity === 'severe' ? 'SAME_DAY_URGENT' : 'ROUTINE_APPOINTMENT'),
            plainSpeechText: parsed.plainSpeechText || parsed.summary || 'Please rest and consult your doctor.',
            suggestedQuestions: Array.isArray(parsed.suggestedQuestions) ? parsed.suggestedQuestions : ['What medicine or diet is safe for me?']
          };
        }
      } catch (err: any) {
        console.warn(`Symptom checker model ${modelName} failed or quota exceeded:`, err?.message || err);
      }
    }
  }

  // High-reliability offline / fallback rule-based checker
  const isEmergency = input.symptoms.some((s) =>
    s.toLowerCase().includes('chest') ||
    s.toLowerCase().includes('breath') ||
    s.toLowerCase().includes('unconscious') ||
    s.toLowerCase().includes('blood')
  );

  if (isEmergency) {
    return {
      summary: '⚠️ Important: These symptoms can be very serious. Please do not wait alone in your room.',
      possibleCauses: ['Urgent condition needing immediate hospital checkup'],
      immediateCare: ['Sit down comfortably', 'Call Campus Ambulance or 108 immediately', 'Alert your hostel roommate or warden'],
      recommendedDoctor: 'Emergency Room Physician',
      urgencyLevel: 'EMERGENCY_NOW',
      plainSpeechText: 'Please stop and call emergency ambulance 108 or your hostel warden immediately. These symptoms need immediate medical help.',
      suggestedQuestions: ['Should I go to the emergency hospital right now?']
    };
  }

  if (input.symptoms.some((s) => s.toLowerCase().includes('fever') || s.toLowerCase().includes('hot'))) {
    return {
      summary: 'Your body feels hot and feverish. This usually means your immune system is actively fighting off a common cold, seasonal virus, or mild infection.',
      possibleCauses: ['Seasonal viral fever', 'Throat infection', 'Mild exhaustion or weather change'],
      immediateCare: ['Drink small sips of clean water or ORS', 'Rest in a well-ventilated room', 'Wipe forehead with a clean damp cloth if feeling very warm'],
      recommendedDoctor: 'General Physician / Campus Dispensary Doctor',
      urgencyLevel: input.severity === 'severe' ? 'SAME_DAY_URGENT' : 'ROUTINE_APPOINTMENT',
      plainSpeechText: 'You appear to have a fever. Drink plenty of water and rest. We suggest booking an appointment with a campus doctor today.',
      suggestedQuestions: ['What safe medicine can I take for my fever?', 'What foods are easy to digest today?']
    };
  }

  if (input.symptoms.some((s) => s.toLowerCase().includes('stomach') || s.toLowerCase().includes('vomit') || s.toLowerCase().includes('diarrhea'))) {
    return {
      summary: 'You are experiencing stomach trouble or nausea. This often happens from food that did not agree with you, dehydration, or a mild tummy bug.',
      possibleCauses: ['Hostel food sensitivity', 'Mild tummy infection / indigestion', 'Dehydration in warm weather'],
      immediateCare: ['Sip electrolyte water / ORS slowly', 'Avoid oily, spicy, or fried foods', 'Rest lying on your left side'],
      recommendedDoctor: 'General Physician / Internal Medicine',
      urgencyLevel: input.severity === 'severe' ? 'SAME_DAY_URGENT' : 'ROUTINE_APPOINTMENT',
      plainSpeechText: 'Your stomach is upset. Please sip clean water or ORS slowly. Do not skip seeing a doctor if vomiting persists.',
      suggestedQuestions: ['Can I take ORS electrolytes?', 'Should I avoid mess food for two days?']
    };
  }

  return {
    summary: 'Based on what you shared, your body is showing signs of tiredness, pain, or mild illness that should be examined by a doctor.',
    possibleCauses: ['Physical strain or lack of sleep', 'Seasonal allergy or mild infection', 'Exam tension or dehydration'],
    immediateCare: ['Lie down and rest in a comfortable spot', 'Drink a glass of warm or room-temperature water', 'Write down when the discomfort started'],
    recommendedDoctor: 'General Physician',
    urgencyLevel: input.severity === 'severe' ? 'SAME_DAY_URGENT' : 'ROUTINE_APPOINTMENT',
    plainSpeechText: 'Here is your preliminary guide. Rest well and drink water. You can book an appointment with our campus doctor below.',
    suggestedQuestions: ['What could be causing this discomfort?', 'Is there any quick first-aid relief I can do right now?']
  };
}
