import { FaEnvelope, FaFacebookF, FaPhone } from "react-icons/fa6";
import fptUniversityLogo from '../../assets/logo-fptu.png'
import fptLogoFixed from '../../assets/fpt_logo-removebg-preview_cropped.png'
import resfes2026 from '../../assets/logo_src_white_nobg.png'
import { useCheckMobile } from "../../hook/useCheckMobile";
import { usePageContent } from "../../hook/usePageContent";

const Footer = () => {
  const { isMobile } = useCheckMobile();
  const { content } = usePageContent();
  const footer = content?.footer;

  if (!footer) {
    return null;
  }
  return (
    <div
      id="footer"
      className="flex flex-col items-center bg-neutral scroll-mt-24 w-full"
    >
      <footer className={`${isMobile ? "" : "w-4/5 max-w-7xl"} flex flex-col footer sm:footer-horizontal bg-neutral text-neutral-content p-10 w-full`}>
        <div className="w-full overflow-hidden relative py-4 max-w-full">
          {/* Optional fading edges */}
          <div className="absolute inset-y-0 left-0 w-8 lg:w-20 bg-linear-to-r from-neutral to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-8 lg:w-20 bg-linear-to-l from-neutral to-transparent z-10"></div>

          <div className="flex w-max animate-marquee">
            {/* Set 1 */}
            <div className="flex min-w-screen md:min-w-[80vw] lg:min-w-7xl shrink-0 items-center justify-around px-4">
              <img src={fptUniversityLogo} className="h-20 sm:h-24 lg:h-28 scale-110 object-contain" alt="FPTU logo" />
              <img src={fptLogoFixed} className="h-28 sm:h-32 lg:h-36 scale-110 object-contain" alt="FPT 20 years logo" />
              <img src={resfes2026} className="h-20 sm:h-24 lg:h-28 scale-110 object-contain" alt="resfes2026 logo" />
            </div>
            {/* Set 2 */}
            <div className="flex min-w-screen md:min-w-[80vw] lg:min-w-7xl shrink-0 items-center justify-around px-4" aria-hidden="true">
              <img src={fptUniversityLogo} className="h-20 sm:h-24 lg:h-28 scale-110 object-contain" alt="FPTU logo" />
              <img src={fptLogoFixed} className="h-28 sm:h-32 lg:h-36 scale-110 object-contain" alt="FPT 20 years logo" />
              <img src={resfes2026} className="h-20 sm:h-24 lg:h-28 scale-110 object-contain" alt="resfes2026 logo" />
            </div>
          </div>
        </div>

        <div className="w-full h-px font-bold bg-white text-2xl lg:text-base "></div>


        <aside className="w-full flex lg:flex-row md:flex-row justify-between">
          <div className=" font-bold text-2xl">
            {footer.headlineOne}
            <p className="font-thin"> {footer.headlineTwo}</p>
            <p className="text-4xl mt-3 font-medium">{footer.headlineThree}</p>
            <br />
            <div className={`flex ${isMobile ? "flex-col max-w-xs" : ""} gap-5`}>
              <a
                href="/register"
                target="_blank"
                rel="noreferrer"
                className="btn mt-2 rounded-full border-0 bg-orange-600 px-8 text-white hover:bg-orange-600/90"
              >
                {footer.ctaLabel}
              </a>
            </div>
          </div>
          <nav className={`${isMobile ? "" : "justify-self-end"}`}>
            {!isMobile && <p className="font-bold text-2xl mb-3">{footer.contactHeading}</p>}
            <div className="flex sm:flex-col gap-5 mt-2">
              <a
                href={footer.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 transition hover:text-orange-500"
              >
                <FaFacebookF className="text-lg" />
                {!isMobile && <span>{footer.facebookLabel}</span>}
              </a>
              <a
                href={`mailto:${footer.email}`}
                target="_blank"
                className="flex items-center gap-3 transition hover:text-orange-500"
              >
                <FaEnvelope className="text-lg" />
                {!isMobile && <span>{footer.emailLabel}</span>}
              </a>
              <a
                target="_blank"
                href={`tel:${footer.phone}`}
                className="flex items-center gap-3 transition hover:text-orange-500"
              >
                <FaPhone className="text-lg" />
                {!isMobile && <span>{footer.phoneLabel}</span>}
              </a>
            </div>
          </nav>
        </aside>
      </footer>
      <div className="flex w-full justify-center">
        <div className="divider w-2/3" />
      </div>
      <p className="font-thin opacity-40 text-sm pb-1">
        {footer.copyrightLine}
      </p>
      <p className="font-thin opacity-40 text-sm pb-20">{footer.rightsLine}</p>
    </div>
  );
};
export default Footer;
