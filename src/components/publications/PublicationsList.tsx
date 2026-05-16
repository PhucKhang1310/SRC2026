import { useEffect, useState } from "react";
import { publicationsData, type PublicationItem } from "../../data/publicationsData";
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";
import Pagination from "../pagination/Pagination";
import { FaArrowLeft } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { useCheckMobile } from "../../hook/useCheckMobile";

const PublicationsList = () => {
  const pageSize = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<PublicationItem[]>(
    publicationsData.slice(0, pageSize)
  );
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useCheckMobile();

  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setItems(publicationsData.slice(startIndex, endIndex));
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className="min-h-screen bg-black text-amber-50">
      <NavBar />
      <section className="mx-auto w-4/5 max-w-5xl pt-36 pb-16">
        {/* Back button */}
        <div>
          <button
            onClick={() => navigate("/home#publications")}
            className="text-md flex items-center gap-2 cursor-pointer text-amber-50/70 hover:text-amber-50 transition-colors"
          >
            <FaArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* Header */}
        <div className="mt-6 mb-10 text-center">
          <h1 className="text-3xl font-black uppercase tracking-wider text-[#ff6a1f] md:text-4xl">
            Publications
          </h1>
          <p className="mt-3 text-sm text-amber-50/50">
            Published research papers from SRC competitions
          </p>
        </div>

        {/* Publication list */}
        <div className="divide-y divide-amber-50/10">
          {items.map((pub) => (
            <article
              key={pub.id}
              className="group py-5 transition-colors hover:bg-amber-50/[0.02] px-4 -mx-4 rounded"
            >
              <a
                href={pub.newsId ? `/news-list/${pub.newsId}` : "#"}
                className="block"
              >
                <h2
                  className={`font-bold leading-snug text-amber-50 group-hover:text-[#ff6a1f] transition-colors ${
                    isMobile ? "text-sm" : "text-base"
                  }`}
                >
                  {pub.title}
                </h2>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="font-bold text-[#ff6a1f]">
                    {pub.source}
                  </span>
                  <span className="text-amber-50/30">|</span>
                  <span className="text-amber-50/50">
                    {new Date(pub.date).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    })}
                  </span>
                </div>
              </a>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {publicationsData.length > pageSize && (
          <Pagination
            className="mt-10"
            currentPage={currentPage}
            totalCount={publicationsData.length}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        )}
      </section>
      <Footer />
    </main>
  );
};

export default PublicationsList;
