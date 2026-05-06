import { Suspense } from "react";
import WinnerScreen from "@/screens/winner/WinnerScreen";

export default function PoolWinnerPage() {
  return (
    <Suspense fallback={null}>
      <WinnerScreen />
    </Suspense>
  );
}
