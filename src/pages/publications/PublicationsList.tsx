import { useEffect, useState } from "react";
import { fetchPublications, parsePublicationDate } from "../../api/publicationApi";
import type { PublicationItem } from "../../data/publicationsData";
import NavBar from "../../components/navbar/NavBar";
import Footer from "../../components/navbar/NavBar";
import Pagination from "../../components/pagination/Pagination";
import { FaArrowLeft } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { useCheckMobile } from "../../hook/useCheckMobile";
import LoadingPage from "../../components/loading/LoadingPage";

const PublicationsList = () => {
  const pageSize = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [publications, setPublications] = useState<PublicationItem[]>([]);
  const [items, setItems] = useState<PublicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useCheckMobile();

  useEffect(() => {
    const controller = new AbortController();

    const loadPublications = async () => {
      const loadingStartedAt = Date.now();

      try {
        setIsLoading(true);
        setFetchError("");

        const remotePublications = await fetchPublications(controller.signal);
        setPublications(remotePublications);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setPublications([]);
        setFetchError("Unable to load live publication data.");
      } finally {
        const elapsed = Date.now() - loadingStartedAt;
        const remainingDelay = Math.max(0, 500 - elapsed);
        await new Promise((resolve) => setTimeout(resolve, remainingDelay));
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadPublications();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const handlePageChange = () => {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setItems(publications.slice(startIndex, endIndex));
    };

    handlePageChange();

    return () => handlePageChange();
  }, [currentPage, publications]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <LoadingPage label="Loading publications" />;
  }

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
          {fetchError && (
            <div className="py-10 text-center text-sm text-amber-50/50">
              {fetchError}
            </div>
          )}
          {!fetchError && items.length === 0 && (
            <div className="py-10 text-center text-sm text-amber-50/50">
              No publications are available.
            </div>
          )}
          {items.map((pub) => (
            <article
              key={pub.id}
              className="group py-5 transition-colors hover:bg-amber-50/2 px-4 -mx-4 rounded"
            >
              <a
                href={`/publications/${encodeURIComponent(pub.id)}`}
                className="block"
              >
                <h2
                  className={`font-bold leading-snug text-amber-50 group-hover:text-[#ff6a1f] transition-colors ${isMobile ? "text-sm" : "text-base"
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
                    {parsePublicationDate(pub.date).toLocaleDateString("vi-VN", {
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
        {publications.length > pageSize && (
          <Pagination
            className="mt-10"
            currentPage={currentPage}
            totalCount={publications.length}
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
