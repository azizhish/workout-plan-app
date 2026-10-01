"use client";

import { useState } from "react";
import { EQUIPMENT } from "@/lib/equipment";
import {
  EXPERIENCE_LEVELS,
  GENDERS,
  GOALS,
  submissionSchema,
  type SubmissionInput,
} from "@/lib/submission-schema";

type Errors = Partial<Record<keyof SubmissionInput, string>>;

const DAYS = [2, 3, 4, 5, 6];

const inputClass =
  "mt-2 block w-full rounded-lg border-2 border-stone-300 bg-white px-4 py-3 text-lg focus:border-teal-700 focus:outline-none aria-invalid:border-red-600";

const choiceClass =
  "flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border-2 border-stone-200 bg-white px-4 py-3 has-checked:border-teal-700 has-checked:bg-teal-50 has-focus-visible:ring-2 has-focus-visible:ring-teal-700";

function toNumber(value: string) {
  return value.trim() === "" ? undefined : Number(value);
}

export default function WorkoutForm() {
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [goal, setGoal] = useState("");
  const [experience, setExperience] = useState("");
  const [days, setDays] = useState<number | null>(null);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [limitations, setLimitations] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [serverError, setServerError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const payload = {
      email,
      age: toNumber(age),
      weight_kg: toNumber(weight),
      height_cm: toNumber(height),
      gender: gender || undefined,
      goal: goal || undefined,
      experience_level: experience || undefined,
      days_per_week: days ?? undefined,
      equipment,
      injuries_or_limitations: limitations,
      parq_cleared: true,
    };

    const parsed = submissionSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof SubmissionInput;
        fieldErrors[key] ??= issue.message;
      }
      setErrors(fieldErrors);
      const first = Object.keys(fieldErrors)[0];
      document.getElementById(`field-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }
      // Phase 2: redirect to Stripe Checkout here.
      setStatus("done");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="rounded-xl border border-teal-200 bg-teal-50 p-6">
        <h3 className="text-2xl font-semibold text-teal-950">Thanks — we&apos;ve got your details</h3>
        <p className="mt-2 text-lg text-teal-900">Your answers have been saved.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-10">
      <Section title="About you">
        <Field id="email" label="Email address" hint="We'll send your plan here." error={errors.email}>
          <input
            id="field-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field id="age" label="Age" error={errors.age}>
            <input
              id="field-age"
              type="number"
              inputMode="numeric"
              min={18}
              max={100}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              aria-invalid={!!errors.age}
              className={inputClass}
            />
          </Field>
          <Field id="weight_kg" label="Weight (kg)" error={errors.weight_kg}>
            <input
              id="field-weight_kg"
              type="number"
              inputMode="decimal"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              aria-invalid={!!errors.weight_kg}
              className={inputClass}
            />
          </Field>
        </div>

        <Field id="height_cm" label="Height (cm)" optional error={errors.height_cm}>
          <input
            id="field-height_cm"
            type="number"
            inputMode="decimal"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            aria-invalid={!!errors.height_cm}
            className={inputClass}
          />
        </Field>

        <Field id="gender" label="Gender" optional error={errors.gender}>
          <select
            id="field-gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className={inputClass}
          >
            <option value="">Choose one</option>
            {GENDERS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      <Section title="Your goals">
        <ChoiceGroup id="goal" legend="What's your main goal?" error={errors.goal}>
          {GOALS.map((g) => (
            <label key={g.id} className={choiceClass}>
              <input
                type="radio"
                name="goal"
                value={g.id}
                checked={goal === g.id}
                onChange={() => setGoal(g.id)}
                className="size-5 accent-teal-700"
              />
              <span className="text-lg">{g.label}</span>
            </label>
          ))}
        </ChoiceGroup>

        <ChoiceGroup id="experience_level" legend="How experienced are you with exercise?" error={errors.experience_level}>
          {EXPERIENCE_LEVELS.map((x) => (
            <label key={x.id} className={choiceClass}>
              <input
                type="radio"
                name="experience_level"
                value={x.id}
                checked={experience === x.id}
                onChange={() => setExperience(x.id)}
                className="size-5 shrink-0 accent-teal-700"
              />
              <span>
                <span className="block text-lg">{x.label}</span>
                <span className="block text-stone-600">{x.hint}</span>
              </span>
            </label>
          ))}
        </ChoiceGroup>

        <ChoiceGroup id="days_per_week" legend="How many days a week can you exercise?" error={errors.days_per_week}>
          <div className="grid grid-cols-5 gap-2">
            {DAYS.map((d) => (
              <label key={d} className={`${choiceClass} justify-center px-0 text-xl font-semibold`}>
                <input
                  type="radio"
                  name="days_per_week"
                  value={d}
                  checked={days === d}
                  onChange={() => setDays(d)}
                  className="sr-only"
                />
                {d}
              </label>
            ))}
          </div>
        </ChoiceGroup>
      </Section>

      {EQUIPMENT.length > 0 && (
        <Section title="Your equipment">
          <ChoiceGroup id="equipment" legend="What do you have access to? Tick all that apply." error={errors.equipment}>
            {EQUIPMENT.map((item) => (
              <label key={item.id} className={choiceClass}>
                <input
                  type="checkbox"
                  value={item.id}
                  checked={equipment.includes(item.id)}
                  onChange={(e) =>
                    setEquipment((prev) =>
                      e.target.checked ? [...prev, item.id] : prev.filter((x) => x !== item.id),
                    )
                  }
                  className="size-5 accent-teal-700"
                />
                <span className="text-lg">{item.label}</span>
              </label>
            ))}
          </ChoiceGroup>
        </Section>
      )}

      <Section title="Anything we should know?">
        <Field
          id="injuries_or_limitations"
          label="Injuries or physical limitations"
          optional
          hint="For example: a sore knee, lower back pain, or a past shoulder injury."
          error={errors.injuries_or_limitations}
        >
          <textarea
            id="field-injuries_or_limitations"
            rows={4}
            maxLength={1000}
            value={limitations}
            onChange={(e) => setLimitations(e.target.value)}
            className={inputClass}
          />
        </Field>
      </Section>

      {serverError && (
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-lg text-red-800">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-xl bg-teal-700 px-6 py-4 text-lg font-semibold text-white hover:bg-teal-800 disabled:cursor-wait disabled:opacity-70"
      >
        {status === "submitting" ? "Saving…" : "Continue"}
      </button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-6">
      <h3 className="border-b border-stone-200 pb-2 text-xl font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function Field({
  id,
  label,
  hint,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={`field-${id}`} className="block text-lg font-medium">
        {label}
        {optional && <span className="ml-2 font-normal text-stone-500">(optional)</span>}
      </label>
      {hint && <p className="mt-1 text-stone-600">{hint}</p>}
      {children}
      {error && <p className="mt-2 text-red-700">{error}</p>}
    </div>
  );
}

function ChoiceGroup({
  id,
  legend,
  error,
  children,
}: {
  id: string;
  legend: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset id={`field-${id}`}>
      <legend className="text-lg font-medium">{legend}</legend>
      <div className="mt-3 space-y-3">{children}</div>
      {error && <p className="mt-2 text-red-700">{error}</p>}
    </fieldset>
  );
}
