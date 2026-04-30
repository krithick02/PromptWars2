import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock framer-motion to render children immediately without animation delays
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  
  const motionProxy = new Proxy(
    {},
    {
      get: (_target, key: string) => {
        return ({ children, ...props }: any) => {
          // Filter out motion-specific props
          const { 
            whileHover, whileTap, initial, animate, exit, transition, 
            variants, layout, layoutId, onLayoutAnimationComplete,
            onViewportEnter, onViewportLeave, viewport,
            ...domProps 
          } = props;
          
          const Tag = key as any;
          return <Tag {...domProps}>{children}</Tag>;
        };
      },
    }
  );

  return {
    ...actual,
    motion: motionProxy,
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
