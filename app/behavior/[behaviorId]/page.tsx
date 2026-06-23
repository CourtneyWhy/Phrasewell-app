import Link from "next/link";

const SCRIPTS: Record<
  string,
  {
    say: string;
    why: string[];
  }
> = {
  screaming: {
    say: "I hear how upset you are. I won’t let you scream at me, but I’m here to help when you’re ready.",
    why: [
      "Names the feeling without agreeing with the behavior",
      "Sets a clear boundary calmly",
      "Keeps you regulated so your child can settle"
    ]
  },
  crying: {
    say: "Something feels really hard right now. You can cry, and I’ll stay with you.",
    why: [
      "Allows emotion without rushing to fix it",
      "Communicates safety and presence",
      "Reduces power struggles"
    ]
  },
  ignoring: {
    say: "I need your attention. If you don’t respond, I’ll help you move your body toward me.",
    why: [
      "States expectation clearly",
      "Explains what will happen next",
      "Avoids yelling or repeating"
    ]
  }
};

export default function BehaviorPage({
  params,
}: {
  params: { behaviorId: string };
}) {
  const script = SCRIPTS[params.behaviorId];

  if (!script) {
    return (
      <main className="min-h-screen p-6">
        <div className="max-w-md mx-auto space-y-4">
          <Link href="/app" className="underline text-sm">
            ← Back
          </Link>
          <p>No script found for this behavior yet.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-md mx-auto space-y-6">
        <Link href="/app" className="underline text-sm">
          ← Back
        </Link>

        <section className="space-y-2">
          <h1 className="text-xl font-semibold">What to say</h1>
          <p className="border rounded-xl p-4">
            “{script.say}”
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Why this works</h2>
          <ul className="list-disc pl-5 space-y-1">
            {script.why.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <label className="text-sm font-medium">Age</label>
          <select className="w-full border rounded-xl p-3">
            <option>2–3</option>
            <option>4–5</option>
            <option>6–8</option>
            <option>9–12</option>
          </select>
        </section>

        <button
          disabled
          className="w-full rounded-xl border p-4 text-gray-500"
        >
          Generate another (next step)
        </button>
      </div>
    </main>
  );
}
