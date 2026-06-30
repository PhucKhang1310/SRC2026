import { useEffect, useState } from "react";
import { fetchPublications, parsePublicationDate } from "../../api/publicationApi";
import type { PublicationItem } from "../../data/publicationsData";
import NavBar from "../../components/navbar/NavBar";
import Footer from "../../components/footer/Footer";
import Pagination from "../../components/pagination/Pagination";
import { FaArrowLeft, FaMoon, FaSun } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { useCheckMobile } from "../../hook/useCheckMobile";
import LoadingPage from "../../components/loading/LoadingPage";

const darkTheme = {
  page: "bg-black text-amber-50",
  backButton: "text-amber-50/70 hover:text-amber-50",
  toggleButton:
    "border-amber-50/15 text-amber-50/75 hover:border-[#ff6a1f] hover:bg-[#ff6a1f]/10 hover:text-amber-50",
  subtitle: "text-amber-50/50",
  divider: "divide-amber-50/10",
  emptyText: "text-amber-50/50",
  row: "hover:bg-amber-50/5",
  title: "text-amber-50 group-hover:text-[#ff6a1f]",
  separator: "text-amber-50/30",
  date: "text-amber-50/50",
};

const lightTheme = {
  page: "bg-slate-50 text-slate-950",
  backButton: "text-slate-600 hover:text-slate-950",
  toggleButton:
    "border-slate-300 text-slate-700 hover:border-[#ff6a1f] hover:bg-orange-50 hover:text-slate-950",
  subtitle: "text-slate-500",
  divider: "divide-slate-200",
  emptyText: "text-slate-500",
  row: "hover:bg-orange-50/70",
  title: "text-slate-950 group-hover:text-[#ff6a1f]",
  separator: "text-slate-300",
  date: "text-slate-500",
};

const PublicationsList = () => {
  const pageSize = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [publications, setPublications] = useState<PublicationItem[]>([]);
  const [items, setItems] = useState<PublicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useCheckMobile();
  const theme = themeMode === "light" ? lightTheme : darkTheme;

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
    <main className={`min-h-screen ${theme.page}`} data-theme={themeMode}>
      <NavBar themeMode={themeMode} />
      <section className="mx-auto w-4/5 max-w-5xl pt-36 pb-16">
        {/* Back button */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => navigate("/home#publications")}
            className={`text-md flex cursor-pointer items-center gap-2 transition-colors ${theme.backButton}`}
          >
            <FaArrowLeft size={16} />
            Back
          </button>
          <button
            type="button"
            onClick={() => setThemeMode((mode) => (mode === "dark" ? "light" : "dark"))}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-wider transition ${theme.toggleButton}`}
            aria-label={`Switch to ${themeMode === "dark" ? "light" : "dark"} theme`}
          >
            {themeMode === "dark" ? <FaSun /> : <FaMoon />}
            {themeMode === "dark" ? "Light" : "Dark"}
          </button>
        </div>

        {/* Header */}
        <div className="mt-6 mb-10 text-center">
          <h1 className="text-3xl font-black uppercase tracking-wider text-[#ff6a1f] md:text-4xl">
            Publications
          </h1>
          <p className={`mt-3 text-sm ${theme.subtitle}`}>
            Published research papers from SRC competitions
          </p>
        </div>

        {/* Publication list */}
        <div className={`divide-y ${theme.divider}`}>
          {fetchError && (
            <div className={`py-10 text-center text-sm ${theme.emptyText}`}>
              {fetchError}
            </div>
          )}
          {!fetchError && items.length === 0 && (
            <div className={`py-10 text-center text-sm ${theme.emptyText}`}>
              No publications are available.
            </div>
          )}
          {items.map((pub) => (
            <article
              key={pub.id}
              className={`group -mx-4 rounded px-4 py-5 transition-colors ${theme.row}`}
            >
              <a
                href={`/publications/${encodeURIComponent(pub.id)}`}
                className="block"
              >
                <h2
                  className={`font-bold leading-snug transition-colors ${theme.title} ${isMobile ? "text-sm" : "text-base"
                    }`}
                >
                  {pub.title}
                </h2>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="font-bold text-[#ff6a1f]">
                    {pub.source}
                  </span>
                  <span className={theme.separator}>|</span>
                  <span className={theme.date}>
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
