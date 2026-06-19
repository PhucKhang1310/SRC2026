import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { fetchPublications, parsePublicationDate } from "../../api/publicationApi";
import type { PublicationItem } from "../../data/publicationsData";
import { useCheckMobile } from "../../hook/useCheckMobile";
import { usePageContent } from "../../hook/usePageContent";
import LoadingPage from "../../components/loading/LoadingPage";

const fallbackPublicationsHome = {
  eyebrow: "Latest Posts",
  badge: "Latest",
  readMoreLabel: "Keep Reading",
  viewAllLabel: "View all publications",
};

const Publications = () => {
  const navigate = useNavigate();
  const { isMobile } = useCheckMobile();
  const { content } = usePageContent();
  const publicationsHome =
    content?.publicationsHome ?? fallbackPublicationsHome;
  const [latestPubs, setLatestPubs] = useState<PublicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadPublications = async () => {
      try {
        setIsLoading(true);
        setError("");
        const publications = await fetchPublications(controller.signal);
        setLatestPubs(publications.slice(0, 3));
      } catch (loadError) {
        if (controller.signal.aborted) return;

        setLatestPubs([]);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load publications.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadPublications();

    return () => controller.abort();
  }, []);

  if (isLoading) {
    return <LoadingPage label="Loading publications" />;
  }

  return (
    <section
      id="publications"
      className="flex scroll-mt-24 flex-col items-center justify-center px-4 py-16 text-black"
    >
      <div className="mb-12 w-4/5 max-w-5xl text-center">
        <p className="divider divider-neutral text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
          {publicationsHome.eyebrow}
        </p>
      </div>

      {error ? (
        <p className="w-4/5 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : latestPubs.length > 0 ? (
        <div className="flex w-4/5 max-w-5xl flex-col gap-16">
          {latestPubs.map((pub, index) => (
            <article
              key={pub.id}
              className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-0 ${
                !isMobile && index % 2 !== 0 ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`${
                  isMobile ? "w-full" : "w-[45%]"
                } shrink-0 overflow-hidden`}
              >
                <img
                  src={pub.image}
                  alt={pub.journalName}
                  className="h-72 w-full object-cover transition-transform duration-500 hover:scale-105 md:h-80"
                  loading="lazy"
                />
              </div>

              <div
                className={`relative flex flex-1 flex-col justify-center bg-white px-8 py-8 shadow-lg ${
                  isMobile
                    ? "-mt-6 mx-4 rounded-md"
                    : index % 2 !== 0
                      ? "-mr-8 rounded-l-md"
                      : "-ml-8 rounded-r-md"
                }`}
                style={
                  !isMobile
                    ? { marginTop: "2rem", marginBottom: "2rem" }
                    : undefined
                }
              >
                <span className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">
                  {publicationsHome.badge}
                </span>
                <h3 className="mb-3 line-clamp-4 text-xl font-bold leading-tight text-gray-900 md:text-2xl">
                  {pub.title}
                </h3>
                <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-gray-600">
                  {pub.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    {parsePublicationDate(pub.date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </span>
                  <button
                    type="button"
                    className="group flex cursor-pointer items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 transition-colors hover:text-teal-600"
                    onClick={() =>
                      navigate(`/publications/${encodeURIComponent(pub.id)}`)
                    }
                  >
                    {publicationsHome.readMoreLabel}
                    <FaArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-black/60">
          No publications are available.
        </p>
      )}

      <button
        type="button"
        className="mt-12 flex cursor-pointer items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500 transition-colors hover:text-black"
        onClick={() => navigate("/publications")}
      >
        {publicationsHome.viewAllLabel}
        <FaArrowRight className="size-3.5" />
      </button>
    </section>
  );
};

export default Publications;
