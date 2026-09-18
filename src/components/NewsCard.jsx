const NewsCard = ({ item, featured = false }) => {
  return (
    <article
      className={[
        "group overflow-hidden rounded-[1.6rem] border border-violet-400/20 bg-white/[0.03] shadow-[0_0_0_1px_rgba(168,85,247,0.04)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/50 hover:bg-white/[0.04]",
        featured ? "p-4 sm:p-5" : "p-3.5 sm:p-4",
      ].join(" ")}
    >
      <div className="flex gap-3 sm:gap-4">
        <div
          className={[
            "relative flex-shrink-0 overflow-hidden rounded-[1.2rem] border border-violet-400/20 bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-zinc-800",
            featured ? "h-28 w-28 sm:h-32 sm:w-32" : "h-20 w-20 sm:h-24 sm:w-24",
          ].join(" ")}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),transparent_45%)]" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-violet-100">
            <span className="h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_12px_rgba(196,181,253,0.9)]" />
            {item.category}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-violet-100">
              {item.category}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-400">
              {item.time}
            </span>
          </div>

          <h3
            className={[
              "font-medium tracking-[-0.04em] text-zinc-50",
              featured ? "text-xl leading-7 sm:text-2xl" : "text-base leading-6 sm:text-lg",
            ].join(" ")}
          >
            {item.headline}
          </h3>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {item.summary}
          </p>

          <div className="mt-3 flex items-center justify-between gap-3 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
            <span>{item.source}</span>
            <span>{item.date}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
