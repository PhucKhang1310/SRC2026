import { useState } from "react";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { submitMentor, type MentorSubmissionPayload } from "../../api/api";
import Footer from "../../components/footer/Footer";
import NavBar from "../../components/navbar/NavBar";
import TurnstileWidget from "../../components/turnstile/TurnstileWidget";

const inputClass =
  "w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-amber-50 outline-none transition placeholder:text-amber-50/30 focus:border-[#ff6a1f] focus:ring-2 focus:ring-[#ff6a1f]/20";
const labelClass =
  "text-xs font-semibold uppercase tracking-wider text-amber-50/55";

const initialForm: MentorSubmissionPayload = {
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
};

const MentorSubmission = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<MentorSubmissionPayload>(initialForm);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  const canSubmit = Boolean(
    form.title && form.fullName && form.email && turnstileToken,
  );

  const updateField = (field: keyof MentorSubmissionPayload, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setStatus("");
  };

  const handleSubmit = async () => {
    try {
      if (!canSubmit) {
        throw new Error("Please fill title, full name, and email.");
      }

      setIsSubmitting(true);
      setStatus("");
      await submitMentor({ ...form, turnstileToken });
      setStatus("Mentor profile submitted.");
      setForm(initialForm);
      setTurnstileToken("");
      setTurnstileResetKey((current) => current + 1);
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Mentor submission failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-amber-50">
      <NavBar />
      <section className="mx-auto max-w-4xl px-6 pt-36 pb-16">
        <button
          type="button"
          onClick={() => navigate("/submit")}
          className="mb-8 inline-flex items-center gap-2 text-sm text-amber-50/65 transition hover:text-amber-50"
        >
          <FaArrowLeft />
          Back to submissions
        </button>

        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-amber-50/55">
            Mentor profile
          </p>
          <h1 className="mt-3 text-3xl font-black uppercase tracking-wider text-[#ff6a1f] md:text-5xl">
            Mentor submission
          </h1>
        </div>

        <form
          className="rounded-lg border border-amber-50/10 bg-zinc-900 p-5 shadow-lg"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="Title"
              placeholder="Dr., MSc., Prof."
              required
              value={form.title}
              onChange={(value) => updateField("title", value)}
            />
            <TextInput
              label="Full name"
              required
              value={form.fullName}
              onChange={(value) => updateField("fullName", value)}
            />
            <TextInput
              label="Department"
              value={form.department}
              onChange={(value) => updateField("department", value)}
            />
            <TextInput
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={(value) => updateField("phone", value)}
            />
            <TextInput
              label="Email"
              required
              type="email"
              value={form.email}
              onChange={(value) => updateField("email", value)}
            />
            <TextInput
              label="Personal website"
              type="url"
              value={form.personalWebsite}
              onChange={(value) => updateField("personalWebsite", value)}
            />
            <TextInput
              label="ORCID"
              value={form.orcid}
              onChange={(value) => updateField("orcid", value)}
            />
            <TextInput
              label="ResearchGate"
              type="url"
              value={form.researchGate}
              onChange={(value) => updateField("researchGate", value)}
            />
            <TextInput
              label="Google Scholar"
              type="url"
              value={form.googleScholar}
              onChange={(value) => updateField("googleScholar", value)}
            />
            <TextInput
              label="Avatar image"
              type="url"
              value={form.avatarImage}
              onChange={(value) => updateField("avatarImage", value)}
            />
            <div className="md:col-span-2">
              <TextArea
                label="Research areas"
                value={form.researchAreas}
                onChange={(value) => updateField("researchAreas", value)}
              />
            </div>
            <div className="md:col-span-2">
              <TextArea
                label="Research topics"
                value={form.researchTopics}
                onChange={(value) => updateField("researchTopics", value)}
              />
            </div>
            <div className="md:col-span-2">
              <TextArea
                label="Note"
                value={form.note}
                onChange={(value) => updateField("note", value)}
              />
            </div>
            <div className="md:col-span-2">
              <TurnstileWidget
                resetKey={turnstileResetKey}
                onTokenChange={(token) => {
                  setTurnstileToken(token);
                  setStatus("");
                }}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-[#ff6a1f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e85f1b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaPaperPlane />
              {isSubmitting ? "Submitting..." : "Submit mentor"}
            </button>
            {status ? (
              <p className="text-sm text-amber-50/70">{status}</p>
            ) : null}
          </div>
        </form>
      </section>
      <Footer />
    </main>
  );
};

type TextInputProps = {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  value: string;
};

const TextInput = ({
  label,
  onChange,
  placeholder,
  required = false,
  type = "text",
  value,
}: TextInputProps) => (
  <label className="grid gap-1">
    <span className={labelClass}>{label}</span>
    <input
      className={inputClass}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      required={required}
      type={type}
      value={value}
    />
  </label>
);

type TextAreaProps = {
  label: string;
  onChange: (value: string) => void;
  value: string;
};

const TextArea = ({ label, onChange, value }: TextAreaProps) => (
  <label className="grid gap-1">
    <span className={labelClass}>{label}</span>
    <textarea
      className={`${inputClass} min-h-28 resize-y`}
      onChange={(event) => onChange(event.target.value)}
      value={value}
    />
  </label>
);

export default MentorSubmission;
