import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { FaArrowLeft, FaImage, FaPaperPlane } from "react-icons/fa6";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../../hook/useUser";
import Footer from "../../components/footer/Footer";
import NavBar from "../../components/navbar/NavBar";

const inputClass =
  "w-full rounded-lg border border-white/15 bg-zinc-950 px-4 py-3 text-sm text-amber-50 outline-none transition placeholder:text-amber-50/30 focus:border-[#ff6a1f] focus:ring-2 focus:ring-[#ff6a1f]/20";

const labelClass =
  "text-xs font-semibold uppercase tracking-wider text-amber-50/60";

const PostNews = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const thumbnailPreviewUrl = useMemo(() => {
    if (!thumbnailFile) {
      return "";
    }

    return URL.createObjectURL(thumbnailFile);
  }, [thumbnailFile]);

  useEffect(() => {
    return () => {
      if (thumbnailPreviewUrl) {
        URL.revokeObjectURL(thumbnailPreviewUrl);
      }
    };
  }, [thumbnailPreviewUrl]);

  if (isUserLoading) {
    return (
      <main className="min-h-screen bg-black text-amber-50">
        <p className="py-32 text-center text-sm text-amber-50/60">
          Checking login status...
        </p>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setThumbnailFile(file);
    setStatusMessage("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !description.trim() || !thumbnailFile) {
      setStatusMessage("Please add a title, description, and thumbnail image.");
      return;
    }

    setStatusMessage(
      "Page is ready. Backend submission will be connected after the news storage shape is confirmed.",
    );
  };

  return (
    <main className="min-h-screen bg-black text-amber-50">
      <NavBar />
      <section className="mx-auto max-w-5xl px-6 pt-32 pb-16">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 text-sm text-amber-50/70 transition hover:text-amber-50"
        >
          <FaArrowLeft size={14} />
          Back
        </button>

        <div className="mb-8">
          <p className={labelClass}>Staff area</p>
          <h1 className="mt-3 text-3xl font-black uppercase tracking-wider text-[#ff6a1f] md:text-5xl">
            Post News
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"
        >
          <section className="rounded-lg border border-amber-50/10 bg-zinc-900 p-5">
            <div className="grid gap-5">
              <div>
                <label htmlFor="news-title" className={labelClass}>
                  Title
                </label>
                <input
                  id="news-title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className={`${inputClass} mt-2`}
                  placeholder="News title"
                  maxLength={140}
                />
              </div>

              <div>
                <label htmlFor="news-description" className={labelClass}>
                  Description
                </label>
                <textarea
                  id="news-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className={`${inputClass} mt-2 min-h-44 resize-y leading-6`}
                  placeholder="Short summary shown on news cards and the detail page"
                  maxLength={600}
                />
              </div>

              <div>
                <label htmlFor="news-thumbnail" className={labelClass}>
                  Thumbnail image
                </label>
                <input
                  id="news-thumbnail"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleThumbnailChange}
                  className="file-input file-input-bordered mt-2 w-full bg-zinc-950 text-amber-50 file:border-0 file:bg-[#f27255] file:text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#f27255] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e65c3b]"
              >
                <FaPaperPlane size={14} />
                Save draft
              </button>
              {statusMessage && (
                <p className="text-sm text-amber-50/65">{statusMessage}</p>
              )}
            </div>
          </section>

          <aside className="rounded-lg border border-amber-50/10 bg-zinc-900 p-5">
            <p className={labelClass}>Preview</p>
            <div className="mt-3 overflow-hidden rounded-lg border border-white/10 bg-black">
              {thumbnailPreviewUrl ? (
                <img
                  src={thumbnailPreviewUrl}
                  alt="Selected news thumbnail preview"
                  className="aspect-4/3 w-full object-cover"
                />
              ) : (
                <div className="flex aspect-4/3 w-full items-center justify-center bg-zinc-950 text-amber-50/35">
                  <FaImage size={38} />
                </div>
              )}
              <div className="p-4">
                <h2 className="line-clamp-2 text-lg font-semibold text-[#f27255]">
                  {title.trim() || "News title"}
                </h2>
                <p className="mt-3 line-clamp-4 text-sm leading-6 text-amber-50/75">
                  {description.trim() ||
                    "The news description will appear here."}
                </p>
              </div>
            </div>
          </aside>
        </form>
      </section>
      <Footer />
    </main>
  );
};

export default PostNews;
