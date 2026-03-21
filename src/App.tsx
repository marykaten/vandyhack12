/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  LayoutDashboard, 
  PieChart, 
  TrendingUp, 
  Lightbulb, 
  ShieldCheck, 
  Loader2, 
  Send,
  RefreshCcw,
  Wallet,
  ArrowRight,
  Zap,
  Lock,
  BarChart3,
  ChevronDown,
  Github,
  Twitter,
  AlertCircle,
  BrainCircuit,
  Target,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImpulseSignal {
  description: string;
  evidence: string;
  confidence: 'low' | 'medium' | 'high';
}

interface Recommendation {
  action: string;
  reason: string;
}

interface FinancialPersonality {
  type: string;
  mbti_equivalent: string;
  description: string;
  traits: string[];
}

interface CompatibilityInsight {
  type: string;
  relationship: string;
  match_score: number;
  advice: string;
}

interface BehaviorAnalysis {
  behavior_summary: string;
  detected_patterns: string[];
  impulse_signals: ImpulseSignal[];
  key_insight: string;
  recommendations: Recommendation[];
  future_projection: {
    warning: string;
    improvement: string;
  };
  encouragement: string;
  financial_personality: FinancialPersonality;
  compatibility_insights: CompatibilityInsight[];
}

const SAMPLE_DATA = `2024-03-01: Coffee Shop - $5.50
2024-03-01: Amazon - $12.99
2024-03-02: Local Bookstore - $42.00
2024-03-02: Uber - $15.20
2024-03-03: Coffee Shop - $5.50
2024-03-03: Steam Games - $59.99
2024-03-04: Whole Foods - $85.50
2024-03-05: Uber - $18.50
2024-03-05: Coffee Shop - $5.50
2024-03-06: Amazon - $124.50
2024-03-07: Rent Payment - $1800.00
2024-03-08: Coffee Shop - $5.50
2024-03-08: Netflix Subscription - $15.99
2024-03-09: Uber - $12.00
2024-03-10: Fine Dining - $145.00
2024-03-11: Amazon - $15.00
2024-03-12: Uber - $25.00
2024-03-13: Coffee Shop - $5.50
2024-03-14: Charity Donation - $50.00
2024-03-15: Grocery Store - $85.00
2024-03-15: Uber - $10.00`;

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="p-8 bg-white rounded-3xl border border-black/5 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
      <Icon className="w-6 h-6 text-indigo-600" />
    </div>
    <h3 className="text-lg font-bold mb-3">{title}</h3>
    <p className="text-black/50 text-sm leading-relaxed">{description}</p>
  </div>
);

export default function App() {
  const [spendingData, setSpendingData] = useState(SAMPLE_DATA);
  const [analysis, setAnalysis] = useState<BehaviorAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const toolRef = useRef<HTMLDivElement>(null);

  const scrollToTool = () => {
    toolRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateInsights = async () => {
    if (!spendingData.trim()) {
      setError("Please provide some spending data first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are an AI financial behavior analyst for a hackathon project.

Your goal is NOT just to summarize spending, but to detect patterns, habits, and potentially impulsive behaviors in a user's financial activity.
You must also assign the user a "Financial Personality Type" (similar to MBTI) based on their spending habits.

Follow these steps carefully:

1. Analyze the spending data by category and frequency.
2. Identify behavioral patterns such as:
   - repeated purchases in the same category over short periods
   - unusually high spending in specific categories
   - patterns tied to time (e.g., frequent small purchases)
   - "impulse-like" behavior (many small or repeated transactions)

3. Detect at least ONE "behavioral signal", such as:
   - impulse spending
   - habit-based overspending
   - inconsistent spending patterns

4. Assign a "Financial Personality Type" (e.g., "The Spontaneous Explorer", "The Disciplined Guardian", "The Strategic Architect") and provide an MBTI equivalent (e.g., ENFP, ISTJ).

5. Provide "Compatibility Insights" with other financial types. How does this user's type interact with a "Disciplined Guardian" or a "Spontaneous Explorer"? Provide 2-3 specific insights with a "match_score" (0-100).

6. Do NOT invent data. Only use what is provided.
7. Do NOT give investment, legal, or tax advice.
8. Keep tone supportive, not judgmental.
9. Focus on helping the user improve habits, not just cut spending.

---

Output in EXACT JSON format:

{
  "financial_personality": {
    "type": "Creative Name for the Personality",
    "mbti_equivalent": "MBTI Code (e.g. ENFP)",
    "description": "1-2 sentence description of this financial personality",
    "traits": ["Trait 1", "Trait 2", "Trait 3"]
  },

  "compatibility_insights": [
    {
      "type": "Other Personality Type Name",
      "relationship": "Synergy | Friction | Balance",
      "match_score": 85,
      "advice": "How these two types can work together financially"
    }
  ],

  "behavior_summary": "2–3 sentence explanation of spending behavior patterns",

  "detected_patterns": [
    "Clear description of 2–3 detected behavioral patterns"
  ],

  "impulse_signals": [
    {
      "description": "What behavior suggests impulse spending",
      "evidence": "Reference to the data (category/frequency/amount)",
      "confidence": "low | medium | high"
    }
  ],

  "key_insight": "One strong, memorable insight about the user's behavior",

  "recommendations": [
    {
      "action": "Specific action the user can take",
      "reason": "Why this helps based on their behavior"
    },
    {
      "action": "Specific action",
      "reason": "Why it helps"
    },
    {
      "action": "Specific action",
      "reason": "Why it helps"
    }
  ],

  "future_projection": {
    "warning": "If this behavior continues, what might happen",
    "improvement": "If they adjust behavior, what could improve"
  },

  "encouragement": "One short supportive sentence"
}

---

Rules:
- detected_patterns: 2–3 items
- impulse_signals: at least 1 item
- recommendations: exactly 3
- Be specific (no vague advice like 'spend less')
- Tie every insight to actual data
- Use simple, clear language

---

Spending data:
${spendingData}`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              financial_personality: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  mbti_equivalent: { type: Type.STRING },
                  description: { type: Type.STRING },
                  traits: { 
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ['type', 'mbti_equivalent', 'description', 'traits']
              },
              compatibility_insights: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING },
                    relationship: { type: Type.STRING },
                    match_score: { type: Type.NUMBER },
                    advice: { type: Type.STRING }
                  },
                  required: ['type', 'relationship', 'match_score', 'advice']
                }
              },
              behavior_summary: { type: Type.STRING },
              detected_patterns: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              impulse_signals: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    description: { type: Type.STRING },
                    evidence: { type: Type.STRING },
                    confidence: { type: Type.STRING, enum: ['low', 'medium', 'high'] }
                  },
                  required: ['description', 'evidence', 'confidence']
                }
              },
              key_insight: { type: Type.STRING },
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    action: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  },
                  required: ['action', 'reason']
                }
              },
              future_projection: {
                type: Type.OBJECT,
                properties: {
                  warning: { type: Type.STRING },
                  improvement: { type: Type.STRING }
                },
                required: ['warning', 'improvement']
              },
              encouragement: { type: Type.STRING }
            },
            required: [
              'financial_personality',
              'compatibility_insights',
              'behavior_summary', 
              'detected_patterns', 
              'impulse_signals', 
              'key_insight', 
              'recommendations', 
              'future_projection', 
              'encouragement'
            ]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        setAnalysis(parsed);
      }
    } catch (err) {
      console.error("Error generating insights:", err);
      setError("Failed to generate insights. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setSpendingData("");
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] font-sans selection:bg-emerald-100 scroll-smooth">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-black/5 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
              <BrainCircuit className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">FinSight</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-black/60 hover:text-black transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-black/60 hover:text-black transition-colors">How it Works</a>
            <a href="#demo" className="text-sm font-medium text-black/60 hover:text-black transition-colors">Live Demo</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={scrollToTool}
              className="px-5 py-2.5 bg-[#1A1A1A] text-white rounded-full text-sm font-semibold hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/5"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> Discover Your Financial MBTI
            </div>
            <h1 className="text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              What's your <span className="text-indigo-600">money personality</span>?
            </h1>
            <p className="text-xl text-black/50 leading-relaxed max-w-lg">
              FinSight uses behavioral psychology and AI to decode your spending habits. Discover your financial archetype and master your money.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={scrollToTool}
                className="px-8 py-4 bg-[#1A1A1A] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-black/10 group"
              >
                Try the Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-4 px-6 py-4">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-100">
                      <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <div className="text-sm text-black/40 font-medium">
                  Trusted by <span className="text-black font-bold">2,000+</span> early users
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-black/5 relative z-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-black/30 uppercase tracking-widest">Monthly Spending</p>
                    <p className="text-3xl font-bold">$3,420.00</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <TrendingUp className="text-white w-6 h-6" />
                  </div>
                </div>
                <div className="h-40 w-full bg-indigo-50/50 rounded-2xl flex items-end gap-2 p-4">
                  {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                    <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-indigo-600/20 rounded-lg hover:bg-indigo-600 transition-colors cursor-pointer" />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest mb-1">Personality Type</p>
                    <p className="font-bold">The Strategic Architect</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest mb-1">MBTI Match</p>
                    <p className="font-bold text-indigo-600">INTJ</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-400/10 blur-3xl rounded-full -z-10" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-400/10 blur-3xl rounded-full -z-10" />
          </motion.div>
        </div>
        <div className="flex justify-center mt-20 animate-bounce">
          <ChevronDown className="text-black/20 w-8 h-8" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold tracking-tight">Everything you need to master your budget.</h2>
            <p className="text-black/50">We built FinSight to be the simplest way to understand where your money goes every month.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Zap}
              title="Instant AI Analysis"
              description="Paste your raw transaction data and get a structured breakdown in seconds. No manual tagging required."
            />
            <FeatureCard 
              icon={Lock}
              title="Privacy First"
              description="We don't store your bank credentials. Your data is processed securely and stays under your control."
            />
            <FeatureCard 
              icon={BarChart3}
              title="Actionable Insights"
              description="Get specific recommendations on where you can save, tailored to your unique spending habits."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <h2 className="text-4xl font-bold tracking-tight">Three steps to clarity.</h2>
              <div className="space-y-8">
                {[
                  { step: "01", title: "Copy your transactions", desc: "Export your monthly summary from your bank app or just copy the text." },
                  { step: "02", title: "Paste into FinSight", desc: "Our AI engine reads through the noise to find the patterns that matter." },
                  { step: "03", title: "Get your game plan", desc: "Receive a supportive, non-judgmental analysis with clear savings goals." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <span className="text-4xl font-black text-indigo-600/20 font-mono">{item.step}</span>
                    <div className="space-y-2">
                      <h4 className="text-xl font-bold">{item.title}</h4>
                      <p className="text-black/50 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#1A1A1A] rounded-[40px] p-12 text-white space-y-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="space-y-4 font-mono text-sm text-indigo-400/80">
                <p>&gt; Analyzing 42 transactions...</p>
                <p>&gt; Categorizing spending...</p>
                <p>&gt; Identifying recurring subscriptions...</p>
                <p>&gt; Calculating savings potential...</p>
                <p className="text-white">&gt; Analysis complete. View results below.</p>
              </div>
              <div className="pt-8 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/40 text-xs uppercase tracking-widest">Efficiency Score</span>
                  <span className="text-indigo-400 font-bold">84%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[84%] bg-indigo-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Tool Section (Demo) */}
      <section id="demo" ref={toolRef} className="py-32 px-6 bg-indigo-50/30 border-y border-indigo-100">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Try it for yourself.</h2>
            <p className="text-black/50">Paste your transaction data below to see the AI in action.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Input */}
            <div className="lg:col-span-5 space-y-8">
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest text-black/40 flex items-center gap-2">
                    <LayoutDashboard className="w-3 h-3" /> Transaction Data
                  </label>
                  <button 
                    onClick={() => setSpendingData(SAMPLE_DATA)}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Load Sample
                  </button>
                </div>
                <div className="relative group">
                  <textarea
                    value={spendingData}
                    onChange={(e) => setSpendingData(e.target.value)}
                    placeholder="Paste your spending summary here (e.g., Rent: $1200, Food: $400...)"
                    className="w-full h-80 p-6 bg-white rounded-2xl border border-black/5 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none font-mono text-sm leading-relaxed"
                    id="spending-input"
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button 
                      onClick={reset}
                      className="p-2 text-black/40 hover:text-black/60 transition-colors"
                      title="Clear"
                    >
                      <RefreshCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </section>

              <button
                onClick={generateInsights}
                disabled={isLoading}
                className="w-full py-4 bg-[#1A1A1A] text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/10 active:scale-[0.98]"
                id="generate-button"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Data...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Generate Insights
                  </>
                )}
              </button>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm"
                >
                  {error}
                </motion.div>
              )}
            </div>

            {/* Right Column: Output */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {!analysis && !isLoading ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-black/10 rounded-3xl bg-white/50"
                  >
                    <div className="bg-white p-4 rounded-2xl shadow-sm mb-6">
                      <BrainCircuit className="w-8 h-8 text-black/20" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Behavioral Analysis Ready</h3>
                    <p className="text-black/40 text-sm max-w-xs">
                      Paste your transaction data on the left to uncover spending patterns and behavioral habits.
                    </p>
                  </motion.div>
                ) : isLoading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl shadow-sm border border-black/5"
                  >
                    <div className="relative w-16 h-16 mb-6">
                      <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Analyzing Behavioral Patterns</h3>
                    <p className="text-black/40 text-sm max-w-xs">
                      Our AI is scanning for impulse signals and habit-based trends...
                    </p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden"
                  >
                    <div className="p-8 border-b border-black/5 bg-indigo-50/30">
                      <div className="flex items-center gap-3 mb-2">
                        <BrainCircuit className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-xl font-bold">Financial Personality Profile</h2>
                      </div>
                      <p className="text-sm text-black/50">Your behavioral DNA, decoded by AI.</p>
                    </div>
                    
                    <div className="p-8 space-y-10">
                      {/* Personality Section */}
                      <section className="p-8 bg-indigo-600 rounded-[32px] text-white space-y-6 relative overflow-hidden">
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Financial Archetype</span>
                            <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
                              {analysis?.financial_personality.mbti_equivalent} Equivalent
                            </span>
                          </div>
                          <h3 className="text-3xl font-bold mb-3">{analysis?.financial_personality.type}</h3>
                          <p className="text-indigo-100 text-sm leading-relaxed mb-6">
                            {analysis?.financial_personality.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {analysis?.financial_personality.traits.map((trait, i) => (
                              <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/10">
                                {trait}
                              </span>
                            ))}
                          </div>
                        </div>
                        <BrainCircuit className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 -rotate-12" />
                      </section>

                      {/* Compatibility Section */}
                      <section className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 flex items-center gap-2">
                          <RefreshCcw className="w-3 h-3" /> Compatibility Insights
                        </h3>
                        <div className="grid gap-4">
                          {analysis?.compatibility_insights.map((insight, i) => (
                            <div key={i} className="p-5 border border-indigo-100 bg-indigo-50/20 rounded-2xl space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Partner Type</span>
                                  <p className="font-bold text-sm text-indigo-900">{insight.type}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Match Score</span>
                                  <p className="font-bold text-sm text-indigo-600">{insight.match_score}%</p>
                                </div>
                              </div>
                              
                              <div className="h-1.5 w-full bg-indigo-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${insight.match_score}%` }}
                                  className={`h-full ${
                                    insight.match_score > 80 ? 'bg-emerald-500' :
                                    insight.match_score > 50 ? 'bg-blue-500' :
                                    'bg-orange-500'
                                  }`}
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                  insight.relationship === 'Synergy' ? 'bg-emerald-50 text-emerald-600' :
                                  insight.relationship === 'Balance' ? 'bg-blue-50 text-blue-600' :
                                  'bg-orange-50 text-orange-600'
                                }`}>
                                  {insight.relationship}
                                </span>
                              </div>
                              <p className="text-xs text-indigo-900/60 leading-relaxed">{insight.advice}</p>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Summary */}
                      <section className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 flex items-center gap-2">
                          <LayoutDashboard className="w-3 h-3" /> Behavior Summary
                        </h3>
                        <p className="text-sm leading-relaxed text-black/70">
                          {analysis?.behavior_summary}
                        </p>
                      </section>

                      {/* Patterns */}
                      <section className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 flex items-center gap-2">
                          <Target className="w-3 h-3" /> Detected Patterns
                        </h3>
                        <div className="grid gap-3">
                          {analysis?.detected_patterns.map((pattern, i) => (
                            <div key={i} className="p-4 bg-gray-50 rounded-2xl text-sm text-black/70 border border-black/5">
                              {pattern}
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Impulse Signals */}
                      <section className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 flex items-center gap-2">
                          <AlertCircle className="w-3 h-3" /> Impulse Signals
                        </h3>
                        <div className="space-y-3">
                          {analysis?.impulse_signals.map((signal, i) => (
                            <div key={i} className="p-5 border border-black/5 rounded-2xl space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-sm">{signal.description}</span>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                                  signal.confidence === 'high' ? 'bg-red-50 text-red-600' :
                                  signal.confidence === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                                  'bg-blue-50 text-blue-600'
                                }`}>
                                  {signal.confidence} confidence
                                </span>
                              </div>
                              <p className="text-xs text-black/50 italic">Evidence: {signal.evidence}</p>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Key Insight */}
                      <section className="p-6 bg-indigo-600 rounded-2xl text-white relative overflow-hidden">
                        <div className="relative z-10 space-y-2">
                          <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <Sparkles className="w-3 h-3" /> Key Insight
                          </h3>
                          <p className="text-lg font-bold leading-tight">
                            "{analysis?.key_insight}"
                          </p>
                        </div>
                        <Sparkles className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12" />
                      </section>

                      {/* Recommendations */}
                      <section className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 flex items-center gap-2">
                          <ShieldCheck className="w-3 h-3" /> Recommendations
                        </h3>
                        <div className="space-y-4">
                          {analysis?.recommendations.map((rec, i) => (
                            <div key={i} className="flex gap-4">
                              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600 font-bold text-xs">
                                {i + 1}
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-bold">{rec.action}</p>
                                <p className="text-xs text-black/50 leading-relaxed">{rec.reason}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Projections */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 bg-red-50/50 rounded-2xl border border-red-100 space-y-2">
                          <h4 className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Warning</h4>
                          <p className="text-xs text-red-900/70 leading-relaxed">{analysis?.future_projection.warning}</p>
                        </div>
                        <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
                          <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Growth</h4>
                          <p className="text-xs text-emerald-900/70 leading-relaxed">{analysis?.future_projection.improvement}</p>
                        </div>
                      </div>

                      {/* Encouragement */}
                      <p className="text-center text-sm font-medium text-black/40 italic pt-4">
                        {analysis?.encouragement}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-indigo-600 rounded-[40px] p-12 lg:p-20 text-center space-y-8 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">Ready to meet your financial self?</h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto">Join thousands of users who are discovering their financial personality with FinSight.</p>
            <button 
              onClick={scrollToTool}
              className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-900/10 active:scale-95"
            >
              Get Started for Free
            </button>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-black/5 py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-xl">
                <BrainCircuit className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">FinSight</span>
            </div>
            <p className="text-black/40 text-sm leading-relaxed">
              Decoding financial behavior through AI and psychology. Built for hackathons, designed for real life.
            </p>
            <div className="flex items-center gap-4">
              <Twitter className="w-5 h-5 text-black/20 hover:text-indigo-600 cursor-pointer transition-colors" />
              <Github className="w-5 h-5 text-black/20 hover:text-indigo-600 cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-black/40 font-medium">
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">Features</li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">Security</li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">Pricing</li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">API</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-black/40 font-medium">
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">About</li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">Careers</li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">Blog</li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">Privacy</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Newsletter</h4>
            <p className="text-sm text-black/40 mb-4">Get the latest financial tips delivered to your inbox.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email" 
                className="bg-gray-50 border border-black/5 rounded-xl px-4 py-2 text-sm flex-1 outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-black/30 font-medium uppercase tracking-widest">
            &copy; 2026 FinSight &bull; All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-black/30 font-medium uppercase tracking-widest">
            <span className="hover:text-black cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-black cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-black cursor-pointer transition-colors">Cookies</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
