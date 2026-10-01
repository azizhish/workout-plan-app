import IntakeSection from "@/components/IntakeSection";

const STEPS = [
  { title: "Answer a few questions", body: "Tell us about your goals, your schedule, and what equipment you have. It takes about 3 minutes." },
  { title: "Pay $25", body: "One simple payment. No subscription, no hidden fees." },
  { title: "Get your plan", body: "Download your plan straight away. We'll email you a copy too." },
];

const INCLUDED = [
  { title: "Real exercises, clearly explained", body: "Every exercise comes with simple form tips so you know exactly how to do it safely." },
  { title: "A plan that grows with you", body: "A clear week-by-week structure, plus guidance on how to progress when you're ready." },
  { title: "Built around what you have", body: "Whether it's a full gym or just your living room floor, your plan uses equipment you actually have." },
];

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <section className="bg-white px-5 pb-16 pt-14 sm:pt-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold uppercase tracking-wide text-teal-700">BuildMyWorkoutPlan</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">Get a workout plan built for you.</h1>
            <p className="mt-6 text-xl leading-relaxed text-stone-700">
              Not a template. Not a generic PDF. A plan based on your goals, your equipment, and your experience level.
            </p>
            <a
              href="#get-started"
              className="mt-10 inline-block w-full rounded-xl bg-teal-700 px-8 py-4 text-lg font-semibold text-white hover:bg-teal-800 sm:w-auto"
            >
              Build my plan
            </a>
          </div>
        </section>

        <section className="px-5 py-16">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold">How it works</h2>
            <ol className="mt-8 space-y-6">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xl font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="mt-1 text-stone-700">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-white px-5 py-16">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold">What you get</h2>
            <ul className="mt-8 space-y-6">
              {INCLUDED.map((item) => (
                <li key={item.title} className="border-l-4 border-teal-700 pl-4">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-1 text-stone-700">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="get-started" className="scroll-mt-4 px-5 py-16">
          <div className="mx-auto max-w-xl">
            <h2 className="text-3xl font-bold">Build your plan</h2>
            <div className="mt-8">
              <IntakeSection />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-white px-5 py-10 text-base text-stone-600">
        <div className="mx-auto max-w-2xl space-y-3">
          <p>
            This plan is general fitness guidance, not medical advice. Please consult a doctor before starting any new
            exercise program. You must be 18 or older to use this service.
          </p>
          <p>
            <a href="/terms" className="underline hover:text-stone-900">Terms &amp; disclaimer</a>
            <span className="mx-2">·</span>
            Contact: support@buildmyworkoutplan.com
          </p>
        </div>
      </footer>
    </>
  );
}
