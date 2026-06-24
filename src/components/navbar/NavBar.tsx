import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import MobileMenu from "./MobileMenu";
import { useCheckMobile } from "../../hook/useCheckMobile";
import fptLogoFixed from "../../assets/fpt_logo-removebg-preview_cropped.png";
import { useUser } from "../../hook/useUser";

const NavBar = () => {
  const { user } = useUser();
  const { isMobile } = useCheckMobile();
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = useCallback((sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      // Wait for the home page to render, then scroll
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.pathname, navigate]);
  const [isHidden, setIsHidden] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const previousScrollY = useRef(0);
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsAtTop(currentScrollY <= 0);

      if (currentScrollY <= 0) {
        setIsHidden(false);
      } else if (currentScrollY > previousScrollY.current) {
        setIsHidden(true);
      } else if (currentScrollY < previousScrollY.current) {
        setIsHidden(false);
      }

      previousScrollY.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      queueMicrotask(() => setIsMenuOpen(false));
    }
  }, [isMobile]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        dropdownRef.current.removeAttribute("open");
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (!isMobile) {
    return (
      <header
        className={`fixed inset-x-0 top-0 z-30 transition-transform duration-300 ${isAtTop ? "shadow-none" : "shadow-xl"
          } ${isHidden && !isDropdownOpen ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div
          className={`${isAtTop ? "bg-transparent" : "bg-[#ff6a1f]"
            } border-b border-white/20 transition-colors duration-500`}
        >
          <div className="mx-auto w-full max-w-7xl px-6 py-4 lg:px-8">
            <div className="navbar text-black!">
              <div className="navbar-start flex items-center gap-6">
                <a
                  href="/"
                  className="inline-flex items-center justify-center leading-none"
                >
                  <img
                    src={fptLogoFixed}
                    className="block h-15 w-auto object-contain scale-180"
                  />
                </a>
                <ul className="menu menu-horizontal text-white px-1 [&>li>button]:text-lg [&>li>button]:font-thin [&>li>button]:hover:bg-transparent [&>li>button]:hover:text-amber-200 [&>li>button]:transition-all [&>li>button]:cursor-pointer">
                  <li><button onClick={() => scrollToSection("about")}>About</button></li>
                  <li><button onClick={() => scrollToSection("research-fields")}>Research Fields</button></li>
                  <li><button onClick={() => scrollToSection("regulations")}>Regulations</button></li>
                  <li><button onClick={() => scrollToSection("milestones")}>Milestones</button></li>
                  <li><button onClick={() => scrollToSection("news")}>News</button></li>
                </ul>
              </div>
              <div className="navbar-end">
                <details ref={dropdownRef} className="dropdown dropdown-end" onToggle={(e) => setIsDropdownOpen((e.currentTarget as HTMLDetailsElement).open)}>
                  <summary className="btn btn-ghost btn-circle">
                    <RxHamburgerMenu size={24} color="white" />
                  </summary>
                  <ul className="dropdown-content menu bg-base-100 text-base-content rounded-box z-50 mt-3 w-52 p-2 shadow-lg border border-base-300" onClick={() => dropdownRef.current?.removeAttribute("open")}>
                    <li><a href="/publications">Publications</a></li>
                    <li><a href="/mentors">Mentors</a></li>
                    <li><a href="/submit">Submit</a></li>
                    <div className="divider my-0"></div>
                    <li><a href="/auth/login">Login</a></li>
                    {user && (
                      <li><a href="/admin">Admin</a></li>
                    )}
                  </ul>
                </details>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`h-0.5 transition-colors duration-500 ${isAtTop ? "bg-transparent shadow-none" : "bg-[#ff6a1f] shadow-md"
            }`}
        />
      </header>
    );
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-30 flex items-center gap-4 px-6 py-4 lg:px-10 transition-all duration-200 ${isHidden ? "-translate-y-full" : "translate-y-0"
          } ${isAtTop ? "bg-black" : "bg-[#ff6a1f]"} `}
      >
        <button
          type="button"
          className="btn btn-ghost btn-sm text-amber-500"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
        >
          <RxHamburgerMenu size={25} color="white" />
        </button>

        <a href="/" className="inline-flex items-center leading-none">
          <img
            src={fptLogoFixed}
            className="block h-15 w-auto object-contain"
          />
        </a>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default NavBar;
