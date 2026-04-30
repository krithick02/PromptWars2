import { render, screen, fireEvent } from "@testing-library/react";
import FAQ from "./FAQ";

describe("FAQ Component", () => {
  it("expands an answer when the question is clicked", () => {
    render(<FAQ />);
    
    const question = screen.getByText(/What if I miss the registration deadline/i);
    const trigger = question.closest("button")!;
    
    // Initial state
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    
    // Click to expand
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/Many states offer Same-Day Registration/i)).toBeVisible();
    
    // Click again to collapse
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
