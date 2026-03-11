export default function Nav() {
  return (
    <nav className="flex items-center justify-between pt-6 sm:pt-8 fade-up">
      <div className="flex items-center gap-2">
        <span className="font-display text-xl sm:text-2xl tracking-[3px] sm:tracking-[4px] grad-text">
          FETCH.IO
        </span>
      </div>
      <div className="flex gap-1.5 sm:gap-2">
        <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.08em] uppercase text-muted2 border border-white/10 px-2.5 sm:px-3 py-1 rounded-full">
          <span style={{ color: "#22c55e" }}>●</span> Online
        </span>
        <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.08em] uppercase text-muted2 border border-white/[0.07] px-2.5 sm:px-3 py-1 rounded-full hidden sm:block">
          Free · No login
        </span>
      </div>
    </nav>
  );
}
