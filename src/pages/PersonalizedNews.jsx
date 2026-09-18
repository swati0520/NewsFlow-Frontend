import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AudioPlayer from "../components/AudioPlayer";
import { getAllNews } from "../services/api";
import { fetchTopHeadlines } from "../services/gnewsApi";

const categories = ["Business", "Technology", "Finance", "World", "India"];

const PersonalizedNews = () => {
  const navigate = useNavigate();
  const [feedItems, setFeedItems] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gnewsLoading, setGnewsLoading] = useState(true);
  const [gnewsError, setGnewsError] = useState("");
  const [topStories, setTopStories] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await getAllNews();
        const news = Array.isArray(response) ? response : response?.news || response?.data || [];
        setFeedItems(news);
        setSelectedStory((prev) => prev || news[0] || null);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load news.");
        setFeedItems([]);
        setSelectedStory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        setGnewsLoading(true);
        setGnewsError("");
        const stories = await fetchTopHeadlines();
        const cleanedStories = stories.slice(0, 5).map((article) => ({
          ...article,
          image: article.image || "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=900&q=80",
        }));

        setTopStories(cleanedStories);
      } catch (err) {
        setGnewsError(err.message || "Unable to load top stories.");
        setTopStories([]);
      } finally {
        setGnewsLoading(false);
      }
    };

    fetchTopStories();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-[#07080d] text-white">
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-400/40 bg-violet-500/10 text-sm font-semibold tracking-[0.16em] text-violet-200 shadow-[0_0_25px_rgba(168,85,247,0.25)]">
              
            </div>
           
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-violet-400/20 bg-white/[0.03] px-3 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-violet-100 transition hover:border-violet-300/60 hover:bg-violet-500/10 hover:text-white"
          >
            Logout
          </button>
        </header>

        <section className="mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.22em] text-violet-200/80">
                Good morning.
              </p>
              <h1 className="text-4xl font-medium tracking-[-0.07em] text-zinc-50 sm:text-5xl lg:text-[4rem] lg:leading-[0.9]">
                Your briefing
              </h1>
            </div>

            <div className="flex items-center gap-3 rounded-full border border-violet-400/20 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-violet-300 shadow-[0_0_12px_rgba(196,181,253,0.9)]" />
              Personalized for you
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
            Your curated audio briefing for India’s most important business, finance and technology stories.
          </p>
        </section>

        <section className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className="rounded-full border border-violet-400/20 bg-white/[0.03] px-4 py-2 text-sm font-medium text-zinc-200 transition-all duration-200 hover:border-violet-300/60 hover:bg-violet-500/10 hover:text-white"
            >
              {category}
            </button>
          ))}
        </section>

        <div className="mb-10 grid gap-6 lg:grid-cols-[1.35fr_0.85fr] lg:items-start">
          <div className="space-y-6">
            <AudioPlayer
              title={selectedStory?.title || "The morning brief"}
              duration="08:42"
              progress={48}
              source={selectedStory?.source }
              audioUrl={selectedStory?.audioUrl || selectedStory?.audio || null}
              speechText={selectedStory ? `${selectedStory.title || ""}. ${selectedStory.description || ""}`.trim() : ""}
            />

            <section>
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-medium tracking-[-0.05em] text-zinc-50">Your personalized feed</h2>
                <button type="button" className="text-sm font-medium text-violet-200 transition hover:text-violet-100">
                  View all
                </button>
              </div>

              {loading ? (
                <div className="rounded-[1.75rem] border border-dashed border-violet-400/20 bg-white/[0.02] p-8 text-center">
                  <h3 className="text-xl font-medium tracking-[-0.04em] text-zinc-50">Loading news...</h3>
                </div>
              ) : error ? (
                <div className="rounded-[1.75rem] border border-dashed border-violet-400/20 bg-white/[0.02] p-8 text-center">
                  <h3 className="text-xl font-medium tracking-[-0.04em] text-zinc-50">Unable to load news</h3>
                  <p className="mt-2 text-sm text-zinc-300">{error}</p>
                </div>
              ) : feedItems.length === 0 ? (
                <div className="rounded-[1.75rem] border border-dashed border-violet-400/20 bg-white/[0.02] p-8 text-center">
                  <h3 className="text-xl font-medium tracking-[-0.04em] text-zinc-50">No stories yet</h3>
                  <p className="mt-2 text-sm text-zinc-300">
                    No news articles are available right now.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                  {feedItems.map((item) => {
                    const isSelected = selectedStory && (selectedStory._id || selectedStory.id || selectedStory.url) === (item._id || item.id || item.url);

                    return (
                      <article
                        key={item._id ?? item.id ?? item.url ?? item.title ?? "story-item"}
                        className={[
                          "cursor-pointer overflow-hidden rounded-[1.5rem] border p-5 transition-all duration-200",
                          isSelected
                            ? "border-violet-300/60 bg-violet-500/10 shadow-[0_0_0_1px_rgba(192,132,252,0.2)]"
                            : "border-violet-400/20 bg-white/[0.03]",
                        ].join(" ")}
                        onClick={() => setSelectedStory(item)}
                      >
                        {item.image ? (
                          <img src={item.image} alt={item.title || "News article"} className="mb-4 h-40 w-full rounded-[1.2rem] object-cover" />
                        ) : null}

                        <p className="text-[10px] uppercase tracking-[0.14em] text-violet-200/80">
                          {item.category ?? "Feed"}
                        </p>

                        <h3 className="mt-3 text-lg font-medium tracking-[-0.04em] text-zinc-50">
                          {item.title ?? "Story headline"}
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-zinc-300">
                          {item.description ?? "No description available."}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-zinc-400">
                          <span>{item.source ?? "Source unavailable"}</span>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedStory(item);
                            }}
                            className="text-violet-200 underline-offset-4 hover:underline"
                          >
                            Read more
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          <aside className="min-h-0 lg:self-start lg:flex lg:flex-col lg:min-h-0 lg:h-[calc(100vh-180px)]">
            <div className="rounded-[2rem] border border-violet-400/20 bg-white/[0.03] p-5 shadow-[0_0_0_1px_rgba(168,85,247,0.05)] backdrop-blur-sm sm:p-6 lg:flex lg:flex-col lg:min-h-0 lg:h-full lg:overflow-hidden">
              <div className="shrink-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-violet-200/80">
                  Today’s brief
                </p>
                <h2 className="mt-3 text-2xl font-medium tracking-[-0.05em] text-zinc-50">
                  Top stories
                </h2>
              </div>

              <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-violet-500/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-violet-400/50">
                {gnewsLoading ? (
                  <div className="rounded-[1.5rem] border border-dashed border-violet-400/20 bg-white/[0.02] p-4 text-sm text-zinc-300">
                    Loading top stories...
                  </div>
                ) : gnewsError ? (
                  <div className="rounded-[1.5rem] border border-dashed border-violet-400/20 bg-white/[0.02] p-4 text-sm text-red-300">
                    {gnewsError}
                  </div>
                ) : topStories.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-violet-400/20 bg-white/[0.02] p-4 text-sm text-zinc-300">
                    No top stories available right now.
                  </div>
                ) : (
                  <div className="space-y-4 pb-1">
                    {topStories.map((article) => {
                      const hasValidUrl = Boolean(article?.url && /^https?:\/\//i.test(article.url));

                      return (
                        <button
                          key={`${article.title}-${article.publishedAt}`}
                          type="button"
                          onClick={() => {
                            if (!hasValidUrl) return;
                            window.open(article.url, "_blank", "noopener,noreferrer");
                          }}
                          disabled={!hasValidUrl}
                          className={[
                            "w-full overflow-hidden rounded-[1.25rem] border border-violet-400/20 bg-gradient-to-br from-violet-500/8 via-fuchsia-500/5 to-transparent text-left transition-all duration-200",
                            hasValidUrl ? "cursor-pointer hover:border-violet-300/60 hover:bg-violet-500/10" : "cursor-default opacity-90",
                          ].join(" ")}
                        >
                          <img
                            src={article.image}
                            alt={article.title || "News article"}
                            className="h-28 w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.src = "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=900&q=80";
                            }}
                          />

                          <div className="p-3">
                            <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-violet-100">
                              {article.source?.name || "News"}
                            </p>
                            <h3 className="mt-2 text-base font-medium tracking-[-0.04em] text-zinc-50">
                              {article.title || "Breaking story"}
                            </h3>

                            <div className="mt-2 text-[10px] uppercase tracking-[0.14em] text-zinc-400">
                              {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }) : "Recent"}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default PersonalizedNews;
