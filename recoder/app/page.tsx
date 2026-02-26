"use client";

import { useEffect, useState } from "react";
import { Header } from "../src/components/Header";
import { CodeEditor } from "../src/components/Editor";
import { ResultModal } from "../src/components/ResultModal";
import { TestPanel } from "../src/components/TestPanel";
import { getDailyChallenge, Challenge } from "../src/lib/challenges";
import { validateCode, ValidationResult } from "../src/lib/validation";
import { useProgress } from "../src/hooks/useProgress";

export default function Home() {
  const { progress, isLoaded, markChallengeCompleted, isTodayCompleted } = useProgress();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState<string>("");
  const [attempts, setAttempts] = useState(0);

  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const daily = getDailyChallenge();
    setChallenge(daily);
    setCode(daily.buggyCode);
  }, []);

  const handleRunCode = () => {
    if (!challenge) return;
    setAttempts(a => a + 1);

    const result = validateCode(code, challenge.testCases);
    setValidationResult(result);

    if (result.success && !isTodayCompleted()) {
      markChallengeCompleted(challenge.id);
      setTimeout(() => setShowModal(true), 500);
    } else if (result.success) {
      setTimeout(() => setShowModal(true), 500);
    }
  };

  const handleReset = () => {
    if (challenge) {
      setCode(challenge.buggyCode);
      setValidationResult(null);
    }
  };

  if (!isLoaded || !challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const completed = isTodayCompleted();
  const testsRemaining = validationResult ? challenge.testCases.length - validationResult.passedCount : challenge.testCases.length;

  return (
    <>
      <Header streak={progress.currentStreak} />

      {/* Mocked Game Background (Dimmed) exactly from Stitch */}
      <div className="fixed inset-0 z-0 flex flex-col items-center justify-center opacity-20 pointer-events-none">
        <div className="grid grid-cols-5 gap-2 mb-4">
          <div className="w-12 h-12 bg-primary/20 border-2 border-primary/30 rounded"></div>
          <div className="w-12 h-12 bg-primary border-2 border-primary rounded"></div>
          <div className="w-12 h-12 bg-primary/20 border-2 border-primary/30 rounded"></div>
          <div className="w-12 h-12 bg-primary/20 border-2 border-primary/30 rounded"></div>
          <div className="w-12 h-12 bg-primary/20 border-2 border-primary/30 rounded"></div>
        </div>
        <div className="grid grid-cols-5 gap-2 mb-4">
          <div className="w-12 h-12 bg-primary border-2 border-primary rounded"></div>
          <div className="w-12 h-12 bg-primary border-2 border-primary rounded"></div>
          <div className="w-12 h-12 bg-primary border-2 border-primary rounded"></div>
          <div className="w-12 h-12 bg-primary border-2 border-primary rounded"></div>
          <div className="w-12 h-12 bg-primary border-2 border-primary rounded"></div>
        </div>
        <div className="grid grid-cols-5 gap-2 mb-4">
          <div className="w-12 h-12 bg-primary/10 border-2 border-slate-700 rounded"></div>
          <div className="w-12 h-12 bg-primary/10 border-2 border-slate-700 rounded"></div>
          <div className="w-12 h-12 bg-primary/10 border-2 border-slate-700 rounded"></div>
          <div className="w-12 h-12 bg-primary/10 border-2 border-slate-700 rounded"></div>
          <div className="w-12 h-12 bg-primary/10 border-2 border-slate-700 rounded"></div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 max-w-4xl mx-auto w-full z-10 relative">
        <div className="w-full space-y-8">

          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">Daily Challenge</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">{challenge.title} - {challenge.description}</p>
          </div>

          <CodeEditor code={code} onChange={setCode} readOnly={completed} />

          <TestPanel challenge={challenge} validationResult={validationResult} />

          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-4 w-full max-w-sm">
              <button
                onClick={handleRunCode}
                disabled={completed}
                className={`flex-1 bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 ${completed ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="material-symbols-outlined">play_arrow</span>
                {completed ? "Completed" : "Run Code"}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-4 rounded-xl border border-slate-200 dark:border-primary/20 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-primary/10 transition-colors flex items-center justify-center"
                title="Reset Code"
              >
                <span className="material-symbols-outlined">restart_alt</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-slate-500 dark:text-primary/60 font-medium">
              <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
              <span>{testsRemaining} test cases remaining</span>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Area from Stitch */}
      <footer className="mt-auto border-t border-slate-200 dark:border-primary/10 py-8 px-4 z-10 relative bg-background-light dark:bg-background-dark">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">

            <div className="flex flex-col items-center md:items-start">
              <span className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Current Streak</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500 fill-1">local_fire_department</span>
                <span className="text-xl font-bold">{progress.currentStreak} Days</span>
              </div>
            </div>

            <div className="w-px h-10 bg-slate-200 dark:bg-primary/10"></div>

            <div className="flex flex-col items-center md:items-start">
              <span className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Rank</span>
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined">workspace_premium</span>
                <span className="text-xl font-bold">Junior</span>
              </div>
            </div>

          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 dark:text-slate-400">Share your progress:</span>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border border-slate-200 dark:border-primary/20 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-xl text-slate-300">share</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-slate-400 dark:text-slate-600">
          © 2026 RECODER. Built for developers.
        </div>
      </footer>

      <ResultModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        dayIndex={new Date().getDate()}
        attempts={attempts}
        streak={progress.currentStreak}
      />
    </>
  );
}
