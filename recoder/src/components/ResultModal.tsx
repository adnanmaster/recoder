import { X, Share2, CheckCircle2 } from "lucide-react";

interface ResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    dayIndex: number;
    attempts: number;
}

export function ResultModal({ isOpen, onClose, dayIndex, attempts }: ResultModalProps) {
    if (!isOpen) return null;

    const generateShareText = () => {
        // Basic share text format
        const boxes = "🟩".repeat(3); // Just hardcoding 3 for the MVP
        const text = `Recoder - Day ${dayIndex}\nAttempts: ${attempts}\n${boxes}\n\nCan you fix the code? test-recoder.vercel.app`;

        // Copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
            alert("Results copied to clipboard!");
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in px-4">
            <div className="glass-panel w-full max-w-md p-8 relative flex flex-col items-center text-center">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-success" />
                </div>

                <h2 className="text-3xl font-bold mb-2">Challenge Solved!</h2>
                <p className="text-text-muted mb-8">
                    You correctly fixed today's broken code snippet.
                </p>

                <div className="bg-[#0d1117] border border-surface-border rounded-xl p-4 w-full mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-text-muted font-medium">Day</span>
                        <span className="font-bold text-xl">{dayIndex}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-text-muted font-medium">Attempts</span>
                        <span className="font-bold text-xl">{attempts}</span>
                    </div>
                </div>

                <button
                    onClick={generateShareText}
                    className="btn btn-primary w-full py-3 text-lg"
                >
                    <Share2 className="w-5 h-5" />
                    Share Result
                </button>
            </div>
        </div>
    );
}
