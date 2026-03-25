"use client";

import { useState, useEffect, useRef } from "react";
import { X, Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Timer, Flame } from "lucide-react";
import { RecipeData } from "./RecipeForm";

export default function CookingMode({ recipe }: { recipe: RecipeData }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [timerOpen, setTimerOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const lastClickTime = useRef(0);

  // Refined timer detection
  const stepText = recipe.steps[currentStep];
  const timeMatch = stepText.match(/(\d+(?:-\d+)?)\s*(mins?|minutes?|hours?|hrs?|seconds?|secs?)/i);
  
  const getSeconds = (match: RegExpMatchArray | null) => {
    if (!match) return 0;
    const rawVal = match[1];
    const unit = match[2].toLowerCase();
    
    // Handle ranges by taking the first number
    const val = parseInt(rawVal.split('-')[0]);
    
    if (unit.startsWith('h')) return val * 3600;
    if (unit.startsWith('s')) return val;
    return val * 60;
  };

  const detectedSeconds = getSeconds(timeMatch);
  const detectedLabel = timeMatch ? `${timeMatch[1]} ${timeMatch[2]}` : "";

  useEffect(() => {
    let interval: any;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const startTimer = (seconds: number) => {
    setTimeLeft(seconds);
    setTimerRunning(true);
    setTimerOpen(true);
  };

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    const diff = now - lastClickTime.current;
    lastClickTime.current = now;

    if (diff < 300) {
      // Double click - Prev
      if (currentStep > 0) setCurrentStep(currentStep - 1);
    } else {
      // Single click - Next (wait a bit to ensure it's not a double click)
      setTimeout(() => {
        if (Date.now() - lastClickTime.current >= 300) {
          if (currentStep < recipe.steps.length - 1) setCurrentStep(currentStep + 1);
        }
      }, 300);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="fixed inset-0 z-[200] bg-artisanal-dark flex flex-col items-center justify-center p-8 md:p-24 overflow-hidden select-none cursor-pointer"
      onClick={handleInteraction}
    >
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
      
      {/* Exit Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); window.location.href = `/${recipe.id}`; }}
        className="absolute top-12 right-12 text-white/20 hover:text-white transition-colors p-4"
      >
        <X className="h-10 w-10" />
      </button>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-white/5">
        <div 
          className="h-full bg-artisanal-brown transition-all duration-700 ease-out" 
          style={{ width: `${((currentStep + 1) / recipe.steps.length) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="w-full max-w-5xl space-y-16 relative">
        <div className="space-y-4">
          <span className="text-artisanal-brown font-bold tracking-[0.5em] text-sm uppercase block text-center">
            Step {currentStep + 1} of {recipe.steps.length}
          </span>
          <div className="h-px w-24 bg-white/10 mx-auto" />
        </div>

        <div className="text-center">
          <h2 className="font-serif text-5xl md:text-8xl text-white leading-[1.2] animate-in fade-in slide-in-from-bottom-8 duration-700 key={currentStep}">
            {stepText}
          </h2>
        </div>

        {/* Dynamic Timer Trigger */}
        {detectedSeconds > 0 && (
          <div className="flex justify-center pt-12">
            <button
              onClick={(e) => { e.stopPropagation(); startTimer(detectedSeconds); }}
              className="group flex items-center bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-5 rounded-3xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Timer className="h-6 w-6 text-artisanal-brown mr-4 group-hover:animate-pulse" />
              <div className="text-left">
                <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest leading-none mb-1">Start Smart Timer</p>
                <p className="text-white font-serif text-xl font-bold">{detectedLabel}</p>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Instruction */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-12 text-white/20 text-[10px] font-bold uppercase tracking-[0.3em] pointer-events-none">
        <span className="flex items-center"><ChevronLeft className="h-3 w-3 mr-2" /> Double Tap Prev</span>
        <div className="h-1 w-1 rounded-full bg-white/10" />
        <span className="flex items-center">Single Tap Next <ChevronRight className="h-3 w-3 ml-2" /></span>
      </div>

      {/* Floating Timer Panel */}
      {timerOpen && (
        <div 
          className="fixed bottom-24 right-24 z-[210] bg-white rounded-[2.5rem] p-10 shadow-2xl border border-cream-200 w-80 animate-in slide-in-from-right-8 fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-artisanal-dark font-bold text-[10px] uppercase tracking-[0.3em]">Active Timer</h3>
            <button onClick={() => setTimerOpen(false)} className="text-artisanal-dark/20 hover:text-artisanal-dark transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="text-center space-y-8">
            <p className={`font-serif text-6xl font-bold tracking-tight ${timeLeft === 0 ? 'text-red-600 animate-bounce' : 'text-artisanal-dark'}`}>
              {timeLeft === 0 ? "Time's up!" : formatTime(timeLeft)}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setTimerRunning(!timerRunning)}
                className={`flex-1 rounded-2xl py-5 flex items-center justify-center transition-all ${timerRunning ? 'bg-cream-100 text-artisanal-dark' : 'bg-artisanal-dark text-white shadow-xl'}`}
              >
                {timerRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </button>
              <button 
                onClick={() => { setTimeLeft(detectedSeconds); setTimerRunning(true); }}
                className="p-5 rounded-2xl bg-cream-50 text-artisanal-dark hover:bg-cream-100 transition-colors"
              >
                <RotateCcw className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
