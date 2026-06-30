import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  FaFloppyDisk,
  FaPen,
  FaPlus,
  FaRotateRight,
  FaTrash,
  FaUserTie,
  FaXmark,
} from "react-icons/fa6";
import { Navigate } from "react-router-dom";
import {
  createAdminMentor,
  deleteAdminMentor,
  fetchAdminMentors,
  updateAdminMentor,
  type AdminMentorRecord,
} from "../../api/adminContentApi";
import LoadingPage from "../../components/loading/LoadingPage";
import Pagination from "../../components/pagination/Pagination";
import { useUser } from "../../hook/useUser";
import AdminSidebar from "./AdminSidebar";

const emptyMentorForm: Omit<AdminMentorRecord, "_id" | "createdAt" | "updatedAt"> = {
  title: "",
  fullName: "",
  department: "",
  phone: "",
  email: "",
  personalWebsite: "",
  orcid: "",
  researchGate: "",
  googleScholar: "",
  researchAreas: "",
  researchTopics: "",
  note: "",
  avatarImage: "",
  feedback: "",
};

const inputClass =
  "w-full rounded-lg border border-white/15 bg-black px-3 py-1.5 text-sm text-amber-50 outline-none transition placeholder:text-amber-50/30 focus:border-[#ff6a1f] focus:ring-2 focus:ring-[#ff6a1f]/20";
const labelClass = "text-xs font-semibold uppercase tracking-wider text-amber-50/55";

const MentorAdminPage = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const [mentors, setMentors] = useState<AdminMentorRecord[]>([]);
  const [form, setForm] = useState(emptyMentorForm);
  const [editingId, setEditingId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;

  const selectedMentor = useMemo(
    () => mentors.find((mentor) => mentor._id === editingId) ?? null,
    [editingId, mentors],
  );

  const filteredMentors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return mentors;

    return mentors.filter((mentor) =>
      [
        mentor.fullName,
        mentor.title,
        mentor.department,
        mentor.email,
        mentor.researchAreas,
        mentor.researchTopics,
        mentor.note,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [mentors, searchTerm]);

  const paginatedMentors = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMentors.slice(start, start + pageSize);
  }, [currentPage, filteredMentors]);

  const loadMentors = async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError("");
      setMentors(await fetchAdminMentors(signal));
      setCurrentPage(1);
    } catch (loadError) {
      if (signal?.aborted) return;
      setError(loadError instanceof Error ? loadError.message : "Could not load mentors.");
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadMentors(controller.signal);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (isUserLoading) return <LoadingPage label="Checking login status" />;
  if (!user) return <Navigate to="/auth/login" replace />;
  if (isLoading) return <LoadingPage label="Loading mentors admin" />;

  const resetForm = () => {
    setEditingId("");
    setForm(emptyMentorForm);
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

  const startEdit = (mentor: AdminMentorRecord) => {
    setEditingId(mentor._id);
    setForm({
      title: mentor.title,
      fullName: mentor.fullName,
      department: mentor.department,
      phone: mentor.phone,
      email: mentor.email,
      personalWebsite: mentor.personalWebsite,
      orcid: mentor.orcid,
      researchGate: mentor.researchGate,
      googleScholar: mentor.googleScholar,
      researchAreas: mentor.researchAreas,
      researchTopics: mentor.researchTopics,
      note: mentor.note,
      avatarImage: mentor.avatarImage,
      feedback: mentor.feedback,
    });
    setStatus("");
    setError("");
    setIsFormOpen(true);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setIsSaving(true);
      setStatus("");
      setError("");

      const savedMentor = editingId
        ? await updateAdminMentor(editingId, form)
        : await createAdminMentor(form);

      setMentors((items) =>
        editingId
          ? items.map((item) => (item._id === savedMentor._id ? savedMentor : item))
          : [savedMentor, ...items],
      );
      if (!editingId) setCurrentPage(1);
      setStatus(editingId ? "Mentor updated." : "Mentor created.");
      closeForm();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save mentor.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (mentor: AdminMentorRecord) => {
    if (!window.confirm(`Delete mentor "${mentor.fullName}"?`)) return;

    try {
      setBusyId(mentor._id);
      setStatus("");
      setError("");
      await deleteAdminMentor(mentor._id);
      setMentors((items) => {
        const nextItems = items.filter((item) => item._id !== mentor._id);
        const lastPage = Math.max(1, Math.ceil(nextItems.length / pageSize));
        setCurrentPage((page) => Math.min(page, lastPage));
        return nextItems;
      });
      if (editingId === mentor._id) resetForm();
      setStatus("Mentor deleted.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete mentor.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#050505] font-sans text-amber-50">
      <AdminSidebar description="Manage published mentor profiles." />

      <section className="flex-1 overflow-y-auto bg-[#0a0a0a]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-amber-50/5 bg-[#0a0a0a]/80 px-6 py-4 shadow-sm backdrop-blur-md md:px-10">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-[#ff6a1f]" />
            <h2 className="text-lg font-medium tracking-wide text-amber-50/90">
              Mentor management
            </h2>
          </div>
          <button
            type="button"
            onClick={() => void loadMentors()}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-amber-50/15 px-4 py-2 text-sm font-semibold text-amber-50 transition hover:border-[#ff6a1f] hover:bg-[#ff6a1f]/10"
          >
            <FaRotateRight />
            Refresh
          </button>
        </div>

        <div className="mx-auto max-w-8xl p-6 md:p-10">
          <section>
            <div className="mb-6 flex flex-col gap-4 border-b border-amber-50/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#ff6a1f]">
                  Published mentors
                </p>
                <h1 className="mt-1 text-3xl font-bold">{mentors.length} profiles</h1>
                <p className="mt-2 text-sm text-amber-50/55">
                  Showing {paginatedMentors.length} of {filteredMentors.length} matches on page {currentPage}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-amber-50 outline-none transition placeholder:text-amber-50/30 focus:border-[#ff6a1f] focus:ring-2 focus:ring-[#ff6a1f]/20 sm:w-80"
                  placeholder="Search mentors"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
                <button
                  type="button"
                  onClick={startCreate}
                  className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#ff6a1f] to-[#e85f1b] px-4 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-[#ff6a1f]/20"
                >
                  <FaPlus />
                  Add mentor
                </button>
              </div>
            </div>

            {error ? <Alert tone="error">{error}</Alert> : null}
            {status ? <Alert tone="success">{status}</Alert> : null}

            <div className="rounded-lg border border-amber-50/10 bg-black">
              <table className="table table-fixed">
                <thead className="bg-zinc-950 text-amber-50/45">
                  <tr className="border-amber-50/10">
                    <th className="w-[22%]">Mentor</th>
                    <th className="w-[13%]">Department</th>
                    <th className="w-[20%]">Research areas</th>
                    <th className="w-[22%]">Research topics</th>
                    <th className="w-[13%]">Email</th>
                    <th className="w-[10%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMentors.map((mentor) => (
                    <tr key={mentor._id} className="border-amber-50/10 hover:bg-amber-50/5">
                      <td>
                        <div className="flex min-w-0 items-center gap-3">
                          {mentor.avatarImage ? (
                            <img
                              src={mentor.avatarImage}
                              alt={mentor.fullName}
                              className="h-12 w-12 shrink-0 rounded-lg border border-amber-50/10 object-cover"
                            />
                          ) : (
                            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-zinc-900 text-amber-50/45">
                              <FaUserTie />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate font-bold text-amber-50">
                              {mentor.fullName || "Unnamed mentor"}
                            </p>
                            <p className="mt-1 truncate text-xs text-amber-50/50">
                              {mentor.title || "No title"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="text-sm leading-6 text-amber-50/70 wrap-anywhere">
                        {mentor.department || "No department"}
                      </td>
                      <td className="text-sm leading-6 text-amber-50/65">
                        <p className="line-clamp-3">{mentor.researchAreas || "No areas"}</p>
                      </td>
                      <td className="text-sm leading-6 text-amber-50/65">
                        <p className="line-clamp-3">{mentor.researchTopics || "No topics"}</p>
                      </td>
                      <td className="truncate text-sm text-amber-50/55">
                        {mentor.email || "No email"}
                      </td>
                      <td>
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            className="btn btn-square btn-sm border-amber-50/15 bg-transparent text-amber-50 hover:border-[#ff6a1f] hover:bg-amber-50/10"
                            onClick={() => startEdit(mentor)}
                            aria-label={`Edit ${mentor.fullName || "mentor"}`}
                            title="Edit"
                          >
                            <FaPen />
                          </button>
                          <button
                            type="button"
                            className="btn btn-square btn-sm border-red-500/50 bg-transparent text-red-100 hover:border-red-500/70 hover:bg-red-950/60 disabled:opacity-60"
                            disabled={busyId === mentor._id}
                            onClick={() => void handleDelete(mentor)}
                            aria-label={`Delete ${mentor.fullName || "mentor"}`}
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

            {filteredMentors.length > pageSize ? (
              <Pagination
                className="mt-8"
                currentPage={currentPage}
                totalCount={filteredMentors.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            ) : null}
          </section>
        </div>
      </section>

      {isFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-sm">
          <form
            onSubmit={(event) => void handleSubmit(event)}
            className="w-full max-w-5xl rounded-lg border border-amber-50/10 bg-black p-7 shadow-2xl shadow-black"
          >
            <div className="sticky top-0 z-10 -mx-7 -mt-7 mb-6 flex items-center justify-between gap-3 border-b border-amber-50/10 bg-black px-7 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#ff6a1f]">
                  {selectedMentor ? "Edit mentor" : "Create mentor"}
                </p>
                <h2 className="mt-1 text-xl font-bold">
                  {selectedMentor?.fullName || "New profile"}
                </h2>
              </div>
                <button
                  type="button"
                  className="cursor-pointer rounded-lg border border-amber-50/15 p-2 transition hover:border-[#ff6a1f] hover:bg-amber-50/10"
                  onClick={closeForm}
                  aria-label="Close mentor form"
                >
                  <FaXmark />
                </button>
            </div>

            <div className="grid gap-x-6 gap-y-5 lg:grid-cols-2">
              <Field label="Title" required value={form.title} onChange={(value) => setForm({ ...form, title: value })} />
              <Field label="Full name" required value={form.fullName} onChange={(value) => setForm({ ...form, fullName: value })} />
              <Field label="Email" required value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
              <Field label="Department" value={form.department} onChange={(value) => setForm({ ...form, department: value })} />
              <Field label="Phone" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} />
              <Field label="Avatar image URL" value={form.avatarImage} onChange={(value) => setForm({ ...form, avatarImage: value })} />
              <Field label="Personal website" value={form.personalWebsite} onChange={(value) => setForm({ ...form, personalWebsite: value })} />
              <Field label="ORCID" value={form.orcid} onChange={(value) => setForm({ ...form, orcid: value })} />
              <Field label="ResearchGate" value={form.researchGate} onChange={(value) => setForm({ ...form, researchGate: value })} />
              <Field label="Google Scholar" value={form.googleScholar} onChange={(value) => setForm({ ...form, googleScholar: value })} />
              <Field label="Research areas" textarea value={form.researchAreas} onChange={(value) => setForm({ ...form, researchAreas: value })} />
              <Field label="Research topics" textarea value={form.researchTopics} onChange={(value) => setForm({ ...form, researchTopics: value })} />
              <Field className="lg:col-span-2" label="Note" textarea value={form.note} onChange={(value) => setForm({ ...form, note: value })} />
              <Field className="lg:col-span-2" label="Feedback" textarea value={form.feedback} onChange={(value) => setForm({ ...form, feedback: value })} />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#ff6a1f] to-[#e85f1b] px-4 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-[#ff6a1f]/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {editingId ? <FaFloppyDisk /> : <FaPlus />}
              {isSaving ? "Saving..." : editingId ? "Save mentor" : "Create mentor"}
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
  textarea = false,
  value,
}: {
  className?: string;
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  textarea?: boolean;
  value: string;
}) => (
  <label className={`grid gap-2 ${className}`}>
    <span className={labelClass}>{label}</span>
    {textarea ? (
      <textarea
        className={`${inputClass} min-h-20 resize-y`}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    ) : (
      <input
        className={inputClass}
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

export default MentorAdminPage;
