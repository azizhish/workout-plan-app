"use client";

import { useState } from "react";

const QUESTIONS = [
  "Has a doctor ever said you have a heart condition and should only do physical activity recommended by a doctor?",
  "Do you experience chest pain during physical activity or at rest?",
  "Do you have a bone or joint problem that could be made worse by exercise?",
];

type Answer = "yes" | "no" | null;

export default function ParqScreen({
  onCleared,
  onBlocked,
}: {
  onCleared: () => void;
  onBlocked: () => void;
}) {
  const [answers, setAnswers] = useState<Answer[]>(QUESTIONS.map(() => null));
  const allAnswered = answers.every((a) => a !== null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!allAnswered) return;
    if (answers.some((a) => a === "yes")) onBlocked();
    else onCleared();
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold">First, a quick safety check</h3>
        <p className="mt-2 text-stone-600">
          Three yes-or-no questions to make sure it&apos;s safe for you to start exercising.
        </p>
      </div>

      {QUESTIONS.map((q, i) => (
        <fieldset key={i} className="rounded-xl border border-stone-200 bg-white p-5">
          <legend className="sr-only">Question {i + 1}</legend>
          <p className="font-medium leading-snug">{q}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {(["yes", "no"] as const).map((value) => (
              <label
                key={value}
                className="flex min-h-12 cursor-pointer items-center justify-center rounded-lg border-2 border-stone-200 text-lg font-medium has-checked:border-teal-700 has-checked:bg-teal-50 has-checked:text-teal-900 has-focus-visible:ring-2 has-focus-visible:ring-teal-700"
              >
                <input
                  type="radio"
                  name={`parq-${i}`}
                  value={value}
                  checked={answers[i] === value}
                  onChange={() => setAnswers((prev) => prev.map((a, j) => (j === i ? value : a)))}
                  className="sr-only"
                />
                {value === "yes" ? "Yes" : "No"}
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      <button
        type="submit"
        disabled={!allAnswered}
        className="w-full rounded-xl bg-teal-700 px-6 py-4 text-lg font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500"
      >
        Continue
      </button>
    </form>
  );
}

export function ParqBlocked() {
  return (
    <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-6">
      <h3 className="text-2xl font-semibold text-amber-950">Please check with your doctor first</h3>
      <p className="mt-3 text-lg leading-relaxed text-amber-950">
        For your safety, we recommend consulting with a doctor before starting an exercise program.
        We&apos;re unable to generate a plan until you&apos;ve been cleared for exercise.
      </p>
      <p className="mt-3 text-amber-900">You have not been charged anything.</p>
    </div>
  );
}
