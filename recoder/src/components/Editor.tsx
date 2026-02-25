import React from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
// We use the tomorrow night theme as a base for dark mode
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';

interface CodeEditorProps {
    code: string;
    onChange: (code: string) => void;
    lang?: string;
    readOnly?: boolean;
}

export function CodeEditor({ code, onChange, lang = "javascript", readOnly = false }: CodeEditorProps) {
    return (
        <div className="glass-panel overflow-hidden">
            <div className="bg-[#0d1117] border-b border-surface-border px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-danger"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                </div>
                <span className="text-xs text-text-muted font-mono ml-2">main.js</span>
            </div>

            <Editor
                value={code}
                onValueChange={onChange}
                highlight={(code) => Prism.highlight(code, Prism.languages[lang], lang)}
                padding={20}
                disabled={readOnly}
                style={{
                    fontFamily: '"Fira Code", "Consolas", monospace',
                    fontSize: 14,
                    minHeight: '300px',
                }}
                className="prism-code"
            />
        </div>
    );
}
