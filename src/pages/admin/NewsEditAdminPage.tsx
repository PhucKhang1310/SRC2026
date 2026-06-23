import { useEffect, useState, type FormEvent } from "react";
import { FaArrowLeft, FaFloppyDisk } from "react-icons/fa6";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { fetchNewsById, updateNews, type NewsRecord } from "../../api/newsApi";
import LoadingPage from "../../components/loading/LoadingPage";
import { useUser } from "../../hook/useUser";

const inputClass =
  "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20";

const labelClass = "text-xs font-semibold uppercase text-slate-400";

const urlsToText = (urls: string[]) => urls.join("\n");

const textToUrls = (value: string) =>
  value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

const toDateInputValue = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString().slice(0, 10);
};

const NewsEditAdminPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: isUserLoading } = useUser();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsRecord | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbNailImage, setThumbNailImage] = useState("");
  const [thumbNailImageFile, setThumbNailImageFile] = useState<File | null>(null);
  const [imagesText, setImagesText] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    fetchNewsById(id, controller.signal)
      .then((record) => {
        setNews(record);
        setTitle(record.title);
        setDescription(record.description);
        setThumbNailImage(record.thumbNailImage);
        setImagesText(urlsToText(record.images));
        setDate(toDateInputValue(record.date));
        setContent(record.content);
        setAuthor(record.author);
      })
      .catch((error) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setStatus(error instanceof Error ? error.message : "Could not load news.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [id]);

  if (isUserLoading) {
    return <LoadingPage label="Checking login status" />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (isLoading) {
    return <LoadingPage label="Loading news editor" />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    try {
      setIsSubmitting(true);
      setStatus("");

      await updateNews(id, {
        title,
        description,
        thumbNailImage,
        thumbNailImageFile,
        images: textToUrls(imagesText),
        imageFiles,
        date,
        content,
        author,
      });

      setStatus("News updated successfully.");
      navigate("/admin/news");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "News update failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <section className="mx-auto max-w-4xl">
        <button
          type="button"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
          onClick={() => navigate("/admin/news")}
        >
          <FaArrowLeft />
          Back to news admin
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Edit News</h1>
          <p className="mt-2 text-sm text-slate-400">
            Update the article details shown on the public news page.
          </p>
        </div>

        {!news && status ? (
          <div className="rounded-md border border-red-500/40 bg-red-950/50 px-4 py-3 text-sm text-red-100">
            {status}
          </div>
        ) : (
          <form
            className="grid gap-5 rounded-lg border border-slate-800 bg-slate-900 p-5"
            onSubmit={(event) => void handleSubmit(event)}
          >
            <label className="grid gap-2">
              <span className={labelClass}>Title</span>
              <input
                autoComplete=""
                className={inputClass}
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>

            <label className="grid gap-2">
              <span className={labelClass}>Description</span>
              <textarea
                className={`${inputClass} min-h-24 resize-y`}
                autoComplete=""
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className={labelClass}>Author</span>
                <input
                  className={inputClass}
                  autoComplete=""
                  required
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                />
              </label>

              <label className="grid gap-2">
                <span className={labelClass}>Date</span>
                <input
                  type="date"
                  className={inputClass}
                  autoComplete=""
                  required
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className={labelClass}>Thumbnail image URL</span>
              <input
                className={inputClass}
                placeholder="https://..."
                value={thumbNailImage}
                onChange={(event) => setThumbNailImage(event.target.value)}
              />
            </label>

            {thumbNailImage ? (
              <img
                src={thumbNailImage}
                alt={title}
                className="h-32 w-48 rounded object-cover"
              />
            ) : null}

            <label className="grid gap-2">
              <span className={labelClass}>Replace thumbnail image file</span>
              <input
                type="file"
                accept="image/*"
                className={inputClass}
                onChange={(event) => setThumbNailImageFile(event.target.files?.[0] ?? null)}
              />
            </label>

            <label className="grid gap-2">
              <span className={labelClass}>Gallery image URLs</span>
              <textarea
                className={`${inputClass} min-h-24 resize-y font-mono text-xs`}
                placeholder="One image URL per line"
                value={imagesText}
                onChange={(event) => setImagesText(event.target.value)}
              />
            </label>

            <label className="grid gap-2">
              <span className={labelClass}>Replace gallery image files</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className={inputClass}
                onChange={(event) => setImageFiles(Array.from(event.target.files ?? []))}
              />
            </label>

            <label className="grid gap-2">
              <span className={labelClass}>Content</span>
              <textarea
                className={`${inputClass} min-h-56 resize-y`}
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
            </label>

            <div className="flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
              {status ? <p className="text-sm text-slate-300">{status}</p> : <span />}
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaFloppyDisk />
                {isSubmitting ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
};

export default NewsEditAdminPage;
