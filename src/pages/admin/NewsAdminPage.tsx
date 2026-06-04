import { useEffect, useState } from "react";
import { FaArrowLeft, FaPlus, FaRotateRight } from "react-icons/fa6";
import { Navigate, useNavigate } from "react-router-dom";
import { fetchNews, type NewsRecord } from "../../api/api";
import { useUser } from "../../hook/useUser";

const NewsAdminPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNews = async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError("");
      setNews(await fetchNews(signal));
    } catch (loadError) {
      if (signal?.aborted) return;
      setError(loadError instanceof Error ? loadError.message : "Could not load news.");
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadNews(controller.signal);

    return () => controller.abort();
  }, []);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
              onClick={() => navigate("/admin")}
            >
              <FaArrowLeft />
              Back to admin
            </button>
            <h1 className="text-3xl font-bold text-white">News Admin</h1>
            <p className="mt-2 text-sm text-slate-400">
              Manage news articles saved in the backend news database.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
              onClick={() => void loadNews()}
            >
              <FaRotateRight />
              Refresh
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-500"
              onClick={() => navigate("/admin/news/upload")}
            >
              <FaPlus />
              New news
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-red-500/40 bg-red-950/50 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
          <div className="grid grid-cols-[96px_1fr] gap-4 border-b border-slate-800 px-4 py-3 text-xs font-semibold uppercase text-slate-500 md:grid-cols-[120px_1fr_180px_140px]">
            <span>Image</span>
            <span>Title</span>
            <span className="hidden md:block">Author</span>
            <span className="hidden md:block">Date</span>
          </div>

          {isLoading ? (
            <p className="px-4 py-10 text-center text-sm text-slate-400">Loading news...</p>
          ) : news.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-slate-400">No news articles found.</p>
          ) : (
            news.map((item) => (
              <article
                key={item._id}
                className="grid grid-cols-[96px_1fr] gap-4 border-b border-slate-800 px-4 py-4 last:border-b-0 md:grid-cols-[120px_1fr_180px_140px] md:items-center"
              >
                <img
                  src={item.thumbNailImage}
                  alt={item.title}
                  className="h-16 w-24 rounded object-cover md:h-20 md:w-28"
                />
                <div className="min-w-0">
                  <h2 className="line-clamp-2 text-sm font-semibold text-white">{item.title}</h2>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-400">{item.description}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500 md:hidden">
                    <span>{item.author}</span>
                    <span>{new Date(item.date).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>
                <span className="hidden text-sm text-slate-300 md:block">{item.author}</span>
                <span className="hidden text-sm text-slate-400 md:block">
                  {new Date(item.date).toLocaleDateString("vi-VN")}
                </span>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default NewsAdminPage;
