interface HeaderProps {
    streak: number;
}

export function Header({ streak }: HeaderProps) {
    return (
        <header className="border-b border-primary/10 px-4 md:px-10 py-4 flex items-center justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-50">
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">terminal</span>
                <h1 className="text-xl font-bold tracking-tighter code-font text-slate-900 dark:text-slate-50">RECODER</h1>
            </div>
            <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:text-primary" title="How to Play">
                    <span className="material-symbols-outlined">help_outline</span>
                </button>
                <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:text-primary" title="Statistics">
                    <span className="material-symbols-outlined">leaderboard</span>
                </button>
                <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:text-primary" title="Settings">
                    <span className="material-symbols-outlined">settings</span>
                </button>
            </div>
        </header>
    );
}
