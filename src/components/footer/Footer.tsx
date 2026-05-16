import { FaEnvelope, FaFacebookF, FaPhone } from "react-icons/fa6";
import fptUniversityLogo from '../../assets/logo-fptu.png'
import fptLogoFixed from '../../assets/fpt_logo-removebg-preview_cropped.png'
// import resfes2025 from '../../assets/2025-RES FES-VUÔNG-WHITE.png'
import resfes2026 from '../../assets/logo_src_white_nobg.png'
import { useCheckMobile } from "../../hook/useCheckMobile";

const Footer = () => {
  const { isMobile } = useCheckMobile();
  return (
    <div
      id="footer"
      className="flex flex-col items-center justify-center bg-neutral scroll-mt-24 "
    >
      <footer className={`${isMobile ? "" : "w-4/5"} flex flex-col footer sm:footer-horizontal bg-neutral text-neutral-content p-10`}>
        <div className="flex md:flex-row lg:flex-row flex-col items-center justify-between">
          <img src={fptUniversityLogo} className="w-100 h-28 scale-110 object-contain" alt="FPTU logo" />
          <img src={fptLogoFixed} className="w-100 h-36 scale-110 object-contain" alt="FPT 20 years logo" />
          <img src={resfes2026} className="w-100 h-28 scale-110 object-contain" alt="resfes2026 logo" />
        </div>

        <div className="w-full h-px font-bold bg-white text-2xl lg:text-base "></div>


        <aside className="w-full flex lg:flex-row md:flex-row justify-between">
          <div className=" font-bold text-2xl">
            Think bigger
            <p className="font-thin"> Build Smarter</p>
            <p className="text-4xl mt-3 font-medium">Join SRC</p>
            <br />
            <div className={`flex ${isMobile ? "flex-col" : ""} gap-5`}>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScEo6HgWxAHJbjeiE2MoVAMRfM1ltmtt3hTJZ0cza6Pz4F1HQ/viewform"
                target="_blank"
                rel="noreferrer"
                className="btn mt-2 rounded-full border-0 bg-orange-600 px-8 text-white hover:bg-orange-600/90"
              >
                Register FPTers
              </a>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScZllL6Ewl8_tId9eMffO2UgYer41U3_6LjW0-SmYNVi2ocnw/viewform"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline mt-2 rounded-full bg-transparent px-8 text-white hover:bg-amber-50 hover:text-black"
              >
                Register Non-FPTers
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
