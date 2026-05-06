import { Suspense } from "react";
import RevealModeScreen from "@/screens/reveal-mode/RevealModeScreen";

export default function PoolModePage() {
  return (
    <Suspense fallback={null}>
      <RevealModeScreen />
    </Suspense>
  );
}
