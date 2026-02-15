import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import TagSelector from "./TagSelector";
import { server, http, HttpResponse } from "../test/setup";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>,
  );
};

describe("TagSelector", () => {
  beforeEach(() => {
    server.use(
      http.get("http://localhost:8000/api/tags/", () => {
        return HttpResponse.json([
          { id: 1, name: "tag1", color: "#ff0000" },
          { id: 2, name: "tag2", color: "#00ff00" },
          { id: 3, name: "tag3", color: "#0000ff" },
        ]);
      }),
    );
  });

  it("renders the tags label", () => {
    renderWithQueryClient(
      <TagSelector selectedTags={[]} onChange={() => {}} />,
    );
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
  });

  it("shows loading state while fetching tags", () => {
    renderWithQueryClient(
      <TagSelector selectedTags={[]} onChange={() => {}} />,
    );
    expect(screen.getByText(/loading tags.../i)).toBeInTheDocument();
  });

  it("displays available tags after loading", async () => {
    renderWithQueryClient(
      <TagSelector selectedTags={[]} onChange={() => {}} />,
    );

    await waitFor(() => {
      expect(screen.getByText("tag1")).toBeInTheDocument();
      expect(screen.getByText("tag2")).toBeInTheDocument();
      expect(screen.getByText("tag3")).toBeInTheDocument();
    });
  });

  it("displays error message on fetch failure", async () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    server.use(
      http.get("http://localhost:8000/api/tags/", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    renderWithQueryClient(
      <TagSelector selectedTags={[]} onChange={() => {}} />,
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load tags/i)).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it("allows selecting a tag", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    renderWithQueryClient(
      <TagSelector selectedTags={[]} onChange={onChange} />,
    );

    await waitFor(() => {
      expect(screen.getByText("tag1")).toBeInTheDocument();
    });

    const tag1Button = screen.getByRole("button", { name: /tag1/i });
    await user.click(tag1Button);

    expect(onChange).toHaveBeenCalledWith([1]);
  });

  it("allows deselecting a tag", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    renderWithQueryClient(
      <TagSelector selectedTags={[1]} onChange={onChange} />,
    );

    await waitFor(() => {
      expect(screen.getByText("tag1")).toBeInTheDocument();
    });

    const tag1Button = screen.getByRole("button", { name: /tag1/i });
    await user.click(tag1Button);

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("allows selecting multiple tags", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    renderWithQueryClient(
      <TagSelector selectedTags={[]} onChange={onChange} />,
    );

    await waitFor(() => {
      expect(screen.getByText("tag1")).toBeInTheDocument();
    });

    const tag1Button = screen.getByRole("button", { name: /tag1/i });
    const tag2Button = screen.getByRole("button", { name: /tag2/i });

    await user.click(tag1Button);
    expect(onChange).toHaveBeenCalledWith([1]);

    await user.click(tag2Button);
    expect(onChange).toHaveBeenCalledWith([1, 2]);
  });

  it("shows selected tags with different styling", async () => {
    const user = userEvent.setup();

    renderWithQueryClient(
      <TagSelector selectedTags={[1]} onChange={() => {}} />,
    );

    await waitFor(() => {
      expect(screen.getByText("tag1")).toBeInTheDocument();
    });

    const tag1Button = screen.getByRole("button", { name: /tag1/i });
    const tag2Button = screen.getByRole("button", { name: /tag2/i });

    // Selected tag should have different classes
    expect(tag1Button).toHaveClass("ring-2");
    expect(tag2Button).not.toHaveClass("ring-2");
  });

  it("displays tag colors correctly", async () => {
    renderWithQueryClient(
      <TagSelector selectedTags={[]} onChange={() => {}} />,
    );

    await waitFor(() => {
      expect(screen.getByText("tag1")).toBeInTheDocument();
    });

    const tag1Button = screen.getByRole("button", { name: /tag1/i });

    // Check that the color is applied via style
    expect(tag1Button).toHaveStyle({ backgroundColor: "rgb(255, 0, 0)" });
  });
});
