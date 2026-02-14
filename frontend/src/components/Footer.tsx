interface FooterProps {
  backendUrl?: string
}

export default function Footer({ backendUrl = 'http://localhost:8000/docs' }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-4 text-xs text-slate-500">
        Backend:{' '}
        <a
          className="underline hover:text-slate-700"
          href={backendUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {backendUrl.replace('http://', '')}
        </a>
      </div>
    </footer>
  )
}
