import React, { useState } from "react";
import { MathTest } from "../types";
import { Calculator, Play, RotateCcw, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";

interface MathTestWidgetProps {
  variableName: string;
  mathTest: MathTest;
  theme?: "violet" | "teal";
}

export default function MathTestWidget({ variableName, mathTest, theme = "violet" }: MathTestWidgetProps) {
  const [hasRun, setHasRun] = useState(false);

  const colors = {
    violet: {
      text: "text-violet-600",
      textDark: "text-violet-950",
      textHigh: "text-violet-700",
      bgLight: "bg-violet-50/80",
      borderLight: "border-violet-100",
      borderUnderline: "decoration-violet-350",
      btn: "bg-violet-600 hover:bg-violet-500 shadow-violet-600/10 focus:ring-violet-500/20",
      textClass: "text-violet-600 px-3 py-1.5 rounded-lg text-sm md:text-base font-semibold bg-violet-50/50 border border-violet-100",
    },
    teal: {
      text: "text-teal-600",
      textDark: "text-teal-950",
      textHigh: "text-teal-700",
      bgLight: "bg-teal-50/80",
      borderLight: "border-teal-100",
      borderUnderline: "decoration-teal-350",
      btn: "bg-teal-600 hover:bg-teal-500 shadow-teal-600/10 focus:ring-teal-500/20",
      textClass: "text-teal-600 px-3 py-1.5 rounded-lg text-sm md:text-base font-semibold bg-teal-50/50 border border-teal-100",
    }
  }[theme];

  return (
    <div className={`border-2 ${theme === "violet" ? "border-violet-200/60" : "border-teal-200/60"} bg-white rounded-2xl p-6 mb-5 animate-fade-in text-slate-800 shadow-sm`}>
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-4">
        <Calculator className={`w-6 h-6 ${colors.text}`} />
        <h4 className="font-display font-bold text-slate-900 text-base md:text-lg lg:text-xl">
          Interactive Math Test: {mathTest.question}
        </h4>
      </div>

      <p className="text-sm md:text-base text-slate-600 mb-4 leading-relaxed">
        Let&apos;s put <span className="font-semibold text-slate-900">“{variableName}”</span> through the average calculator. If we can calculate the average of two samples and get a real middle quantity, it is <span className={`${colors.text} font-bold underline ${colors.borderUnderline}`}>Quantitative</span>. If it fails, it is <span className="text-amber-705 font-bold underline decoration-amber-300">Categorical</span>.
      </p>

      {/* Calculator Screen */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 font-mono text-sm shadow-inner mb-4 relative overflow-hidden">
        <div className="absolute right-3 top-3 px-2 py-0.5 rounded bg-slate-200/60 border border-slate-300 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          STAT-CALC v1.0
        </div>
        
        <div className="text-slate-400 text-xs mb-1.5 font-bold tracking-wide uppercase">// Inputs to Average:</div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {mathTest.items.map((item, idx) => (
            <span key={idx} className={colors.textClass}>
              {item}
            </span>
          ))}
        </div>

        <div className="text-slate-400 text-xs mb-1.5 font-bold tracking-wide uppercase">// Operation Math Formula:</div>
        <div className="text-base text-slate-700 bg-white p-3 rounded-lg border border-slate-200 mb-4 font-semibold">
          {hasRun ? (
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className={`${colors.text} font-bold text-sm md:text-base`}>{mathTest.mathExplanation}</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${mathTest.averageAllowed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                {mathTest.averageAllowed ? "SUCCESS" : "DIV-ERROR"}
              </span>
            </div>
          ) : (
            <span className="text-slate-400 italic block py-0.5 text-sm">Calculating... [Click Run Below]</span>
          )}
        </div>

        {hasRun && (
          <div className="text-sm leading-relaxed animate-fade-in mt-3 border-t border-slate-200 pt-3 text-slate-600">
            <div className="flex items-start gap-2.5">
              {mathTest.averageAllowed ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold text-slate-900 text-sm md:text-base">
                  {mathTest.averageAllowed ? "Validation Success: " : "Validation Block: "}
                </span>
                <span className="text-sm md:text-base inline">{mathTest.explanation}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        {!hasRun ? (
          <button
            onClick={() => setHasRun(true)}
            id="run-math-test-btn"
            className={`flex-1 flex items-center justify-center gap-2 ${colors.btn} active:scale-95 transition text-white py-3 px-5 rounded-xl text-sm font-semibold cursor-pointer shadow-sm`}
          >
            <Play className="w-4 h-4" /> Run Math Test
          </button>
        ) : (
          <button
            onClick={() => setHasRun(false)}
            id="reset-math-test-btn"
            className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 active:scale-95 transition text-slate-700 border border-slate-200 py-3 px-5 rounded-xl text-sm font-semibold cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Reset Test
          </button>
        )}
      </div>
    </div>
  );
}
