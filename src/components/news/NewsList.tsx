import { useEffect, useState } from "react";
import fptLogo from "../../assets/fpt_logo.jpg"
import { newsData, type NewsItem } from "../../data/newsData";
import NavBar from "../navbar/NavBar";
import Pagination from "../pagination/Pagination";
import { FaArrowLeft } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../footer/Footer";
import { useCheckMobile } from "../../hook/useCheckMobile";

const newsList: NewsItem[] = [...newsData, ...newsData, ...newsData];

const NewsList = () => {
    let pageSize = 9;
    const [newsItems, setNewsItems] = useState<NewsItem[]>(newsList.slice(0, pageSize));
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();
    const { isMobile } = useCheckMobile();
    if (isMobile) {
        pageSize = 4;
    }

    useEffect(() => {
        const handlePageChange = () => {
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            setNewsItems(newsList.slice(startIndex, endIndex));
        }

        handlePageChange();

        return () => handlePageChange();
    }, [currentPage, pageSize]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [location, currentPage])

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    const handleBackToNewsPage = () => {
        navigate("/home#news");
    }

    return (
        <main className="bg-black min-h-screen text-amber-50">
            <NavBar />
            <section className="mx-auto w-4/5 max-w-7xl pt-36">
                <div>
                    <button
                        onClick={handleBackToNewsPage}
                        className="text-md flex items-center ml-6 gap-2 cursor-pointer">
                        <FaArrowLeft size={16} />
                        Back
                    </button>
                </div>
                <div className="text-3xl font-bold w-full max-w-7xl py-4 pl-6 ">
                    SRC2026 News
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-16 p-6">
                    {newsItems.map((newsItem, index) => (
                        <a
                            key={`news-item-${index}-${newsItem.id}`}
                            href={`/news-list/${newsItem.id}`}
                            className="group flex flex-col overflow-hidden rounded-lg cursor-pointer p-2"
                        >
                            <div className="overflow-hidden">
                                <img
                                    src={fptLogo}
                                    alt="FPT Logo"
                                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <div className="mt-4 flex flex-col flex-1 gap-4">
                                <div className="flex justify-between items-center text-white text-sm">
                                    <span className="font-medium">{newsItem.author}</span>
                                    <span>{new Date(newsItem.date).toLocaleDateString("vi-VN")}</span>
                                </div>
                                <h3 className="line-clamp-2 font-semibold text-base text-[#f27255]">{newsItem.title}</h3>
                            </div>
                        </a>
                    ))}
                </div>

                <Pagination
                    className="mt-8"
                    currentPage={currentPage}
                    totalCount={newsList.length}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                />
            </section>
            <Footer />
        </main>
    )
}

export default NewsList;