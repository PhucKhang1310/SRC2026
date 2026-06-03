import { useEffect } from "react";
import AboutUs from "./components/about/AboutUs";
import Awards from "./components/awards/Awards";
import Footer from "./components/footer/Footer";
import Hero from "./components/hero/Hero";
import Milestones from "./components/milestones/Milestones";
import NavBar from "./components/navbar/NavBar";
import Regulations from "./components/regulations/Regulations";
import ResearchFields from "./components/research/ResearchFields";
import News from "./components/news/News";
import Publications from "./components/publications/Publications";
import Workshops from "./components/workshops/Workshops";
import LazyWrapper from "./components/wrapper/LazyWrapper";
import { PageContentProvider } from "./context/PageContentContext";

const App = () => {
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
    <PageContentProvider>
      <NavBar />
      <Hero />
      <AboutUs />
      <ResearchFields />
      <Awards />
      <Regulations />
      <Milestones />
      <News />
      <Publications />
      <LazyWrapper id="workshops">
        <Workshops />
      </LazyWrapper>
      <Footer />
    </PageContentProvider>
  );
};
export default App;
