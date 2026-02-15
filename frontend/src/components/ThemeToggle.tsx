import { useThemeContext } from "../contexts/ThemeContext";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className = "" }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`p-2 rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 ${className}`.trim()}
    >
      <span className="text-2xl" role="img" aria-hidden="true">
        {theme === "light" ? "☀" : "🌙"}
      </span>
    </button>
  );
};

export default ThemeToggle;
