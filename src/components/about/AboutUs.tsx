import { useState } from "react";
import resfesPlasma from "../../assets/resfes_plasma.jpg";
import resfesTour from "../../assets/resfes_tour.jpg";
import resfesWind from "../../assets/resfes_wind.jpg";
import resfesMentor from "../../assets/resfes_mentor.jpg";
import { useFadeIn } from "../../hook/useFadeIn";
import { useCheckMobile } from "../../hook/useCheckMobile";
import { FaChevronDown } from "react-icons/fa6";

const AboutUs = () => {
  const { isMobile } = useCheckMobile();
  const [showMore, setShowMore] = useState(isMobile ? false : true);
  const images = [resfesPlasma, resfesTour, resfesWind, resfesMentor];

  const [activeIndex, setActiveIndex] = useState(0);
  const { inView, ref } = useFadeIn();

  const handleCarouselScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const carousel = e.currentTarget;
    const itemHeight = carousel.scrollHeight / images.length;
    const activeIdx = Math.round(carousel.scrollTop / itemHeight);
    setActiveIndex(Math.min(activeIdx, images.length - 1));
  };

  const handleCarouselScrollHorizontal = (e: React.UIEvent<HTMLDivElement>) => {
    const carousel = e.currentTarget;
    const itemWidth = carousel.scrollWidth / images.length;
    const activeIdx = Math.round(carousel.scrollLeft / itemWidth);
    setActiveIndex(Math.min(activeIdx, images.length - 1));
  };

  const renderCarousel = () => {
    if (isMobile) {
      return (
        <div className="flex flex-col w-3/4 mt-20 items-center">
          <div
            className={`flex flex-col flex-1 gap-4 items-center justify-start`}
          >
            <div
              className="carousel carousel-horizontal rounded-box h-[90vh]"
              onScroll={handleCarouselScrollHorizontal}
            >
              <div className="carousel-item w-full h-full">
                <img className="object-cover" src={resfesPlasma} />
              </div>
              <div className="carousel-item w-full h-full">
                <img className="object-cover" src={resfesTour} />
              </div>
              <div className="carousel-item w-full h-full">
                <img className="object-cover" src={resfesWind} />
              </div>
              <div className="carousel-item w-full h-full">
                <img className="object-cover" src={resfesMentor} />
              </div>
            </div>
            <div className="flex gap-2 justify-center mt-4 mb-4">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-6 h-1 rounded transition-all ${index === activeIndex
                    ? "bg-gray-800 opacity-100"
                    : "bg-gray-300 opacity-50"
                    }`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 pl-8">
            <h3 className="text-3xl font-bold leading-tight text-black">
              Research-Based Learning, Real-World Impact
            </h3>
            <p className="text-base leading-8 text-black/75">
              <span className="font-semibold text-black">
                Research-Based Learning (RBL)
              </span>{" "}
              places students at the center of educational activity, shifting
              the focus from teacher-centered delivery to student-driven
              inquiry. Through active research practice, students strengthen
              core skills in problem definition, data collection, analysis, and
              evidence-based explanation.
            </p>
            {!showMore ? (
              <div className="">
                <p className="text-base leading-8 text-black/75">
                  At{" "}
                  <span className="font-semibold text-black">
                    Student Research Competition 2026
                  </span>
                  , students are encouraged to move from passive learners to
                  active participants in the scientific journey. SRC 2026
                  integrates RBL into major-specific curricula to cultivate
                  practical, relevant capabilities for each field.
                </p>
                <p className="text-base leading-8 text-black/75">
                  We encourage research teams across majors and sub-committees
                  to apply research-based learning in authentic contexts,
                  equipping students with the mindset and skills needed to meet
                  evolving industry demands.
                </p>
              </div>
            ) : (
              <div className="flex justify-center">
                <FaChevronDown
                  color="black"
                  onClick={() => setShowMore(!showMore)}
                />
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex w-3/4 mt-20 items-center">
        <div className={`flex flex-1 gap-4 items-center justify-start`}>
          <div className="flex flex-col gap-2 justify-center">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-1 h-6 rounded transition-all ${index === activeIndex
                  ? "bg-gray-800 opacity-100"
                  : "bg-gray-300 opacity-50"
                  }`}
              />
            ))}
          </div>
          <div
            className="carousel carousel-vertical rounded-box h-[90vh]"
            onScroll={handleCarouselScroll}
          >
            <div className="carousel-item h-full">
              <img className="object-cover" src={resfesPlasma} />
            </div>
            <div className="carousel-item h-full">
              <img className="object-cover" src={resfesTour} />
            </div>
            <div className="carousel-item h-full">
              <img className="object-cover" src={resfesWind} />
            </div>
            <div className="carousel-item h-full">
              <img className="object-cover" src={resfesMentor} />
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 pl-8">
          <h3 className="text-3xl font-bold leading-tight text-black">
            Research-Based Learning, Real-World Impact
          </h3>
          <p className="text-base leading-8 text-black/75">
            <span className="font-semibold text-black">
              Research-Based Learning (RBL)
            </span>{" "}
            places students at the center of educational activity, shifting the
            focus from teacher-centered delivery to student-driven inquiry.
            Through active research practice, students strengthen core skills in
            problem definition, data collection, analysis, and evidence-based
            explanation.
          </p>
          <p className="text-base leading-8 text-black/75">
            At{" "}
            <span className="font-semibold text-black">
              Student Research Competition 2026
            </span>
            , students are encouraged to move from passive learners to active
            participants in the scientific journey. SRC 2026 integrates RBL into
            major-specific curricula to cultivate practical, relevant
            capabilities for each field.
          </p>
          <p className="text-base leading-8 text-black/75">
            We encourage research teams across majors and sub-committees to
            apply research-based learning in authentic contexts, equipping
            students with the mindset and skills needed to meet evolving
            industry demands.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={ref}
      id="about"
      className={`flex bg-amber-50 flex-col justify-center items-center pb-10 scroll-mt-24 
        ${inView ? "fade-in" : "opacity-0"}`}
    >
      <span className="mt-20 font-extrabold text-xl text-black flex gap-3">
        <svg
          viewBox="0 0 292.828 292.828"
          xmlns="http://www.w3.org/2000/svg"
          width="15"
        >
          <polygon
            points="256.756,99.709 256.74,231.242 25.509,0 0,25.509 231.247,256.756 99.709,256.756 99.709,292.828 292.828,292.828 292.828,99.709"
            fill="#00000"
          />
        </svg>
        ABOUT SRC 2026
      </span>

      {renderCarousel()}
    </div>
  );
};
export default AboutUs;
