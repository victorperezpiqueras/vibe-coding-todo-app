import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useTheme } from "./useTheme";

describe("useTheme", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it("should default to light theme", () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("light");
  });

  it("should toggle theme from light to dark", () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("dark");
  });

  it("should toggle theme from dark to light", () => {
    const { result } = renderHook(() => useTheme());

    // Toggle to dark first
    act(() => {
      result.current.toggleTheme();
    });

    // Toggle back to light
    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("light");
  });

  it("should persist theme to localStorage when toggled", () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("should load theme from localStorage on initialization", () => {
    localStorage.setItem("theme", "dark");

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("dark");
  });

  it("should apply theme to document element when toggled", () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("should remove dark class when toggling to light", () => {
    const { result } = renderHook(() => useTheme());

    // Toggle to dark
    act(() => {
      result.current.toggleTheme();
    });

    // Toggle back to light
    act(() => {
      result.current.toggleTheme();
    });

    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("should apply saved dark theme to document element on initialization", () => {
    localStorage.setItem("theme", "dark");

    renderHook(() => useTheme());

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("should handle localStorage getItem errors gracefully", () => {
    // Mock localStorage.getItem to throw an error
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = () => {
      throw new Error("LocalStorage error");
    };

    // Should not throw and should default to light theme
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");

    // Restore original
    localStorage.getItem = originalGetItem;
  });

  it("should handle localStorage setItem errors gracefully", () => {
    // Mock localStorage.setItem to throw an error
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = () => {
      throw new Error("LocalStorage error");
    };

    const { result } = renderHook(() => useTheme());

    // Should not throw when toggling
    expect(() => {
      act(() => {
        result.current.toggleTheme();
      });
    }).not.toThrow();

    // Theme should still change even if persistence fails
    expect(result.current.theme).toBe("dark");

    // Restore original
    localStorage.setItem = originalSetItem;
  });
});
