import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Header from "./Header";

describe("Header", () => {
  it("renders the Task Board title", () => {
    render(<Header apiStatus="healthy" onSync={vi.fn()} />);
    expect(screen.getByText("Task Board")).toBeInTheDocument();
  });

  it("displays API status as healthy", () => {
    render(<Header apiStatus="healthy" onSync={vi.fn()} />);
    const status = screen.getByTestId("api-status");
    expect(status).toHaveTextContent("healthy");
    expect(status).toHaveClass("text-emerald-600");
  });

  it("displays API status as disconnected", () => {
    render(<Header apiStatus="disconnected" onSync={vi.fn()} />);
    const status = screen.getByTestId("api-status");
    expect(status).toHaveTextContent("disconnected");
    expect(status).toHaveClass("text-rose-600");
  });

  it("displays API status as checking", () => {
    render(<Header apiStatus="checking..." onSync={vi.fn()} />);
    const status = screen.getByTestId("api-status");
    expect(status).toHaveTextContent("checking...");
    expect(status).toHaveClass("text-rose-600");
  });

  it("renders sync button", () => {
    render(<Header apiStatus="healthy" onSync={vi.fn()} />);
    expect(screen.getByRole("button", { name: /sync/i })).toBeInTheDocument();
  });

  it("calls onSync when sync button is clicked", async () => {
    const user = userEvent.setup();
    const onSync = vi.fn();

    render(<Header apiStatus="healthy" onSync={onSync} />);

    const syncButton = screen.getByRole("button", { name: /sync/i });
    await user.click(syncButton);

    expect(onSync).toHaveBeenCalledTimes(1);
  });
});
