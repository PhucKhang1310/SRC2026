import { FaEnvelope, FaFacebookF, FaPhone } from "react-icons/fa6";
import fptUniversityLogo from '../../assets/logo-fptu.png'
import fptLogoFixed from '../../assets/fpt_logo-removebg-preview_cropped.png'
import resfes2025 from '../../assets/2025-RES FES-VUÔNG-WHITE.png'
import { useCheckMobile } from "../../hook/useCheckMobile";

const Footer = () => {
  const { isMobile } = useCheckMobile();
  return (
    <div
      id="footer"
      className="flex flex-col items-center bg-neutral scroll-mt-24 w-full"
    >
      <footer className={`${isMobile ? "" : "w-4/5 max-w-7xl"} flex flex-col footer sm:footer-horizontal bg-neutral text-neutral-content p-10 w-full`}>
        <div className="w-full overflow-hidden relative py-4 max-w-full">
          {/* Optional fading edges */}
          <div className="absolute inset-y-0 left-0 w-8 lg:w-20 bg-gradient-to-r from-neutral to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-8 lg:w-20 bg-gradient-to-l from-neutral to-transparent z-10"></div>
          
          <div className="flex w-max animate-marquee">
            {/* Set 1 */}
            <div className="flex min-w-[100vw] md:min-w-[80vw] lg:min-w-[1280px] shrink-0 items-center justify-around px-4">
              <img src={fptUniversityLogo} className="h-20 sm:h-24 lg:h-28 scale-110 object-contain" alt="FPTU logo" />
              <img src={fptLogoFixed} className="h-28 sm:h-32 lg:h-36 scale-110 object-contain" alt="FPT 20 years logo" />
              <img src={resfes2025} className="h-20 sm:h-24 lg:h-28 scale-110 object-contain" alt="resfes2025 logo" />
            </div>
            {/* Set 2 */}
            <div className="flex min-w-[100vw] md:min-w-[80vw] lg:min-w-[1280px] shrink-0 items-center justify-around px-4" aria-hidden="true">
              <img src={fptUniversityLogo} className="h-20 sm:h-24 lg:h-28 scale-110 object-contain" alt="FPTU logo" />
              <img src={fptLogoFixed} className="h-28 sm:h-32 lg:h-36 scale-110 object-contain" alt="FPT 20 years logo" />
              <img src={resfes2025} className="h-20 sm:h-24 lg:h-28 scale-110 object-contain" alt="resfes2025 logo" />
            </div>
          </div>
        </div>

        <div className="w-full h-px font-bold bg-white text-2xl lg:text-base "></div>


        <aside className="w-full flex lg:flex-row md:flex-row justify-between">
          <div className=" font-bold text-2xl">
            Think bigger
            <p className="font-thin"> Build Smarter</p>
            <p className="text-4xl mt-3 font-medium">Join SRC</p>
            <br />
            <div className={`flex ${isMobile ? "flex-col max-w-xs" : ""} gap-5`}>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScEo6HgWxAHJbjeiE2MoVAMRfM1ltmtt3hTJZ0cza6Pz4F1HQ/viewform"
                target="_blank"
                rel="noreferrer"
                className="btn mt-2 rounded-full border-0 bg-orange-600 px-8 text-white hover:bg-orange-600/90"
              >
                Register Now
              </a>
            </div>
          </div>
          <nav className={`${isMobile ? "" : "justify-self-end"}`}>
            {!isMobile && <p className="font-bold text-2xl mb-3">Contact us</p>}
            <div className="flex sm:flex-col gap-5 mt-2">
              <a
                href="https://www.facebook.com/fpt.resfes"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 transition hover:text-orange-500"
              >
                <FaFacebookF className="text-lg" />
                {!isMobile && <span>Follow us on Facebook</span>}
              </a>
              <a
                href="mailto:src@fe.edu.vn"
                className="flex items-center gap-3 transition hover:text-orange-500"
              >
                <FaEnvelope className="text-lg" />
                {!isMobile && <span>Email us at src@fe.edu.vn</span>}
              </a>
              <a
                href="tel:+842465549806"
                className="flex items-center gap-3 transition hover:text-orange-500"
              >
                <FaPhone className="text-lg" />
                {!isMobile && <span>(+84) 246.654.9806</span>}
              </a>
            </div>
          </nav>
        </aside>
      </footer>
      <div className="flex w-full justify-center">
        <div className="divider w-2/3" />
      </div>
      <p className="font-thin opacity-40 text-sm pb-1">
        © 2026 Student Research Competition
      </p>
      <p className="font-thin opacity-40 text-sm pb-20">All rights reserved</p>
    </div>
  );
};
export default Footer;
