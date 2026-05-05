import workshopImage from "../../assets/resfes_tour.jpg";
import { useCheckMobile } from "../../hook/useCheckMobile";

const Workshops = () => {
  const { isMobile } = useCheckMobile();

  return (
    <section id="workshops" className="scroll-mt-24 px-6 py-20 lg:px-10 ">
      <div
        className="relative mx-auto flex min-h-[70vh] max-w-7xl items-center overflow-hidden rounded-4xl border border-white/10 bg-black text-white shadow-2xl"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.8)), url(${workshopImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-16 text-center lg:px-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-orange-400/90">
            Workshops
          </p>
          <h2 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Scientific Research Guidance Workshops
          </h2>
          <a
            href="https://forms.gle/uDwrApEKfoRjaobb8"
            target="_blank"
            rel="noopener noreferrer"
            className="btn mt-6 rounded-full border-0 bg-orange-600 px-8 text-base text-white hover:bg-orange-600/90"
          >
            Register for Workshop
          </a>

          <ul className="list mt-8 w-full rounded-2xl bg-black/50 backdrop-blur-sm border border-white/15 text-start">
            <li className="p-4 pb-2 text-xs opacity-60 tracking-wide text-white">Upcoming workshops — Sunday, 01.03.2026</li>

            <li className={`list-row border-white/10 ${isMobile ? "flex flex-col" : ""}`} >
              <div>
                <div className="text-white font-semibold">Research Methodology — Engineering</div>
                <div className="text-xs uppercase font-semibold opacity-60 text-white/70">Dr. Ta Hoang Thang</div>
              </div>
              <div className={`flex flex-col items-end text-xs text-white/60 ${isMobile ? 'items-start' : ''}`}>
                <span>8:30 – 10:30</span>
                <span className="text-orange-300">Hall Academic</span>
              </div>
            </li>

            <li className={`list-row border-white/10 ${isMobile ? "flex flex-col" : ""}`} >
              <div>
                <div className="text-white font-semibold">Research Methodology — Economics & Social Sciences</div>
                <div className="text-xs uppercase font-semibold opacity-60 text-white/70">Dr. Le Ha Van</div>
              </div>
              <div className={`flex flex-col items-end text-xs text-white/60 ${isMobile ? 'items-start' : ''}`}>
                <span>8:30 – 10:30</span>
                <span className="text-orange-300">Hall Business</span>
              </div>
            </li>

            <li className={`list-row border-white/10 ${isMobile ? "flex flex-col" : ""}`} >
              <div>
                <div className="text-white font-semibold">Reporting with LaTeX/Overleaf</div>
                <div className="text-xs uppercase font-semibold opacity-60 text-white/70">PhD Candidate Pham Minh Tri</div>
              </div>
              <div className={`flex flex-col items-end text-xs text-white/60 ${isMobile ? 'items-start' : ''}`}>
                <span>10:30 – 12:00</span>
                <span className="text-orange-300">Hall Academic</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,153,0,0.15),transparent_40%),radial-gradient(circle_at_50%_70%,rgba(255,255,255,0.08),transparent_45%)]" />
      </div>
    </section>
  );
};

export default Workshops;
