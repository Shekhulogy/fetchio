export function Steps() {
  const steps = [
    {
      n: "01",
      icon: "📋",
      title: "Paste the link",
      desc: "Copy any YouTube or Instagram URL — share link or browser bar, both work.",
    },
    {
      n: "02",
      icon: "👁️",
      title: "Preview & confirm",
      desc: "See the real thumbnail to confirm you have the right content before saving.",
    },
    {
      n: "03",
      icon: "⬇️",
      title: "Save instantly",
      desc: "Hit download — the file is streamed directly from our server to your device.",
    },
  ];
  return (
    <div className="mt-12 sm:mt-16">
      <div className="flex items-end justify-between pb-4 mb-2 border-b border-white/[0.07]">
        <h2 className="font-display text-[24px] sm:text-[30px] tracking-[2px] grad-text">
          HOW IT WORKS
        </h2>
        <span className="text-[10px] sm:text-[11px] text-muted uppercase tracking-[0.1em]">
          3 steps
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        {steps.map((s) => (
          <div
            key={s.n}
            className="relative bg-card border border-white/[0.07] rounded-2xl p-4 sm:p-5 overflow-hidden hover:border-white/[0.14] hover:-translate-y-1 transition-all group"
          >
            <div className="absolute right-3.5 bottom-2 font-display text-[48px] sm:text-[56px] leading-none select-none grad-text opacity-[0.06]">
              {s.n}
            </div>
            <div
              className="w-[36px] h-[36px] sm:w-[38px] sm:h-[38px] rounded-[9px] bg-surface border border-white/[0.07] flex items-center justify-center text-[16px] sm:text-[17px] mb-3"
              style={{
                borderColor: "rgba(255,68,68,0.15)",
                background: "rgba(255,68,68,0.05)",
              }}
            >
              {s.icon}
            </div>
            <h3 className="text-[13px] sm:text-[13.5px] font-semibold text-text mb-1.5">
              {s.title}
            </h3>
            <p className="text-[11.5px] sm:text-[12px] text-muted2 leading-relaxed">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Platforms() {
  const others: { name: string; color: string; icon: React.ReactNode }[] = [
    { name: "TikTok", color: "#69C9D0", icon: <TikTokIcon /> },
    { name: "Twitter / X", color: "#1d9bf0", icon: <XIcon /> },
    { name: "Facebook", color: "#1877f2", icon: <FacebookIcon /> },
    { name: "Reddit", color: "#ff4500", icon: <RedditIcon /> },
    { name: "Vimeo", color: "#1ab7ea", icon: <VimeoIcon /> },
    { name: "Twitch", color: "#9147ff", icon: <TwitchIcon /> },
    { name: "SoundCloud", color: "#ff5500", icon: <SoundCloudIcon /> },
    { name: "Dailymotion", color: "#0066dc", icon: <DailymotionIcon /> },
    { name: "Pinterest", color: "#e60023", icon: <PinterestIcon /> },
    { name: "Bilibili", color: "#00a1d6", icon: <BilibiliIcon /> },
    { name: "Rumble", color: "#85c742", icon: <RumbleIcon /> },
    { name: "Kick", color: "#53fc18", icon: <KickIcon /> },
  ];

  return (
    <div className="bg-card border border-white/[0.07] rounded-2xl p-5 sm:p-7 mt-6">
      <div className="flex items-end justify-between mb-4 sm:mb-5">
        <h2 className="font-display text-[24px] sm:text-[30px] tracking-[2px] grad-text">
          PLATFORMS
        </h2>
        <span className="text-[10px] sm:text-[11px] text-muted uppercase tracking-[0.1em]">
          1000+ sites
        </span>
      </div>

      {/* Main two */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <PlatformCard
          icon={<YTIcon />}
          name="YouTube"
          badge="Primary"
          desc="Videos, Shorts, Playlists. Up to 4K + MP3 extraction. Best quality support."
          color="#ff4444"
        />
        <PlatformCard
          icon={<IGIcon />}
          name="Instagram"
          badge="Primary"
          desc="Posts, Reels, Stories, IGTV. Photos and videos fully supported."
          color="#e1306c"
        />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-3.5">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-[10px] text-muted uppercase tracking-[0.1em]">
          Also supported
        </span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      {/* Others grid */}
      <div className="flex flex-wrap gap-2">
        {others.map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11.5px] font-medium text-muted2 border border-white/[0.06] bg-surface hover:border-white/[0.12] hover:text-text transition-all group"
          >
            <span
              className="flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
              style={{ color: p.color }}
            >
              {p.icon}
            </span>
            {p.name}
          </div>
        ))}
        <div className="flex items-center px-2.5 py-1.5 rounded-lg text-[11.5px] font-medium border border-white/[0.06] bg-surface grad-text">
          + 1000 more
        </div>
      </div>
    </div>
  );
}

function PlatformCard({
  icon,
  name,
  badge,
  desc,
  color,
}: {
  icon: React.ReactNode;
  name: string;
  badge?: string;
  desc: string;
  color: string;
}) {
  return (
    <div
      className="flex items-start gap-3 sm:gap-3.5 p-3.5 sm:p-4 bg-surface rounded-xl transition-all hover:-translate-y-0.5"
      style={{ border: `1px solid ${color}25` }}
    >
      <div
        className="w-[36px] h-[36px] sm:w-[38px] sm:h-[38px] rounded-[9px] flex items-center justify-center flex-shrink-0"
        style={{ background: color + "15", border: `1px solid ${color}30` }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4
            className="text-[12.5px] sm:text-[13px] font-semibold"
            style={{ color }}
          >
            {name}
          </h4>
          {badge && (
            <span className="text-[9px] font-bold uppercase tracking-[0.06em] px-1.5 py-0.5 rounded grad-bg text-white">
              {badge}
            </span>
          )}
        </div>
        <p className="text-[11px] sm:text-[11.5px] text-muted2 leading-[1.55]">
          {desc}
        </p>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] py-6 sm:py-7 flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-0 text-[11px] sm:text-[12px] text-muted mt-4 mb-2">
      <span>
        © 2025 <span className="grad-text font-medium">Fetch.io</span> ·
        Personal use only
      </span>
      <div className="flex gap-4 sm:gap-5">
        <a href="#" className="hover:text-text transition-colors">
          Privacy
        </a>
        <a href="#" className="hover:text-text transition-colors">
          Terms
        </a>
        <a href="#" className="hover:text-text transition-colors">
          API
        </a>
      </div>
    </footer>
  );
}

function YTIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#ff4444">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function IGIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#e1306c">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

// ── Platform chip icons (14×14) ──

function TikTokIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.845L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function RedditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  );
}

function VimeoIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.612-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.478 4.807z" />
    </svg>
  );
}

function TwitchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
    </svg>
  );
}

function SoundCloudIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.175 12.225c-.042 0-.083.007-.125.011V12.2c0-1.87 1.522-3.387 3.4-3.387.386 0 .757.065 1.105.18a5.634 5.634 0 0 1 5.38-3.98c3.116 0 5.638 2.522 5.638 5.635 0 .05-.003.1-.004.15.195-.04.396-.064.602-.064 1.67 0 3.024 1.354 3.024 3.024 0 1.67-1.354 3.024-3.024 3.024H1.175C.526 16.782 0 16.256 0 15.607c0-.648.526-1.174 1.175-1.174h.001v-.002c-.65 0-1.175-.526-1.175-1.175 0-.648.524-1.174 1.174-1.031z" />
    </svg>
  );
}

function DailymotionIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.006 0C5.373 0 0 5.372 0 12c0 6.626 5.372 12 12.006 12C18.63 24 24 18.626 24 12c0-6.628-5.372-12-11.994-12zm2.52 16.99c-.52.287-2.333.55-3.316-.31-1.304-1.15-1.26-4.224.078-5.32 1.05-.856 3.01-.736 3.714.202.08.105.16.26.16.26s.03-2.63.03-3.9c0-.298.232-.53.528-.53h1.063c.296 0 .53.234.53.53v8.14c0 .223-.135.422-.338.506l-.898.33c-.003 0-.003.003-.007.003a.434.434 0 0 1-.308-.012l-.003-.003-.004-.003.003.003c.002.002.003.003.003.003-.122-.055-.22-.176-.235-.31v-.588s-.42.71-1.003.998zm.006-4.12c-.285-.58-1.013-.744-1.597-.468-.58.275-.862 1.005-.625 1.748.275.87.9 1.22 1.6 1.003.49-.152.8-.608.85-1.12.043-.424-.073-.88-.228-1.163z" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.001 24c6.627 0 12-5.373 12-12C24 5.372 18.627 0 12 0z" />
    </svg>
  );
}

function BilibiliIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.764-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
    </svg>
  );
}

function RumbleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.5 13.5l-6 3.5V7l6 3.5v3z" />
    </svg>
  );
}

function KickIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 2h4v7l5-7h5l-6 8 6.5 12H12l-4-7.5-2 2.5V22H2V2z" />
    </svg>
  );
}
