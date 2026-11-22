"use client";

import type { BeforeMount, OnMount } from "@monaco-editor/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Monaco ne fonctionne pas côté serveur : chargement uniquement dans le navigateur.
const Monaco = dynamic(() => import("@monaco-editor/react").then((m) => m.default), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

type ThemeName = "rustine-night" | "rustine-day" | "rustine-blackout";

const defineThemes: BeforeMount = (monaco) => {
  monaco.editor.defineTheme("rustine-night", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6f6d5e", fontStyle: "italic" },
      { token: "keyword", foreground: "7fc8f8" },
      { token: "string", foreground: "b8f25c" },
      { token: "number", foreground: "ffb938" },
      { token: "regexp", foreground: "ff8a6b" },
      { token: "type", foreground: "ffb938" },
      { token: "identifier", foreground: "ece8d9" },
      { token: "delimiter", foreground: "b4b09f" },
    ],
    colors: {
      "editor.background": "#0c0d0a",
      "editor.foreground": "#ece8d9",
      "editorLineNumber.foreground": "#4a4c40",
      "editorLineNumber.activeForeground": "#b8f25c",
      "editor.lineHighlightBackground": "#171913",
      "editor.lineHighlightBorder": "#00000000",
      "editor.selectionBackground": "#b8f25c33",
      "editor.inactiveSelectionBackground": "#b8f25c1a",
      "editorCursor.foreground": "#b8f25c",
      "editorIndentGuide.background1": "#22251d",
      "editorIndentGuide.activeBackground1": "#3d4135",
      "editorWhitespace.foreground": "#2a2d24",
      "editorBracketMatch.background": "#b8f25c22",
      "editorBracketMatch.border": "#b8f25c66",
      "scrollbarSlider.background": "#3d413566",
      "scrollbarSlider.hoverBackground": "#3d4135aa",
      "editorGutter.background": "#0c0d0a",
      "editorWidget.background": "#171913",
      "editorWidget.border": "#3d4135",
    },
  });
  monaco.editor.defineTheme("rustine-day", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "8a8775", fontStyle: "italic" },
      { token: "keyword", foreground: "1f6fa8" },
      { token: "string", foreground: "3d7a00" },
      { token: "number", foreground: "9a6200" },
      { token: "type", foreground: "9a6200" },
      { token: "identifier", foreground: "16170f" },
    ],
    colors: {
      "editor.background": "#fbf9f2",
      "editor.foreground": "#16170f",
      "editorLineNumber.foreground": "#bfb9a4",
      "editorLineNumber.activeForeground": "#3d7a00",
      "editor.lineHighlightBackground": "#f2efe4",
      "editor.lineHighlightBorder": "#00000000",
      "editor.selectionBackground": "#3d7a0026",
      "editorCursor.foreground": "#3d7a00",
      "editorIndentGuide.background1": "#e8e4d6",
      "editorGutter.background": "#fbf9f2",
    },
  });
  monaco.editor.defineTheme("rustine-blackout", {
    base: "vs-dark",
    inherit: false,
    rules: [
      { token: "", foreground: "9dff8a" },
      { token: "comment", foreground: "3f7a36", fontStyle: "italic" },
      { token: "string", foreground: "d8ff6a" },
      { token: "keyword", foreground: "c8ffbd", fontStyle: "bold" },
    ],
    colors: {
      "editor.background": "#000000",
      "editor.foreground": "#9dff8a",
      "editorLineNumber.foreground": "#1f3a1f",
      "editorLineNumber.activeForeground": "#9dff8a",
      "editor.lineHighlightBackground": "#0b120a",
      "editor.lineHighlightBorder": "#00000000",
      "editor.selectionBackground": "#9dff8a33",
      "editorCursor.foreground": "#9dff8a",
      "editorIndentGuide.background1": "#0f1f0f",
      "editorGutter.background": "#000000",
    },
  });
};

function currentTheme(blackout: boolean): ThemeName {
  if (blackout) return "rustine-blackout";
  return document.documentElement.dataset.theme === "light" ? "rustine-day" : "rustine-night";
}

export interface CodeEditorProps {
  path: string;
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  blackout: boolean;
}

export function CodeEditor({ path, value, onChange, onRun, blackout }: CodeEditorProps) {
  const [theme, setTheme] = useState<ThemeName>("rustine-night");
  const runRef = useRef(onRun);
  runRef.current = onRun;

  useEffect(() => {
    setTheme(currentTheme(blackout));
    const onTheme = () => setTheme(currentTheme(blackout));
    window.addEventListener("rustine-theme", onTheme);
    return () => window.removeEventListener("rustine-theme", onTheme);
  }, [blackout]);

  const onMount: OnMount = (editor, monaco) => {
    // Ctrl/Cmd + Entrée : lancer les tests sans quitter le clavier.
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runRef.current());
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    });
  };

  return (
    <Monaco
      path={path}
      language={path.endsWith(".py") ? "python" : "javascript"}
      value={value}
      onChange={(v) => onChange(v ?? "")}
      beforeMount={defineThemes}
      onMount={onMount}
      theme={theme}
      loading={<EditorSkeleton />}
      options={{
        fontFamily: "var(--font-jetbrains), ui-monospace, monospace",
        fontSize: 14,
        lineHeight: 22,
        // Pas de ligatures : on veut voir <= et =>, pas ≤ et ⇒.
        fontLigatures: false,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        padding: { top: 16, bottom: 16 },
        renderLineHighlight: "all",
        // En Blackout, l'écran reste strictement monochrome.
        bracketPairColorization: { enabled: !blackout },
        smoothScrolling: true,
        cursorBlinking: "phase",
        cursorSmoothCaretAnimation: "on",
        tabSize: 2,
        automaticLayout: true,
        // Pas d'autocomplétion « magique » : le joueur doit comprendre ce qu'il écrit.
        quickSuggestions: false,
        suggestOnTriggerCharacters: false,
        inlineSuggest: { enabled: false },
        wordBasedSuggestions: "off",
        parameterHints: { enabled: true },
        accessibilitySupport: "auto",
        tabFocusMode: false,
        ariaLabel: `Éditeur de code, fichier ${path}. Échap puis Tab pour sortir de l'éditeur.`,
      }}
    />
  );
}

function EditorSkeleton() {
  return (
    <div className="h-full space-y-2.5 bg-sunken p-5" aria-hidden="true">
      {[62, 40, 0, 75, 55, 68, 30].map((w, i) => (
        <div key={i} className="flex gap-4">
          <span className="h-3 w-5 rounded bg-line" />
          {w > 0 && <span className="h-3 animate-pulse rounded bg-line" style={{ width: `${w}%` }} />}
        </div>
      ))}
    </div>
  );
}
