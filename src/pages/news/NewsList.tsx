import { useEffect, useMemo, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchNews, type NewsRecord } from "../../api/api";
import fptLogo from "../../assets/fpt_logo.jpg";
import { useCheckMobile } from "../../hook/useCheckMobile";
// import Footer from "../footer/Footer";
import NavBar from "../../components/navbar/NavBar";
import Pagination from "../../components/pagination/Pagination";
import LoadingPage from "../../components/loading/LoadingPage";

const NewsList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isMobile } = useCheckMobile();
    const pageSize = isMobile ? 4 : 9;
    const [newsList, setNewsList] = useState<NewsRecord[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const loadNews = async () => {
            try {
                setIsLoading(true);
                setError("");
                setNewsList(await fetchNews(controller.signal));
            } catch (loadError) {
                if (controller.signal.aborted) return;
                setError(loadError instanceof Error ? loadError.message : "Failed to load news.");
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        void loadNews();

        return () => controller.abort();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [pageSize]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [location, currentPage]);

    const newsItems = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return newsList.slice(startIndex, startIndex + pageSize);
    }, [currentPage, newsList, pageSize]);

    const handleBackToNewsPage = () => {
        navigate("/home#news");
    };

    if (isLoading) {
        return <LoadingPage label="Loading news" />;
    }

    return (
        <main className="min-h-screen bg-black text-amber-50">
            <NavBar />
            <section className="mx-auto w-4/5 max-w-7xl pt-36">
                <div>
                    <button
                        type="button"
                        onClick={handleBackToNewsPage}
                        className="text-md ml-6 flex cursor-pointer items-center gap-2"
                    >
                        <FaArrowLeft size={16} />
                        Back
                    </button>
                </div>

                <div className="w-full max-w-7xl py-4 pl-6 text-3xl font-bold">
                    SRC2026 News
                </div>

                {error && (
                    <p className="mx-6 rounded border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-100">
                        {error}
                    </p>
                )}

                <div className="grid grid-cols-1 gap-x-4 gap-y-16 p-6 md:grid-cols-2 lg:grid-cols-3">
                    {newsItems.length > 0 ? (
                        newsItems.map((newsItem) => (
                            <a
                                key={newsItem._id}
                                href={`/news-list/${newsItem._id}`}
                                className="group flex cursor-pointer flex-col overflow-hidden rounded-lg p-2"
                            >
                                <div className="overflow-hidden">
                                    <img
                                        src={newsItem.thumbNailImage || fptLogo}
                                        alt={newsItem.title}
                                        className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="mt-4 flex flex-1 flex-col gap-4">
                                    <div className="flex items-center justify-between text-sm text-white">
                                        <span className="font-medium">{newsItem.author}</span>
                                        <span>{new Date(newsItem.date).toLocaleDateString("vi-VN")}</span>
                                    </div>
                                    <h3 className="line-clamp-2 text-base font-semibold text-[#f27255]">
                                        {newsItem.title}
                                    </h3>
                                </div>
                            </a>
                        ))
                    ) : (
                        <p className="col-span-full py-12 text-center text-white/70">
                            No news items are available.
                        </p>
                    )}
                </div>

                {!isLoading && newsList.length > pageSize && (
                    <Pagination
                        className="mt-8"
                        currentPage={currentPage}
                        totalCount={newsList.length}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                    />
                )}
            </section>
            {/* <Footer /> */}
        </main>
    );
};

export default NewsList;
