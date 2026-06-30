import { Suspense } from "react";
import AppLoginForm from "./AppLoginForm";

export default function BetaLoginPage() {
  const betaGate = Boolean(process.env.BETA_APP_PASSWORD?.trim());
  return (
    <Suspense fallback={null}>
      <AppLoginForm betaGate={betaGate} />
    </Suspense>
  );
}
