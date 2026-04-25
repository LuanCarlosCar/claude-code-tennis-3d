const NAV_ITEMS = ['Coleção', 'Drops', 'Tecnologia', 'Suporte'] as const
const LINKEDIN_URL = 'https://www.linkedin.com/in/luan-carlos-a3a08a123/'

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
      <div className="flex min-w-0 items-center gap-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <span
            aria-hidden
            className="block h-2 w-2 shrink-0 rotate-45 bg-[#d4763c] sm:h-2.5 sm:w-2.5"
          />
          <span className="font-mono text-[11px] tracking-[0.2em] text-white sm:text-xs sm:tracking-[0.25em]">
            CLAUDE CODE
          </span>
          <span className="hidden font-mono text-xs tracking-[0.25em] text-white/40 sm:inline">
            / ATHLETICS
          </span>
        </div>

        <nav className="ml-4 hidden items-center gap-6 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href="#"
              className="font-mono text-[11px] uppercase tracking-widest text-white/50 transition-colors hover:text-white"
            >
              {item}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="hidden md:flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white/60 backdrop-blur-md">
          <span className="block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400/60" />
          Drop 01 · Disponível
        </div>

        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn do desenvolvedor"
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[11px] text-white/70 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
          </svg>
          <span className="hidden sm:inline">Luan Carlos</span>
        </a>
      </div>
    </header>
  )
}
