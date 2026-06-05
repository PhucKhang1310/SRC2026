import { usePageContent } from "../../hook/usePageContent";

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-5 w-5"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
      clipRule="evenodd"
    />
  </svg>
);

const Milestones = () => {
  const { content } = usePageContent();

  if (!content) {
    return null;
  }

  const { milestones, milestonesNote, milestonesTitle } = content;

  return (
    <>
      <style>
        {`
          @keyframes firstTimelineBlink {
            0%,
            100% {
              opacity: 1;
              box-shadow: 0 0 0 rgba(255, 255, 255, 0);
            }
            50% {
              opacity: 0.32;
              box-shadow: 0 0 18px rgba(255, 255, 255, 0.28);
            }
          }

          .first-timeline-box-blink {
            animation: firstTimelineBlink 1.5s ease-in-out infinite;
          }
        `}
      </style>
      <section
        id="milestones"
        className="bg-black px-6 py-16 text-white lg:px-10 scroll-mt-24"
      >
        <span className="font-extrabold text-sm text-white flex gap-3 justify-center mb-10">
          <svg
            viewBox="0 0 292.828 292.828"
            xmlns="http://www.w3.org/2000/svg"
            width="10"
          >
            <polygon
              points="256.756,99.709 256.74,231.242 25.509,0 0,25.509 231.247,256.756 99.709,256.756 99.709,292.828 292.828,292.828 292.828,99.709"
              fill="#ffffff"
            />
          </svg>
          {milestonesTitle}
        </span>
        <div className="mx-auto max-w-5xl px-2 py-4 sm:px-4">
          <ul className="timeline timeline-snap-icon timeline-vertical w-full">
            {milestones.map((item, index) => (
              <li key={item.id}>
                {index !== 0 && <hr className="bg-amber-50/40" />}

                {index % 2 === 0 ? (
                  <div
                    className={`timeline-start timeline-box border-white/25 bg-black text-right ${
                      index === 0 ? "first-timeline-box-blink" : ""
                    }`}
                  >
                    {item.detail ? (
                      <span className="badge badge-outline badge-xs mb-2 border-white text-white">
                        {item.detail}
                      </span>
                    ) : null}
                    <time className="block text-xs font-extrabold uppercase tracking-wide text-white">
                      {item.date}
                    </time>
                    <div className="mt-1 text-sm font-semibold text-white/85">
                      {item.title}
                    </div>
                  </div>
                ) : null}

                <div className="timeline-middle">
                  <CheckIcon />
                </div>

                {index % 2 !== 0 ? (
                  <div className="timeline-end timeline-box border-white/25 bg-black">
                    {item.detail ? (
                      <span className="badge badge-outline badge-xs mb-2 border-white text-white">
                        {item.detail}
                      </span>
                    ) : null}
                    <time className="block text-xs font-extrabold uppercase tracking-wide text-white">
                      {item.date}
                    </time>
                    <div className="mt-1 text-sm font-semibold text-white/85">
                      {item.title}
                    </div>
                  </div>
                ) : null}

                {index !== milestones.length - 1 && (
                  <hr className="bg-amber-50/40" />
                )}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-center text-sm italic font-thin opacity-40">
            {milestonesNote}
          </p>
        </div>
      </section>
    </>
  );
};

export default Milestones;
