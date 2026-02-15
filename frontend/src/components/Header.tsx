import ThemeToggle from "./ThemeToggle";

const Header = () => {
  return (
    <header className="bg-white/80 dark:bg-slate-800/80 shadow-sm backdrop-blur-sm sticky top-0 z-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Vibe App
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
