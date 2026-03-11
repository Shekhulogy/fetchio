export default function Hero() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-center gap-8 lg:gap-10 py-12 sm:py-16 lg:py-20 fade-up">
      <div>
        <div
          className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-medium tracking-[0.12em] uppercase text-muted2 border border-white/[0.07] px-3 sm:px-3.5 py-1.5 rounded-full mb-4 sm:mb-6"
          style={{
            borderColor: "rgba(255,68,68,0.2)",
            background: "rgba(255,68,68,0.04)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#ff4444] block"
            style={{ boxShadow: "0 0 5px #ff4444aa" }}
          />
          Instant · No watermarks · HD
        </div>

        <h1 className="font-display text-[clamp(42px,10vw,104px)] tracking-[2px] leading-[0.92] mb-5 sm:mb-7 text-white">
          SAVE ANY MEDIA
          <span className="block grad-text">ANYWHERE.</span>
        </h1>

        <p className="text-[13.5px] sm:text-[14.5px] font-light text-muted2 leading-[1.75] max-w-[360px] mb-8 sm:mb-10">
          Drop a YouTube or Instagram link and download videos, reels, and posts
          in seconds — up to 4K, zero compression.
        </p>

        <div className="flex gap-6 sm:gap-9">
          {[
            { num: "4K", label: "Max Quality" },
            { num: "1000+", label: "Platforms" },
            { num: "0s", label: "Wait time" },
          ].map(({ num, label }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="font-display text-[24px] sm:text-[30px] tracking-[1px] leading-none grad-text">
                {num}
              </span>
              <span className="text-[9px] sm:text-[10px] text-muted uppercase tracking-[0.1em] font-medium">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating card — desktop only */}
      <div className="hidden lg:block w-[210px] flex-shrink-0">
        <div className="float-card bg-card border border-white/[0.07] rounded-[18px] p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-[34px] h-[34px] rounded-[9px] bg-surface border border-white/[0.07] flex items-center justify-center">
              <YTIcon />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-text">
                Tutorial · 1080p
              </div>
              <div className="text-[11px] text-muted2 mt-0.5">YouTube</div>
            </div>
          </div>
          <Bar label="Downloading" pct={87} />
          <Bar label="Processing" pct={100} delay="0.3s" />
          <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-text border border-white/[0.07] rounded-full px-2.5 py-1">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#ff4444] animate-blink block"
              style={{ boxShadow: "0 0 5px #ff4444aa" }}
            />
            Ready to save
          </div>
        </div>
      </div>
    </section>
  );
}

function Bar({
  label,
  pct,
  delay,
}: {
  label: string;
  pct: number;
  delay?: string;
}) {
  return (
    <div className="mb-3.5">
      <div className="flex justify-between text-[10px] text-muted uppercase tracking-[0.06em] mb-1.5">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full grad-bg"
          style={
            {
              "--w": `${pct}%`,
              width: `${pct}%`,
              animation: `grow 2s ease-out ${delay ?? ""} both`,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
}

function YTIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#f0f0f0">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
