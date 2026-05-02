import { useState, useMemo, useCallback } from "react";
import { z } from "zod";
import { STATE_DATA } from "../components/StateSelector";

const STEPS = [
  { id: "reg",  title: "Registration" },
  { id: "edu",  title: "Education"    },
  { id: "vote", title: "Balloting"    },
];

const WEIGHTS = {
  stateSelected:    10,
  step_reg:         15,
  step_edu:         15,
  step_vote:        15,
  sandboxCast:      15,
  checklistAll:     15,
  notifierEnabled:  15,
};

const FALLBACK_DEADLINE = new Date("2026-11-03T00:00:00");

const StateSchema = z.string().nullable();
const StepSchema = z.number().min(0).max(STEPS.length - 1);

export function useDashboardState() {
  const [activeStep, setActiveStep]         = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedState, setSelectedState]   = useState<string | null>(null);
  const [sandboxCast, setSandboxCast]       = useState(false);
  const [checklistAll, setChecklistAll]     = useState(false);
  const [notifierOn, setNotifierOn]         = useState(false);

  const pathComplete = completedSteps.length === STEPS.length;

  // Countdown logic
  const deadline = useMemo(() => {
    if (!selectedState) return FALLBACK_DEADLINE;
    const d = STATE_DATA[selectedState as keyof typeof STATE_DATA]?.electionDay;
    return d ? new Date(d) : FALLBACK_DEADLINE;
  }, [selectedState]);

  const daysRemaining = Math.max(
    0,
    Math.ceil((deadline.getTime() - Date.now()) / (1000 * 3600 * 24))
  );

  // Score logic
  const { score, achieved } = useMemo(() => {
    const hits: string[] = [];
    let s = 0;
    if (selectedState)                   { s += WEIGHTS.stateSelected;   hits.push("State selected"); }
    if (completedSteps.includes(0))      { s += WEIGHTS.step_reg;         hits.push("Registration done"); }
    if (completedSteps.includes(1))      { s += WEIGHTS.step_edu;         hits.push("Education complete"); }
    if (completedSteps.includes(2))      { s += WEIGHTS.step_vote;        hits.push("Voting pathway read"); }
    if (sandboxCast)                     { s += WEIGHTS.sandboxCast;      hits.push("Ballot practiced"); }
    if (checklistAll)                    { s += WEIGHTS.checklistAll;     hits.push("Day-of checklist done"); }
    if (notifierOn)                      { s += WEIGHTS.notifierEnabled;  hits.push("Alerts configured"); }
    return { score: s, achieved: hits };
  }, [selectedState, completedSteps, sandboxCast, checklistAll, notifierOn]);

  const handleCompleteStep = useCallback((e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const validatedIndex = StepSchema.parse(index);
    setCompletedSteps(prev => {
      if (!prev.includes(validatedIndex)) return [...prev, validatedIndex];
      return prev;
    });
    if (validatedIndex < STEPS.length - 1) setActiveStep(validatedIndex + 1);
  }, [completedSteps]);

  const updateSelectedState = useCallback((state: string | null) => {
    setSelectedState(StateSchema.parse(state));
  }, []);


  return {
    activeStep, setActiveStep,
    completedSteps,
    selectedState, setSelectedState: updateSelectedState,
    sandboxCast, setSandboxCast,
    checklistAll, setChecklistAll,
    notifierOn, setNotifierOn,
    pathComplete,
    daysRemaining,
    score, achieved,
    handleCompleteStep,
    STEPS
  };
}
