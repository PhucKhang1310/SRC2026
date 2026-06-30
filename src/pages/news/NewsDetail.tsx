import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { fetchNews, type NewsRecord } from "../../api/newsApi";
import srcLogo from "../../assets/logo_src_white_nobg.png";
import { useCheckMobile } from "../../hook/useCheckMobile";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/NavBar";
import LoadingPage from "../../components/loading/LoadingPage";

const getNewsImage = (item: NewsRecord) =>
  item.thumbNailImage || item.images[0] || srcLogo;

const NewsDetail = () => {
  const { isMobile } = useCheckMobile();
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadNews = async () => {
      try {
        setIsLoading(true);
        setError("");
        setNews(await fetchNews(controller.signal));
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setError(
          loadError instanceof Error ? loadError.message : "Failed to load news.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadNews();

    return () => controller.abort();
  }, []);

  const newsItem = useMemo(
    () => news.find((item) => item._id === id),
    [id, news],
  );

  const relatedNews = useMemo(
    () => news.filter((item) => item._id !== id).slice(0, 3),
    [id, news],
  );

  if (isLoading) {
    return <LoadingPage label="Loading news article" />;
  }

  return (
    <main className="min-h-screen bg-black p-6 text-amber-50">
      <Navbar />
      <section className="mx-auto w-4/5 pt-28">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="text-md mt-2 ml-1 flex cursor-pointer items-center gap-2"
        >
          <FaArrowLeft size={16} />
          Back
        </button>

        {error ? (
          <p className="mt-6 rounded border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        ) : newsItem ? (
          <>
            {isMobile && (
              <img
                src={getNewsImage(newsItem)}
                alt={newsItem.title}
                className="mt-6 max-h-105 w-full rounded-lg object-cover"
              />
            )}

            <div className="mt-6">
              <h2 className="mb-4 text-3xl font-bold text-[#f27255]">
                {newsItem.title}
              </h2>

              {!isMobile && (
                <img
                  src={getNewsImage(newsItem)}
                  alt={newsItem.title}
                  className="max-h-105 w-full rounded-lg object-cover"
                />
              )}

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-amber-50/60">
                <span>{newsItem.author}</span>
                <span>{new Date(newsItem.date).toLocaleDateString("vi-VN")}</span>
              </div>
              <p className="mt-4 leading-7 text-amber-50/90">
                {newsItem.content || newsItem.description}
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="mt-6 text-3xl font-bold text-[#f27255]">
              News not found
            </h2>
            <p className="mt-4 text-amber-50/90">Something went wrong.</p>
          </>
        )}
      </section>

      <div className="mx-auto w-3/4">
        <h3 className="mt-10 text-2xl font-bold">Related News</h3>
        <div className="mx-auto pb-20">
          <div className="mt-6 grid grid-cols-12 gap-8">
            {relatedNews.map((item) => (
              <Link
                key={item._id}
                to={`/news-list/${item._id}`}
                className={
                  isMobile
                    ? "col-span-12"
                    : "col-span-12 md:col-span-6 lg:col-span-4"
                }
              >
                <img
                  src={getNewsImage(item)}
                  alt={item.title}
                  className="h-56 w-full object-cover"
                  loading="lazy"
                />
                <h4 className="mt-4 line-clamp-2 text-xl font-normal text-amber-50">
                  {item.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default NewsDetail;
