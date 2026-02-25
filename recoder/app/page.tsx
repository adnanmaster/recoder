"use client";

import { useEffect, useState } from "react";
import { Header } from "../src/components/Header";
import { CodeEditor } from "../src/components/Editor";
import { ResultModal } from "../src/components/ResultModal";
import { getDailyChallenge, Challenge } from "../src/lib/challenges";
import { validateCode, ValidationResult } from "../src/lib/validation";
import { useProgress } from "../src/hooks/useProgress";
import { Play, RotateCcw, CheckCircle2, XCircle } from "lucide-react";

export default function Home() {
  const { progress, isLoaded, markChallengeCompleted, isTodayCompleted } = useProgress();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState<string>("");
  const [attempts, setAttempts] = useState(0);

  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Load daily challenge on mount
    const daily = getDailyChallenge();
    setChallenge(daily);
    setCode(daily.buggyCode);
  }, []);

  const handleRunCode = () => {
    if (!challenge) return;

    setAttempts(a => a + 1);

    // Simulate slight network delay/processing
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
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-text-muted">Loading today's challenge...</p>
        </div>
      </div>
    );
  }

  const completed = isTodayCompleted();

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 w-full">
      <Header streak={progress.currentStreak} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Challenge Description & Results */}
        <div className="lg:col-span-1 space-y-6">
          <section className="glass-panel p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{challenge.title}</h2>
              {completed && (
                <span className="bg-success/20 text-success text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Solved
                </span>
              )}
            </div>
            <p className="text-text-main text-sm leading-relaxed mb-6">
              {challenge.description}
            </p>

            <div className="bg-[#0d1117] rounded-lg p-4 border border-surface-border">
              <h3 className="text-sm font-semibold text-text-muted mb-3 uppercase tracking-wider">Test Cases</h3>
              <div className="space-y-3">
                {challenge.testCases.map((tc, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between text-text-muted mb-1">
                      <span>Input: <code className="text-primary">{JSON.stringify(tc.input)}</code></span>
                    </div>
                    <div>
                      <span className="text-text-muted">Expected: </span>
                      <code className="text-success">{JSON.stringify(tc.expectedOutput)}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Validation Results Panel */}
          {validationResult && (
            <section className={`glass-panel p-6 border-l-4 ${validationResult.success ? 'border-l-success' : 'border-l-danger'}`}>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                {validationResult.success ? (
                  <><CheckCircle2 className="w-5 h-5 text-success" /> All Tests Passed!</>
                ) : (
                  <><XCircle className="w-5 h-5 text-danger" /> Tests Failed</>
                )}
              </h3>

              {validationResult.error ? (
                <div className="bg-danger/10 text-danger p-3 rounded-md text-sm font-mono whitespace-pre-wrap">
                  {validationResult.error}
                </div>
              ) : (
                <div className="space-y-4">
                  {validationResult.results.map((r, i) => (
                    <div key={i} className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        {r.passed ? <CheckCircle2 className="w-4 h-4 text-success" /> : <XCircle className="w-4 h-4 text-danger" />}
                        <span className="font-medium">Test {i + 1}</span>
                      </div>
                      {!r.passed && (
                        <div className="pl-6 text-xs bg-[#0d1117] p-2 rounded border border-surface-border mt-1">
                          {r.error ? (
                            <span className="text-danger font-mono">{r.error}</span>
                          ) : (
                            <>
                              <div className="text-text-muted">Expected: <span className="text-success">{JSON.stringify(r.expected)}</span></div>
                              <div className="text-text-muted">Actual: <span className="text-danger">{JSON.stringify(r.actual)}</span></div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        {/* Right Column: Code Editor */}
        <div className="lg:col-span-2 space-y-4">
          <CodeEditor
            code={code}
            onChange={setCode}
            readOnly={completed}
          />

          <div className="flex justify-between items-center">
            <button
              onClick={handleReset}
              className="btn bg-surface-color border border-surface-border text-text-muted hover:text-text-main"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Code
            </button>

            <button
              onClick={handleRunCode}
              disabled={completed}
              className={`btn btn-primary ${completed ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Play className="w-4 h-4 text-black fill-black" />
              {completed ? "Completed" : "Run Code"}
            </button>
          </div>
        </div>

      </div>

      <ResultModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        dayIndex={new Date().getDate()}
        attempts={attempts}
      />
    </main>
  );
}
