"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";

type CalcLabels = {
  service: string; size: string; complexity: string; duration: string; task: string; next: string; back: string; calculate: string; result: string; disclaimer: string; leave: string;
  options: Record<string, string>;
};

const steps = ["service", "size", "complexity", "duration", "task"] as const;
const choices = {
  service: ["analytics", "it", "strategy"],
  size: ["small", "medium", "large"],
  complexity: ["basic", "standard", "premium"],
  duration: ["short", "mid", "long"],
};
const base = { analytics: 200000, it: 350000, strategy: 180000 };
const sizeMultiplier = { small: 1, medium: 1.5, large: 2.5 };
const complexityMultiplier = { basic: 1, standard: 1.8, premium: 3 };
const durationMultiplier = { short: 1, mid: 0.9, long: 0.8 };

export function Calculator({ locale, labels }: { locale: Locale; labels: CalcLabels }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [complete, setComplete] = useState(false);
  const key = steps[step];
  const options = key === "task" ? [] : choices[key];
  const canContinue = key === "task" ? Boolean(values.task?.trim()) : Boolean(values[key]);
  const price = useMemo(() => {
    if (!values.service || !values.size || !values.complexity || !values.duration) return 0;
    return Math.round(base[values.service as keyof typeof base] * sizeMultiplier[values.size as keyof typeof sizeMultiplier] * complexityMultiplier[values.complexity as keyof typeof complexityMultiplier] * durationMultiplier[values.duration as keyof typeof durationMultiplier] / 10000) * 10000;
  }, [values]);
  const format = new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US");
  const selectOption = (option: string) => {
    setValues((current) => ({ ...current, [key]: option }));
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  if (complete) {
    return (
      <div className="calc-result">
        <span>{labels.result}</span>
        <strong>{format.format(Math.round(price * 0.85))}–{format.format(Math.round(price * 1.15))} ₽</strong>
        <p>{labels.disclaimer}</p>
        <Link className="button" href={`/${locale}/contacts?source=calculator`}>{labels.leave}</Link>
      </div>
    );
  }

  return (
    <div className="calculator">
      <div className="calc-progress"><span style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
      <div className="calc-head"><span>0{step + 1} / 0{steps.length}</span><h2>{labels[key]}</h2></div>
      {key === "task" ? (
        <textarea className="calc-textarea" value={values.task || ""} onChange={(event) => setValues({ ...values, task: event.target.value })} rows={6} maxLength={1000} autoFocus />
      ) : (
        <div className="calc-options">
          {options.map((option) => (
            <button key={option} type="button" className={values[key] === option ? "selected" : ""} onClick={() => selectOption(option)}>
              <span>{labels.options[option]}</span><i aria-hidden="true">↗</i>
            </button>
          ))}
        </div>
      )}
      <div className="calc-actions">
        <button type="button" className="text-button" disabled={step === 0} onClick={() => setStep(step - 1)}>{labels.back}</button>
        {key === "task" ? <button type="button" className="button" disabled={!canContinue} onClick={() => setComplete(true)}>{labels.calculate}</button> : <span className="calc-hint">{labels.next} →</span>}
      </div>
    </div>
  );
}
