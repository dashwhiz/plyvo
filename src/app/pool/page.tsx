import { Suspense } from "react";
import PoolBuilderScreen from "@/screens/pool-builder/PoolBuilderScreen";

export default function PoolPage() {
  return (
    <Suspense fallback={null}>
      <PoolBuilderScreen />
    </Suspense>
  );
}
