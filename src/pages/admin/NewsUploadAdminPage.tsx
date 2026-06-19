import { useState, type FormEvent } from "react";
import { FaArrowLeft, FaFloppyDisk } from "react-icons/fa6";
import { Navigate, useNavigate } from "react-router-dom";
import { submitNews } from "../../api/api";
import { useUser } from "../../hook/useUser";

const inputClass =
  "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20";

const labelClass = "text-xs font-semibold uppercase text-slate-400";

const textToUrls = (value: string) =>
  value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

const NewsUploadAdminPage = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbNailImage, setThumbNailImage] = useState("");
  const [thumbNailImageFile, setThumbNailImageFile] = useState<File | null>(null);
  const [imagesText, setImagesText] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isUserLoading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
        <p className="py-12 text-center text-sm text-slate-400">
          Checking login status...
        </p>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setStatus("");

      await submitNews({
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

      setStatus("News saved successfully.");
      navigate("/admin/news");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "News submission failed.");
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
          <h1 className="text-3xl font-bold text-white">Create News</h1>
          <p className="mt-2 text-sm text-slate-400">
            Submit a news article to MongoDB `newsDb.newsCollection`.
          </p>
        </div>

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

          <label className="grid gap-2">
            <span className={labelClass}>Thumbnail image file</span>
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
            <span className={labelClass}>Gallery image files</span>
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
              {isSubmitting ? "Saving..." : "Submit news"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default NewsUploadAdminPage;
