import { Fragment, useEffect } from "react";
import type { ReactNode } from "react";
import AboutUs from "./components/about/AboutUs";
import Awards from "./components/awards/Awards";
import Footer from "./components/footer/Footer";
import Hero from "./components/hero/Hero";
import Milestones from "./components/milestones/Milestones";
import NavBar from "./components/navbar/NavBar";
import Regulations from "./components/regulations/Regulations";
import ResearchFields from "./components/research/ResearchFields";
import LazyWrapper from "./components/wrapper/LazyWrapper";
import News from "./pages/news/News";
import Publications from "./pages/publications/Publications";
import Workshops from "./components/workshops/Workshops";
import { usePageContent } from "./hook/usePageContent";
import {
  defaultPageLayout,
  type PageSectionKind,
} from "./data/contentData";

const sectionComponents: Record<PageSectionKind, () => ReactNode> = {
  hero: () => <Hero />,
  about: () => <AboutUs />,
  research: () => <ResearchFields />,
  awards: () => <Awards />,
  regulations: () => <Regulations />,
  milestones: () => <Milestones />,
  news: () => <News />,
  publications: () => <Publications />,
  workshops: () => (
    <LazyWrapper id="workshops">
      <Workshops />
    </LazyWrapper>
  ),
  footer: () => <Footer />,
};

const App = () => {
  const { content } = usePageContent();
  const layout = content?.layout ?? defaultPageLayout;

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        // Use a requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          const element = document.querySelector(hash);
          if (element) {
            // Get the element's position
            const offsetTop = element.getBoundingClientRect().top + window.scrollY;
            // Adjust for fixed na  vbar height (approximately 64px)
            const scrollTarget = Math.max(0, offsetTop - 80);

            window.scrollTo({
              top: scrollTarget,
              behavior: "smooth",
            });
          }
        });
      }
    };

    // Handle hash change events
    window.addEventListener("hashchange", scrollToHash);

    // Handle initial page load with hash
    if (window.location.hash) {
      // Use setTimeout to ensure components are mounted
      const timer = setTimeout(scrollToHash, 500);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("hashchange", scrollToHash);
      };
    }

    return () => {
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  return (
    <>
      <NavBar />
      {layout
        .filter((section) => section.enabled)
        .map((section) => (
          <Fragment key={section.id}>
            {sectionComponents[section.id]()}
          </Fragment>
        ))}
    </>
  );
};
export default App;
