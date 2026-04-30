import { renderHook, act } from "@testing-library/react";
import { useDashboardState } from "../hooks/useDashboardState";

describe("useDashboardState Hook", () => {
  it("transitions to pathComplete after all steps are done", () => {
    const { result } = renderHook(() => useDashboardState());
    
    expect(result.current.pathComplete).toBe(false);
    expect(result.current.score).toBe(0);

    // Complete steps
    act(() => {
      result.current.setSelectedState("California");
      result.current.handleCompleteStep({ stopPropagation: () => {} } as any, 0);
      result.current.handleCompleteStep({ stopPropagation: () => {} } as any, 1);
      result.current.handleCompleteStep({ stopPropagation: () => {} } as any, 2);
    });

    expect(result.current.completedSteps).toHaveLength(3);
    expect(result.current.pathComplete).toBe(true);
    expect(result.current.score).toBeGreaterThan(50);
  });
});
