"use client";

import Stepper from "@/components/Stepper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";

// Lazy‐load each of your step components.
// This will split each step into its own chunk, only loaded when that tab is first rendered.
const QuestionCard = SuspenseLazy(() => import("./_components/QuestionCard"));
const Step2 = SuspenseLazy(() => import("./_components/Step2"));
const Plan = SuspenseLazy(() => import("./_components/Plan"));
const MusicTemplate = SuspenseLazy(() => import("./_components/MusicTemplate"));
const AlmostDone = SuspenseLazy(() => import("./_components/AlmostDone"));

// Utility to wrap React.lazy with a fallback Suspense wrapper
function SuspenseLazy(loader) {
  const Comp = lazy(loader);
  return (props) => (
    <Suspense
      fallback={
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
      }>
      <Comp {...props} />
    </Suspense>
  );
}

// These two arrays never change, so we can define them once outside the component.
const TAB_KEYS = [1, 2, 3, 4, 5];
const STEP_COMPONENTS = [
  QuestionCard,
  Step2,
  Plan,
  MusicTemplate,
  AlmostDone,
];

export default function Page() {
  // currentTab holds the “active” tab (1‐based index).
  const [currentTab, setCurrentTab] = useState(1);
  // activeStep is 0‐based for Stepper
  const [activeStep, setActiveStep] = useState(0);


  // Keep the Stepper in sync with currentTab.
  useEffect(() => {
    setActiveStep(currentTab - 1);
  }, [currentTab]);

  // move to next tab if not already at last
  const handleNext = useCallback(() => {
    setCurrentTab((prev) => {
      const idx = TAB_KEYS.indexOf(prev);
      if (idx === -1 || idx === TAB_KEYS.length - 1) return prev;
      return TAB_KEYS[idx + 1];
    });
  }, []);

  // move to previous tab if not already at first
  const handlePrev = useCallback(() => {
    setCurrentTab((prev) => {
      const idx = TAB_KEYS.indexOf(prev);
      if (idx <= 0) return prev;
      return TAB_KEYS[idx - 1];
    });
  }, []);

  // Memoize the list of <TabsTrigger> so they don’t re‐render on every tab change.
  const tabTriggers = useMemo(
    () =>
      TAB_KEYS.map((tabKey) => (
        <TabsTrigger key={tabKey} value={String(tabKey)} />
      )),
    []
  );

  // Memoize the <TabsContent> array, pairing each component in STEP_COMPONENTS
  // with its corresponding tab key. We pass down onNext/onPrev into each.
  const tabContents = useMemo(
    () =>
      STEP_COMPONENTS.map((StepComp, idx) => {
        const tabValue = String(TAB_KEYS[idx]);
        return (
          <TabsContent key={tabValue} value={tabValue}>
            <StepComp onNext={handleNext} onPrev={handlePrev} />
          </TabsContent>
        );
      }),
    [handleNext, handlePrev]
  );

  return (
    <div
      className="
        flex flex-col items-center
        max-sm:justify-start max-sm:items-start max-sm:h-screen
        max-lg:gap-y-14
        max-sm:overflow-auto max-sm:gap-y-14 max-sm:mt-12 max-lg:mt-12
        justify-center gap-6 w-full px-4 overflow-x-hidden
      "
    >
      {/* Stepper */}
      <div className="w-full flex justify-center items-center">
        <Stepper currentStep={activeStep} />
      </div>

      <Tabs
        value={String(currentTab)}
        onValueChange={(val) => setCurrentTab(Number(val))}
        className="
          w-fit justify-center items-center px-6 flex flex-col gap-6
          bg-[#111111] shadow-2xl shadow-zinc-700 py-5 rounded-lg
        "
      >
        <TabsList>{tabTriggers}</TabsList>
        {tabContents}
      </Tabs>
    </div>
  );
}
