"use client";

import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";

interface CodeEditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    language?: string;
    readOnly?: boolean;
}

export default function CodeEditor({ value, onChange, language = "python", readOnly = false }: CodeEditorProps) {
    const monaco = useMonaco();

    useEffect(() => {
        if (monaco) {
            monaco.editor.defineTheme('papyr-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [
                    { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
                    { token: 'keyword', foreground: '3b82f6' },
                    { token: 'string', foreground: '10b981' },
                    { token: 'number', foreground: 'f59e0b' },
                    { token: 'type', foreground: '8b5cf6' },
                ],
                colors: {
                    'editor.background': '#000000',
                    'editor.lineHighlightBackground': '#111111',
                    'editorLineNumber.foreground': '#4b5563',
                    'editorIndentGuide.background': '#1f2937',
                }
            });
        }
    }, [monaco]);

    return (
        <div className="w-full h-full border-l border-gray-800 bg-black">
            <Editor
                height="100%"
                language={language}
                theme="papyr-dark"
                value={value}
                onChange={onChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    lineHeight: 24,
                    padding: { top: 24, bottom: 24 },
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                    cursorSmoothCaretAnimation: "on",
                    formatOnPaste: true,
                    readOnly: readOnly,
                    wordWrap: "on"
                }}
                loading={
                    <div className="flex h-full items-center justify-center text-gray-500 font-mono text-sm">
                        Loading editor...
                    </div>
                }
            />
        </div>
    );
}
