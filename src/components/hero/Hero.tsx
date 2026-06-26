import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useCheckMobile } from "../../hook/useCheckMobile";
import HeroGlow from "../../assets/home-hero01.png";
import logoFptu from '../../assets/logo-fptu.png'
import resfes2026 from '../../assets/logo_src_white_nobg.png'
import fptLogoFixed from "../../assets/fpt_logo-removebg-preview_cropped.png";
import { usePageContent } from "../../hook/usePageContent";


const Hero = () => {
  const { isMobile } = useCheckMobile()
  const { content, error } = usePageContent();
  const hero = content?.hero;
  const registrationDeadline = hero?.registrationDeadline;
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    if (!registrationDeadline) return;

    const updateTimeLeft = () => {
      const targetDate = new Date(registrationDeadline).getTime();
      const diff = Math.max(0, Math.floor((targetDate - Date.now()) / 1000));
      setTotalSeconds(diff);
    };

    updateTimeLeft();
    const timer = window.setInterval(updateTimeLeft, 1000);

    return () => window.clearInterval(timer);
  }, [registrationDeadline]);

  if (error || !hero) {
    return (
      <section
        id="home"
        className="flex min-h-screen items-center justify-center bg-black px-6 text-center text-white"
      >
      </section>
    );
  }

  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  const valueStyle = (value: number) => ({ "--value": value } as CSSProperties);
  const getFlickerTimings = (text: string, index: number) => {
    let seed = index + text.length;

    for (const character of text) {
      seed += character.charCodeAt(0) * (index + 1);
    }

    const delay = (seed % 12) * 0.07;
    const duration = 1.4 + (seed % 5) * 0.18;

    return {
      "--delay": `${delay}s`,
      "--duration": `${duration}s`,
    } as CSSProperties;
  };
  const renderFlickerText = (text: string) =>
    text.split("").map((character, index) => (
      <span
        key={`${text}-${character}-${index}`}
        className="flicker-letter"
        style={getFlickerTimings(text, index)}
      >
        {character === " " ? "\u00A0" : character}
      </span>
    ));

  return (
    <>
      <section
        id="home"
        className="relative isolate min-h-screen overflow-hidden bg-black scroll-mt-24"
      >
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 pb-16 pt-28 lg:px-10 ">
          <div className="flex w-full flex-col lg:gap-90 lg:flex-row lg:items-center lg:justify-between">
            <div className="hero-content self-start p-0 text-neutral-content lg:justify-start">
              <div className="max-w-xl">
                <div className="mb-3 text-5xl lg:text-7xl text-white">
                  {hero.titleLines.map((line, index) => (
                    <h1
                      key={`${line}-${index}`}
                      className={index % 2 === 0 ? "font-bold" : "font-thin"}
                    >
                      {renderFlickerText(line)}
                    </h1>
                  ))}
                </div>
                <div className="text-rotate mb-3 font-semibold text-orange-400">
                  <span className="justify-items-start">
                    <span className="max-w-lg">
                      {hero.taglinePrimary}
                    </span>
                    <span className="max-w-lg">
                      {hero.taglineSecondary}
                    </span>
                  </span>
                </div>
                <p className="text-xs text-white/50 mb-2 tracking-wide">{hero.countdownLabel}</p>
                <div className={`grid grid-flow-col gap-2 text-center auto-cols-max lg:gap-5 `}>
                  <div className="flex flex-col p-2 bg-[#111827] rounded-box text-neutral-content">
                    <span className="countdown font-mono text-5xl">
                      <span
                        style={valueStyle(days)}
                        aria-live="polite"
                        aria-label={`${days} days`}
                      >
                        {days}
                      </span>
                    </span>
                    days
                  </div>
                  <div className="flex flex-col p-2  bg-[#111827] rounded-box text-neutral-content">
                    <span className="countdown font-mono text-5xl">
                      <span
                        style={valueStyle(hours)}
                        aria-live="polite"
                        aria-label={`${hours} hours`}
                      >
                        {hours}
                      </span>
                    </span>
                    hours
                  </div>
                  <div className="flex flex-col p-2  bg-[#111827] rounded-box text-neutral-content">
                    <span className="countdown font-mono text-5xl">
                      <span
                        style={valueStyle(minutes)}
                        aria-live="polite"
                        aria-label={`${minutes} minutes`}
                      >
                        {minutes}
                      </span>
                    </span>
                    min
                  </div>
                  <div className="flex flex-col p-2  bg-[#111827] rounded-box text-neutral-content">
                    <span className="countdown font-mono text-5xl">
                      <span
                        style={valueStyle(seconds)}
                        aria-live="polite"
                        aria-label={`${seconds} seconds`}
                      >
                        {seconds}
                      </span>
                    </span>
                    sec
                  </div>
                </div>
                <div className={`flex ${isMobile ? `flex-col max-w-xs` : `gap-5`}`}>
                  <a
                    href="/register"
                    target="_blank"
                    rel="noreferrer"
                    className="btn mt-8 rounded-full border-0 bg-orange-600 px-8 text-white hover:bg-orange-600/90"
                  >
                    {hero.ctaLabel}
                  </a>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_24%,rgba(42,171,94,0.34),transparent_34%),radial-gradient(circle_at_72%_34%,rgba(108,232,170,0.24),transparent_42%),radial-gradient(circle_at_54%_84%,rgba(61,73,255,0.42),transparent_46%)] "
            />
            <img
              src={HeroGlow}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute left-[-30%] top-[6%] w-[165vw] max-w-none opacity-80 mix-blend-screen sm:left-[-18%] sm:top-[8%] sm:w-[145vw] lg:left-[-2%] lg:top-[8%] lg:w-[74vw] ml-48 fade-in"
            />
          </div>
        </div>

        <div className="relative mt-10  z-20 flex w-full items-start justify-center bg-linear-to-b from-black/80 to-black">
          <div className="grid grid-cols-6 w-full justify-center gap-y-6">
            {!isMobile && (
              <span className="col-span-6 font-extrabold text-white text-base mb-2 flex w-full justify-center gap-2 mt-6">
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
                {hero.partnerLabel}
              </span>
            )}
            {isMobile ? (
              <>
                <div className="flex flex-col justify-center col-span-6">
                  <img src={logoFptu} alt="Fpt University Logo" className="w-100 h-28 object-contain" />
                  <img src={fptLogoFixed} alt="Fpt logo 20 năm" className="w-100 h-36 object-contain" />
                  <img src={resfes2026} alt="2026 Resfes Logo" className="w-100 h-28 object-contain" />
                </div>
              </>
            ) : (
              <div className="flex justify-center col-span-6">
                <img src={logoFptu} alt="Fpt University Logo" className="w-100 h-28 object-contain" />
                <img src={fptLogoFixed} alt="Fpt logo 20 năm" className="w-100 h-36 object-contain" />
                <img src={resfes2026} alt="2026 Resfes Logo" className="w-100 h-28 object-contain" />
              </div>
            )}
            <div className="col-span-6 text-center text-2xl pb-18">
              <h1 className="font-thin text-white ">
                <span className="font-bold">{hero.closingLinePrimary}</span>
              </h1>
              <h1 className="font-bold text-white">{hero.closingLineSecondary}</h1>
            </div>
          </div>
        </div>
      </section >
    </>
  );
};
export default Hero;
