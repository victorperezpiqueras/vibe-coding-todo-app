interface HeaderProps {
  apiStatus: string;
  onSync: () => void;
}

export default function Header({ apiStatus, onSync }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">Task Board</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">
            API:{" "}
            <span
              data-testid="api-status"
              className={
                apiStatus === "healthy" ? "text-emerald-600" : "text-rose-600"
              }
            >
              {apiStatus}
            </span>
          </span>
          <button
            data-testid="sync-button"
            onClick={onSync}
            className="rounded-md bg-slate-900 text-white px-3 py-1.5 text-sm hover:bg-slate-700"
          >
            Sync
          </button>
        </div>
      </div>
    </header>
  );
}
