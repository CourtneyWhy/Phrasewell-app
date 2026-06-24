import { Suspense } from "react";
import BetaLoginForm from "./BetaLoginForm";

export default function BetaLoginPage() {
  return (
    <Suspense fallback={null}>
      <BetaLoginForm />
    </Suspense>
  );
}
