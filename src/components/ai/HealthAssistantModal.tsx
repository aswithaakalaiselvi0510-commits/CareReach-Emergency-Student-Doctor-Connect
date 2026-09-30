import React, { useState, useEffect, useRef } from 'react';
import { CareReachStore } from '../../services/store';
import {
  askHealthAssistant,
  checkSymptomsWithGemini,
  SymptomCheckResult
} from '../../services/gemini';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShieldAlert,
  Calendar,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  ArrowRight,
  Thermometer,
  Info,
  Mic,
  MicOff,
  Radio,
  FileAudio,
  BookmarkCheck,
  History,
  FileText
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
  contextSymptoms?: string[];
}

// Common visual symptoms with multi-lingual labels & big friendly emojis
interface VisualSymptom {
  id: string;
  nameEn: string;
  nameHi: string;
  nameTa: string;
  icon: string;
  color: string;
  isEmergencyAlert?: boolean;
}

const COMMON_SYMPTOMS: VisualSymptom[] = [
  {
    id: 'fever',
    nameEn: 'Fever / Hot Body',
    nameHi: 'तेज बुखार / तपना',
    nameTa: 'காய்ச்சல் / சூடு',
    icon: '🌡️',
    color: 'border-amber-300 bg-amber-50 hover:bg-amber-100'
  },
  {
    id: 'stomach',
    nameEn: 'Stomach Pain / Vomit',
    nameHi: 'पेट दर्द / उल्टी',
    nameTa: 'வயிற்று வலி / வாந்தி',
    icon: '🤢',
    color: 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100'
  },
  {
    id: 'headache',
    nameEn: 'Headache / Dizziness',
    nameHi: 'सिरदर्द / चक्कर',
    nameTa: 'தலைவலி / தலைசுற்றல்',
    icon: '🤕',
    color: 'border-blue-300 bg-blue-50 hover:bg-blue-100'
  },
  {
    id: 'cold_cough',
    nameEn: 'Cough / Cold / Throat',
    nameHi: 'खांसी / जुकाम / गला',
    nameTa: 'இருமல் / சளி / தொண்டை',
    icon: '🫁',
    color: 'border-teal-300 bg-teal-50 hover:bg-teal-100'
  },
  {
    id: 'body_pain',
    nameEn: 'Body & Muscle Pain',
    nameHi: 'बदन दर्द / थकान',
    nameTa: 'உடல் வலி / அசதி',
    icon: '🦵',
    color: 'border-purple-300 bg-purple-50 hover:bg-purple-100'
  },
  {
    id: 'rash_wound',
    nameEn: 'Skin Rash / Allergy',
    nameHi: 'त्वचा में खुजली / दाने',
    nameTa: 'அரிப்பு / தோல் தடிப்பு',
    icon: '🩹',
    color: 'border-rose-300 bg-rose-50 hover:bg-rose-100'
  },
  {
    id: 'chest_emergency',
    nameEn: 'Chest Tightness / Breath',
    nameHi: 'सीने में दर्द / सांस फूलना',
    nameTa: 'நெஞ்சு வலி / மூச்சுத்திணறல்',
    icon: '🚨',
    color: 'border-red-400 bg-red-50 hover:bg-red-100 text-red-900',
    isEmergencyAlert: true
  }
];

export const HealthAssistantModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onNavigate,
  contextSymptoms = []
}) => {
  const [activeTab, setActiveTab] = useState<'checker' | 'chat'>('checker');
  const [language, setLanguage] = useState<'en' | 'hi' | 'ta'>('en');

  // Symptom Checker State
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(contextSymptoms);
  const [duration, setDuration] = useState<string>('Started today');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  const [extraNotes, setExtraNotes] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [result, setResult] = useState<SymptomCheckResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Web Speech API Dictation (Speech to Text) State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [listeningTarget, setListeningTarget] = useState<'checker' | 'chat'>('checker');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [lastRecognizedSpeech, setLastRecognizedSpeech] = useState<string>('');
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [savedRecordId, setSavedRecordId] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Chat State
  const [messages, setMessages] = useState<
    { sender: 'user' | 'assistant'; text: string; timestamp: string }[]
  >([
    {
      sender: 'assistant',
      text: `Hello! I am your **CareReach Health Assistant**.\n\nYou can speak or tap your symptoms in the **Symptom Checker** tab, or ask me any question here to prepare for your doctor visit.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Stop speech when closing or changing
  useEffect(() => {
    return () => {
      stopSpeech();
      stopListening();
    };
  }, []);

  if (!isOpen) return null;

  // Toggle symptom selection
  const toggleSymptom = (symName: string) => {
    if (selectedSymptoms.includes(symName)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symName));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symName]);
    }
  };

  // Run Symptom Check via Gemini API & Automatically Save to Health Records Vault
  const handleCheckSymptoms = async () => {
    if (selectedSymptoms.length === 0) return;
    setIsChecking(true);
    stopSpeech();
    stopListening();

    try {
      const guidance = await checkSymptomsWithGemini({
        symptoms: selectedSymptoms,
        duration,
        severity,
        additionalNotes: extraNotes || lastRecognizedSpeech,
        preferredLanguage: language
      });
      setResult(guidance);

      // AUTOMATICALLY SAVE TO STUDENT HEALTH RECORDS VAULT
      try {
        const studentId = CareReachStore.getState().student.id;
        const newRecord = CareReachStore.addMedicalRecord({
          studentId,
          title: `AI Symptom Check: ${selectedSymptoms.join(', ')}`,
          category: 'SYMPTOM_ASSESSMENT',
          fileUrl: '#',
          fileName: `Symptom_Check_${new Date().toISOString().slice(0, 10)}.pdf`,
          fileSize: '45 KB',
          sharedWithDoctor: true,
          doctorNotes: `Guidance Summary: ${guidance.summary}\nSpecialist: ${guidance.recommendedDoctor}\nUrgency: ${guidance.urgencyLevel}`,
          symptomAssessment: {
            symptoms: [...selectedSymptoms],
            duration,
            severity,
            summary: guidance.summary,
            possibleCauses: guidance.possibleCauses,
            immediateCare: guidance.immediateCare,
            recommendedDoctor: guidance.recommendedDoctor,
            urgencyLevel: guidance.urgencyLevel,
            voiceDictatedNotes: extraNotes || lastRecognizedSpeech || undefined,
            language
          }
        });
        setSavedRecordId(newRecord.id);
      } catch (saveErr) {
        console.warn('Could not auto-save symptom assessment to health records:', saveErr);
      }
    } catch {
      // Fallback is handled automatically inside checkSymptomsWithGemini
    } finally {
      setIsChecking(false);
    }
  };

  // ========================================================
  // WEB SPEECH API: SPEECH RECOGNITION (DICTATION)
  // ========================================================
  const startListening = (target: 'checker' | 'chat') => {
    stopSpeech(); // Stop TTS audio if playing

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      alert('Voice dictation is supported in modern browsers like Google Chrome, Safari, and Microsoft Edge.');
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;

      // Select speech language
      if (language === 'hi') {
        recognition.lang = 'hi-IN';
      } else if (language === 'ta') {
        recognition.lang = 'ta-IN';
      } else {
        recognition.lang = 'en-IN';
      }

      setListeningTarget(target);
      setIsListening(true);
      setInterimTranscript('');

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            currentFinal += transcript + ' ';
          } else {
            currentInterim += transcript;
          }
        }

        setInterimTranscript(currentInterim);

        if (currentFinal.trim()) {
          const finalClean = currentFinal.trim();
          setLastRecognizedSpeech((prev) => (prev ? `${prev} ${finalClean}` : finalClean));

          if (target === 'checker') {
            setExtraNotes((prev) => (prev ? `${prev} ${finalClean}` : finalClean));
            // Detect and auto-select matching visual symptoms from speech
            detectSymptomsFromSpeech(finalClean);
          } else {
            setChatInput((prev) => (prev ? `${prev} ${finalClean}` : finalClean));
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setIsListening(false);
          setInterimTranscript('');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.start();
    } catch (err) {
      console.warn('Error starting speech recognition:', err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignored
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript('');
  };

  // Keyword recognizer to auto-check symptom cards as user speaks
  const detectSymptomsFromSpeech = (spokenText: string) => {
    const text = spokenText.toLowerCase();

    const triggerMap: { symptomName: string; keywords: string[] }[] = [
      {
        symptomName: 'Fever / Hot Body',
        keywords: ['fever', 'temperature', 'hot', 'warm', 'chills', 'காய்ச்சல்', 'சூடு', 'உடல் சூடு', 'बुखार', 'तपना', 'तापमान', 'ठंड']
      },
      {
        symptomName: 'Stomach Pain / Vomit',
        keywords: ['stomach', 'vomit', 'vomiting', 'loose', 'diarrhea', 'nausea', 'motion', 'belly', 'வயிறு', 'வயிற்று', 'வாந்தி', 'பேதி', 'செரியாமை', 'पेट', 'उल्टी', 'दस्त', 'पेट दर्द', 'मरोड़']
      },
      {
        symptomName: 'Headache / Dizziness',
        keywords: ['headache', 'head', 'dizzy', 'dizziness', 'faint', 'தலைவலி', 'தலைசுற்றல்', 'மயக்கம்', 'सिरदर्द', 'चक्कर', 'सिर दर्द']
      },
      {
        symptomName: 'Cough / Cold / Throat',
        keywords: ['cough', 'cold', 'throat', 'sore', 'sneeze', 'phlegm', 'இருமல்', 'சளி', 'தொண்டை', 'மூக்கடைப்பு', 'खांसी', 'जुकाम', 'गला', 'कफ', 'छींक']
      },
      {
        symptomName: 'Body & Muscle Pain',
        keywords: ['body pain', 'muscle', 'leg', 'back', 'tired', 'weak', 'உடல் வலி', 'அசதி', 'கை கால் வலி', 'बदन दर्द', 'थकान', 'कमजोरी', 'दर्द']
      },
      {
        symptomName: 'Skin Rash / Allergy',
        keywords: ['rash', 'skin', 'itch', 'itching', 'allergy', 'red', 'wound', 'அரிப்பு', 'தடிப்பு', 'காயம்', 'தோல்', 'खुजली', 'दाने', 'चोट', 'एलर्जी']
      },
      {
        symptomName: 'Chest Tightness / Breath',
        keywords: ['chest', 'breath', 'breathing', 'heavy', 'tight', 'heart', 'நெஞ்சு', 'மூச்சு', 'திணறல்', 'सीने', 'सांस', 'घबराहट']
      }
    ];

    setSelectedSymptoms((current) => {
      const updated = new Set(current);
      triggerMap.forEach((entry) => {
        if (entry.keywords.some((kw) => text.includes(kw))) {
          updated.add(entry.symptomName);
        }
      });
      return Array.from(updated);
    });
  };

  // ========================================================
  // WEB SPEECH API: TEXT TO SPEECH (READ ALOUD)
  // ========================================================
  const speakGuidance = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    stopListening();
    window.speechSynthesis.cancel(); // Clear any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Clear, reassuring pace
    utterance.pitch = 1.0;

    if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (language === 'ta') {
      utterance.lang = 'ta-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Chat message sending
  const handleSendChat = async (queryText?: string) => {
    const textToSend = queryText || chatInput;
    if (!textToSend.trim() || chatLoading) return;

    stopListening();
    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await askHealthAssistant(textToSend, {
        symptoms: selectedSymptoms,
        studentAge: 20
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'I could not process that question. Please consult with our verified campus doctor directly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleProceedToBooking = () => {
    stopSpeech();
    stopListening();
    onClose();
    if (onNavigate) {
      onNavigate('/student/appointments');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[660px] max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="p-4 bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  CareReach Symptom Guide
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
                  Voice Enabled
                </span>
              </div>
              <p className="text-xs text-sky-100 font-medium">
                {language === 'ta'
                  ? 'வாய்வழியாக சொல்லுங்கள் அல்லது தொட்டு தேர்ந்தெடுக்கவும்'
                  : language === 'hi'
                  ? 'बोलकर बताएं या छूकर लक्षण चुनें'
                  : 'Talk with voice or tap icons'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Multi-language Selector */}
            <div className="bg-black/20 rounded-xl p-1 flex items-center gap-1 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
                  language === 'en' ? 'bg-white text-slate-950 shadow' : 'text-sky-100 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
                  language === 'hi' ? 'bg-white text-slate-950 shadow' : 'text-sky-100 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
                  language === 'ta' ? 'bg-white text-slate-950 shadow' : 'text-sky-100 hover:text-white'
                }`}
              >
                தமிழ்
              </button>
            </div>

            <button
              onClick={() => {
                stopSpeech();
                stopListening();
                onClose();
              }}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 p-1.5 flex items-center border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => {
              stopSpeech();
              stopListening();
              setActiveTab('checker');
            }}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'checker'
                ? 'bg-white text-sky-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Thermometer className="h-4 w-4 text-sky-600" />
            <span>
              {language === 'ta'
                ? 'அறிகுறி பரிசோதனை (குரல் / தொடுதல்)'
                : language === 'hi'
                ? 'लक्षण जांचकर्ता (बोलें / चुनें)'
                : '1-Tap & Voice Symptom Checker'}
            </span>
          </button>
          <button
            onClick={() => {
              stopSpeech();
              stopListening();
              setActiveTab('chat');
            }}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'chat'
                ? 'bg-white text-sky-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bot className="h-4 w-4 text-indigo-600" />
            <span>
              {language === 'ta'
                ? 'கேள்விகள் கேட்க (AI Chat)'
                : language === 'hi'
                ? 'बातचीत करें (AI Chat)'
                : 'Consultation Prep Chat'}
            </span>
          </button>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="bg-amber-50 px-4 py-2 border-b border-amber-200 text-amber-950 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
            <span className="font-medium text-[11px] sm:text-xs">
              <strong>Preliminary AI Guidance:</strong> Not a medical diagnosis. Always consult a verified doctor before taking medications.
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: VISUAL & VOICE SYMPTOM CHECKER FOR ALL PEOPLE */}
        {/* ======================================================== */}
        {activeTab === 'checker' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-50 space-y-4">
            {!result ? (
              <>
                {/* Voice Dictation Accessible Callout Banner */}
                <div
                  className={`p-4 rounded-3xl border-2 transition-all ${
                    isListening
                      ? 'bg-rose-50 border-rose-400 ring-4 ring-rose-500/20 shadow-md'
                      : 'bg-gradient-to-r from-indigo-50 via-sky-50 to-emerald-50 border-indigo-200/80 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                          isListening
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-indigo-600 text-white shadow'
                        }`}
                      >
                        {isListening ? (
                          <Radio className="h-6 w-6 animate-spin-slow" />
                        ) : (
                          <Mic className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-slate-900">
                            {isListening
                              ? language === 'ta'
                                ? 'கேட்கிறது... உங்கள் அறிகுறிகளைச் சொல்லுங்கள்'
                                : language === 'hi'
                                ? 'सुन रहे हैं... अपनी तकलीफ बोलिए'
                                : 'Listening... Speak your symptoms freely'
                              : language === 'ta'
                              ? 'எழுதத் தெரியவில்லையா? வாய்வழியாக சொல்லுங்கள்!'
                              : language === 'hi'
                              ? 'लिखना नहीं चाहते? बोलकर बताएं!'
                              : 'Prefer talking over typing? Tap to dictate'}
                          </h4>
                          {isListening && (
                            <span className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-ping inline-block" />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {isListening
                            ? language === 'ta'
                              ? 'பேசி முடித்ததும் "முடிந்தது" பொத்தானைத் தொடவும்.'
                              : language === 'hi'
                              ? 'बोलने के बाद "हो गया" बटन दबाएं।'
                              : 'Speak in English, தமிழ், or हिन्दी. Icons will auto-highlight!'
                            : language === 'ta'
                            ? 'மைக் பொத்தானைத் தொட்டு உங்கள் உடல்நிலையைப் பேசுங்கள். தானாகவே அறிகுறிகள் பதிவாகும்.'
                            : language === 'hi'
                            ? 'माइक दबाएं और बताएं क्या तकलीफ है। ऐप खुद समझ लेगा।'
                            : 'Tap microphone and talk naturally. Web Speech API auto-detects keywords.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => startListening('checker')}
                        className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs shadow-md flex items-center gap-2 transition-all active:scale-95 ${
                          isListening
                            ? 'bg-rose-600 hover:bg-rose-700 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        {isListening ? (
                          <>
                            <MicOff className="h-4 w-4" />
                            <span>
                              {language === 'ta' ? 'முடிந்தது' : language === 'hi' ? 'हो गया' : 'Done Speaking'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4" />
                            <span>
                              {language === 'ta' ? 'பேச தொடங்குங்கள்' : language === 'hi' ? 'बोलना शुरू करें' : 'Start Talking'}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Live Interim Transcript Display */}
                  {(isListening || interimTranscript || lastRecognizedSpeech) && (
                    <div className="mt-3 p-3 bg-white/90 rounded-2xl border border-indigo-100 shadow-inner text-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold mb-1">
                        <span className="flex items-center gap-1.5 text-indigo-700">
                          <Radio className="h-3.5 w-3.5" />
                          <span>
                            {isListening
                              ? 'Recognizing Speech Live...'
                              : 'Recognized Spoken Symptoms:'}
                          </span>
                        </span>
                        {lastRecognizedSpeech && (
                          <button
                            type="button"
                            onClick={() => {
                              setLastRecognizedSpeech('');
                              setExtraNotes('');
                            }}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <p className="text-slate-800 font-medium italic leading-relaxed">
                        "{interimTranscript || lastRecognizedSpeech || '...'}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Step 1: Visual Symptom Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                      <span className="h-5 w-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">
                        1
                      </span>
                      <span>
                        {language === 'ta'
                          ? 'உங்களுக்கு என்ன பிரச்சனை உள்ளது? (தொட்டு தேர்ந்தெடுக்கவும்)'
                          : language === 'hi'
                          ? 'आपको क्या तकलीफ हो रही है? (चुनने के लिए टैप करें)'
                          : 'What are you feeling? (Tap icons or speak above)'}
                      </span>
                    </label>
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                      {selectedSymptoms.length} selected
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {COMMON_SYMPTOMS.map((sym) => {
                      const isSelected = selectedSymptoms.includes(sym.nameEn);
                      const symTitle =
                        language === 'ta'
                          ? sym.nameTa
                          : language === 'hi'
                          ? sym.nameHi
                          : sym.nameEn;

                      return (
                        <button
                          key={sym.id}
                          type="button"
                          onClick={() => toggleSymptom(sym.nameEn)}
                          className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between min-h-[78px] active:scale-95 ${
                            isSelected
                              ? 'border-sky-600 bg-sky-50 shadow-md ring-2 ring-sky-600/20'
                              : `${sym.color} border-slate-200`
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-2xl">{sym.icon}</span>
                            {isSelected && (
                              <CheckCircle2 className="h-4 w-4 text-sky-600 fill-sky-100" />
                            )}
                          </div>
                          <div>
                            <span className="font-extrabold text-xs text-slate-900 block leading-tight mt-1">
                              {symTitle}
                            </span>
                            {sym.isEmergencyAlert && (
                              <span className="text-[9px] font-black uppercase text-red-600 tracking-wider">
                                Urgent Alert
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Duration (How long?) */}
                <div>
                  <label className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5 mb-2">
                    <span className="h-5 w-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">
                      2
                    </span>
                    <span>
                      {language === 'ta'
                        ? 'எத்தனை நாட்களாக இந்த தொந்தரவு உள்ளது?'
                        : language === 'hi'
                        ? 'यह परेशानी कितने समय से है?'
                        : 'Since when did it start?'}
                    </span>
                  </label>

                  <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                    {[
                      {
                        value: 'Started today',
                        labelEn: '⏱️ Started Today',
                        labelHi: '⏱️ आज से ही',
                        labelTa: '⏱️ இன்று தொடங்கியது'
                      },
                      {
                        value: '2 to 3 days',
                        labelEn: '🗓️ 2-3 Days',
                        labelHi: '🗓️ 2-3 दिन से',
                        labelTa: '🗓️ 2-3 நாட்களாக'
                      },
                      {
                        value: 'Over a week',
                        labelEn: '📅 Over a Week',
                        labelHi: '📅 एक हफ्ते से ज्यादा',
                        labelTa: '📅 ஒரு வாரத்திற்கு மேல்'
                      }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setDuration(opt.value)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          duration === opt.value
                            ? 'border-sky-600 bg-sky-600 text-white shadow'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {language === 'ta'
                          ? opt.labelTa
                          : language === 'hi'
                          ? opt.labelHi
                          : opt.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Visual Discomfort Level */}
                <div>
                  <label className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5 mb-2">
                    <span className="h-5 w-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">
                      3
                    </span>
                    <span>
                      {language === 'ta'
                        ? 'எவ்வளவு சிரமமாக உணர்கிறீர்கள்?'
                        : language === 'hi'
                        ? 'तकलीफ कितनी ज्यादा महसूस हो रही है?'
                        : 'How uncomfortable does it feel?'}
                    </span>
                  </label>

                  <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                    {[
                      {
                        key: 'mild' as const,
                        label: '🙂 Mild / லேசானது / हल्का',
                        desc: 'Can walk and study'
                      },
                      {
                        key: 'moderate' as const,
                        label: '😐 Medium / மிதமானது / मध्यम',
                        desc: 'Need bed rest'
                      },
                      {
                        key: 'severe' as const,
                        label: '😣 Severe / கடுமையானது / बहुत तेज',
                        desc: 'Hard to move or sleep'
                      }
                    ].map((s) => (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => setSeverity(s.key)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          severity === s.key
                            ? 'border-sky-600 bg-sky-50 text-sky-950 ring-2 ring-sky-600/20'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block font-black text-xs">{s.label}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{s.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleCheckSymptoms}
                    disabled={selectedSymptoms.length === 0 || isChecking}
                    className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-extrabold rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-98 text-sm"
                  >
                    {isChecking ? (
                      <>
                        <Sparkles className="h-5 w-5 animate-spin" />
                        <span>
                          {language === 'ta'
                            ? 'AI பரிசோதனை செய்கிறது...'
                            : language === 'hi'
                            ? 'AI जांच कर रहा है...'
                            : 'Checking with Gemini AI...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 text-amber-300" />
                        <span>
                          {language === 'ta'
                            ? 'எனக்கான முதற்கட்ட ஆலோசனை பெறுக'
                            : language === 'hi'
                            ? 'शुरुआती मार्गदर्शन देखें'
                            : 'Get Simple Preliminary Guidance'}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-slate-400 mt-2 font-medium">
                    Fast & confidential. Tailored for hostel students and campus clinics.
                  </p>
                </div>
              </>
            ) : (
              /* RESULTS VIEW: Simple, reassuring, voice-enabled, action-oriented */
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Automatic Health Record Vault Save Banner */}
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs text-emerald-950 font-medium shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-xl bg-emerald-600 text-white shrink-0 shadow-sm">
                      <BookmarkCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-extrabold block text-emerald-950">
                        {language === 'ta'
                          ? 'மருத்துவ வரலாற்றில் தானாகச் சேமிக்கப்பட்டது'
                          : language === 'hi'
                          ? 'स्वास्थ्य इतिहास में अपने-आप सहेजा गया'
                          : 'Automatically Saved to Health Records Vault'}
                      </span>
                      <span className="text-[11px] text-emerald-700 leading-tight block mt-0.5">
                        {language === 'ta'
                          ? 'உங்கள் உடல்நலப் பதிவுகள் காலப்போக்கில் கண்காணிக்க இந்த அறிக்கை பாதுகாப்பாக வைக்கப்பட்டுள்ளது.'
                          : language === 'hi'
                          ? 'आपकी बीमारी का इतिहास समय के साथ ट्रैक करने के लिए इसे सुरक्षित रख लिया गया है।'
                          : 'This evaluation is safely archived so you and your doctor can track symptoms over time.'}
                      </span>
                    </div>
                  </div>
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => {
                        stopSpeech();
                        stopListening();
                        onClose();
                        onNavigate('/student/records');
                      }}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-[11px] shrink-0 flex items-center gap-1 transition-all shadow-sm active:scale-95"
                    >
                      <History className="h-3.5 w-3.5" />
                      <span>{language === 'ta' ? 'வரலாறு பார்க்க' : language === 'hi' ? 'इतिहास देखें' : 'View History'}</span>
                    </button>
                  )}
                </div>

                {/* Urgency Badge & Voice Read-Aloud Button */}
                <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                          result.urgencyLevel === 'EMERGENCY_NOW'
                            ? 'bg-red-100 text-red-700 border border-red-300'
                            : result.urgencyLevel === 'SAME_DAY_URGENT'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {result.urgencyLevel === 'EMERGENCY_NOW'
                          ? '🚨 Immediate Emergency Attention'
                          : result.urgencyLevel === 'SAME_DAY_URGENT'
                          ? '⚡ Same-Day Clinic Visit Advised'
                          : '✅ Non-Emergency: Routine Consultation'}
                      </span>
                    </div>

                    {/* Big Audio Read Aloud Button for Non-Literate / Visually Impaired */}
                    <button
                      type="button"
                      onClick={() => speakGuidance(result.plainSpeechText)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                        isSpeaking
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                      title="Read aloud in clear speech"
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="h-4 w-4" />
                          <span>Stop Audio</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-4 w-4" />
                          <span>
                            {language === 'ta' ? 'குரலில் கேட்க' : language === 'hi' ? 'सुनें' : 'Read Aloud'}
                          </span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Summary */}
                  <div className="mt-3">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                      {language === 'ta'
                        ? 'இது எதனால் இருக்கலாம்?'
                        : language === 'hi'
                        ? 'यह क्या हो सकता है?'
                        : 'What this usually means:'}
                    </h4>
                    <p className="mt-1 text-sm font-semibold text-slate-900 leading-relaxed">
                      {result.summary}
                    </p>
                  </div>

                  {/* Possible Causes in Simple Language */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.possibleCauses.map((cause, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 flex items-start gap-2"
                      >
                        <Info className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                        <span>{cause}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safe First-Aid Steps */}
                <div className="bg-emerald-50 rounded-3xl p-4 border border-emerald-200">
                  <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>
                      {language === 'ta'
                        ? 'இப்போது நீங்கள் செய்ய வேண்டியவை:'
                        : language === 'hi'
                        ? 'अभी आप घर या हॉस्टल में क्या करें:'
                        : 'Safe steps you can do right now:'}
                    </span>
                  </h4>
                  <ul className="mt-2 space-y-1.5">
                    {result.immediateCare.map((step, idx) => (
                      <li key={idx} className="text-xs text-emerald-950 font-medium flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Doctor Type */}
                <div className="bg-white rounded-2xl p-3 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                      <Stethoscope className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-bold block">
                        Recommended Specialist
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        {result.recommendedDoctor}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                    Campus Network
                  </span>
                </div>

                {/* Primary Action: Book Appointment */}
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={handleProceedToBooking}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm active:scale-98"
                  >
                    <Calendar className="h-5 w-5" />
                    <span>
                      {language === 'ta'
                        ? 'மருத்துவர் முன்பதிவு செய்ய தொடரவும்'
                        : language === 'hi'
                        ? 'डॉक्टर से अपॉइंटमेंट बुक करें'
                        : 'Proceed to Book Doctor Appointment'}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      stopSpeech();
                      stopListening();
                      setResult(null);
                    }}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Check Different Symptoms</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: INTERACTIVE AI CONVERSATION & PREP CHAT */}
        {/* ======================================================== */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${
                    m.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold ${
                      m.sender === 'user' ? 'bg-sky-600' : 'bg-indigo-600'
                    }`}
                  >
                    {m.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      m.sender === 'user'
                        ? 'bg-sky-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>
                    <span
                      className={`text-[10px] block mt-1.5 ${
                        m.sender === 'user' ? 'text-sky-200 text-right' : 'text-slate-400'
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs">
                    <Bot className="h-4 w-4 animate-spin-slow" />
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce delay-150" />
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce delay-300" />
                    <span className="text-xs text-slate-500 ml-1">Answering with Gemini AI...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                'Questions to ask my doctor',
                'What should I monitor with fever?',
                'Mess food allergy advice',
                'When should I go to hospital?'
              ].map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSendChat(s)}
                  className="text-[11px] whitespace-nowrap bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 px-3 py-1 rounded-full border border-slate-200 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input Bar with Voice Dictation */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder={
                  isListening && listeningTarget === 'chat'
                    ? 'Listening... Speak your question now'
                    : 'Type or tap mic to speak your question...'
                }
                className={`flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  isListening && listeningTarget === 'chat'
                    ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-500/20 text-rose-900 font-medium'
                    : 'bg-slate-50 border-slate-200'
                }`}
              />

              {/* Dictation Mic Button in Chat Input */}
              <button
                type="button"
                onClick={() => startListening('chat')}
                className={`p-2.5 rounded-xl transition-all shadow ${
                  isListening && listeningTarget === 'chat'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title={isListening ? 'Stop listening' : 'Dictate with voice'}
              >
                {isListening && listeningTarget === 'chat' ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </button>

              <button
                onClick={() => handleSendChat()}
                disabled={!chatInput.trim() || chatLoading}
                className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white transition-all shadow"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
