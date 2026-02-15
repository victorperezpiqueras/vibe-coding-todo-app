import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import ThemeToggle from "./ThemeToggle";
import { ThemeProvider } from "../contexts/ThemeContext";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("should render toggle button", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    expect(
      screen.getByRole("button", { name: /toggle theme/i }),
    ).toBeInTheDocument();
  });

  it("should show sun icon in light mode", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button.textContent).toContain("☀");
  });

  it("should show moon icon in dark mode", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const button = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(button);

    expect(button.textContent).toContain("🌙");
  });

  it("should toggle theme when clicked", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const button = screen.getByRole("button", { name: /toggle theme/i });

    // Initially light mode
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    // Click to toggle to dark
    await user.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    // Click to toggle back to light
    await user.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("should render with custom className", () => {
    render(
      <ThemeProvider>
        <ThemeToggle className="custom-class" />
      </ThemeProvider>,
    );

    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button).toHaveClass("custom-class");
  });

  it("should have accessible label", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Toggle theme");
  });
});
