create table submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email text not null,
  age integer not null check (age >= 18 and age <= 100),
  weight_kg numeric not null check (weight_kg > 0),
  height_cm numeric check (height_cm is null or height_cm > 0),
  gender text,
  goal text not null check (goal in ('general_fitness', 'strength', 'weight_loss', 'muscle_gain')),
  experience_level text not null check (experience_level in ('beginner', 'intermediate', 'advanced')),
  days_per_week integer not null check (days_per_week between 2 and 6),
  equipment text[] not null,
  injuries_or_limitations text,
  parq_cleared boolean not null default true,
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  plan_json jsonb,
  plan_pdf_url text,
  email_sent boolean default false,
  email_sent_at timestamptz
);

create index idx_submissions_email on submissions(email);
create index idx_submissions_stripe_session on submissions(stripe_checkout_session_id);

-- All access goes through the server using the service role key, which bypasses RLS.
-- No policies = the public anon key can't read or write this table.
alter table submissions enable row level security;
