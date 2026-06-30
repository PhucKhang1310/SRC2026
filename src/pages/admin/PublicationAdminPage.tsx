import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  FaFloppyDisk,
  FaMoon,
  FaPen,
  FaPlus,
  FaRotateRight,
  FaSun,
  FaTrash,
  FaXmark,
} from "react-icons/fa6";
import { Navigate } from "react-router-dom";
import {
  createAdminPublication,
  deleteAdminPublication,
  fetchAdminPublications,
  updateAdminPublication,
  type AdminPublicationRecord,
} from "../../api/adminContentApi";
import LoadingPage from "../../components/loading/LoadingPage";
import Pagination from "../../components/pagination/Pagination";
import { useUser } from "../../hook/useUser";
import AdminSidebar from "./AdminSidebar";

type PublicationForm = Omit<AdminPublicationRecord, "_id" | "createdAt" | "updatedAt" | "images"> & {
  imagesText: string;
};

const emptyPublicationForm: PublicationForm = {
  publishTitle: "",
  publishDate: "",
  content: "",
  title: "",
  author: "",
  journal: "",
  year: "",
  doi: "",
  abstract: "",
  authorGmail: "",
  feedback: "",
  entryType: "",
  citationKey: "",
  booktitle: "",
  volume: "",
  number: "",
  pages: "",
  keywords: "",
  publisher: "",
  url: "",
  rawBibtex: "",
  imagesText: "",
};

const darkTheme = {
  shell: "bg-[#050505] text-amber-50",
  content: "bg-[#0a0a0a]",
  topbar: "border-amber-50/5 bg-[#0a0a0a]/80",
  heading: "text-amber-50/90",
  border: "border-amber-50/10",
  subtleText: "text-amber-50/55",
  panel: "border-amber-50/10 bg-black",
  tableHead: "bg-zinc-950 text-amber-50/45",
  row: "border-amber-50/10 hover:bg-amber-50/5",
  titleText: "text-amber-50",
  bodyText: "text-amber-50/70",
  mutedText: "text-amber-50/55",
  input:
    "border-white/15 bg-black text-amber-50 placeholder:text-amber-50/30 focus:border-[#ff6a1f] focus:ring-[#ff6a1f]/20",
  outlineButton:
    "border-amber-50/15 text-amber-50 hover:border-[#ff6a1f] hover:bg-[#ff6a1f]/10",
  iconButton:
    "border-amber-50/15 bg-transparent text-amber-50 hover:border-[#ff6a1f] hover:bg-amber-50/10",
  dangerButton:
    "border-red-500/50 bg-transparent text-red-100 hover:border-red-500/70 hover:bg-red-950/60",
  overlay: "bg-black/70",
  modal: "border-amber-50/10 bg-black shadow-black",
  modalHeader: "border-amber-50/10 bg-black",
  closeButton: "border-amber-50/15 hover:border-[#ff6a1f] hover:bg-amber-50/10",
  label: "text-amber-50/55",
};

const lightTheme = {
  shell: "bg-slate-100 text-slate-950",
  content: "bg-slate-50",
  topbar: "border-slate-200 bg-white/85",
  heading: "text-slate-900",
  border: "border-slate-200",
  subtleText: "text-slate-500",
  panel: "border-slate-200 bg-white",
  tableHead: "bg-slate-100 text-slate-500",
  row: "border-slate-200 hover:bg-orange-50/70",
  titleText: "text-slate-950",
  bodyText: "text-slate-700",
  mutedText: "text-slate-500",
  input:
    "border-slate-300 bg-white text-slate-950 placeholder:text-slate-400 focus:border-[#ff6a1f] focus:ring-[#ff6a1f]/20",
  outlineButton:
    "border-slate-300 text-slate-700 hover:border-[#ff6a1f] hover:bg-orange-50",
  iconButton:
    "border-slate-300 bg-white text-slate-700 hover:border-[#ff6a1f] hover:bg-orange-50",
  dangerButton:
    "border-red-300 bg-white text-red-700 hover:border-red-400 hover:bg-red-50",
  overlay: "bg-slate-950/35",
  modal: "border-slate-200 bg-white shadow-slate-300",
  modalHeader: "border-slate-200 bg-white",
  closeButton: "border-slate-300 hover:border-[#ff6a1f] hover:bg-orange-50",
  label: "text-slate-500",
};

const imagesToText = (publication: AdminPublicationRecord) =>
  publication.images.map((image) => `${image.url}|${image.publicId}`).join("\n");

const parseImages = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [url, publicId] = line.split("|").map((part) => part.trim());
      return { url, publicId: publicId || url };
    })
    .filter((image) => image.url);

const PublicationAdminPage = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const [publications, setPublications] = useState<AdminPublicationRecord[]>([]);
  const [form, setForm] = useState(emptyPublicationForm);
  const [editingId, setEditingId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const pageSize = 10;
  const theme = themeMode === "light" ? lightTheme : darkTheme;

  const selectedPublication = useMemo(
    () => publications.find((publication) => publication._id === editingId) ?? null,
    [editingId, publications],
  );

  const filteredPublications = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return publications;

    return publications.filter((publication) =>
      [
        publication.title,
        publication.publishTitle,
        publication.author,
        publication.authorGmail,
        publication.journal,
        publication.year,
        publication.publishDate,
        publication.doi,
        publication.abstract,
        publication.content,
        publication.keywords,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [publications, searchTerm]);

  const paginatedPublications = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPublications.slice(start, start + pageSize);
  }, [currentPage, filteredPublications]);

  const loadPublications = async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError("");
      setPublications(await fetchAdminPublications(signal));
      setCurrentPage(1);
    } catch (loadError) {
      if (signal?.aborted) return;
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load publications.",
      );
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadPublications(controller.signal);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (isUserLoading) return <LoadingPage label="Checking login status" />;
  if (!user) return <Navigate to="/auth/login" replace />;
  if (isLoading) return <LoadingPage label="Loading publications admin" />;

  const resetForm = () => {
    setEditingId("");
    setForm(emptyPublicationForm);
  };

  const closeForm = () => {
    resetForm();
    setIsFormOpen(false);
  };

  const startCreate = () => {
    resetForm();
    setStatus("");
    setError("");
    setIsFormOpen(true);
  };

  const startEdit = (publication: AdminPublicationRecord) => {
    setEditingId(publication._id);
    setForm({
      publishTitle: publication.publishTitle,
      publishDate: publication.publishDate,
      content: publication.content,
      title: publication.title,
      author: publication.author,
      journal: publication.journal,
      year: publication.year,
      doi: publication.doi,
      abstract: publication.abstract,
      authorGmail: publication.authorGmail,
      feedback: publication.feedback,
      entryType: publication.entryType ?? "",
      citationKey: publication.citationKey ?? "",
      booktitle: publication.booktitle ?? "",
      volume: publication.volume ?? "",
      number: publication.number ?? "",
      pages: publication.pages ?? "",
      keywords: publication.keywords ?? "",
      publisher: publication.publisher ?? "",
      url: publication.url ?? "",
      rawBibtex: publication.rawBibtex ?? "",
      imagesText: imagesToText(publication),
    });
    setStatus("");
    setError("");
    setIsFormOpen(true);
  };

  const toPayload = () => ({
    ...form,
    title: form.title || form.publishTitle,
    publishTitle: form.publishTitle || form.title,
    abstract: form.abstract || form.content,
    year: form.year || form.publishDate,
    images: parseImages(form.imagesText),
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setIsSaving(true);
      setStatus("");
      setError("");

      const payload = toPayload();
      const savedPublication = editingId
        ? await updateAdminPublication(editingId, payload)
        : await createAdminPublication(payload);

      setPublications((items) =>
        editingId
          ? items.map((item) =>
              item._id === savedPublication._id ? savedPublication : item,
            )
          : [savedPublication, ...items],
      );
      if (!editingId) setCurrentPage(1);
      setStatus(editingId ? "Publication updated." : "Publication created.");
      closeForm();
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Could not save publication.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (publication: AdminPublicationRecord) => {
    if (!window.confirm(`Delete publication "${publication.title}"?`)) return;

    try {
      setBusyId(publication._id);
      setStatus("");
      setError("");
      await deleteAdminPublication(publication._id);
      setPublications((items) => {
        const nextItems = items.filter((item) => item._id !== publication._id);
        const lastPage = Math.max(1, Math.ceil(nextItems.length / pageSize));
        setCurrentPage((page) => Math.min(page, lastPage));
        return nextItems;
      });
      if (editingId === publication._id) resetForm();
      setStatus("Publication deleted.");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete publication.",
      );
    } finally {
      setBusyId("");
    }
  };

  return (
    <main className={`flex h-screen w-full overflow-hidden font-sans ${theme.shell}`} data-theme={themeMode}>
      <AdminSidebar description="Manage published publication records." />

      <section className={`flex-1 overflow-y-auto ${theme.content}`}>
        <div className={`sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4 shadow-sm backdrop-blur-md md:px-10 ${theme.topbar}`}>
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-[#ff6a1f]" />
            <h2 className={`text-lg font-medium tracking-wide ${theme.heading}`}>
              Publication management
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setThemeMode((mode) => (mode === "dark" ? "light" : "dark"))}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition ${theme.outlineButton}`}
              aria-label={`Switch to ${themeMode === "dark" ? "light" : "dark"} theme`}
            >
              {themeMode === "dark" ? <FaSun /> : <FaMoon />}
              {themeMode === "dark" ? "Light" : "Dark"}
            </button>
            <button
              type="button"
              onClick={() => void loadPublications()}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition ${theme.outlineButton}`}
            >
              <FaRotateRight />
              Refresh
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-8xl p-6 md:p-10">
          <section>
            <div className={`mb-6 flex flex-col gap-4 border-b pb-6 lg:flex-row lg:items-end lg:justify-between ${theme.border}`}>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#ff6a1f]">
                  Published publications
                </p>
                <h1 className="mt-1 text-3xl font-bold">
                  {publications.length} records
                </h1>
                <p className={`mt-2 text-sm ${theme.subtleText}`}>
                  Showing {paginatedPublications.length} of {filteredPublications.length} matches on page {currentPage}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 sm:w-80 ${theme.input}`}
                  placeholder="Search publications"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
                <button
                  type="button"
                  onClick={startCreate}
                  className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-r from-[#ff6a1f] to-[#e85f1b] px-4 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-[#ff6a1f]/20"
                >
                  <FaPlus />
                  Add publication
                </button>
              </div>
            </div>

            {error ? <Alert tone="error">{error}</Alert> : null}
            {status ? <Alert tone="success">{status}</Alert> : null}

            <div className={`rounded-lg border ${theme.panel}`}>
              <table className="table table-fixed">
                <thead className={theme.tableHead}>
                  <tr className={theme.border}>
                    <th className="w-[27%]">Publication</th>
                    <th className="w-[15%]">Author</th>
                    <th className="w-[14%]">Journal</th>
                    <th className="w-[8%]">Year</th>
                    <th className="w-[13%]">DOI</th>
                    <th className="w-[13%]">Keywords</th>
                    <th className="w-[10%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPublications.map((publication) => (
                    <tr key={publication._id} className={theme.row}>
                      <td>
                        <div className="min-w-0">
                          <p className={`line-clamp-2 font-bold leading-6 ${theme.titleText}`}>
                            {publication.title || publication.publishTitle || "Untitled publication"}
                          </p>
                          <p className={`mt-1 line-clamp-2 text-xs leading-5 ${theme.mutedText}`}>
                            {publication.abstract || publication.content || "No abstract provided."}
                          </p>
                        </div>
                      </td>
                      <td className={`text-sm leading-6 ${theme.bodyText}`}>
                        <p className="line-clamp-3">{publication.author || "No author"}</p>
                      </td>
                      <td className={`text-sm leading-6 ${theme.bodyText}`}>
                        <p className="line-clamp-3">{publication.journal || publication.booktitle || "No journal"}</p>
                      </td>
                      <td className={`text-sm ${theme.mutedText}`}>
                        {publication.year || publication.publishDate || "-"}
                      </td>
                      <td className={`text-sm ${theme.mutedText}`}>
                        <p className="line-clamp-2 break-all">{publication.doi || "No DOI"}</p>
                      </td>
                      <td className={`text-sm leading-6 ${theme.mutedText}`}>
                        <p className="line-clamp-3">{publication.keywords || "No keywords"}</p>
                      </td>
                      <td>
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            className={`btn btn-square btn-sm ${theme.iconButton}`}
                            onClick={() => startEdit(publication)}
                            aria-label={`Edit ${publication.title || publication.publishTitle || "publication"}`}
                            title="Edit"
                          >
                            <FaPen />
                          </button>
                          <button
                            type="button"
                            className={`btn btn-square btn-sm disabled:opacity-60 ${theme.dangerButton}`}
                            disabled={busyId === publication._id}
                            onClick={() => void handleDelete(publication)}
                            aria-label={`Delete ${publication.title || publication.publishTitle || "publication"}`}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPublications.length > pageSize ? (
              <Pagination
                className="mt-8"
                currentPage={currentPage}
                totalCount={filteredPublications.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            ) : null}
          </section>
        </div>
      </section>

      {isFormOpen ? (
        <div className={`fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-8 backdrop-blur-sm ${theme.overlay}`}>
          <form
            onSubmit={(event) => void handleSubmit(event)}
            className={`w-full max-w-5xl rounded-lg border p-7 shadow-2xl ${theme.modal}`}
          >
            <div className={`sticky top-0 z-10 -mx-7 -mt-7 mb-6 flex items-center justify-between gap-3 border-b px-7 py-5 ${theme.modalHeader}`}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#ff6a1f]">
                  {selectedPublication ? "Edit publication" : "Create publication"}
                </p>
                <h2 className={`mt-1 text-xl font-bold ${theme.titleText}`}>
                  {selectedPublication?.title || selectedPublication?.publishTitle || "New record"}
                </h2>
              </div>
              <button
                type="button"
                className={`cursor-pointer rounded-lg border p-2 transition ${theme.closeButton}`}
                onClick={closeForm}
                aria-label="Close publication form"
              >
                <FaXmark />
              </button>
            </div>

            <div className="grid gap-x-6 gap-y-5 lg:grid-cols-2">
              <Field label="Title" required theme={theme} value={form.title} onChange={(value) => setForm({ ...form, title: value, publishTitle: form.publishTitle || value })} />
              <Field label="Author" required theme={theme} value={form.author} onChange={(value) => setForm({ ...form, author: value })} />
              <Field label="Author email" required theme={theme} value={form.authorGmail} onChange={(value) => setForm({ ...form, authorGmail: value })} />
              <Field label="Publish title" theme={theme} value={form.publishTitle} onChange={(value) => setForm({ ...form, publishTitle: value })} />
              <Field label="Publish date" theme={theme} value={form.publishDate} onChange={(value) => setForm({ ...form, publishDate: value, year: form.year || value })} />
              <Field label="Year" theme={theme} value={form.year} onChange={(value) => setForm({ ...form, year: value })} />
              <Field label="Journal" theme={theme} value={form.journal} onChange={(value) => setForm({ ...form, journal: value })} />
              <Field label="DOI" theme={theme} value={form.doi} onChange={(value) => setForm({ ...form, doi: value })} />
              <Field label="Book title" theme={theme} value={form.booktitle ?? ""} onChange={(value) => setForm({ ...form, booktitle: value })} />
              <Field label="Volume" theme={theme} value={form.volume ?? ""} onChange={(value) => setForm({ ...form, volume: value })} />
              <Field label="Number" theme={theme} value={form.number ?? ""} onChange={(value) => setForm({ ...form, number: value })} />
              <Field label="Pages" theme={theme} value={form.pages ?? ""} onChange={(value) => setForm({ ...form, pages: value })} />
              <Field label="Keywords" theme={theme} value={form.keywords ?? ""} onChange={(value) => setForm({ ...form, keywords: value })} />
              <Field label="Publisher" theme={theme} value={form.publisher ?? ""} onChange={(value) => setForm({ ...form, publisher: value })} />
              <Field label="URL" theme={theme} value={form.url ?? ""} onChange={(value) => setForm({ ...form, url: value })} />
              <Field label="Entry type" theme={theme} value={form.entryType ?? ""} onChange={(value) => setForm({ ...form, entryType: value })} />
              <Field label="Citation key" theme={theme} value={form.citationKey ?? ""} onChange={(value) => setForm({ ...form, citationKey: value })} />
              <Field label="Abstract" textarea theme={theme} value={form.abstract} onChange={(value) => setForm({ ...form, abstract: value, content: form.content || value })} />
              <Field label="Content" textarea theme={theme} value={form.content} onChange={(value) => setForm({ ...form, content: value })} />
              <Field label="Raw BibTeX" textarea theme={theme} value={form.rawBibtex ?? ""} onChange={(value) => setForm({ ...form, rawBibtex: value })} />
              <Field label="Images, one per line as URL|publicId" textarea theme={theme} value={form.imagesText} onChange={(value) => setForm({ ...form, imagesText: value })} />
              <Field label="Feedback" textarea theme={theme} value={form.feedback} onChange={(value) => setForm({ ...form, feedback: value })} />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-r from-[#ff6a1f] to-[#e85f1b] px-4 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-[#ff6a1f]/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {editingId ? <FaFloppyDisk /> : <FaPlus />}
              {isSaving ? "Saving..." : editingId ? "Save publication" : "Create publication"}
            </button>
          </form>
        </div>
      ) : null}
    </main>
  );
};

const Field = ({
  className = "",
  label,
  onChange,
  required = false,
  theme,
  textarea = false,
  value,
}: {
  className?: string;
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  theme: typeof darkTheme;
  textarea?: boolean;
  value: string;
}) => (
  <label className={`grid gap-2 ${className}`}>
    <span className={`text-xs font-semibold uppercase tracking-wider ${theme.label}`}>{label}</span>
    {textarea ? (
      <textarea
        className={`w-full rounded-lg border px-3 py-1.5 text-sm outline-none transition focus:ring-2 ${theme.input} min-h-20 resize-y`}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    ) : (
      <input
        className={`w-full rounded-lg border px-3 py-1.5 text-sm outline-none transition focus:ring-2 ${theme.input}`}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    )}
  </label>
);

const Alert = ({
  children,
  tone,
}: {
  children: string;
  tone: "error" | "success";
}) => (
  <div
    className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
      tone === "error"
        ? "border-red-500/40 bg-red-950/50 text-red-100"
        : "border-emerald-500/40 bg-emerald-950/50 text-emerald-100"
    }`}
  >
    {children}
  </div>
);

export default PublicationAdminPage;
