import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Dialog from "./Dialog";

describe("Dialog", () => {
  it("does not render when isOpen is false", () => {
    render(
      <Dialog isOpen={false} onClose={vi.fn()} title="Test Dialog">
        <p>Content</p>
      </Dialog>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders when isOpen is true", () => {
    render(
      <Dialog isOpen={true} onClose={vi.fn()} title="Test Dialog">
        <p>Content</p>
      </Dialog>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("displays the title", () => {
    render(
      <Dialog isOpen={true} onClose={vi.fn()} title="Test Dialog">
        <p>Content</p>
      </Dialog>,
    );
    expect(screen.getByText("Test Dialog")).toBeInTheDocument();
  });

  it("displays children content", () => {
    render(
      <Dialog isOpen={true} onClose={vi.fn()} title="Test Dialog">
        <p>Test content</p>
      </Dialog>,
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("calls onClose when backdrop is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Dialog isOpen={true} onClose={onClose} title="Test Dialog">
        <p>Content</p>
      </Dialog>,
    );

    const backdrop = document.querySelector(".bg-black\\/50");
    expect(backdrop).toBeInTheDocument();

    if (backdrop) {
      await user.click(backdrop);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Dialog isOpen={true} onClose={onClose} title="Test Dialog">
        <p>Content</p>
      </Dialog>,
    );

    const closeButton = screen.getByLabelText("Close dialog");
    await user.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when ESC key is pressed", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Dialog isOpen={true} onClose={onClose} title="Test Dialog">
        <p>Content</p>
      </Dialog>,
    );

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("has proper ARIA attributes", () => {
    render(
      <Dialog isOpen={true} onClose={vi.fn()} title="Test Dialog">
        <p>Content</p>
      </Dialog>,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "dialog-title");
  });

  it("prevents body scroll when open", () => {
    const { rerender } = render(
      <Dialog isOpen={true} onClose={vi.fn()} title="Test Dialog">
        <p>Content</p>
      </Dialog>,
    );

    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <Dialog isOpen={false} onClose={vi.fn()} title="Test Dialog">
        <p>Content</p>
      </Dialog>,
    );

    expect(document.body.style.overflow).toBe("");
  });

  it("focuses first focusable element when opened", () => {
    render(
      <Dialog isOpen={true} onClose={vi.fn()} title="Test Dialog">
        <input data-testid="first-input" />
        <button>Click</button>
      </Dialog>,
    );

    const closeButton = screen.getByLabelText("Close dialog");
    expect(closeButton).toHaveFocus();
  });
});
