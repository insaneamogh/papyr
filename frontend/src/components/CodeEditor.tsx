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
            monaco.editor.defineTheme('papyr-light', {
                base: 'vs',
                inherit: true,
                rules: [
                    { token: 'comment', foreground: '9ca3af', fontStyle: 'italic' },
                    { token: 'keyword', foreground: '005cc5', fontStyle: 'bold' },
                    { token: 'string', foreground: '032f62' },
                    { token: 'number', foreground: '005cc5' },
                    { token: 'type', foreground: 'd73a49' },
                ],
                colors: {
                    'editor.background': '#ffffff',
                    'editor.lineHighlightBackground': '#f3f4f6',
                    'editorLineNumber.foreground': '#9ca3af',
                    'editorIndentGuide.background': '#e5e7eb',
                }
            });
        }
    }, [monaco]);

    return (
        <div className="w-full h-full border-l border-gray-200 bg-white">
            <Editor
                height="100%"
                language={language}
                theme="papyr-light"
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
                    <div className="flex h-full items-center justify-center text-gray-400 font-semibold text-sm">
                        Loading editor...
                    </div>
                }
            />
        </div>
    );
}
