interface ResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    dayIndex: number;
    attempts: number;
    streak: number;
}

export function ResultModal({ isOpen, onClose, dayIndex, attempts, streak }: ResultModalProps) {
    if (!isOpen) return null;

    const generateShareText = () => {
        const boxes = "🟩".repeat(3);
        const text = `Recoder - Day ${dayIndex}\nAttempts: ${attempts}\n${boxes}\n\nCan you fix the code? test-recoder.vercel.app`;

        navigator.clipboard.writeText(text).then(() => {
            alert("Results copied to clipboard!");
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-dark/80 blur-overlay p-4">
            {/* Success Card Container */}
            <div className="relative w-full max-w-md bg-white dark:bg-[#162a1d] border border-primary/20 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Top Navigation / Close */}
                <header className="flex items-center justify-between px-6 py-4 border-b border-primary/10">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">terminal</span>
                        <span className="font-bold text-sm tracking-widest uppercase">Recoder</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-primary/10 transition-colors"
                    >
                        <span className="material-symbols-outlined text-slate-400">close</span>
                    </button>
                </header>

                <div className="p-6 md:p-8 flex flex-col items-center">

                    {/* Header Section */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                            <span className="material-symbols-outlined text-primary text-4xl">check_circle</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Solved!</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Excellent performance today.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 w-full mb-6">
                        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-100 dark:bg-background-dark border border-primary/10">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter mb-1">Time</span>
                            <span className="text-2xl font-black text-slate-900 dark:text-white">--:--</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-100 dark:bg-background-dark border border-primary/10">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter mb-1">Attempts</span>
                            <span className="text-2xl font-black text-slate-900 dark:text-white">{attempts}</span>
                        </div>
                    </div>

                    {/* Streak Banner */}
                    <div className="w-full p-4 mb-8 rounded-xl bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-3xl">local_fire_department</span>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-primary leading-none">Daily Streak</span>
                                <span className="text-lg font-black dark:text-white">{streak} Days</span>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div key={i} className={`w-1.5 h-6 rounded-full ${i < Math.min(streak, 7) ? 'bg-primary' : 'bg-primary/20'}`}></div>
                            ))}
                        </div>
                    </div>

                    {/* Social Share / Results Mock */}
                    <div className="w-full space-y-4">
                        <div className="bg-slate-100 dark:bg-background-dark/50 p-4 rounded-lg flex flex-col items-center justify-center border border-dashed border-primary/30">
                            <div className="text-xl tracking-widest mb-2 select-none text-center">
                                🟩🟩⬜🟩<br />
                                🟩🟩🟩🟩
                            </div>
                            <button
                                onClick={generateShareText}
                                className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-background-dark font-bold rounded-lg hover:brightness-110 active:scale-[0.98] transition-all"
                            >
                                <span className="material-symbols-outlined text-xl">share</span>
                                COPY RESULTS
                            </button>
                        </div>
                    </div>

                    {/* Footer / Next Challenge */}
                    <div className="mt-8 flex flex-col items-center gap-2 border-t border-primary/10 pt-6 w-full">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            <span>New challenge tomorrow</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Confetti-like Accent Decoration */}
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary rotate-45 rounded-sm opacity-20 pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-primary rounded-full opacity-20 pointer-events-none"></div>
            <div className="absolute top-1/2 right-20 w-5 h-2 bg-primary rounded-full opacity-10 pointer-events-none"></div>
        </div >
    );
}
