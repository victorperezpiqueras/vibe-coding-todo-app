import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Header from "./Header";
import { ThemeProvider } from "../contexts/ThemeContext";
import userEvent from "@testing-library/user-event";

describe("Header", () => {
  it("renders app title", () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>,
    );
    const title = screen.getByText(/vibe app/i);
    expect(title).toBeInTheDocument();
  });

  it("renders theme toggle button", () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>,
    );
    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it("toggles theme when toggle button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>,
    );

    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });

    // Initially light mode
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    // Click to toggle to dark
    await user.click(toggleButton);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
