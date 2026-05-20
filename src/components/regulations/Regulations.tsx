const Regulations = () => {
  return (
    <section
      id="regulations"
      className="bg-amber-50 px-6 py-20 text-black lg:px-10 scroll-mt-24"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold text-black lg:text-5xl">
            Regulations
          </h2>
          <div className="mt-3 font-thin text-sm text-black/70 lg:text-base">
            <p className="divider divider-neutral">
              Official rules and submission requirements for SRC 2026 (FPTU
              HCMC).
            </p>
          </div>
        </div>

        <div className="join join-vertical w-full rounded-2xl bg-amber-50 text-black shadow-xl">
          <div className="collapse collapse-arrow join-item border-b border-black/10 rounded-t-2xl">
            <input type="radio" name="regulations-accordion" defaultChecked />
            <div className="collapse-title text-xl font-bold">
              1. Eligible Participants
            </div>
            <div className="collapse-content text-sm leading-7 text-black/80">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Students from all majors at{" "}
                  <strong>FPT University HCMC</strong> are eligible.
                </li>
                <li>
                  The competition includes <strong>5 sub-committees</strong>:
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li>Information Technology</li>
                    <li>Semiconductor IC &amp; Digital Automotive</li>
                    <li>
                      Graphic Design &amp; Digital Art, Multimedia Communication
                    </li>
                    <li>Economics &amp; Business Administration</li>
                    <li>Languages (English Language, Japanese Language)</li>
                  </ul>
                </li>
                <li>
                  <strong>Sub-committee split mechanism:</strong> Combined
                  sub-committees (English Language &amp; Japanese Language;
                  Graphic Design &amp; Digital Art &amp; Multimedia
                  Communication) will be considered for splitting into separate
                  sub-committees if each field group has{" "}
                  <strong>6 or more valid registered topics</strong>. Otherwise,
                  they will continue to be evaluated together within the combined
                  sub-committee.
                </li>
              </ul>
            </div>
          </div>

          <div className="collapse collapse-arrow join-item border-b border-black/10">
            <input type="radio" name="regulations-accordion" />
            <div className="collapse-title text-xl font-bold">
              2. General Rules
            </div>
            <div className="collapse-content text-sm leading-7 text-black/80">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Teams can register as{" "}
                  <strong>individuals or groups (max 4 members/group)</strong>.
                </li>
                <li>
                  Each student can join up to <strong>2 research topics</strong>.
                </li>
                <li>
                  Each topic can only join <strong>one sub-committee</strong>.
                </li>
                <li>
                  Topics that previously won awards at ResFes, or have been
                  published in journals, conferences, or other FPTU HCMC
                  scientific research competitions are{" "}
                  <strong>not accepted</strong>.
                </li>
                <li>
                  The official language for report presentation, oral
                  presentation, and Q&amp;A is <strong>English</strong>.
                </li>
                <li>
                  <strong>Turnitin similarity</strong> must not exceed{" "}
                  <strong>25%</strong>.
                </li>
                <li>
                  Research teams must check for plagiarism on Turnitin before
                  submission (if possible).
                </li>
                <li>
                  Teams with a similarity index exceeding 25% will be{" "}
                  <strong>
                    eliminated from the Preliminary or Final Round
                  </strong>
                  .
                </li>
                <li>
                  Evaluation councils and rankings are established only for
                  sub-committees with <strong>at least 6 topics</strong>. If a
                  sub-committee has 4–5 topics, a council may still be formed but
                  only <strong>1 award</strong> will be granted.
                </li>
                <li>
                  Teams must present at the Final Round and attend the closing
                  ceremony where results are announced.
                </li>
              </ul>

              <p className="font-semibold mt-4 text-base">
                Competition Process:
              </p>

              <p className="font-semibold mt-3">
                Round 1 – Preliminary (Proposal):
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Teams submit a Research Proposal upon registration.
                </li>
                <li>
                  Proposal template available at:{" "}
                  <a href="#" className="link link-primary">
                    Proposal Template
                  </a>
                </li>
                <li>
                  The Organizing Committee / Expert Council will evaluate and
                  select qualified topics for the Final Round.
                </li>
                <li>
                  The list of teams advancing to the Final Round will be
                  officially announced.
                </li>
                <li>
                  Presentation time per group: <strong>20 minutes</strong> (10
                  min presentation + 10 min Q&amp;A)
                </li>
              </ul>

              <p className="font-semibold mt-3">Round 2 – Final Round:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Teams that pass the Preliminary Round submit full research
                  papers and present live before the Council.
                </li>
                <li>
                  Final results will be announced at the Closing Ceremony.
                </li>
                <li>
                  Teams will present and defend{" "}
                  <strong>100% in English</strong> or{" "}
                  <strong>Japanese</strong> (for the Japanese Language
                  sub-committee).
                </li>
                <li>
                  Duration: <strong>10 min presentation</strong> +{" "}
                  <strong>20 min defense</strong>
                </li>
                <li>
                  Each team must prepare: personal laptop for slide projection,
                  presentation slides, product/model (if any).
                </li>
              </ul>

              <p className="mt-3 italic text-black/60">
                Note: Evaluation councils will be established for sub-committees
                with 6+ topics in the Final Round. For sub-committees with 4–5
                topics, the award structure will be adjusted accordingly.
              </p>
            </div>
          </div>

          <div className="collapse collapse-arrow join-item border-b border-black/10 rounded-b-2xl">
            <input type="radio" name="regulations-accordion" />
            <div className="collapse-title text-xl font-bold">
              3. Submission Requirements
            </div>
            <div className="collapse-content text-sm leading-7 text-black/80">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Teams submit a <strong>full research paper</strong>.
                </li>
                <li>
                  Use IEEE/IEEE Word template, single-column format, maximum 10
                  A4 pages (excluding References and Appendices).
                </li>
                <li>
                  Citation style:
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li>
                      IEEE for Information Technology:{" "}
                      <a
                        href="https://libguides.murdoch.edu.au/IEEE/home"
                        target="_blank"
                        rel="noreferrer"
                        className="link link-primary"
                      >
                        Reference
                      </a>
                    </li>
                    <li>
                      APA for Economics &amp; Business Administration,
                      Languages, Multimedia Communication and Digital
                      Art/Design:{" "}
                      <a
                        href="https://libguides.murdoch.edu.au/APA/all"
                        target="_blank"
                        rel="noreferrer"
                        className="link link-primary"
                      >
                        Reference
                      </a>
                    </li>
                  </ul>
                </li>
                <li>Prepare presentation slides for the Final Round.</li>
                <li>
                  Presentation language (written and oral): English, or Japanese
                  for the Japanese Language sub-committee.
                </li>
                <li>
                  Full paper writing instructions: available in the official
                  guideline.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Regulations;
