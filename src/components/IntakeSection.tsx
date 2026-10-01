"use client";

import { useState, useSyncExternalStore } from "react";
import ParqScreen, { ParqBlocked } from "./ParqScreen";
import WorkoutForm from "./WorkoutForm";

const BLOCK_KEY = "parq_blocked";

function readStoredBlock() {
  try {
    return sessionStorage.getItem(BLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

const noopSubscribe = () => () => {};

export default function IntakeSection() {
  const storedBlock = useSyncExternalStore(noopSubscribe, readStoredBlock, () => false);
  const [step, setStep] = useState<"parq" | "form" | "blocked">("parq");

  if (storedBlock || step === "blocked") return <ParqBlocked />;
  if (step === "form") return <WorkoutForm />;

  return (
    <ParqScreen
      onCleared={() => setStep("form")}
      onBlocked={() => {
        try {
          sessionStorage.setItem(BLOCK_KEY, "1");
        } catch {}
        setStep("blocked");
      }}
    />
  );
}
