import { useEffect, useState } from "react";
import { FaPen, FaPlus, FaRotateRight } from "react-icons/fa6";
import { Navigate, useNavigate } from "react-router-dom";
import { fetchNews, type NewsRecord } from "../../api/newsApi";
import { useUser } from "../../hook/useUser";
import LoadingPage from "../../components/loading/LoadingPage";
import AdminSidebar from "./AdminSidebar";

const NewsAdminPage = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNews = async (
    signal?: AbortSignal,
    options: { forceRefresh?: boolean } = {},
  ) => {
    try {
      setIsLoading(true);
      setError("");
      setNews(await fetchNews(signal, options));
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

  if (isUserLoading) {
    return <LoadingPage label="Checking login status" />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (isLoading) {
    return <LoadingPage label="Loading news admin" />;
  }

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#050505] font-sans text-amber-50">
      <AdminSidebar description="Manage published news articles." />

      <section className="flex-1 overflow-y-auto bg-[#0a0a0a]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-amber-50/5 bg-[#0a0a0a]/80 px-6 py-4 shadow-sm backdrop-blur-md md:px-10">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-[#ff6a1f]" />
            <h2 className="text-lg font-medium tracking-wide text-amber-50/90">
              News management
            </h2>
          </div>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-amber-50/15 px-4 py-2 text-sm font-semibold text-amber-50 transition hover:border-[#ff6a1f] hover:bg-[#ff6a1f]/10"
            onClick={() => void loadNews(undefined, { forceRefresh: true })}
          >
            <FaRotateRight />
            Refresh
          </button>
        </div>

        <div className="mx-auto max-w-8xl p-6 md:p-10">
          <div className="mb-6 flex flex-col gap-4 border-b border-amber-50/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#ff6a1f]">
                Published news
              </p>
              <h1 className="mt-1 text-3xl font-bold text-amber-50">
                {news.length} articles
              </h1>
              <p className="mt-2 text-sm text-amber-50/55">
              Manage news articles saved in the backend news database.
            </p>
          </div>

            <button
              type="button"
              className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#ff6a1f] to-[#e85f1b] px-4 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-[#ff6a1f]/20"
              onClick={() => navigate("/admin/news/upload")}
            >
              <FaPlus />
              Add news
            </button>
        </div>

        {error && (
            <div className="mb-6 rounded-lg border border-red-500/40 bg-red-950/50 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

          <div className="rounded-lg border border-amber-50/10 bg-black">
            <table className="table table-fixed">
              <thead className="bg-zinc-950 text-amber-50/45">
                <tr className="border-amber-50/10">
                  <th className="w-[12%]">Image</th>
                  <th className="w-[42%]">Title</th>
                  <th className="w-[18%]">Author</th>
                  <th className="w-[14%]">Date</th>
                  <th className="w-[14%] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {news.length === 0 ? (
                  <tr className="border-amber-50/10">
                    <td colSpan={5} className="py-10 text-center text-sm text-amber-50/55">
                      No news articles found.
                    </td>
                  </tr>
                ) : (
                  news.map((item) => (
                    <tr key={item._id} className="border-amber-50/10 hover:bg-amber-50/5">
                      <td>
                        <img
                          src={item.thumbNailImage}
                          alt={item.title}
                          className="h-14 w-20 rounded-lg border border-amber-50/10 object-cover"
                        />
                      </td>
                      <td>
                        <div className="min-w-0">
                          <h2 className="line-clamp-2 text-sm font-semibold text-amber-50">
                            {item.title}
                          </h2>
                          <p className="mt-1 line-clamp-2 text-xs text-amber-50/50">
                            {item.description}
                          </p>
                        </div>
                      </td>
                      <td className="text-sm text-amber-50/70 wrap-anywhere">
                        {item.author}
                      </td>
                      <td className="text-sm text-amber-50/55">
                        {new Date(item.date).toLocaleDateString("vi-VN")}
                      </td>
                      <td>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="btn btn-sm border-amber-50/15 bg-transparent text-amber-50 hover:border-[#ff6a1f] hover:bg-amber-50/10"
                            onClick={() => navigate(`/admin/news/${item._id}/edit`)}
                          >
                            <FaPen />
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NewsAdminPage;
