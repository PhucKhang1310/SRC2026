import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  FaArrowLeft,
  FaCheck,
  FaEnvelope,
  FaLink,
  FaRotateRight,
  FaUserTie,
  FaXmark,
} from "react-icons/fa6";
import { Navigate, useNavigate } from "react-router-dom";
import {
  approvePendingMentor,
  approvePendingPublication,
  declinePendingMentor,
  declinePendingPublication,
  fetchPendingMentors,
  fetchPendingPublications,
  type PendingMentor,
  type PendingPublication,
} from "../../api/adminSubmissionsApi";
import LoadingPage from "../../components/loading/LoadingPage";
import { useUser } from "../../hook/useUser";

type QueueType = "publications" | "mentors";

const formatDate = (value?: string) => {
  if (!value) return "No date";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("vi-VN");
};

const stripHtml = (value: string) =>
  value
    .replace(/<img[^>]*>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();


const SubmissionReviewAdminPage = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const navigate = useNavigate();
  const [activeQueue, setActiveQueue] = useState<QueueType>("publications");
  const [publications, setPublications] = useState<PendingPublication[]>([]);
  const [mentors, setMentors] = useState<PendingMentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [busyId, setBusyId] = useState("");

  const totalPending = publications.length + mentors.length;
  const activeItems = activeQueue === "publications" ? publications : mentors;

  const queueCounts = useMemo(
    () => ({
      publications: publications.length,
      mentors: mentors.length,
    }),
    [mentors.length, publications.length],
  );

  const loadSubmissions = async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError("");
      const [pendingPublications, pendingMentors] = await Promise.all([
        fetchPendingPublications(signal),
        fetchPendingMentors(signal),
      ]);

      setPublications(pendingPublications);
      setMentors(pendingMentors);
    } catch (loadError) {
      if (signal?.aborted) return;
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load pending submissions.",
      );
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadSubmissions(controller.signal);

    return () => controller.abort();
  }, []);

  if (isUserLoading) {
    return <LoadingPage label="Checking login status" />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (isLoading) {
    return <LoadingPage label="Loading submission queue" />;
  }

  const handlePublicationAction = async (
    id: string,
    action: "approve" | "decline",
  ) => {
    try {
      setBusyId(id);
      setStatus("");
      setError("");

      if (action === "approve") {
        await approvePendingPublication(id);
        setStatus("Publication approved and published.");
      } else {
        await declinePendingPublication(id);
        setStatus("Publication declined.");
      }

      setPublications((items) => items.filter((item) => item._id !== id));
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "Could not update publication.",
      );
    } finally {
      setBusyId("");
    }
  };

  const handleMentorAction = async (id: string, action: "approve" | "decline") => {
    try {
      setBusyId(id);
      setStatus("");
      setError("");

      if (action === "approve") {
        await approvePendingMentor(id);
        setStatus("Mentor approved and published.");
      } else {
        await declinePendingMentor(id);
        setStatus("Mentor declined.");
      }

      setMentors((items) => items.filter((item) => item._id !== id));
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "Could not update mentor.",
      );
    } finally {
      setBusyId("");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-800 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <button
              type="button"
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
              onClick={() => navigate("/admin")}
            >
              <FaArrowLeft />
              Back to admin
            </button>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
              Admin review
            </p>
            <h1 className="mt-1 text-3xl font-bold text-white">
              Pending submissions
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Approve mentor profiles and publication records before they appear
              on the public site.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-300">
              {totalPending} pending
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900 cursor-pointer"
              onClick={() => void loadSubmissions()}
            >
              <FaRotateRight />
              Refresh
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <QueueTab
            active={activeQueue === "publications"}
            count={queueCounts.publications}
            label="Publications"
            onClick={() => setActiveQueue("publications")}
          />
          <QueueTab
            active={activeQueue === "mentors"}
            count={queueCounts.mentors}
            label="Mentors"
            onClick={() => setActiveQueue("mentors")}
          />
        </div>

        {error ? <Alert tone="error">{error}</Alert> : null}
        {status ? <Alert tone="success">{status}</Alert> : null}

        {activeItems.length === 0 ? (
          <EmptyState label={`No pending ${activeQueue}.`} />
        ) : activeQueue === "publications" ? (
          <div className="grid gap-4">
            {publications.map((publication) => (
              <PublicationReviewCard
                key={publication._id}
                isBusy={busyId === publication._id}
                publication={publication}
                onApprove={() =>
                  void handlePublicationAction(publication._id, "approve")
                }
                onDecline={() =>
                  void handlePublicationAction(publication._id, "decline")
                }
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {mentors.map((mentor) => (
              <MentorReviewCard
                key={mentor._id}
                isBusy={busyId === mentor._id}
                mentor={mentor}
                onApprove={() => void handleMentorAction(mentor._id, "approve")}
                onDecline={() => void handleMentorAction(mentor._id, "decline")}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

const QueueTab = ({
  active,
  count,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${active
      ? "bg-orange-600 text-white"
      : "border border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-900"
      }`}
    onClick={onClick}
  >
    {label}
    <span
      className={`rounded px-2 py-0.5 text-xs ${active ? "bg-white/15 text-white" : "bg-slate-800 text-slate-300"
        }`}
    >
      {count}
    </span>
  </button>
);

const PublicationReviewCard = ({
  isBusy,
  onApprove,
  onDecline,
  publication,
}: {
  isBusy: boolean;
  onApprove: () => void;
  onDecline: () => void;
  publication: PendingPublication;
}) => (
  <article className="rounded-lg border border-slate-800 bg-slate-900 p-5">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
          Publication
        </p>
        <h2 className="mt-2 text-xl font-bold text-white">
          {publication.publishTitle}
        </h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-400">
          <span>{publication.author}</span>
          <span>{formatDate(publication.publishDate)}</span>
          {publication.journal ? <span>{publication.journal}</span> : null}
          {publication.doi ? <span>DOI: {publication.doi}</span> : null}
        </div>
      </div>
      <ActionButtons
        isBusy={isBusy}
        onApprove={onApprove}
        onDecline={onDecline}
      />
    </div>

    <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-300">
      {stripHtml(publication.content) || "No content provided."}
    </p>

    <div className="mt-5 grid gap-3 border-t border-slate-800 pt-4 text-sm text-slate-400 md:grid-cols-2">
      <InfoLine icon={<FaEnvelope />} label="Submitter" value={publication.authorGmail} />
      <InfoLine label="Submitted" value={formatDate(publication.createdAt)} />
    </div>

    {publication.images?.length ? (
      <div className="mt-4 flex flex-wrap gap-3">
        {publication.images.map((image) => (
          <img
            key={image.publicId || image.url}
            alt={publication.publishTitle}
            className="h-20 w-28 rounded object-cover"
            src={image.url}
          />
        ))}
      </div>
    ) : null}
  </article>
);

const MentorReviewCard = ({
  isBusy,
  mentor,
  onApprove,
  onDecline,
}: {
  isBusy: boolean;
  mentor: PendingMentor;
  onApprove: () => void;
  onDecline: () => void;
}) => (
  <article className="rounded-lg border border-slate-800 bg-slate-900 p-5">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex min-w-0 gap-4">
        {mentor.avatarImage ? (
          <img
            src={mentor.avatarImage}
            alt={mentor.fullName}
            className="h-20 w-20 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-lg bg-slate-800 text-slate-400">
            <FaUserTie />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
            Mentor
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">{mentor.fullName}</h2>
          <p className="mt-2 text-sm text-slate-400">
            {[mentor.title, mentor.department].filter(Boolean).join(" | ")}
          </p>
        </div>
      </div>
      <ActionButtons
        isBusy={isBusy}
        onApprove={onApprove}
        onDecline={onDecline}
      />
    </div>

    <div className="mt-5 grid gap-3 border-t border-slate-800 pt-4 text-sm text-slate-400 md:grid-cols-2">
      <InfoLine icon={<FaEnvelope />} label="Email" value={mentor.email} />
      <InfoLine label="Phone" value={mentor.phone || "-"} />
      <InfoLine label="Research areas" value={mentor.researchAreas || "-"} />
      <InfoLine label="Research topics" value={mentor.researchTopics || "-"} />
      <InfoLine label="Submitted" value={formatDate(mentor.createdAt)} />
      {mentor.personalWebsite ? (
        <InfoLine icon={<FaLink />} label="Website" value={mentor.personalWebsite} />
      ) : null}
    </div>

    {mentor.note ? (
      <p className="mt-4 text-sm leading-6 text-slate-300">{mentor.note}</p>
    ) : null}
  </article>
);

const ActionButtons = ({
  isBusy,
  onApprove,
  onDecline,
}: {
  isBusy: boolean;
  onApprove: () => void;
  onDecline: () => void;
}) => (
  <div className="flex shrink-0 flex-wrap gap-2">
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isBusy}
      onClick={onApprove}
    >
      <FaCheck />
      {isBusy ? "Working..." : "Approve"}
    </button>
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 rounded-md border border-red-500/50 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-950/60 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isBusy}
      onClick={onDecline}
    >
      <FaXmark />
      Decline
    </button>
  </div>
);

const InfoLine = ({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
}) => (
  <div className="min-w-0">
    <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
      {icon}
      {label}
    </p>
    <p className="wrap-break-word text-slate-300">{value || "-"}</p>
  </div>
);

const Alert = ({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "error" | "success";
}) => (
  <div
    className={`mb-6 rounded-md border px-4 py-3 text-sm ${tone === "error"
      ? "border-red-500/40 bg-red-950/50 text-red-100"
      : "border-emerald-500/40 bg-emerald-950/50 text-emerald-100"
      }`}
  >
    {children}
  </div>
);

const EmptyState = ({ label }: { label: string }) => (
  <div className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-12 text-center text-sm text-slate-400">
    {label}
  </div>
);

export default SubmissionReviewAdminPage;
