import { FaArrowRight, FaChalkboardUser, FaFileLines } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import NavBar from "../../components/navbar/NavBar";

const SubmissionPage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-black text-amber-50">
      <NavBar />
      <section className="mx-auto max-w-6xl px-6 pt-36 pb-16">
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-amber-50/55">
            SRC 2026
          </p>
          <h1 className="mt-3 text-3xl font-black uppercase tracking-wider text-[#ff6a1f] md:text-5xl">
            Submissions
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-amber-50/65 md:text-base">
            Choose the submission type that matches your role. Each form sends
            the required fields directly to the backend review collection.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <SubmissionChoice
            icon={<FaFileLines />}
            title="Publication submission"
            description="Submit a student publication with title, authors, date, content, contact email, and optional DOI, journal, or images."
            actionLabel="Submit publication"
            onClick={() => navigate("/submit/publication")}
          />
          <SubmissionChoice
            icon={<FaChalkboardUser />}
            title="Mentor submission"
            description="Submit a mentor profile with academic title, name, contact details, research areas, research topics, and profile links."
            actionLabel="Submit mentor"
            onClick={() => navigate("/submit/mentor")}
          />
        </div>
      </section>
      <Footer />
    </main>
  );
};

type SubmissionChoiceProps = {
  actionLabel: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  title: string;
};

const SubmissionChoice = ({
  actionLabel,
  description,
  icon,
  onClick,
  title,
}: SubmissionChoiceProps) => (
  <article className="flex min-h-72 flex-col justify-between rounded-lg border border-amber-50/10 bg-zinc-900 p-6 shadow-lg">
    <div>
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#ff6a1f] text-xl text-white">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-amber-50">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-amber-50/65">{description}</p>
    </div>
    <button
      type="button"
      onClick={onClick}
      className="mt-8 inline-flex w-fit items-center gap-2 rounded-lg bg-[#ff6a1f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e85f1b]"
    >
      {actionLabel}
      <FaArrowRight />
    </button>
  </article>
);

export default SubmissionPage;
