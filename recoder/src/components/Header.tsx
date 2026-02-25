import { Flame, Code2 } from "lucide-react";

interface HeaderProps {
    streak: number;
}

export function Header({ streak }: HeaderProps) {
    return (
        <header className="glass-panel px-6 py-4 flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-lg">
                    <Code2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl font-bold title-gradient m-0">Recoder</h1>
                    <p className="text-xs text-text-muted m-0">The Daily Code Fixer</p>
                </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-surface-border">
                <Flame className={`w-5 h-5 ${streak > 0 ? "text-orange-500 fill-orange-500" : "text-gray-500"}`} />
                <span className="font-semibold">{streak} Day Streak</span>
            </div>
        </header>
    );
}
