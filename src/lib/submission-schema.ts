import { z } from "zod";
import { EQUIPMENT } from "./equipment";

export const GOALS = [
  { id: "general_fitness", label: "Feel fitter and healthier overall" },
  { id: "strength", label: "Get stronger" },
  { id: "weight_loss", label: "Lose weight" },
  { id: "muscle_gain", label: "Build muscle" },
] as const;

export const EXPERIENCE_LEVELS = [
  { id: "beginner", label: "New to exercise", hint: "Or it's been a long time since I've exercised regularly" },
  { id: "intermediate", label: "Some experience", hint: "I've worked out on and off for a while" },
  { id: "advanced", label: "Very experienced", hint: "I've trained consistently for years" },
] as const;

export const GENDERS = [
  { id: "female", label: "Female" },
  { id: "male", label: "Male" },
  { id: "other", label: "Other" },
  { id: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

const ids = <T extends readonly { id: string }[]>(list: T) =>
  list.map((x) => x.id) as [T[number]["id"], ...T[number]["id"][]];

const equipmentIds = new Set(EQUIPMENT.map((e) => e.id));

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

// Shared by the form (client) and the API route (server).
export const submissionSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Please enter a valid email address")),
  age: z
    .number({ error: "Please enter your age" })
    .int("Please enter a whole number")
    .min(18, "You must be 18 or older to use this service")
    .max(100, "Please enter a valid age"),
  weight_kg: z
    .number({ error: "Please enter your weight" })
    .min(30, "Please enter your weight in kilograms")
    .max(300, "Please enter your weight in kilograms"),
  height_cm: z
    .number()
    .min(100, "Please enter your height in centimetres")
    .max(250, "Please enter your height in centimetres")
    .optional(),
  gender: z.enum(ids(GENDERS)).optional(),
  goal: z.enum(ids(GOALS), { error: "Please choose a goal" }),
  experience_level: z.enum(ids(EXPERIENCE_LEVELS), { error: "Please choose your experience level" }),
  days_per_week: z
    .number({ error: "Please choose how many days" })
    .int()
    .min(2, "Please choose between 2 and 6 days")
    .max(6, "Please choose between 2 and 6 days"),
  equipment: z
    .array(z.string())
    .refine((list) => list.every((id) => equipmentIds.has(id)), "Unknown equipment selected")
    .refine((list) => EQUIPMENT.length === 0 || list.length > 0, "Please choose at least one option")
    .transform((list) => [...new Set(list)]),
  injuries_or_limitations: optionalText(1000),
  parq_cleared: z.literal(true, { error: "Health screening must be completed" }),
});

export type SubmissionInput = z.input<typeof submissionSchema>;
export type Submission = z.output<typeof submissionSchema>;
