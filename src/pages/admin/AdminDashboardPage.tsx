import { useEffect, useState, type ReactNode } from "react";
import {
  FaArrowRight,
  FaCircleExclamation,
  FaFileLines,
  FaInbox,
  FaLayerGroup,
  FaNewspaper,
  FaRotateRight,
  FaUserTie,
} from "react-icons/fa6";
import { Navigate, useNavigate } from "react-router-dom";
import {
  fetchPendingMentors,
  fetchPendingPublications,
} from "../../api/adminSubmissionsApi";
import { fetchNews } from "../../api/newsApi";
import { getPageContent } from "../../api/pageContentApi";
import LoadingPage from "../../components/loading/LoadingPage";
import { useUser } from "../../hook/useUser";
import AdminSidebar from "./AdminSidebar";

const AdminDashboardPage = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  const [pendingPublications, setPendingPublications] = useState(0);
  const [pendingMentors, setPendingMentors] = useState(0);
  const [activeSections, setActiveSections] = useState(0);
  const [inactiveSections, setInactiveSections] = useState(0);
  const [newsArticles, setNewsArticles] = useState(0);
  const [isTelemetryLoading, setIsTelemetryLoading] = useState(true);
  const [telemetryError, setTelemetryError] = useState("");

  const totalPending = pendingPublications + pendingMentors;
  const totalSections = activeSections + inactiveSections;

  const loadTelemetry = async (signal?: AbortSignal) => {
    try {
      setIsTelemetryLoading(true);
      setTelemetryError("");

      const [publications, mentors, content, news] = await Promise.all([
        fetchPendingPublications(signal),
        fetchPendingMentors(signal),
        getPageContent(signal, { forceRefresh: true }),
        fetchNews(signal, { forceRefresh: true }),
      ]);

      setPendingPublications(publications.length);
      setPendingMentors(mentors.length);
      setActiveSections(content.layout.filter((section) => section.enabled).length);
      setInactiveSections(content.layout.filter((section) => !section.enabled).length);
      setNewsArticles(news.length);
    } catch (error) {
      if (signal?.aborted) return;
      setTelemetryError(
        error instanceof Error
          ? error.message
          : "Could not load dashboard telemetry.",
      );
    } finally {
      if (!signal?.aborted) {
        setIsTelemetryLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!user) return;

    const controller = new AbortController();
    void loadTelemetry(controller.signal);

    return () => controller.abort();
  }, [user]);

  if (isLoading) {
    return <LoadingPage label="Checking login status" />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <main className="flex min-h-screen w-full bg-[#050505] font-sans text-amber-50">
      <AdminSidebar description="Choose an admin workspace." />

      <section className="flex-1 bg-[#0a0a0a]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-amber-50/5 bg-[#0a0a0a]/80 px-6 py-4 shadow-sm backdrop-blur-md md:px-10">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-[#ff6a1f]" />
            <h2 className="text-lg font-medium tracking-wide text-amber-50/90">
              Admin dashboard
            </h2>
          </div>
          <a
            href="/"
            className="rounded-lg border border-amber-50/15 px-4 py-2 text-sm font-semibold text-amber-50 transition hover:border-[#ff6a1f] hover:bg-[#ff6a1f]/10"
          >
            Public site
          </a>
        </div>

        <div className="mx-auto max-w-5xl p-6 md:p-10">
          <div className="mb-8 border-b border-amber-50/10 pb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#ff6a1f]">
              Admin hub
            </p>
            <h1 className="mt-1 text-3xl font-bold text-amber-50">
              SRC2026 operations
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-amber-50/55">
              Open the workspace you need for page layout management or submission
              review.
            </p>
          </div>

          {telemetryError ? (
            <div className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-red-500/40 bg-red-950/50 px-4 py-3 text-sm text-red-100">
              <span className="inline-flex items-center gap-2">
                <FaCircleExclamation />
                {telemetryError}
              </span>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-red-200/20 px-3 py-2 text-xs font-semibold transition hover:bg-red-900/50"
                onClick={() => void loadTelemetry()}
              >
                <FaRotateRight />
                Retry
              </button>
            </div>
          ) : null}

          <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <TelemetryCard
              icon={<FaInbox />}
              isLoading={isTelemetryLoading}
              label="Total pending"
              value={totalPending}
            />
            <TelemetryCard
              icon={<FaFileLines />}
              isLoading={isTelemetryLoading}
              label="Pending publications"
              value={pendingPublications}
            />
            <TelemetryCard
              icon={<FaUserTie />}
              isLoading={isTelemetryLoading}
              label="Pending mentors"
              value={pendingMentors}
            />
            <TelemetryCard
              detail={`${totalSections} configured`}
              icon={<FaLayerGroup />}
              isLoading={isTelemetryLoading}
              label="Active sections"
              value={activeSections}
            />
            <TelemetryCard
              detail={`${inactiveSections} hidden`}
              icon={<FaNewspaper />}
              isLoading={isTelemetryLoading}
              label="News articles"
              value={newsArticles}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <DashboardCard
              description="Update public page sections, content ordering, news previews, and version history."
              icon={<FaLayerGroup />}
              label="Layout editor"
              meta="Public site content"
              onClick={() => navigate("/admin/layout")}
            />
            <DashboardCard
              description="Review pending publication records and mentor profiles before publishing them."
              icon={<FaInbox />}
              label="Submissions"
              meta="Approval queue"
              onClick={() => navigate("/admin/submissions")}
            />
            <DashboardCard
              description="Create, edit, and remove published mentor profiles shown on the public mentors page."
              icon={<FaUserTie />}
              label="Manage mentors"
              meta="Published profiles"
              onClick={() => navigate("/admin/mentors")}
            />
            <DashboardCard
              description="Create, edit, and remove published publication records shown on the public publications page."
              icon={<FaFileLines />}
              label="Manage publications"
              meta="Published records"
              onClick={() => navigate("/admin/publications")}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

const DashboardCard = ({
  description,
  icon,
  label,
  meta,
  onClick,
}: {
  description: string;
  icon: ReactNode;
  label: string;
  meta: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    className="group flex min-h-56 cursor-pointer flex-col justify-between rounded-lg border border-amber-50/10 bg-black p-6 text-left shadow-xl shadow-black/20 transition-all hover:border-[#ff6a1f]/50 hover:bg-zinc-950"
    onClick={onClick}
  >
    <div>
      <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-amber-50/10 bg-zinc-900 text-xl text-[#ff6a1f]">
        {icon}
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-50/35">
        {meta}
      </p>
      <h2 className="mt-2 flex items-center gap-3 text-2xl font-bold text-amber-50">
        {label}
        <FaArrowRight className="text-base text-amber-50/35 transition group-hover:translate-x-1 group-hover:text-[#ff6a1f]" />
      </h2>
      <p className="mt-3 text-sm leading-6 text-amber-50/55">{description}</p>
    </div>

    <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#ffb088]">
      <FaFileLines />
      Open workspace
    </div>
  </button>
);

const TelemetryCard = ({
  detail,
  icon,
  isLoading,
  label,
  value,
}: {
  detail?: string;
  icon: ReactNode;
  isLoading: boolean;
  label: string;
  value: number | string;
}) => (
  <div className="rounded-lg border border-amber-50/10 bg-black p-5 shadow-xl shadow-black/20">
    <div className="mb-4 flex items-center justify-between gap-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-50/35">
        {label}
      </p>
      <span className="text-[#ff6a1f]">{icon}</span>
    </div>
    {isLoading ? (
      <div className="h-9 w-20 animate-pulse rounded bg-amber-50/10" />
    ) : (
      <p className="text-3xl font-bold text-amber-50">{value}</p>
    )}
    {detail ? <p className="mt-2 text-xs text-amber-50/45">{detail}</p> : null}
  </div>
);

export default AdminDashboardPage;
