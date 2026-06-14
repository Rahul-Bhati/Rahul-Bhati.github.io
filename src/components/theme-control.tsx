"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

type Mode = "system" | "light" | "dark";

const options: { mode: Mode; label: string; Icon: typeof Sun }[] = [
  { mode: "system", label: "System", Icon: Monitor },
  { mode: "light", label: "Light", Icon: Sun },
  { mode: "dark", label: "Dark", Icon: Moon },
];

function applyMode(mode: Mode) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = mode === "dark" || (mode === "system" && prefersDark);
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeControl() {
  const [mode, setMode] = useState<Mode | null>(null);

  useEffect(() => {
    let stored: Mode = "system";
    try {
      const v = localStorage.getItem("theme");
      if (v === "light" || v === "dark") stored = v;
    } catch {}
    setMode(stored);

    // Track OS changes while in system mode.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      try {
        if (!localStorage.getItem("theme")) applyMode("system");
      } catch {}
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function select(next: Mode) {
    setMode(next);
    try {
      if (next === "system") localStorage.removeItem("theme");
      else localStorage.setItem("theme", next);
    } catch {}
    applyMode(next);
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-sm text-neutral-500 dark:text-neutral-500">Theme</span>
      <div
        role="radiogroup"
        aria-label="Color theme"
        className="inline-flex items-center rounded-lg border border-neutral-200 p-0.5 dark:border-neutral-800"
      >
        {options.map(({ mode: m, label, Icon }) => {
          const active = mode === m;
          return (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={label}
              title={label}
              onClick={() => select(m)}
              className={`grid size-7 place-items-center rounded-md transition-colors ${
                active
                  ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                  : "text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300"
              }`}
            >
              <Icon size={15} strokeWidth={2} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
