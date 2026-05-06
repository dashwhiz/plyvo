import { strings } from "@/strings";

export default function Home() {
  return (
    <main style={{ padding: "var(--space-8)" }}>
      <h1 className="font-display" style={{ fontSize: 48 }}>
        {strings.app.name}
      </h1>
      <p style={{ color: "var(--fg-muted)" }}>{strings.app.tagline}</p>
    </main>
  );
}
