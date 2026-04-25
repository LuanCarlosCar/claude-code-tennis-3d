export default function Footer() {
  return (
    <>
      <div className="pointer-events-none fixed top-6 left-6 z-10 font-mono text-xs leading-relaxed text-white/70">
        <div className="text-white/90 tracking-widest">
          CLAUDE CODE TENNIS 3D
        </div>
        <div className="text-white/40">v0.1 · MVP</div>
      </div>

      <a
        href="https://github.com/LuanCarlosCar"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub do desenvolvedor"
        className="fixed top-6 right-6 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white/70 backdrop-blur-md transition-all duration-200 hover:bg-white/10 hover:text-white"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.01c-3.2.7-3.87-1.37-3.87-1.37-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 015.78 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.56 4.57-1.52 7.85-5.83 7.85-10.91C23.5 5.65 18.35.5 12 .5z" />
        </svg>
        LuanCarlosCar
      </a>

      <div className="pointer-events-none fixed bottom-6 left-6 z-10 font-mono text-xs text-white/40">
        Arraste · Role · Clique no botão pra trocar cor
      </div>
    </>
  )
}
