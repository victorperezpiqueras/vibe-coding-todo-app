import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderApp = () => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </QueryClientProvider>,
  );
};

describe("App", () => {
  it("renders the main application", () => {
    renderApp();
    expect(screen.getByText(/vibe app/i)).toBeInTheDocument();
  });

  it("displays API status", async () => {
    renderApp();
    expect(screen.getByTestId("api-status")).toBeInTheDocument();
  });

  it("shows loading state initially", () => {
    renderApp();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows "Add New Item" button', () => {
    renderApp();
    expect(
      screen.getByRole("button", { name: /add new item/i }),
    ).toBeInTheDocument();
  });

  it("opens item creation form when Add New Item is clicked", async () => {
    const user = userEvent.setup();
    renderApp();
    const addButton = screen.getByRole("button", { name: /add new item/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /create new item/i }),
      ).toBeInTheDocument();
    });
  });

  it("closes item creation form when Cancel is clicked", async () => {
    const user = userEvent.setup();
    renderApp();
    const addButton = screen.getByRole("button", { name: /add new item/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /create new item/i }),
      ).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /create new item/i }),
      ).not.toBeInTheDocument();
    });
  });

  it("shows name input in item creation form", async () => {
    const user = userEvent.setup();
    renderApp();
    const addButton = screen.getByRole("button", { name: /add new item/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });
  });

  it("shows description input in item creation form", async () => {
    const user = userEvent.setup();
    renderApp();
    const addButton = screen.getByRole("button", { name: /add new item/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    });
  });

  it("shows tag selector in item creation form", async () => {
    const user = userEvent.setup();
    renderApp();
    const addButton = screen.getByRole("button", { name: /add new item/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
    });
  });

  it("shows create button in item creation form", async () => {
    const user = userEvent.setup();
    renderApp();
    const addButton = screen.getByRole("button", { name: /add new item/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /^create$/i }),
      ).toBeInTheDocument();
    });
  });

  it("shows cancel button in item creation form", async () => {
    const user = userEvent.setup();
    renderApp();
    const addButton = screen.getByRole("button", { name: /add new item/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
    });
  });

  it("allows typing in name input", async () => {
    const user = userEvent.setup();
    renderApp();
    const addButton = screen.getByRole("button", { name: /add new item/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, "Test Item");
    expect(nameInput).toHaveValue("Test Item");
  });

  it("allows typing in description input", async () => {
    const user = userEvent.setup();
    renderApp();
    const addButton = screen.getByRole("button", { name: /add new item/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    });

    const descInput = screen.getByLabelText(/description/i);
    await user.type(descInput, "Test Description");
    expect(descInput).toHaveValue("Test Description");
  });

  it("disables create button when name is empty", async () => {
    const user = userEvent.setup();
    renderApp();
    const addButton = screen.getByRole("button", { name: /add new item/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /^create$/i }),
      ).toBeInTheDocument();
    });

    const createButton = screen.getByRole("button", { name: /^create$/i });
    expect(createButton).toBeDisabled();
  });

  it("enables create button when name is provided", async () => {
    const user = userEvent.setup();
    renderApp();
    const addButton = screen.getByRole("button", { name: /add new item/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, "Test Item");

    const createButton = screen.getByRole("button", { name: /^create$/i });
    expect(createButton).toBeEnabled();
  });

  it("resets form when closed and reopened", async () => {
    const user = userEvent.setup();
    renderApp();

    // Open form and fill it
    const addButton = screen.getByRole("button", { name: /add new item/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, "Test Item");

    // Close form
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    // Reopen form
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    // Check that input is empty
    const nameInputAfterReopen = screen.getByLabelText(/name/i);
    expect(nameInputAfterReopen).toHaveValue("");
  });

  it("shows API connection status", () => {
    renderApp();
    const statusElement = screen.getByTestId("api-status");
    expect(statusElement).toBeInTheDocument();
  });

  it("renders items container", () => {
    renderApp();
    const container = screen.getByTestId("items-container");
    expect(container).toBeInTheDocument();
  });
});
