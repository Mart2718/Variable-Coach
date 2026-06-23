import React, { useState, useEffect } from "react";
import { presetScenarios } from "./scenariosData";
import { Scenario, VariableType, VariableRole } from "./types";
import MathTestWidget from "./components/MathTestWidget";
import VisualAnalogyWidget from "./components/VisualAnalogyWidget";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap,
  Coffee,
  Dumbbell,
  BookOpen,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  Cpu,
  BookmarkCheck,
  Compass,
  ArrowLeftRight,
  X,
  Info
} from "lucide-react";

export default function App() {
  // Scenario states
  const [scenarios, setScenarios] = useState<Scenario[]>(presetScenarios);
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const currentScenario = scenarios[activeScenarioIdx] || scenarios[0];

  // Active step state
  const [currentStep, setCurrentStep] = useState<
    "intro" | "classify_v1" | "classify_v2" | "explanatory_vs_response" | "completed"
  >("intro");

  // User input answers
  const [userV1Type, setUserV1Type] = useState<VariableType | null>(null);
  const [userV2Type, setUserV2Type] = useState<VariableType | null>(null);
  const [userExplanatoryIdx, setUserExplanatoryIdx] = useState<number | null>(null);

  // Error logging / showing feedback
  const [v1Correct, setV1Correct] = useState<boolean | null>(null);
  const [v2Correct, setV2Correct] = useState<boolean | null>(null);
  const [associationCorrect, setAssociationCorrect] = useState<boolean | null>(null);

  // Toggle widgets
  const [v1ShowMath, setV1ShowMath] = useState(false);
  const [v1ShowAnalogy, setV1ShowAnalogy] = useState(false);
  const [v2ShowMath, setV2ShowMath] = useState(false);
  const [v2ShowAnalogy, setV2ShowAnalogy] = useState(false);

  // Mascot dynamic avatar states
  const [mascotMood, setMascotMood] = useState<"encouraging" | "puzzled" | "philosophical" | "celebrating">("encouraging");
  const [mascotDialogue, setMascotDialogue] = useState<string>("");

  // Score system
  const [totalQuizzesSolved, setTotalQuizzesSolved] = useState(0);
  const [showGuide, setShowGuide] = useState(true);

  // Auto dialogue updating on step shift
  useEffect(() => {
    updateMascotAndPrompts();
  }, [currentStep, activeScenarioIdx, v1Correct, v2Correct, associationCorrect]);

  const updateMascotAndPrompts = () => {
    if (!currentScenario) return;

    const v1 = currentScenario.variables[0];
    const v2 = currentScenario.variables[1];

    switch (currentStep) {
      case "intro":
        setMascotMood("encouraging");
        setMascotDialogue(
          `Greetings, Statistician in training! Today we are exploring "${currentScenario.title}". Read the research question: "${currentScenario.researchQuestion}" Let's break down this real-world setup.`
        );
        break;

      case "classify_v1":
        if (v1Correct === null) {
          setMascotMood("philosophical");
          setMascotDialogue(
            `Let's start our cataloguing. Look at Variable 1: "${v1.name}". What kind of data is this? Is it continuous, countable physical amounts (Quantitative) or named description classes (Categorical)?`
          );
        } else if (v1Correct === false) {
          setMascotMood("puzzled");
          setMascotDialogue(
            `Ah, not quite! But that is a common speed bump. Let's do a little Math Test or look at the Visual Analogy drawer below to help see why.`
          );
        } else {
          setMascotMood("encouraging");
          setMascotDialogue(
            `Magnificent! "${v1.name}" is indeed ${v1.type}. Notice how we can describe its traits. Ready to handle Variable 2?`
          );
        }
        break;

      case "classify_v2":
        if (v2Correct === null) {
          setMascotMood("philosophical");
          setMascotDialogue(
            `Perfect! Next up, let's analyze Variable 2: "${v2.name}". Think carefully: can you average these records, or are they descriptive labels?`
          );
        } else if (v2Correct === false) {
          setMascotMood("puzzled");
          setMascotDialogue(
            `Close! But let's verify. Ask yourself: if you average the values, does that physically mean anything? Check out the Math Test or Analogy!`
          );
        } else {
          setMascotMood("encouraging");
          setMascotDialogue(
            `Spot on! "${v2.name}" is classified as ${v2.type}. We've catalogued both variables successfully. Next, let's outline cause and effect!`
          );
        }
        break;

      case "explanatory_vs_response":
        if (associationCorrect === null) {
          setMascotMood("philosophical");
          setMascotDialogue(
            `Excellent work! Now let's explore cause & effect. One variable is the 'independent driver' (Explanatory) and the other is the resulting 'experimental outcome' (Response). Who drives who?`
          );
        } else if (associationCorrect === false) {
          setMascotMood("puzzled");
          setMascotDialogue(
            `Wait! Let&apos;s evaluate the relationship index. Ask yourself: does altering the outcome magically rewind time to change the driver? Or does the driver cause the outcome?`
          );
        } else {
          setMascotMood("celebrating");
          setMascotDialogue(
            `Incredible reasoning! You correctly established the statistical channel. You're ready to design physical studies.`
          );
        }
        break;

      case "completed":
        setMascotMood("celebrating");
        setMascotDialogue(
          `Splendid! You have completely solved "${currentScenario.title}" workbook! You've learned how ${v1.name} and ${v2.name} connect. Practice on another study to sharpen your skills!`
        );
        break;
    }
  };

  // Selection actions
  const handleV1Classification = (type: VariableType) => {
    setUserV1Type(type);
    const correct = type === currentScenario.variables[0].type;
    setV1Correct(correct);

    if (correct) {
      setV1ShowMath(false);
      setV1ShowAnalogy(false);
      // Wait shortly for positive reinforcement before progressing
      setTimeout(() => {
        setCurrentStep("classify_v2");
      }, 1400);
    } else {
      // Auto expand help for educational assistance
      setV1ShowMath(true);
      setV1ShowAnalogy(true);
    }
  };

  const handleV2Classification = (type: VariableType) => {
    setUserV2Type(type);
    const correct = type === currentScenario.variables[1].type;
    setV2Correct(correct);

    if (correct) {
      setV2ShowMath(false);
      setV2ShowAnalogy(false);
      setTimeout(() => {
        setCurrentStep("explanatory_vs_response");
      }, 1400);
    } else {
      setV2ShowMath(true);
      setV2ShowAnalogy(true);
    }
  };

  const handleSubmitAssociation = () => {
    if (userExplanatoryIdx === null) return;
    const correct = userExplanatoryIdx === currentScenario.explanatoryIndex;
    setAssociationCorrect(correct);

    if (correct) {
      setTimeout(() => {
        setCurrentStep("completed");
        setTotalQuizzesSolved((prev) => prev + 1);
      }, 1500);
    }
  };

  // Reset current scenario workbook
  const handleResetScenario = () => {
    setUserV1Type(null);
    setUserV2Type(null);
    setUserExplanatoryIdx(null);
    setV1Correct(null);
    setV2Correct(null);
    setAssociationCorrect(null);
    setV1ShowMath(false);
    setV1ShowAnalogy(false);
    setV2ShowMath(false);
    setV2ShowAnalogy(false);
    setCurrentStep("intro");
  };

  // Select another scenario
  const handleSelectScenario = (idx: number) => {
    setActiveScenarioIdx(idx);
    setUserV1Type(null);
    setUserV2Type(null);
    setUserExplanatoryIdx(null);
    setV1Correct(null);
    setV2Correct(null);
    setAssociationCorrect(null);
    setV1ShowMath(false);
    setV1ShowAnalogy(false);
    setV2ShowMath(false);
    setV2ShowAnalogy(false);
    setCurrentStep("intro");
  };

  // Mascot Emoticon Helper based on mood
  const getMascotEmote = () => {
    switch (mascotMood) {
      case "encouraging":
        return "👋😄";
      case "puzzled":
        return "🤔💡";
      case "philosophical":
        return "🎓👨‍🏫";
      case "celebrating":
        return "🎉🏆";
      default:
        return "🎓👨‍🏫";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-indigo-500/30 selection:text-indigo-300">
      
      {/* Top Banner Header */}
      <header id="app-header" className="border-b border-slate-800 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50 px-4 py-3 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-500 via-red-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-red-950/30 border border-red-400/20">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] md:text-[10px] font-mono font-extrabold text-red-350 uppercase tracking-widest bg-red-950/85 px-2 py-0.5 rounded border border-red-900/50">
                  Santa Ana College
                </span>
                <span className="text-[9px] md:text-[10px] font-mono font-extrabold text-indigo-300 uppercase tracking-widest bg-indigo-950/85 px-2 py-0.5 rounded border border-indigo-900/50">
                  Math Department
                </span>
                <span className="text-[9px] md:text-[10px] font-mono font-extrabold text-teal-300 uppercase tracking-widest bg-teal-950/85 px-2 py-0.5 rounded border border-teal-900/50">
                  Stats C1000
                </span>
              </div>
              <h1 className="font-display font-extrabold text-lg md:text-xl text-slate-100 tracking-tight flex items-center gap-2 mt-1">
                Variable Coach 
                <span className="text-xs font-mono font-normal text-indigo-400/80">• Classroom Lab Edition</span>
              </h1>
            </div>
          </div>

          {/* Quick Metrics & Session Achievements */}
          <div className="flex items-center gap-3.5 flex-wrap">
            <button
              onClick={() => setShowGuide((prev) => !prev)}
              className={`flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer select-none ${
                showGuide 
                  ? "bg-indigo-950/80 text-indigo-300 border-indigo-500/50 hover:bg-indigo-900/50 ring-2 ring-indigo-500/10" 
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <Compass className={`w-4 h-4 ${showGuide ? "text-indigo-400" : "text-slate-500"}`} />
              {showGuide ? "HIDE QUICK-GUIDE" : "HOW TO USE THIS APP?"}
            </button>
            <span className="text-sm text-slate-350 flex items-center gap-1.5 font-mono bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 shadow-sm">
              <BookmarkCheck className="w-5 h-5 text-emerald-400 animate-pulse" />
              SOLVED: <span className="text-emerald-400 font-extrabold text-base">{totalQuizzesSolved}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Scenario Playboard */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Interactive Quick-Start Lesson Guide */}
          <AnimatePresence>
            {showGuide && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border-2 border-indigo-500/30 rounded-2xl p-5 md:p-6 shadow-xl relative">
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded border border-indigo-900/60 font-bold uppercase tracking-widest animate-pulse">Interactive Guide</span>
                    <button 
                      onClick={() => setShowGuide(false)}
                      className="text-slate-400 hover:text-slate-255 transition p-1 hover:bg-slate-800 rounded-lg cursor-pointer"
                      title="Dismiss Guide"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h3 className="font-display font-bold text-lg md:text-xl text-indigo-300 flex items-center gap-2 mb-3">
                    <Compass className="w-5 h-5 text-indigo-400 animate-bounce" /> How to Master Variable Coach
                  </h3>
                  
                  <p className="text-xs md:text-sm text-slate-350 leading-relaxed max-w-3xl mb-5 font-semibold">
                    Every research design is powered by variable definitions. Here is your clear roadmap to solve each scenario and learn statistics conceptually:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-950/60 border border-slate-900/80 p-4 rounded-xl flex flex-col gap-2 transition hover:border-indigo-500/20">
                      <div className="w-7 h-7 rounded-lg bg-indigo-950/80 border border-indigo-500/40 font-mono text-xs text-indigo-300 flex items-center justify-center font-extrabold">1</div>
                      <h4 className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-200">Pick A Case</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                        Select an active topic below (e.g. caffeine, physical recovery, grades) to load real-world variables.
                      </p>
                    </div>
                    <div className="bg-slate-950/60 border border-slate-900/80 p-4 rounded-xl flex flex-col gap-2 transition hover:border-violet-500/20">
                      <div className="w-7 h-7 rounded-lg bg-violet-950/80 border border-violet-500/40 font-mono text-xs text-violet-300 flex items-center justify-center font-extrabold">2</div>
                      <h4 className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-200">Investigate Var 1</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                        Look at actual data samples. Use the <strong className="text-violet-400 font-extrabold">Math Test</strong> &amp; <strong className="text-purple-400 font-extrabold">Analogy drawers</strong> below to decide its type.
                      </p>
                    </div>
                    <div className="bg-slate-950/60 border border-slate-900/80 p-4 rounded-xl flex flex-col gap-2 transition hover:border-teal-500/20">
                      <div className="w-7 h-7 rounded-lg bg-teal-950/80 border border-teal-500/40 font-mono text-xs text-teal-300 flex items-center justify-center font-extrabold">3</div>
                      <h4 className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-200">Investigate Var 2</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                        Analyze Variable 2&apos;s records. Ask yourself: does averaging these samples make physical mathematical sense?
                      </p>
                    </div>
                    <div className="bg-slate-950/60 border border-slate-900/80 p-4 rounded-xl flex flex-col gap-2 transition hover:border-amber-500/20">
                      <div className="w-7 h-7 rounded-lg bg-amber-950/80 border border-amber-500/40 font-mono text-xs text-amber-300 flex items-center justify-center font-extrabold">4</div>
                      <h4 className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-200">Map Association</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                        Establish causality direction. Classify which is the <strong className="text-amber-400 font-extrabold">Explanatory Cause</strong> and which is the <strong className="text-emerald-400 font-extrabold">Response Outcome</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            key="guided-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
                {/* Curriculum Scenario Selector */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 md:p-5">
                  <h3 className="text-sm font-mono text-slate-350 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                    <BookOpen className="w-4.5 h-4.5 text-indigo-400" /> Choose active curriculum study:
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {scenarios.map((sc, idx) => (
                      <button
                        key={sc.id}
                        onClick={() => handleSelectScenario(idx)}
                        className={`px-4 py-2.5 rounded-xl border text-sm font-extrabold text-left transition flex items-center gap-2 cursor-pointer ${
                          activeScenarioIdx === idx
                            ? "bg-slate-850 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-950/20"
                            : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                        }`}
                      >
                        {sc.category === "coffee" && <Coffee className="w-4 h-4" />}
                        {sc.category === "gym" && <Dumbbell className="w-4 h-4" />}
                        {sc.category === "school" && <GraduationCap className="w-4 h-4" />}
                        {sc.category === "custom" && <Sparkles className="w-4 h-4 text-indigo-400" />}
                        {sc.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Workbook Card Wrapper */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden glass-glow-emerald">
                  
                  {/* Research Card Header */}
                  <div className="p-6 md:p-8 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-indigo-950/25">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono uppercase tracking-widest bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-slate-400 font-bold">
                        Study Scenario
                      </span>
                      {currentStep !== "intro" && (
                        <button
                          onClick={handleResetScenario}
                          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 transition cursor-pointer font-bold"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> restart workbook
                        </button>
                      )}
                    </div>
                    <h2 className="font-display font-extrabold text-2xl text-indigo-300 md:text-3xl tracking-tight">
                      {currentScenario.title}
                    </h2>
                    <p className="text-sm md:text-base text-slate-300 mt-2.5 leading-relaxed font-medium">
                      {currentScenario.description}
                    </p>
                    
                    {/* Focus Question Banner */}
                    <div className="mt-5 bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl flex items-start gap-4">
                      <HelpCircle className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-mono text-slate-400 font-bold uppercase tracking-widest">
                          Core Research Question
                        </h4>
                        <p className="text-base md:text-lg text-slate-100 font-bold leading-relaxed font-display mt-1">
                          “{currentScenario.researchQuestion}”
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Variable Play Mat Body */}
                  <div className="p-5 md:p-6 bg-slate-950/40">
                    
                    {/* Step Navigator Progress bar */}
                    <div className="flex justify-between items-center mb-8 max-w-lg mx-auto relative px-1">
                      <div className="absolute h-1 bg-slate-800 left-4 right-4 top-1/2 -translate-y-1/2 -z-10"></div>
                      <div 
                        className={`absolute h-1 left-4 top-1/2 -translate-y-1/2 -z-10 transition-all duration-300 ${
                          currentStep === "intro" ? "bg-indigo-500 shadow-sm shadow-indigo-500/50" :
                          currentStep === "classify_v1" ? "bg-violet-500 shadow-sm shadow-violet-500/50" :
                          currentStep === "classify_v2" ? "bg-teal-500 shadow-sm shadow-teal-500/50" :
                          currentStep === "explanatory_vs_response" ? "bg-amber-500 shadow-sm shadow-amber-500/50" : "bg-emerald-500 shadow-sm shadow-emerald-500/50"
                        }`}
                        style={{ 
                          width: currentStep === "intro" ? "0%" :
                                 currentStep === "classify_v1" ? "25%" :
                                 currentStep === "classify_v2" ? "50%" :
                                 currentStep === "explanatory_vs_response" ? "75%" : "100%"
                        }}
                      ></div>
                      
                      {[
                        { step: "intro", label: "Intro", colorClass: "indigo" },
                        { step: "classify_v1", label: "Var 1", colorClass: "violet" },
                        { step: "classify_v2", label: "Var 2", colorClass: "teal" },
                        { step: "explanatory_vs_response", label: "Relation", colorClass: "amber" },
                        { step: "completed", label: "Done", colorClass: "emerald" }
                      ].map((item, idx) => {
                        const states = ["intro", "classify_v1", "classify_v2", "explanatory_vs_response", "completed"];
                        const isPast = states.indexOf(currentStep) >= idx;
                        const isActive = currentStep === item.step;

                        let bubbleStyle = 'bg-slate-950 text-slate-400 border-slate-800';
                        if (isActive) {
                          if (item.colorClass === 'indigo') bubbleStyle = 'bg-indigo-600 text-white border-indigo-400 ring-4 ring-indigo-500/25 shadow-md shadow-indigo-600/20';
                          else if (item.colorClass === 'violet') bubbleStyle = 'bg-violet-600 text-white border-violet-400 ring-4 ring-violet-500/25 shadow-md shadow-violet-600/20';
                          else if (item.colorClass === 'teal') bubbleStyle = 'bg-teal-600 text-white border-teal-400 ring-4 ring-teal-500/25 shadow-md shadow-teal-600/20';
                          else if (item.colorClass === 'amber') bubbleStyle = 'bg-amber-600 text-white border-amber-400 ring-4 ring-amber-500/25 shadow-md shadow-amber-600/20';
                          else if (item.colorClass === 'emerald') bubbleStyle = 'bg-emerald-600 text-white border-emerald-400 ring-4 ring-emerald-500/25 shadow-md shadow-emerald-600/20';
                        } else if (isPast) {
                          if (item.colorClass === 'indigo') bubbleStyle = 'bg-indigo-950/60 text-indigo-400 border-indigo-900/60';
                          else if (item.colorClass === 'violet') bubbleStyle = 'bg-violet-950/60 text-violet-400 border-violet-900/60';
                          else if (item.colorClass === 'teal') bubbleStyle = 'bg-teal-950/60 text-teal-450 border-teal-900/60';
                          else if (item.colorClass === 'amber') bubbleStyle = 'bg-amber-950/60 text-amber-400 border-amber-900/60';
                          else bubbleStyle = 'bg-emerald-950/80 text-emerald-400 border-emerald-500/60';
                        }

                        return (
                          <div key={item.step} className="flex flex-col items-center gap-1.5">
                            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition border-2 ${bubbleStyle}`}>
                               {idx + 1}
                            </div>
                            <span className="text-[10px] md:text-xs font-mono text-slate-500 font-bold uppercase tracking-widest">{item.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* INTERACTIVE COMPONENT STATES */}
                    <AnimatePresence mode="wait">
                      
                      {/* Step 1: Introduction Play */}
                      {currentStep === "intro" && (
                        <motion.div
                          key="step-intro"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex flex-col items-center py-4 text-center"
                        >
                          <div className="w-16 h-16 rounded-full bg-indigo-950/50 border border-indigo-500/35 flex items-center justify-center mb-4 shadow-lg shadow-indigo-950/20">
                            <Compass className="w-8 h-8 text-indigo-400 animate-pulse" />
                          </div>
                          
                          <h3 className="text-xl md:text-2xl font-display font-bold text-slate-100 mb-2">
                            Step 1: Inspect the Variables
                          </h3>
                          <p className="text-xs md:text-sm text-slate-400 max-w-2xl mb-6 leading-relaxed font-semibold">
                            Every research design is powered by variables. To crack this scenario, we must explore both variables, analyze actual sample data, and determine how they function together in a statistical model.
                          </p>

                          {/* Interactive Variable Overview Preview */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-8 text-left">
                            {/* Variable 1 Card */}
                            <div className="bg-slate-950 border border-violet-900/40 p-5 rounded-2xl relative overflow-hidden group hover:border-violet-600/50 transition">
                              <div className="absolute top-0 right-0 w-20 h-20 bg-violet-600/5 rounded-full blur-2xl pointer-events-none"></div>
                              <div className="flex justify-between items-start mb-2.5">
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-violet-950/80 text-violet-300 border border-violet-900/60 uppercase tracking-widest">
                                  Variable 1
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-500 font-bold uppercase">
                                  Unclassified
                                </span>
                              </div>
                              <h4 className="font-display font-extrabold text-lg text-violet-200">
                                {currentScenario.variables[0].name}
                              </h4>
                              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-semibold">
                                {currentScenario.variables[0].description}
                              </p>
                              
                              <div className="mt-4 flex items-center gap-1.5 text-[10px] font-mono text-violet-400 font-bold uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
                                Double-click or start inspection to analyze
                              </div>
                            </div>

                            {/* Variable 2 Card */}
                            <div className="bg-slate-950 border border-teal-900/40 p-5 rounded-2xl relative overflow-hidden group hover:border-teal-600/50 transition col-span-1">
                              <div className="absolute top-0 right-0 w-20 h-20 bg-teal-600/5 rounded-full blur-2xl pointer-events-none"></div>
                              <div className="flex justify-between items-start mb-2.5">
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-900/60 uppercase tracking-widest">
                                  Variable 2
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-500 font-bold uppercase">
                                  Unclassified
                                </span>
                              </div>
                              <h4 className="font-display font-extrabold text-lg text-teal-200">
                                {currentScenario.variables[1].name}
                              </h4>
                              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-semibold">
                                {currentScenario.variables[1].description}
                              </p>

                              <div className="mt-4 flex items-center gap-1.5 text-[10px] font-mono text-teal-400 font-bold uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                                Will unlock in phase 2 of inspection
                              </div>
                            </div>
                          </div>

                          {/* Glowing Navigation Call to Action */}
                          <div className="flex flex-col items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setCurrentStep("classify_v1")}
                              className="bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 text-white py-3.5 px-8 rounded-xl text-sm md:text-base font-bold flex items-center gap-2.5 tracking-wide cursor-pointer shadow-md duration-250 active:scale-95 animate-pulse"
                            >
                              Start Interactive Inspection: {currentScenario.variables[0].name} <ArrowRight className="w-5 h-5" />
                            </button>
                            <p className="text-[10px] font-mono text-slate-550 font-bold uppercase tracking-wider mt-1.5">
                              ← Or use the selector above to pick another curriculum study
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2: Classify Variable 1 */}
                      {currentStep === "classify_v1" && (
                        <motion.div
                          key="step-classify_v1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex flex-col gap-5"
                        >
                          <div className="bg-slate-950 border border-violet-900/45 p-6 rounded-2xl shadow-inner relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-violet-950/80 text-violet-300 border border-violet-900/60 uppercase tracking-widest">
                                Focus: Variable 1
                              </span>
                            </div>
                            <h3 className="font-display font-extrabold text-xl md:text-2xl text-violet-200">
                              {currentScenario.variables[0].name}
                            </h3>
                            <p className="text-sm md:text-base text-slate-400 mt-2 leading-relaxed font-medium">
                              {currentScenario.variables[0].description}
                            </p>

                            {/* Sample Row */}
                            <div className="mt-4 py-3.5 bg-slate-900/40 rounded-xl px-4 border border-violet-950/60 flex items-center gap-2.5 flex-wrap">
                              <span className="text-xs font-mono text-violet-400 font-bold uppercase tracking-widest mr-2">Sample dataset values:</span>
                              {currentScenario.variables[0].exampleData.map((ex, idx) => (
                                <span key={idx} className="text-sm font-mono bg-slate-950 border border-violet-900/40 text-violet-250 px-3 py-1.5 rounded-lg font-bold shadow-sm">
                                  {ex}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Interactive Buttons */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                            <button
                              type="button"
                              onClick={() => handleV1Classification("Quantitative")}
                              className={`p-5 rounded-2xl border-2 text-left transition relative cursor-pointer ${
                                userV1Type === "Quantitative"
                                  ? v1Correct 
                                    ? "bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                                    : "bg-red-950/40 border-red-500 ring-2 ring-red-500/20 shadow-sm"
                                  : "bg-slate-900 border-slate-800 hover:border-violet-600/80 hover:bg-violet-950/20"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-display font-bold text-base md:text-lg">Quantitative</h4>
                                {userV1Type === "Quantitative" && (
                                  v1Correct ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <AlertTriangle className="w-6 h-6 text-red-400" />
                                )}
                              </div>
                              <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
                                Values represent numbers or mathematical magnitudes where calculations like averages make sense.
                              </p>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleV1Classification("Categorical")}
                              className={`p-5 rounded-2xl border-2 text-left transition relative cursor-pointer ${
                                userV1Type === "Categorical"
                                  ? v1Correct 
                                    ? "bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
                                    : "bg-red-950/40 border-red-500 ring-2 ring-red-500/20 shadow-sm"
                                  : "bg-slate-900 border-slate-800 hover:border-violet-600/80 hover:bg-violet-950/20"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-display font-bold text-base md:text-lg">Categorical</h4>
                                {userV1Type === "Categorical" && (
                                  v1Correct ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <AlertTriangle className="w-6 h-6 text-red-400" />
                                )}
                              </div>
                              <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
                                Values represent distinct categories, words or descriptive groups where calculating math averages fails.
                              </p>
                            </button>
                          </div>

                          {/* Quick validation indicator if correct */}
                          {v1Correct === true && (
                            <div className="bg-emerald-950/50 border-2 border-emerald-500/40 rounded-xl p-5 text-sm md:text-base mt-2 animate-fade-in text-emerald-250 leading-relaxed font-medium shadow-md">
                              <span className="font-bold block mb-1 text-emerald-400">🎉 Brilliant Job!</span>
                              {currentScenario.variables[0].typeReasoning}
                                           {/* Tutorial Assistance draw trigger - ALWAYS AVAILABLE to help them decide! */}
                          {v1Correct !== true && (
                            <div className="flex flex-col gap-4 mt-5 border-t border-slate-850 pt-5">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <span className="text-sm font-mono text-slate-350 font-bold flex flex-col sm:flex-row sm:items-start md:items-center gap-1">
                                  <span className="flex items-center gap-1.5"><Lightbulb className="w-5 h-5 text-yellow-500 animate-pulse" /> Diagnostic Labs:</span>
                                  <span className="text-[11px] text-indigo-400 font-normal">(Verify data qualities first)</span>
                                </span>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setV1ShowMath(!v1ShowMath)}
                                    className={`px-4 py-2 text-xs uppercase font-mono tracking-wider font-extrabold rounded-full border-2 transition cursor-pointer ${
                                      v1ShowMath ? "bg-violet-950 border-violet-600 text-violet-300 pointer-events-auto" : "bg-slate-950 border-slate-800 text-slate-400 hover:border-violet-600/50 hover:text-violet-350"
                                    }`}
                                  >
                                    Math Test {!v1ShowMath && userV1Type === null && <span className="text-[9px] text-indigo-400 ml-1">★ Try First</span>}
                                  </button>
                                  <button
                                    onClick={() => setV1ShowAnalogy(!v1ShowAnalogy)}
                                    className={`px-4 py-2 text-xs uppercase font-mono tracking-wider font-extrabold rounded-full border-2 transition cursor-pointer ${
                                      v1ShowAnalogy ? "bg-violet-950 border-violet-600 text-violet-300 pointer-events-auto" : "bg-slate-950 border-slate-800 text-slate-400 hover:border-violet-600/50 hover:text-violet-351"
                                    }`}
                                  >
                                    Analogy {!v1ShowAnalogy && userV1Type === null && <span className="text-[9px] text-indigo-400 ml-1">★ Try First</span>}
                                  </button>
                                </div>
                              </div>

                              {/* Help prompt when they haven't run any tools yet */}
                              {!v1ShowMath && !v1ShowAnalogy && userV1Type === null && (
                                <p className="text-xs text-indigo-300 bg-indigo-950/20 border border-indigo-900/30 px-4 py-3.5 rounded-xl leading-relaxed italic font-semibold shadow-sm">
                                  💡 <strong className="text-indigo-200">Avoid Guessing!</strong> Click <strong className="text-violet-300">"Math Test"</strong> or <strong className="text-violet-305">"Analogy"</strong> right above to run live interactive experiments. It will prove exactly whether this variable works on a mathematical or labeled scale!
                                </p>
                              )}

                              {v1ShowMath && (
                                <MathTestWidget 
                                  variableName={currentScenario.variables[0].name} 
                                  mathTest={currentScenario.variables[0].mathTest} 
                                  theme="violet"
                                />
                              )}

                              {v1ShowAnalogy && (
                                <VisualAnalogyWidget 
                                  variableName={currentScenario.variables[0].name} 
                                  analogy={currentScenario.variables[0].visualAnalogy}
                                  exampleData={currentScenario.variables[0].exampleData}
                                  theme="violet"
                                />
                              )}
                            </div>
                          )}              </div>
                          )}
                        </motion.div>
                      )}

                      {/* Step 3: Classify Variable 2 */}
                      {currentStep === "classify_v2" && (
                        <motion.div
                          key="step-classify_v2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex flex-col gap-5"
                        >
                          <div className="bg-slate-950 border border-teal-900/45 p-6 rounded-2xl shadow-inner relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-600/5 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-teal-950/80 text-teal-300 border border-teal-800/60 uppercase tracking-widest">
                                Focus: Variable 2
                              </span>
                            </div>
                            <h3 className="font-display font-extrabold text-xl md:text-2xl text-teal-200">
                              {currentScenario.variables[1].name}
                            </h3>
                            <p className="text-sm md:text-base text-slate-400 mt-2 leading-relaxed font-medium">
                              {currentScenario.variables[1].description}
                            </p>

                            {/* Sample Row */}
                            <div className="mt-4 py-3.5 bg-slate-900/40 rounded-xl px-4 border border-teal-950/60 flex items-center gap-2.5 flex-wrap">
                              <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-widest mr-2">Sample dataset values:</span>
                              {currentScenario.variables[1].exampleData.map((ex, idx) => (
                                <span key={idx} className="text-sm font-mono bg-slate-950 border border-teal-900/40 text-teal-250 px-3 py-1.5 rounded-lg font-bold shadow-sm">
                                  {ex}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Interactive Buttons */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                            <button
                              type="button"
                              onClick={() => handleV2Classification("Quantitative")}
                              className={`p-5 rounded-2xl border-2 text-left transition relative cursor-pointer ${
                                userV2Type === "Quantitative"
                                  ? v2Correct 
                                    ? "bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                                    : "bg-red-950/40 border-red-500 ring-2 ring-red-500/20 shadow-sm"
                                  : "bg-slate-900 border-slate-805 hover:border-teal-600/80 hover:bg-teal-950/20"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-display font-bold text-base md:text-lg">Quantitative</h4>
                                {userV2Type === "Quantitative" && (
                                  v2Correct ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <AlertTriangle className="w-6 h-6 text-red-400" />
                                )}
                              </div>
                              <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
                                Values represent numbers or mathematical magnitudes where calculations like averages make sense.
                              </p>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleV2Classification("Categorical")}
                              className={`p-5 rounded-2xl border-2 text-left transition relative cursor-pointer ${
                                userV2Type === "Categorical"
                                  ? v2Correct 
                                    ? "bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20"
                                    : "bg-red-950/40 border-red-500 ring-2 ring-red-500/20 shadow-sm"
                                  : "bg-slate-900 border-slate-800 hover:border-teal-600/80 hover:bg-teal-950/20"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-display font-bold text-base md:text-lg">Categorical</h4>
                                {userV2Type === "Categorical" && (
                                  v2Correct ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <AlertTriangle className="w-6 h-6 text-red-400" />
                                )}
                              </div>
                              <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
                                Values represent distinct categories, words or descriptive groups where calculating math averages fails.
                              </p>
                            </button>
                          </div>

                          {/* Quick validation indicator if correct */}
                          {v2Correct === true && (
                            <div className="bg-emerald-950/50 border-2 border-emerald-500/40 rounded-xl p-5 text-sm md:text-base mt-2 animate-fade-in text-emerald-250 leading-relaxed font-medium shadow-md">
                              <span className="font-bold block mb-1 text-emerald-400">🎉 Magnificent Job!</span>
                              {currentScenario.variables[1].typeReasoning}
                                {/* Tutorial Assistance draw trigger - ALWAYS AVAILABLE to help them decide! */}
                          {v2Correct !== true && (
                            <div className="flex flex-col gap-4 mt-5 border-t border-slate-850 pt-5">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <span className="text-sm font-mono text-slate-350 font-bold flex flex-col sm:flex-row sm:items-start md:items-center gap-1">
                                  <span className="flex items-center gap-1.5"><Lightbulb className="w-5 h-5 text-yellow-500 animate-pulse" /> Diagnostic Labs:</span>
                                  <span className="text-[11px] text-indigo-400 font-normal">(Verify data qualities first)</span>
                                </span>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setV2ShowMath(!v2ShowMath)}
                                    className={`px-4 py-2 text-xs uppercase font-mono tracking-wider font-extrabold rounded-full border-2 transition cursor-pointer ${
                                      v2ShowMath ? "bg-teal-950 border-teal-600 text-teal-355 pointer-events-auto" : "bg-slate-950 border-slate-800 text-slate-400 hover:border-teal-600/50 hover:text-teal-350"
                                    }`}
                                  >
                                    Math Test {!v2ShowMath && userV2Type === null && <span className="text-[9px] text-teal-400 ml-1">★ Try First</span>}
                                  </button>
                                  <button
                                    onClick={() => setV2ShowAnalogy(!v2ShowAnalogy)}
                                    className={`px-4 py-2 text-xs uppercase font-mono tracking-wider font-extrabold rounded-full border-2 transition cursor-pointer ${
                                      v2ShowAnalogy ? "bg-teal-950 border-teal-600 text-teal-355 pointer-events-auto" : "bg-slate-950 border-slate-800 text-slate-400 hover:border-teal-600/50 hover:text-teal-351"
                                    }`}
                                  >
                                    Analogy {!v2ShowAnalogy && userV2Type === null && <span className="text-[9px] text-teal-400 ml-1">★ Try First</span>}
                                  </button>
                                </div>
                              </div>

                              {/* Help prompt when they haven't run any tools yet */}
                              {!v2ShowMath && !v2ShowAnalogy && userV2Type === null && (
                                <p className="text-xs text-indigo-300 bg-indigo-950/20 border border-indigo-900/30 px-4 py-3.5 rounded-xl leading-relaxed italic font-semibold shadow-sm">
                                  💡 <strong className="text-indigo-200">Avoid Guessing!</strong> Click <strong className="text-teal-300">"Math Test"</strong> or <strong className="text-teal-305">"Analogy"</strong> right above to run live interactive experiments. It will prove exactly whether this variable works on a mathematical or labeled scale!
                                </p>
                              )}

                              {v2ShowMath && (
                                <MathTestWidget 
                                  variableName={currentScenario.variables[1].name} 
                                  mathTest={currentScenario.variables[1].mathTest} 
                                  theme="teal"
                                />
                              )}

                              {v2ShowAnalogy && (
                                <VisualAnalogyWidget 
                                  variableName={currentScenario.variables[1].name} 
                                  analogy={currentScenario.variables[1].visualAnalogy}
                                  exampleData={currentScenario.variables[1].exampleData}
                                  theme="teal"
                                />
                              )}
                            </div>
                          )}                        </div>
                          )}
                        </motion.div>
                      )}

                      {/* Step 4: Explanatory vs Response Setup */}
                      {currentStep === "explanatory_vs_response" && (
                        <motion.div
                          key="step-explanatory_vs_response"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex flex-col gap-4"
                        >
                          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-inner">
                            <h3 className="font-display text-lg md:text-xl font-bold text-indigo-300 mb-3">
                              Statistical Direction Map (Cause & Effect)
                            </h3>
                            <p className="text-sm md:text-base text-slate-355 mb-5 leading-relaxed font-medium">
                              Now let&apos;s map how these two variables connect:
                              <br />
                              - The **Explanatory variable** is the <span className="text-indigo-400 font-extrabold underline underline-offset-4 decoration-2">Driver (cause)</span>.
                              <br />- The **Response variable** is the <span className="text-emerald-400 font-extrabold underline underline-offset-4 decoration-2">Outcome (effect)</span>.
                            </p>

                            {/* Relationship flowchart visualization */}
                            <div className="bg-slate-900/60 p-5 rounded-2xl border-2 border-slate-800 mb-6 text-center shadow-lg">
                              <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase block mb-4">Hypothesized Model Flow</span>
                              
                              <div className="flex flex-col md:flex-row items-center justify-center gap-5 py-3">
                                {userExplanatoryIdx === null ? (
                                  <div className="text-sm md:text-base text-indigo-400 font-bold py-3.5 flex items-center justify-center gap-2 animate-pulse w-full select-none">
                                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50"></span>
                                    👈 Choose Option A or Option B below to draw your model flow!
                                  </div>
                                ) : (
                                  <>
                                    <div className="bg-indigo-950/80 border-2 border-indigo-500/40 p-4 rounded-xl w-full md:w-5/12 text-center shadow-md">
                                      <span className="text-[10px] font-mono font-extrabold text-indigo-400 uppercase tracking-widest block mb-1">EXPLANATORY VARIABLE (DRIVER)</span>
                                      <span className="text-sm md:text-base font-bold text-indigo-100 block truncate">{currentScenario.variables[userExplanatoryIdx].name}</span>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-indigo-300">
                                      <ArrowRight className="w-6 h-6 rotate-90 md:rotate-0" />
                                    </div>

                                    <div className="bg-emerald-950/80 border-2 border-emerald-500/40 p-4 rounded-xl w-full md:w-5/12 text-center shadow-md">
                                      <span className="text-[10px] font-mono font-extrabold text-emerald-400 uppercase tracking-widest block mb-1">RESPONSE VARIABLE (OUTCOME)</span>
                                      <span className="text-sm md:text-base font-bold text-emerald-100 block truncate">{currentScenario.variables[userExplanatoryIdx === 0 ? 1 : 0].name}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Option selection box */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                              <button
                                type="button"
                                onClick={() => setUserExplanatoryIdx(0)}
                                className={`p-5 rounded-2xl border-2 text-left transition cursor-pointer relative overflow-hidden ${
                                  userExplanatoryIdx === 0
                                    ? "bg-slate-950 border-indigo-500 ring-2 ring-indigo-500/25"
                                    : "bg-slate-900 border-slate-800 hover:border-violet-800/40"
                                }`}
                              >
                                <div className="absolute top-0 left-0 w-1 h-full bg-violet-600"></div>
                                <span className="font-bold text-sm md:text-base text-slate-200 block mb-2 pl-2">
                                  Option A: <span className="text-violet-400 font-extrabold">{currentScenario.variables[0].name}</span> drives <span className="text-teal-400 font-extrabold">{currentScenario.variables[1].name}</span>
                                </span>
                                <p className="text-slate-400 leading-relaxed text-xs md:text-sm font-medium pl-2">
                                  Alterations in caffeine levels or study times explain variation in memory recall score or exam status.
                                </p>
                              </button>

                              <button
                                type="button"
                                onClick={() => setUserExplanatoryIdx(1)}
                                className={`p-5 rounded-2xl border-2 text-left transition cursor-pointer relative overflow-hidden ${
                                  userExplanatoryIdx === 1
                                    ? "bg-slate-950 border-indigo-500 ring-2 ring-indigo-500/25"
                                    : "bg-slate-900 border-slate-800 hover:border-teal-850"
                                }`}
                              >
                                <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
                                <span className="font-bold text-slate-200 text-sm md:text-base block mb-2 pl-2">
                                  Option B: <span className="text-teal-400 font-extrabold">{currentScenario.variables[1].name}</span> drives <span className="text-violet-400 font-extrabold">{currentScenario.variables[0].name}</span>
                                </span>
                                <p className="text-slate-400 leading-relaxed text-xs md:text-sm font-medium pl-2">
                                  The outcome variables (like exam outcome or exhaustion rating) are the triggers that dictate study times or hydration levels.
                                </p>
                              </button>
                            </div>

                            {/* Error warning if wrong submissions */}
                            {associationCorrect === false && (
                              <div className="mb-5 bg-violet-950/40 border-2 border-violet-850 p-4.5 rounded-xl flex items-start gap-3.5 text-xs md:text-sm text-violet-300 leading-relaxed font-medium shadow-md">
                                <AlertTriangle className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold block mb-1 text-violet-250 text-sm md:text-base">Let’s rethink cause and direction!</span>
                                  Does a student&apos;s exam status (Pass vs. Fail) physically travel back in time to dictate how many hours they studied? No! Study happens first; the exam grade is the downstream effect.
                                </div>
                              </div>
                            )}

                            {associationCorrect === true && (
                              <div className="mb-5 bg-emerald-950/40 border-2 border-emerald-850 p-4.5 rounded-xl flex items-start gap-3.5 text-sm md:text-base text-emerald-300 leading-relaxed font-semibold shadow-md">
                                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-extrabold block mb-1 text-emerald-450 text-base md:text-lg">Exactly! Splendid logical deduction.</span>
                                  {currentScenario.driverExplanation}
                                </div>
                              </div>
                            )}

                            {/* Submission block */}
                            <button
                              type="button"
                              onClick={handleSubmitAssociation}
                              disabled={userExplanatoryIdx === null}
                              id="assoc-submit-btn"
                              className={`w-full py-4 px-8 rounded-xl text-sm md:text-base font-bold flex items-center justify-center gap-2.5 cursor-pointer transition ${
                                userExplanatoryIdx === null
                                  ? "bg-slate-800 text-slate-500 cursor-not-allowed border-2 border-transparent"
                                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/20 active:scale-95 border-2 border-indigo-500 font-extrabold"
                              }`}
                            >
                              Submit Relationship Mapping <ArrowRight className="w-5 h-5" />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 5: Completed Stage Celebration */}
                      {currentStep === "completed" && (
                        <motion.div
                          key="step-complete"
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.95, opacity: 0 }}
                          className="flex flex-col gap-5 text-slate-100"
                        >
                          <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-emerald-950/60 border-2 border-emerald-500/40 flex items-center justify-center mb-5 shadow-lg shadow-emerald-950/20">
                              <Trophy className="w-10 h-10 text-emerald-400 animate-bounce" />
                            </div>
                            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-emerald-400">
                              Workbook Solved!
                            </h2>
                            <p className="text-sm md:text-base text-slate-355 max-w-sm mt-3 leading-relaxed font-semibold">
                              You successfully identified both variables&apos; mathematical profiles and established their correct causal direction!
                            </p>

                            {/* Statistical summary box */}
                            <div className="w-full max-w-xl bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 my-6 text-left font-mono text-xs md:text-sm shadow-inner">
                              <div className="border-b border-slate-800 pb-3 mb-4 text-emerald-400 font-bold uppercase tracking-widest text-[11px]">
                                // OFFICIAL STATISTICAL RECORD
                              </div>
                              <div className="space-y-3 text-slate-200">
                                <div>
                                  <span className="text-slate-500 font-bold">Explanatory Var (X):</span>{" "}
                                  <span className={`font-extrabold text-sm md:text-base ${currentScenario.explanatoryIndex === 0 ? "text-violet-400 font-extrabold" : "text-teal-400 font-extrabold"}`}>
                                    {currentScenario.variables[currentScenario.explanatoryIndex].name}
                                  </span>{" "}
                                  <span className={`px-2 py-0.5 rounded text-[10px] border font-mono font-bold ml-1 ${currentScenario.explanatoryIndex === 0 ? "bg-violet-950 text-violet-300 border-violet-900/60" : "bg-teal-950 text-teal-300 border-teal-900/60"}`}>
                                    {currentScenario.variables[currentScenario.explanatoryIndex].type}
                                  </span>
                                </div>
                                <div className="border-t border-slate-900 my-1"></div>
                                <div>
                                  <span className="text-slate-500 font-bold">Response Var (Y):</span>{" "}
                                  <span className={`font-extrabold text-sm md:text-base ${currentScenario.responseIndex === 0 ? "text-violet-400 font-extrabold" : "text-teal-400 font-extrabold"}`}>
                                    {currentScenario.variables[currentScenario.responseIndex].name}
                                  </span>{" "}
                                  <span className={`px-2 py-0.5 rounded text-[10px] border font-mono font-bold ml-1 ${currentScenario.responseIndex === 0 ? "bg-violet-950 text-violet-300 border-violet-900/60" : "bg-teal-950 text-teal-300 border-teal-900/60"}`}>
                                    {currentScenario.variables[currentScenario.responseIndex].type}
                                  </span>
                                </div>
                                <div className="border-t border-slate-900 my-1"></div>
                                <div className="text-xs md:text-sm text-slate-400 leading-relaxed font-sans pt-2">
                                  <span className="font-extrabold text-slate-200 block mb-1">Recommended Analysis method:</span>{" "}
                                  {currentScenario.variables[currentScenario.explanatoryIndex].type === "Categorical" &&
                                  currentScenario.variables[currentScenario.responseIndex].type === "Quantitative"
                                    ? "Two-sample t-test or ANOVA. Since the cause is categorical grouped classes and the effect is continuous magnitude measurements!"
                                    : currentScenario.variables[currentScenario.explanatoryIndex].type === "Quantitative" &&
                                      currentScenario.variables[currentScenario.responseIndex].type === "Quantitative"
                                    ? "Simple Linear Regression & Pearson Correlation. Since both the cause and effect variables track continuous numerical scales!"
                                    : "Logistic Regression or Chi-Square Association Analysis."}
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-4 w-full">
                              <button
                                type="button"
                                onClick={() => handleSelectScenario((activeScenarioIdx + 1) % scenarios.length)}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white py-3.5 px-6 rounded-xl text-xs md:text-sm font-bold transition cursor-pointer shadow-md shadow-indigo-950/20"
                              >
                                Try Next Study
                              </button>
                              <button
                                type="button"
                                onClick={handleResetScenario}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-350 py-3.5 px-6 rounded-xl text-xs md:text-sm font-bold transition cursor-pointer"
                              >
                                Replay Workbook
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
        </div>

        {/* Right Column: Dynamic Statistician Tutor Mascot */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-indigo-500/40 rounded-2xl p-6 sticky top-24 shadow-2xl shadow-indigo-950/35 flex flex-col gap-5 relative overflow-hidden">
            {/* Dynamic ambient glowing backing */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Mascot header/profile */}
            <div className="flex items-center gap-4.5 pb-4 border-b border-indigo-900/40 relative z-10">
              <div 
                className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-700 border-2 border-indigo-300 flex items-center justify-center text-4xl shadow-xl shadow-indigo-500/20 select-none transform hover:scale-110 active:scale-95 duration-350 transition cursor-help"
                title="Professor Hypo emote shifts depending on study states!"
              >
                {getMascotEmote()}
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base md:text-lg text-slate-100 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-indigo-200 via-violet-200 to-teal-200 bg-clip-text text-transparent">Professor Hypo</span>
                  <span className="text-[10px] bg-indigo-950 border border-indigo-500/40 text-indigo-300 px-2.5 py-1 font-mono rounded-lg font-bold tracking-wider animate-pulse">
                    COACH
                  </span>
                </h3>
                <p className="text-xs text-indigo-300 font-mono font-bold mt-0.5">Statistical Pedagogist </p>
              </div>
            </div>

            {/* Simulated interactive quote / coach dialog */}
            <div className="bg-slate-950 border-2 border-indigo-950 p-5 rounded-2xl min-h-[160px] flex flex-col justify-between shadow-inner relative z-10 group hover:border-indigo-500/30 transition duration-300">
              <div className="absolute top-3 right-4 text-[9px] font-mono text-indigo-500/40 font-bold select-none">// LIVE FEEDBACK</div>
              <div className="text-sm md:text-base text-slate-200 leading-relaxed italic font-semibold animate-fade-in pt-2">
                “{mascotDialogue}”
              </div>
              
              <div className="text-[9px] font-mono font-bold text-indigo-400/40 text-right mt-4 tracking-widest uppercase">
                // ACTIVE COACH DIALOGUE
              </div>
            </div>

            {/* Quick Helper cheat sheet */}
            <div className="bg-slate-950/30 border border-indigo-950 p-5 rounded-2xl shadow-inner relative z-10">
              <h4 className="text-xs font-mono font-extrabold text-indigo-300 uppercase tracking-widest mb-3.5 flex items-center gap-1.5">
                <Lightbulb className="w-5 h-5 text-amber-400 animate-pulse" /> Tutor Cheat Sheet:
              </h4>
              <ul className="text-xs md:text-sm text-slate-400 space-y-3 leading-relaxed font-semibold">
                <li className="p-3 rounded-xl bg-violet-950/20 border border-violet-900/30 transition hover:bg-violet-950/30">
                  <strong className="text-violet-300 block text-sm mb-1 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse shadow-sm shadow-violet-500/50"></span> Quantitative:
                  </strong>
                  Focuses on real magnitude amounts. Mathematical averages make complete numerical sense (e.g., fatigue score 4 and sleep score 8 average to 6).
                </li>
                <li className="p-3 rounded-xl bg-teal-950/20 border border-teal-900/30 transition hover:bg-teal-950/30">
                  <strong className="text-teal-300 block text-sm mb-1 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse shadow-sm shadow-teal-500/50"></span> Categorical:
                  </strong>
                  Focuses on grouping labels. It is impossible to calculate numeric middle quantities (e.g., the average of &quot;Smoothie&quot; and &quot;Chai&quot; fails).
                </li>
                <li className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/30 transition hover:bg-amber-950/30">
                  <strong className="text-amber-300 block text-sm mb-1 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-sm shadow-amber-500/50"></span> Explanatory (X Variable):
                  </strong>
                  The predictive input trigger variable that we manipulate or divide groups by to explain downstream variation.
                </li>
                <li className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30 transition hover:bg-emerald-950/30">
                  <strong className="text-emerald-300 block text-sm mb-1 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50"></span> Response (Y Variable):
                  </strong>
                  The primary output measurement of interest. This observation updates or registers differences after explanatory input changes.
                </li>
              </ul>
            </div>
          </div>
        </div>

      </main>

      {/* Humble Footer */}
      <footer id="workspace-footer" className="text-center py-8 px-4 mt-auto border-t border-slate-900 bg-slate-950 text-slate-500 text-xs font-mono space-y-2">
        <p className="font-bold text-slate-400">🏫 Santa Ana College Math Department &bull; Statistics C1000 Courseware</p>
        <p>Authorized for instructional and student laboratory application &bull; Variable Coach v1.2</p>
      </footer>
    </div>
  );
}
