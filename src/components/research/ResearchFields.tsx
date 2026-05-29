import { useRef, useState } from "react";
import { useFadeIn } from "../../hook/useFadeIn";
import ResearchAccordion from "./ResearchAccordion";
import ResearchCarousel from "./ResearchCarousel";
import { useCheckMobile } from "../../hook/useCheckMobile";
import ResearchFieldsMobile from "./ResearchFieldMobile";
import { useEditableContent } from "../../hook/useEditableContent";

const ResearchFields = () => {
  const { isMobile } = useCheckMobile();
  const { researchTitle, researchFields } = useEditableContent();
  const [activeField, setActiveField] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { inView, ref } = useFadeIn();

  const handleAccordionChange = (index: number) => {
    setActiveField(index);

    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        top: index * carouselRef.current.clientHeight,
        behavior: "smooth",
      });
    }
  };

  const handleCarouselScroll = () => {
    if (!carouselRef.current) {
      return;
    }

    const index = Math.round(
      carouselRef.current.scrollTop / carouselRef.current.clientHeight
    );

    if (index !== activeField) {
      setActiveField(index);
    }
  };

  if (isMobile) {
    return (
      <ResearchFieldsMobile
        activeField={activeField}
        onAccordionChange={handleAccordionChange}
        fields={researchFields}
        title={researchTitle}
      />
    )
  }

  return (
    <div
      id="research-fields"
      ref={ref}
      className={`flex flex-col justify-center items-center pt-10 pb-20 bg-amber-50 scroll-mt-24
        ${inView ? "fade-in" : "opacity-0"}`}
    >
      <span className="divider before:bg-black/60 after:bg-black/60 mt-20 font-extrabold text-sm text-black flex gap-3 w-3/4 self-center">
        <svg
          viewBox="0 0 292.828 292.828"
          xmlns="http://www.w3.org/2000/svg"
          width="25"
        >
          <polygon
            points="256.756,99.709 256.74,231.242 25.509,0 0,25.509 231.247,256.756 99.709,256.756 99.709,292.828 292.828,292.828 292.828,99.709"
            fill="#000000"
          />
        </svg>
        {researchTitle}
      </span>
      <div className="flex gap-10 mt-10 items-center w-2/3">
        <ResearchAccordion
          activeField={activeField}
          onAccordionChange={handleAccordionChange}
          fields={researchFields}
        />
        <div className="divider divider-horizontal divider-neutral " />
        <ResearchCarousel
          carouselRef={carouselRef}
          onScroll={handleCarouselScroll}
          fields={researchFields}
        />
      </div>
    </div>
  );
};
export default ResearchFields;
