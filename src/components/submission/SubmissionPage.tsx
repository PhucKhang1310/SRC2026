import { useMemo, useState } from "react";
import {
  submitMentor,
  submitPublication,
  type MentorSubmissionPayload,
  type PublicationSubmissionPayload,
} from "../../api/api";
import Footer from "../footer/Footer";
import NavBar from "../navbar/NavBar";

const mentorCsvTemplate =
  "Title (Học hàm/học vị),Full Name (Họ và tên),Department (Đơn vị công tác),Phone (if available),Email,Personal Website,OrCID,ResearchGate,Google Scholar,Research Areas (Lĩnh vực nghiên cứu chính),Research Topics (Hướng nghiên cứu cụ thể),Note (Ghi chú khác),Avatar Image\nDr.,Mentor Name,Computer Science,+84 901 234 567,mentor@example.com,https://example.com,0000-0000-0000-0000,https://www.researchgate.net/profile/example,https://scholar.google.com/citations?user=example,Artificial Intelligence,\"Machine learning, computer vision\",Available for undergraduate research mentoring.,https://drive.google.com/file/d/example/view";

const publicationBibtexTemplate = `@article{ZHOU2026108568,
title = {An online forecasting-based fine-tuning pipeline for time-series anomaly prediction},
journal = {Neural Networks},
volume = {198},
pages = {108568},
year = {2026},
doi = {https://doi.org/10.1016/j.neunet.2026.108568},
url = {https://www.sciencedirect.com/science/article/pii/S0893608026000316},
author = {Zhou Zhou and Van Hoan Trinh and Yuet Ming Joyce Yue},
keywords = {Time series, Anomaly prediction, Online forecasting},
abstract = {Publication abstract...}
}`;

const parseCsvRow = (row: string) => {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < row.length; index += 1) {
    const character = row[index];
    const nextCharacter = row[index + 1];

    if (character === '"' && nextCharacter === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (character === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (character === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += character;
  }

  values.push(current.trim());
  return values;
};

const normalizeHeader = (value: string) =>
  value.toLowerCase().replace(/\s+/g, " ").trim();

const getCsvValue = (
  row: Record<string, string>,
  fields: string[],
  fallback = ""
) => {
  for (const field of fields) {
    const value = row[normalizeHeader(field)];
    if (value) {
      return value;
    }
  }

  return fallback;
};

const parseMentorCsv = (csv: string): MentorSubmissionPayload => {
  const rows = csv
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean);

  if (rows.length < 2) {
    throw new Error("CSV needs one header row and one mentor row.");
  }

  const headers = parseCsvRow(rows[0]).map(normalizeHeader);
  const values = parseCsvRow(rows[1]);
  const row = headers.reduce<Record<string, string>>((result, header, index) => {
    result[header] = values[index] ?? "";
    return result;
  }, {});

  return {
    title: getCsvValue(row, ["Title (Học hàm/học vị)"]),
    fullName: getCsvValue(row, ["Full Name (Họ và tên)"]),
    department: getCsvValue(row, ["Department (Đơn vị công tác)"]),
    phone: getCsvValue(row, ["Phone (if available)"]),
    email: getCsvValue(row, ["Email"]),
    personalWebsite: getCsvValue(row, ["Personal Website"]),
    orcid: getCsvValue(row, ["OrCID"]),
    researchGate: getCsvValue(row, ["ResearchGate"]),
    googleScholar: getCsvValue(row, ["Google Scholar"]),
    researchAreas: getCsvValue(row, ["Research Areas (Lĩnh vực nghiên cứu chính)"]),
    researchTopics: getCsvValue(row, ["Research Topics (Hướng nghiên cứu cụ thể)"]),
    note: getCsvValue(row, ["Note (Ghi chú khác)"]),
    avatarImage: getCsvValue(row, ["Avatar Image"]),
  };
};

const parseBibtexFields = (bibtex: string) => {
  const fields: Record<string, string> = {};
  const bodyStart = bibtex.indexOf("{");
  const bodyEnd = bibtex.lastIndexOf("}");

  if (bodyStart === -1 || bodyEnd === -1 || bodyEnd <= bodyStart) {
    throw new Error("BibTeX entry is missing its braces.");
  }

  const body = bibtex.slice(bodyStart + 1, bodyEnd);
  let index = body.indexOf(",");
  index = index === -1 ? 0 : index + 1;

  while (index < body.length) {
    while (body[index] && /[\s,]/.test(body[index])) index += 1;

    const keyStart = index;
    while (body[index] && /[A-Za-z0-9_-]/.test(body[index])) index += 1;
    const key = body.slice(keyStart, index).toLowerCase();

    while (body[index] && /\s/.test(body[index])) index += 1;
    if (body[index] !== "=") break;
    index += 1;
    while (body[index] && /\s/.test(body[index])) index += 1;

    const opening = body[index];
    let value = "";

    if (opening === "{" || opening === '"') {
      const closing = opening === "{" ? "}" : '"';
      let depth = opening === "{" ? 1 : 0;
      index += 1;
      const valueStart = index;

      while (index < body.length) {
        if (opening === "{" && body[index] === "{") depth += 1;
        if (body[index] === closing) {
          if (opening === "{") depth -= 1;
          if (opening === '"' || depth === 0) break;
        }
        index += 1;
      }

      value = body.slice(valueStart, index).trim();
      index += 1;
    } else {
      const valueStart = index;
      while (body[index] && body[index] !== ",") index += 1;
      value = body.slice(valueStart, index).trim();
    }

    if (key) fields[key] = value;
  }

  return fields;
};

const parseBibtexPublication = (
  bibtex: string,
  authorGmail: string,
  imagesText: string
): PublicationSubmissionPayload => {
  const fields = parseBibtexFields(bibtex);
  const year = fields.year || String(new Date().getFullYear());
  const images = imagesText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [url, publicId = ""] = line.split(",").map((value) => value.trim());
      return { url, publicId };
    });

  return {
    publishTitle: fields.title || "Untitled publication",
    author: fields.author || "",
    publishDate: `${year}-01-01`,
    content: [
      fields.abstract,
      fields.journal ? `Journal: ${fields.journal}` : "",
      fields.doi ? `DOI: ${fields.doi}` : "",
      fields.url ? `URL: ${fields.url}` : "",
      fields.keywords ? `Keywords: ${fields.keywords}` : "",
    ]
      .filter(Boolean)
      .join("\n\n"),
    authorGmail,
    doi: fields.doi || "",
    journal: fields.journal || "",
    ...(images.length > 0 ? { images } : {}),
  };
};

const SubmissionPage = () => {
  const [mentorCsv, setMentorCsv] = useState(mentorCsvTemplate);
  const [publicationBibtex, setPublicationBibtex] = useState(
    publicationBibtexTemplate
  );
  const [authorGmail, setAuthorGmail] = useState("");
  const [publicationImages, setPublicationImages] = useState("");
  const [mentorStatus, setMentorStatus] = useState("");
  const [publicationStatus, setPublicationStatus] = useState("");
  const [isSubmittingMentor, setIsSubmittingMentor] = useState(false);
  const [isSubmittingPublication, setIsSubmittingPublication] = useState(false);

  const mentorPayload = useMemo(() => {
    try {
      return parseMentorCsv(mentorCsv);
    } catch {
      return null;
    }
  }, [mentorCsv]);

  const publicationPayload = useMemo(() => {
    try {
      return parseBibtexPublication(
        publicationBibtex,
        authorGmail,
        publicationImages
      );
    } catch {
      return null;
    }
  }, [authorGmail, publicationBibtex, publicationImages]);

  const handleMentorFile = async (file?: File) => {
    if (!file) return;
    setMentorCsv(await file.text());
  };

  const handleMentorSubmit = async () => {
    try {
      if (!mentorPayload) throw new Error("CSV could not be parsed.");
      setIsSubmittingMentor(true);
      setMentorStatus("");
      await submitMentor(mentorPayload);
      setMentorStatus("Mentor submission sent.");
    } catch (error) {
      setMentorStatus(
        error instanceof Error ? error.message : "Mentor submission failed."
      );
    } finally {
      setIsSubmittingMentor(false);
    }
  };

  const handlePublicationSubmit = async () => {
    try {
      if (!publicationPayload) throw new Error("BibTeX could not be parsed.");
      setIsSubmittingPublication(true);
      setPublicationStatus("");
      await submitPublication(publicationPayload);
      setPublicationStatus("Publication submission sent.");
    } catch (error) {
      setPublicationStatus(
        error instanceof Error ? error.message : "Publication submission failed."
      );
    } finally {
      setIsSubmittingPublication(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-amber-50">
      <NavBar />
      <section className="mx-auto max-w-6xl px-6 pt-36 pb-16">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black uppercase tracking-wider text-[#ff6a1f] md:text-5xl">
            Submissions
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-amber-50/10 bg-zinc-900 p-5">
            <h2 className="text-xl font-bold text-amber-50">
              Mentor information
            </h2>
            <input
              type="file"
              accept=".csv,text/csv"
              className="file-input file-input-bordered mt-4 w-full bg-zinc-950 text-amber-50"
              onChange={(event) => void handleMentorFile(event.target.files?.[0])}
            />
            <textarea
              className="textarea textarea-bordered mt-4 min-h-72 w-full bg-zinc-950 font-mono text-xs text-amber-50"
              value={mentorCsv}
              onChange={(event) => setMentorCsv(event.target.value)}
            />
            <pre className="mt-4 max-h-80 overflow-auto rounded bg-black p-4 text-xs text-amber-50/80">
              {JSON.stringify(mentorPayload, null, 2)}
            </pre>
            <button
              type="button"
              className="btn mt-4 border-none bg-[#ff6a1f] text-white hover:bg-[#e85f1b]"
              disabled={!mentorPayload || isSubmittingMentor}
              onClick={() => void handleMentorSubmit()}
            >
              {isSubmittingMentor ? "Submitting..." : "Submit mentor"}
            </button>
            {mentorStatus && (
              <p className="mt-3 text-sm text-amber-50/70">{mentorStatus}</p>
            )}
          </section>

          <section className="rounded-lg border border-amber-50/10 bg-zinc-900 p-5">
            <h2 className="text-xl font-bold text-amber-50">
              Student publication
            </h2>
            <textarea
              className="textarea textarea-bordered mt-4 min-h-72 w-full bg-zinc-950 font-mono text-xs text-amber-50"
              value={publicationBibtex}
              onChange={(event) => setPublicationBibtex(event.target.value)}
            />
            <input
              type="email"
              className="input input-bordered mt-4 w-full bg-zinc-950 text-amber-50"
              placeholder="Author Gmail"
              value={authorGmail}
              onChange={(event) => setAuthorGmail(event.target.value)}
            />
            <textarea
              className="textarea textarea-bordered mt-4 min-h-24 w-full bg-zinc-950 font-mono text-xs text-amber-50"
              placeholder="Optional images, one per line: url, publicId"
              value={publicationImages}
              onChange={(event) => setPublicationImages(event.target.value)}
            />
            <pre className="mt-4 max-h-80 overflow-auto rounded bg-black p-4 text-xs text-amber-50/80">
              {JSON.stringify(publicationPayload, null, 2)}
            </pre>
            <button
              type="button"
              className="btn mt-4 border-none bg-[#ff6a1f] text-white hover:bg-[#e85f1b]"
              disabled={!publicationPayload || isSubmittingPublication}
              onClick={() => void handlePublicationSubmit()}
            >
              {isSubmittingPublication ? "Submitting..." : "Submit publication"}
            </button>
            {publicationStatus && (
              <p className="mt-3 text-sm text-amber-50/70">
                {publicationStatus}
              </p>
            )}
          </section>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default SubmissionPage;
