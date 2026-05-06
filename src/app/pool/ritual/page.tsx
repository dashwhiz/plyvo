import { Suspense } from "react";
import RitualScreen from "@/screens/ritual/RitualScreen";

export default function PoolRitualPage() {
  return (
    <Suspense fallback={null}>
      <RitualScreen />
    </Suspense>
  );
}
