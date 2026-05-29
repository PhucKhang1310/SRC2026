import { useEffect, useRef, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import MobileMenu from "./MobileMenu";
import { useCheckMobile } from "../../hook/useCheckMobile";
import fptLogoFixed from "../../assets/fpt_logo-removebg-preview_cropped.png";

const NavBar = () => {
  const { isMobile } = useCheckMobile();
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const previousScrollY = useRef(0);

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

  if (!isMobile) {
    return (
      <header
        className={`fixed inset-x-0 top-0 z-30 transition-transform duration-300 ${isAtTop ? "shadow-none" : "shadow-xl"
          } ${isHidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div
          className={`${isAtTop ? "bg-transparent" : "bg-[#ff6a1f]"
            } border-b border-white/20 transition-colors duration-500`}
        >
          <div className="mx-auto w-full max-w-7xl px-6 py-4 lg:px-8">
            <div className="navbar text-black!">
              <div className="navbar-start flex items-center gap-6 ">
                <a
                  href="/home"
                  className="inline-flex items-center justify-center leading-none"
                >
                  <img
                    src={fptLogoFixed}
                    className="block h-15 w-auto object-contain scale-180 "
                  />
                </a>
                <ul className="menu menu-horizontal text-white px-1 [&>li>a]:text-lg [&>li>a]:font-thin [&>li>a]:hover:bg-transparent [&>li>a]:hover:text-amber-200 [&>li>a]:transition-all">
                  <li>
                    <a href="/home#about">About</a>
                  </li>
                  <li>
                    <a href="/home#research-fields">Research Fields</a>
                  </li>
                  <li>
                    <a href="/home#regulations">Regulations</a>
                  </li>
                  <li>
                    <a href="/home#milestones">Milestones</a>
                  </li>
                </ul>
              </div>
              <div className="navbar-end">
                <ul className="menu menu-horizontal text-white px-1 [&>li>a]:text-lg [&>li>a]:font-thin [&>li>a]:hover:bg-transparent [&>li>a]:hover:text-amber-200 [&>li>a]:transition-all">
                  <li>
                    <a href="/home#news">News</a>
                  </li>
                  <li>
                    <a href="/publications">Publications</a>
                  </li>
                  <li>
                    <a href="/mentors">Mentors</a>
                  </li>
                  <li>
                    <a href="/submit">Submit</a>
                  </li>
                </ul>
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

        <a href="/home" className="inline-flex items-center leading-none">
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
