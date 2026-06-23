import React, { useState } from "react";
import { VisualAnalogy } from "../types";
import { Sparkles, Layers, Sliders, Info } from "lucide-react";

interface VisualAnalogyWidgetProps {
  variableName: string;
  analogy: VisualAnalogy;
  exampleData: string[];
  theme?: "violet" | "teal";
}

export default function VisualAnalogyWidget({ variableName, analogy, exampleData, theme = "violet" }: VisualAnalogyWidgetProps) {
  const [sliderVal, setSliderVal] = useState(50);
  const [selectedBucketIdx, setSelectedBucketIdx] = useState<number | null>(null);

  const colors = {
    violet: {
      text: "text-violet-600",
      textDark: "text-violet-950",
      textHigh: "text-violet-750",
      bgLight: "bg-violet-50/70",
      borderLight: "border-violet-100",
      accentSlider: "accent-violet-600",
      indicatorBg: "bg-violet-50 text-violet-700 border-violet-100",
      barBg: "bg-violet-600",
      bucketSelected: "bg-violet-50 border-violet-500 text-violet-700 ring-1 ring-violet-500/20 font-bold",
      bulletSelected: "bg-violet-600 text-white border-violet-600",
      narrativeCard: "bg-violet-50 border border-violet-100 text-violet-950",
    },
    teal: {
      text: "text-teal-600",
      textDark: "text-teal-950",
      textHigh: "text-teal-750",
      bgLight: "bg-teal-50/70",
      borderLight: "border-teal-100",
      accentSlider: "accent-teal-600",
      indicatorBg: "bg-teal-50 text-teal-700 border-teal-100",
      barBg: "bg-teal-600",
      bucketSelected: "bg-teal-50 border-teal-500 text-teal-700 ring-1 ring-teal-500/20 font-bold",
      bulletSelected: "bg-teal-600 text-white border-teal-600",
      narrativeCard: "bg-teal-50 border border-teal-100 text-teal-950",
    }
  }[theme];

  return (
    <div className={`border-2 ${theme === "violet" ? "border-violet-200/60" : "border-teal-200/60"} bg-white rounded-2xl p-6 mb-5 animate-fade-in text-slate-800 shadow-sm`}>
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-4">
        <Sparkles className={`w-6 h-6 ${colors.text}`} />
        <h4 className="font-display font-bold text-slate-900 text-base md:text-lg lg:text-xl">
          Intuitive Analogy: {analogy.title}
        </h4>
      </div>

      <p className="text-sm md:text-base text-slate-600 mb-4 leading-relaxed">
        Let&apos;s visualize <span className="font-semibold text-slate-900">“{variableName}”</span> in a physical environment:
      </p>

      {/* Visual Workspace depending on analogy type */}
      {analogy.type === "ruler" || analogy.type === "scale" ? (
         <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-4 text-slate-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Sliders className="w-4 h-4 text-slate-500" /> Continuous Magnitude Ruler
            </span>
            <span className={`text-sm font-mono font-bold px-3 py-1 rounded-full border ${colors.indicatorBg}`}>
              Value: {sliderVal}%
            </span>
          </div>

          {/* Graphical Ruler */}
          <div className="py-4 relative">
            <div className="h-5 bg-slate-200 border border-slate-300 relative rounded-full overflow-hidden flex items-center">
              <div 
                className={`h-full ${colors.barBg} transition-all duration-75`}
                style={{ width: `${sliderVal}%` }}
              ></div>
              {/* Tick marks */}
              <div className="absolute inset-x-0 inset-y-0 flex justify-between px-3 text-[10px] font-mono font-bold text-slate-500 pointer-events-none items-center">
                <span>0 UNIT</span>
                <span>MIN</span>
                <span>MID</span>
                <span>MAX</span>
                <span>100 UNIT</span>
              </div>
            </div>
            
            {/* Interactive Slider */}
            <input 
              type="range"
              min="0"
              max="100"
              value={sliderVal}
              onChange={(e) => setSliderVal(Number(e.target.value))}
              className={`w-full mt-4 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${colors.accentSlider}`}
            />
          </div>

          <p className="text-sm text-slate-500 leading-relaxed text-center italic mt-2 font-mono">
            Notice how you can slide smoothly between any two values? There are infinite increments!
          </p>
         </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-4 text-slate-700">
          <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wide mb-3 flex items-center gap-1">
            <Layers className="w-4 h-4 text-slate-500" /> Folder Compartment Bins
          </div>

          {/* Graphical Buckets */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {exampleData.slice(0, 4).map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedBucketIdx(idx)}
                className={`p-4 rounded-xl border text-center transition active:scale-95 text-sm flex flex-col items-center justify-center gap-2 cursor-pointer ${
                  selectedBucketIdx === idx 
                    ? colors.bucketSelected 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 shadow-sm'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${selectedBucketIdx === idx ? colors.bulletSelected : 'bg-slate-100 border-slate-300 text-slate-400'}`}>
                  {idx + 1}
                </div>
                <span className="truncate max-w-full font-bold">{item}</span>
              </button>
            ))}
          </div>

          <p className="text-sm text-slate-600 leading-relaxed text-center italic font-mono min-h-[40px] flex items-center justify-center">
            {selectedBucketIdx !== null 
              ? `You selected Compartment folder [${exampleData[selectedBucketIdx]}]. You are sorted into an absolute category bin!`
              : "Click any folder bin above. Notice how you jump from one name to another? There is no 'middle' state."}
          </p>
        </div>
      )}

      {/* Narrative block */}
      <div className={`rounded-xl p-4 text-sm md:text-base leading-relaxed flex items-start gap-3 ${colors.narrativeCard}`}>
        <Info className={`w-5 h-5 shrink-0 mt-0.5 ${colors.text}`} />
        <div>
          <span className="font-bold flex items-center gap-1 mb-1">{analogy.concept} Mode:</span>
          {analogy.analogyText}
        </div>
      </div>
    </div>
  );
}
