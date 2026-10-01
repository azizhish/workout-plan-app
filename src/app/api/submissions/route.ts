import { z } from "zod";
import { submissionSchema } from "@/lib/submission-schema";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Please check the form and try again", issues: z.flattenError(parsed.error).fieldErrors },
      { status: 400 },
    );
  }

  try {
    const { data, error } = await getSupabase()
      .from("submissions")
      .insert({ ...parsed.data, payment_status: "pending" })
      .select("id")
      .single();

    if (error) throw error;
    return Response.json({ id: data.id }, { status: 201 });
  } catch (err) {
    console.error("Failed to save submission", err);
    return Response.json(
      { error: "Something went wrong saving your details. Please try again." },
      { status: 500 },
    );
  }
}
