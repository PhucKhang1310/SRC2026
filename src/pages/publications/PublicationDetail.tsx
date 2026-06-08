import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { fetchPublicationById, parsePublicationDate } from "../../api/api";
import type { PublicationItem } from "../../data/publicationsData";
import NavBar from "../../components/navbar/NavBar";
import Footer from "../../components/navbar/NavBar";
import LoadingPage from "../../components/loading/LoadingPage";

const sanitizePublicationHtml = (html: string) =>
  html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+=["'][^"']*["']/gi, "")
    .replace(/\sjavascript:/gi, "");

const PublicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [publication, setPublication] = useState<PublicationItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!id) {
      setFetchError("Publication was not found.");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadPublication = async () => {
      try {
        setIsLoading(true);
        setFetchError("");
        setPublication(await fetchPublicationById(id, controller.signal));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setPublication(null);
        setFetchError("Unable to load this publication.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadPublication();

    return () => controller.abort();
  }, [id]);

  const contentHtml = useMemo(
    () => sanitizePublicationHtml(publication?.content || publication?.description || ""),
    [publication]
  );

  if (isLoading) {
    return <LoadingPage label="Loading publication" />;
  }

  return (
    <main className="min-h-screen bg-black text-amber-50">
      <NavBar />
      <section className="mx-auto w-4/5 max-w-4xl pt-36 pb-16">
        <button
          type="button"
          onClick={() => navigate("/publications")}
          className="text-md flex cursor-pointer items-center gap-2 text-amber-50/70 transition-colors hover:text-amber-50"
        >
          <FaArrowLeft size={16} />
          Back to publications
        </button>

        {fetchError && (
          <div className="py-16 text-center text-sm text-amber-50/50">
            {fetchError}
          </div>
        )}

        {publication && (
          <article className="mt-8">
            <img
              src={publication.image}
              alt={publication.journalName}
              className="mb-8 h-72 w-full rounded-md object-cover md:h-96"
            />
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#ff6a1f]">
              {publication.source}
            </p>
            <h1 className="text-3xl font-black leading-tight text-amber-50 md:text-5xl">
              {publication.title}
            </h1>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-amber-50/50">
              {publication.author && <span>{publication.author}</span>}
              <span>
                {parsePublicationDate(publication.date).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </span>
            </div>
            <div
              className="prose prose-invert mt-10 max-w-none text-amber-50/80 prose-headings:text-amber-50 prose-p:leading-8 prose-img:rounded-md"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </article>
        )}
      </section>
      <Footer />
    </main>
  );
};

export default PublicationDetail;
