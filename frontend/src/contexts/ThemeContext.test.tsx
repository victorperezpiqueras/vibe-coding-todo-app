import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ThemeProvider, useThemeContext } from "./ThemeContext";

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  describe("ThemeProvider", () => {
    it("should render children", () => {
      render(
        <ThemeProvider>
          <div>Test Child</div>
        </ThemeProvider>,
      );

      expect(screen.getByText("Test Child")).toBeInTheDocument();
    });

    it("should provide default light theme", () => {
      const TestComponent = () => {
        const { theme } = useThemeContext();
        return <div data-testid="theme">{theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("theme")).toHaveTextContent("light");
    });

    it("should provide toggleTheme function", () => {
      const TestComponent = () => {
        const { toggleTheme } = useThemeContext();
        return <button onClick={toggleTheme}>Toggle</button>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>,
      );

      expect(
        screen.getByRole("button", { name: /toggle/i }),
      ).toBeInTheDocument();
    });

    it("should toggle theme when toggleTheme is called", async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const { theme, toggleTheme } = useThemeContext();
        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <button onClick={toggleTheme}>Toggle</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>,
      );

      const button = screen.getByRole("button", { name: /toggle/i });
      await user.click(button);

      expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    });

    it("should load saved theme from localStorage", () => {
      localStorage.setItem("theme", "dark");

      const TestComponent = () => {
        const { theme } = useThemeContext();
        return <div data-testid="theme">{theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    });
  });

  describe("useThemeContext", () => {
    it("should throw error when used outside ThemeProvider", () => {
      // Suppress console.error for this test
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const TestComponent = () => {
        useThemeContext();
        return <div>Test</div>;
      };

      expect(() => render(<TestComponent />)).toThrow(
        "useThemeContext must be used within a ThemeProvider",
      );

      consoleSpy.mockRestore();
    });
  });
});
