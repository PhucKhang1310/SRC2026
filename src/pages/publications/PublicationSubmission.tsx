import { useMemo, useState } from "react";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import {
  submitPublication,
  type PublicationSubmissionPayload,
} from "../../api/api";
import Footer from "../../components/footer/Footer";
import NavBar from "../../components/navbar/NavBar";
import TurnstileWidget from "../../components/turnstile/TurnstileWidget";

const inputClass =
  "w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-amber-50 outline-none transition placeholder:text-amber-50/30 focus:border-[#ff6a1f] focus:ring-2 focus:ring-[#ff6a1f]/20";
const labelClass =
  "text-xs font-semibold uppercase tracking-wider text-amber-50/55";

const initialForm: PublicationSubmissionPayload = {
  publishTitle: "",
  author: "",
  publishDate: "",
  content: "",
  authorGmail: "",
  doi: "",
  journal: "",
  images: [],
};

const parseImages = (value: string): PublicationSubmissionPayload["images"] =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [url, publicId = ""] = line.split(",").map((item) => item.trim());
      return { url, publicId };
    })
    .filter((image) => image.url && image.publicId);

const PublicationSubmission = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<PublicationSubmissionPayload>(initialForm);
  const [imagesText, setImagesText] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  const payload = useMemo<PublicationSubmissionPayload>(
    () => ({
      ...form,
      images: parseImages(imagesText),
    }),
    [form, imagesText],
  );

  const canSubmit = Boolean(
    payload.publishTitle &&
    payload.author &&
    payload.publishDate &&
    payload.content &&
    payload.authorGmail &&
    turnstileToken,
  );

  const updateField = (
    field: keyof PublicationSubmissionPayload,
    value: string,
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setStatus("");
  };

  const handleSubmit = async () => {
    try {
      if (!canSubmit) {
        throw new Error("Please fill title, author, date, content, and Gmail.");
      }

      setIsSubmitting(true);
      setStatus("");
      await submitPublication({ ...payload, turnstileToken });
      setStatus("Publication submission sent.");
      setForm(initialForm);
      setImagesText("");
      setTurnstileToken("");
      setTurnstileResetKey((current) => current + 1);
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Publication submission failed.",
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
            Student publication
          </p>
          <h1 className="mt-3 text-3xl font-black uppercase tracking-wider text-[#ff6a1f] md:text-5xl">
            Publication submission
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
              label="Publish title"
              required
              value={form.publishTitle}
              onChange={(value) => updateField("publishTitle", value)}
            />
            <TextInput
              label="Author"
              required
              value={form.author}
              onChange={(value) => updateField("author", value)}
            />
            <TextInput
              label="Publish date"
              required
              type="date"
              value={form.publishDate}
              onChange={(value) => updateField("publishDate", value)}
            />
            <TextInput
              label="Author Gmail"
              required
              type="email"
              value={form.authorGmail}
              onChange={(value) => updateField("authorGmail", value)}
            />
            <TextInput
              label="DOI"
              value={form.doi}
              onChange={(value) => updateField("doi", value)}
            />
            <TextInput
              label="Journal"
              value={form.journal}
              onChange={(value) => updateField("journal", value)}
            />
            <div className="md:col-span-2">
              <TextArea
                label="Content"
                required
                value={form.content}
                onChange={(value) => updateField("content", value)}
              />
            </div>
            <div className="md:col-span-2">
              <TextArea
                label="Images"
                placeholder="Optional, one per line: imageUrl, publicId"
                value={imagesText}
                onChange={(value) => {
                  setImagesText(value);
                  setStatus("");
                }}
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
              {isSubmitting ? "Submitting..." : "Submit publication"}
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
  placeholder?: string;
  required?: boolean;
  value: string;
};

const TextArea = ({
  label,
  onChange,
  placeholder,
  required = false,
  value,
}: TextAreaProps) => (
  <label className="grid gap-1">
    <span className={labelClass}>{label}</span>
    <textarea
      className={`${inputClass} min-h-32 resize-y`}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      required={required}
      value={value}
    />
  </label>
);

export default PublicationSubmission;
