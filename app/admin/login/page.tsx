"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Login failed");
      return;
    }
    router.push("/admin/growth");
    router.refresh();
  }

  return (
    <main className="growth-admin-login">
      <form className="growth-admin-card" onSubmit={handleSubmit}>
        <h1 className="font-heading">Phrasewell Growth OS</h1>
        <p>Founder access only</p>
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error ? <p className="growth-error">{error}</p> : null}
        <button type="submit" className="growth-btn growth-btn-primary">
          Enter dashboard
        </button>
      </form>
    </main>
  );
}
