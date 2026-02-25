import React from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';

interface CodeEditorProps {
    code: string;
    onChange: (code: string) => void;
    lang?: string;
    readOnly?: boolean;
}

export function CodeEditor({ code, onChange, lang = "javascript", readOnly = false }: CodeEditorProps) {
    // Generate simple line numbers for visual effect
    const lineCount = code.split('\\n').length || 1;
    const lines = Array.from({ length: Math.max(lineCount, 5) }, (_, i) => i + 1);

    return (
        <div className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-primary/20 bg-white dark:bg-slate-950 shadow-2xl">
            {/* Mac OS Style Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-primary/5 border-b border-slate-200 dark:border-primary/10">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <span className="text-xs font-mono text-slate-400 dark:text-primary/40 uppercase tracking-widest">{lang}</span>
            </div>

            {/* Editor Body with line numbers */}
            <div className="flex code-font text-sm md:text-base leading-relaxed overflow-x-auto relative">
                {/* Line Numbers Sidebar */}
                <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-6 text-slate-400 border-r border-slate-200 dark:border-primary/10 text-right select-none min-w-[3rem]">
                    {lines.map(n => <div key={n} className="leading-6">{n}</div>)}
                </div>

                {/* Actual Editor Component */}
                <div className="flex-1 bg-white dark:bg-slate-950 min-h-[200px] outline-none relative">
                    <Editor
                        value={code}
                        onValueChange={onChange}
                        highlight={(code) => Prism.highlight(code, Prism.languages[lang], lang)}
                        padding={24}
                        disabled={readOnly}
                        style={{
                            fontFamily: 'inherit',
                            lineHeight: '1.5rem',
                            outline: 'none',
                            minHeight: '200px'
                        }}
                        className="prism-code"
                    />
                </div>
            </div>
        </div>
    );
}
