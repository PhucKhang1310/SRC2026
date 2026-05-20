import { useRef, useCallback } from "react";
import { FaMedal, FaTrophy, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useFadeIn } from "../../hook/useFadeIn";

interface AwardTier {
  label: string;
  amount: string;
  count: number;
  icon: "trophy" | "medal";
  color: string;
}

interface SubCommittee {
  name: string;
  nameVi: string;
  color: string;
  accentGradient: string;
  borderColor: string;
  standardAwards: AwardTier[];
  smallAwards: AwardTier[];
  expandedNote?: string;
  expandedAwards?: AwardTier[];
}

const subCommittees: SubCommittee[] = [
  {
    name: "Information Technology",
    nameVi: "Công nghệ thông tin",
    color: "from-blue-500 to-cyan-400",
    accentGradient: "from-blue-500/20 to-cyan-400/10",
    borderColor: "border-blue-400/30",
    standardAwards: [
      { label: "1st Prize", amount: "10,000,000 VND", count: 1, icon: "trophy", color: "text-yellow-300" },
      { label: "2nd Prize", amount: "6,000,000 VND", count: 1, icon: "medal", color: "text-gray-300" },
      { label: "3rd Prize", amount: "4,000,000 VND", count: 1, icon: "medal", color: "text-amber-600" },
    ],
    smallAwards: [
      { label: "Khơi nguồn Tri thức", amount: "6,000,000 VND", count: 1, icon: "medal", color: "text-white" },
    ],
    expandedNote: "If 10+ final presentations, award structure expands:",
    expandedAwards: [
      { label: "1st Prize", amount: "10,000,000 VND", count: 1, icon: "trophy", color: "text-yellow-300" },
      { label: "2nd Prize", amount: "6,000,000 VND", count: 2, icon: "medal", color: "text-gray-300" },
      { label: "3rd Prize", amount: "4,000,000 VND", count: 2, icon: "medal", color: "text-amber-600" },
    ],
  },
  {
    name: "Semiconductor IC & Digital Automotive",
    nameVi: "Vi mạch bán dẫn và ô tô số",
    color: "from-indigo-500 to-blue-400",
    accentGradient: "from-indigo-500/20 to-blue-400/10",
    borderColor: "border-indigo-400/30",
    standardAwards: [
      { label: "1st Prize", amount: "10,000,000 VND", count: 1, icon: "trophy", color: "text-yellow-300" },
      { label: "2nd Prize", amount: "6,000,000 VND", count: 1, icon: "medal", color: "text-gray-300" },
      { label: "3rd Prize", amount: "4,000,000 VND", count: 1, icon: "medal", color: "text-amber-600" },
    ],
    smallAwards: [
      { label: "Khơi nguồn Tri thức", amount: "6,000,000 VND", count: 1, icon: "medal", color: "text-white" },
    ],
  },
  {
    name: "Graphic Design & Digital Art, Multimedia Communication",
    nameVi: "Thiết kế đồ hoạ & mỹ thuật số, Công nghệ truyền thông",
    color: "from-pink-500 to-rose-400",
    accentGradient: "from-pink-500/20 to-rose-400/10",
    borderColor: "border-pink-400/30",
    standardAwards: [
      { label: "1st Prize", amount: "10,000,000 VND", count: 1, icon: "trophy", color: "text-yellow-300" },
      { label: "2nd Prize", amount: "6,000,000 VND", count: 1, icon: "medal", color: "text-gray-300" },
      { label: "3rd Prize", amount: "4,000,000 VND", count: 1, icon: "medal", color: "text-amber-600" },
    ],
    smallAwards: [
      { label: "Khơi nguồn Tri thức", amount: "6,000,000 VND", count: 1, icon: "medal", color: "text-white" },
    ],
  },
  {
    name: "Economics & Business Administration",
    nameVi: "Kinh tế & Quản trị kinh doanh",
    color: "from-emerald-500 to-teal-400",
    accentGradient: "from-emerald-500/20 to-teal-400/10",
    borderColor: "border-emerald-400/30",
    standardAwards: [
      { label: "1st Prize", amount: "10,000,000 VND", count: 1, icon: "trophy", color: "text-yellow-300" },
      { label: "2nd Prize", amount: "6,000,000 VND", count: 1, icon: "medal", color: "text-gray-300" },
      { label: "3rd Prize", amount: "4,000,000 VND", count: 1, icon: "medal", color: "text-amber-600" },
    ],
    smallAwards: [
      { label: "Khơi nguồn Tri thức", amount: "6,000,000 VND", count: 1, icon: "medal", color: "text-white" },
    ],
  },
  {
    name: "Languages (English & Japanese)",
    nameVi: "Ngôn ngữ (Ngôn ngữ Anh, Ngôn ngữ Nhật)",
    color: "from-violet-500 to-purple-400",
    accentGradient: "from-violet-500/20 to-purple-400/10",
    borderColor: "border-violet-400/30",
    standardAwards: [
      { label: "1st Prize", amount: "10,000,000 VND", count: 1, icon: "trophy", color: "text-yellow-300" },
      { label: "2nd Prize", amount: "6,000,000 VND", count: 1, icon: "medal", color: "text-gray-300" },
      { label: "3rd Prize", amount: "4,000,000 VND", count: 1, icon: "medal", color: "text-amber-600" },
    ],
    smallAwards: [
      { label: "Khơi nguồn Tri thức", amount: "6,000,000 VND", count: 1, icon: "medal", color: "text-white" },
    ],
  },
];

const AwardCard = ({ award }: { award: AwardTier }) => (
  <div className="flex flex-col items-center gap-1 rounded-xl bg-white/5 backdrop-blur-sm px-4 py-4 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-105">
    {award.icon === "trophy" ? (
      <FaTrophy className={`text-2xl sm:text-3xl ${award.color} drop-shadow-lg`} />
    ) : (
      <FaMedal className={`text-2xl sm:text-3xl ${award.color} drop-shadow-lg`} />
    )}
    <p className={`text-sm sm:text-base font-bold ${award.color}`}>
      {award.count > 1 ? `${award.count}x ` : ""}
      {award.label}
    </p>
    <p className="text-xs sm:text-sm font-semibold text-white/80">{award.amount}</p>
  </div>
);

const AwardSlide = ({ sc }: { sc: SubCommittee }) => (
  <div
    className={`rounded-box backdrop-blur-xl p-6 sm:p-8 md:p-10 w-[85vw] max-w-3xl`}
  >
    <div className="text-center mb-8">
      <div
        className={`inline-block bg-linear-to-r ${sc.color} bg-clip-text text-transparent text-lg sm:text-xl md:text-2xl font-extrabold tracking-wide`}
      >
        {sc.name}
      </div>
      <p className="text-white/40 text-xs sm:text-sm mt-1 italic">
        {sc.nameVi}
      </p>
    </div>

    <div className="mb-6">
      <p className="text-center text-xs sm:text-sm text-yellow-300/80 font-semibold mb-4 tracking-wide uppercase">
        ★ 6+ topics at the Final Round ★
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-xl mx-auto">
        {sc.standardAwards.map((award, i) => (
          <AwardCard key={`std-${i}`} award={award} />
        ))}
      </div>
    </div>

    <div className="mb-4">
      <p className="text-center text-xs sm:text-sm text-white/50 font-semibold mb-3 tracking-wide uppercase">
        4–5 topics at the Final Round
      </p>
      <div className="flex justify-center">
        <div className="max-w-50 w-full">
          {sc.smallAwards.map((award, i) => (
            <AwardCard key={`small-${i}`} award={award} />
          ))}
        </div>
      </div>
    </div>

    {sc.expandedNote && sc.expandedAwards && (
      <div
        className={`mt-6 rounded-xl border ${sc.borderColor} bg-white/5 backdrop-blur-sm p-4 sm:p-5`}
      >
        <p className="text-amber-200 text-xs sm:text-sm font-semibold mb-3 text-center">
          ⚡ {sc.expandedNote}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
          {sc.expandedAwards.map((award, i) => (
            <AwardCard key={`exp-${i}`} award={award} />
          ))}
        </div>
      </div>
    )}
  </div>
);

// Triple the items: [clone set] [real set] [clone set] for seamless infinite loop
const loopedItems = [...subCommittees, ...subCommittees, ...subCommittees];
const REAL_COUNT = subCommittees.length;
const REAL_START = REAL_COUNT; // real items start at index 5 (middle set)

function scrollToChild(el: HTMLDivElement, childIdx: number, behavior: ScrollBehavior = "instant") {
  const child = el.children[childIdx] as HTMLElement;
  if (!child) return;
  el.scrollTo({
    left: child.offsetLeft - (el.offsetWidth - child.offsetWidth) / 2,
    behavior,
  });
}

const Awards = () => {
  const { inView, ref } = useFadeIn(0.15, 80);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isResetting = useRef(false);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitialized = useRef(false);

  // Position to first real item (middle set, index REAL_START)
  const initRef = useCallback((node: HTMLDivElement | null) => {
    if (!node || hasInitialized.current) return;
    carouselRef.current = node;
    hasInitialized.current = true;
    requestAnimationFrame(() => scrollToChild(node, REAL_START));
  }, []);

  const getClosestIdx = useCallback((el: HTMLDivElement) => {
    const centerX = el.scrollLeft + el.offsetWidth / 2;
    const children = Array.from(el.children) as HTMLElement[];

    let closestIdx = 0;
    let closestDist = Infinity;
    children.forEach((child, i) => {
      const dist = Math.abs(child.offsetLeft + child.offsetWidth / 2 - centerX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });
    return closestIdx;
  }, []);

  // When scrolling stops, if we're in a clone set, jump to the equivalent real item
  const handleScrollEnd = useCallback(() => {
    const el = carouselRef.current;
    if (!el || isResetting.current) return;

    const closestIdx = getClosestIdx(el);

    // If in the first clone set (0..REAL_COUNT-1), jump to the real set
    if (closestIdx < REAL_START) {
      isResetting.current = true;
      scrollToChild(el, closestIdx + REAL_COUNT);
      requestAnimationFrame(() => { isResetting.current = false; });
    }
    // If in the last clone set (REAL_START+REAL_COUNT .. end), jump to the real set
    else if (closestIdx >= REAL_START + REAL_COUNT) {
      isResetting.current = true;
      scrollToChild(el, closestIdx - REAL_COUNT);
      requestAnimationFrame(() => { isResetting.current = false; });
    }
  }, [getClosestIdx]);

  const handlePrev = useCallback(() => {
    const el = carouselRef.current;
    if (!el || isResetting.current) return;
    const currentIdx = getClosestIdx(el);
    scrollToChild(el, Math.max(0, currentIdx - 1), "smooth");
  }, [getClosestIdx]);

  const handleNext = useCallback(() => {
    const el = carouselRef.current;
    if (!el || isResetting.current) return;
    const currentIdx = getClosestIdx(el);
    scrollToChild(el, Math.min(el.children.length - 1, currentIdx + 1), "smooth");
  }, [getClosestIdx]);

  const onScroll = useCallback(() => {
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(handleScrollEnd, 100);
  }, [handleScrollEnd]);

  return (
    <section
      id="awards"
      ref={ref}
      className="bg-black py-20 pt-30 scroll-mt-24"
    >
      <div
        className={`mx-auto w-full ${inView ? "fade-in" : "opacity-0"
          }`}
      >
        <div className="divider font-extrabold text-sm text-white! before:bg-amber-50/15! after:bg-amber-50/15! max-w-6xl mx-auto px-6">
          AWARDS
        </div>

        {/* DaisyUI Carousel - center snap, 30px bleed, infinite loop */}
        <div className="relative mx-auto mt-12 w-[calc(85vw+60px)] max-w-207">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            aria-label="Previous sub-committee"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-110 shadow-lg"
          >
            <FaChevronLeft className="text-sm sm:text-base mr-1" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next sub-committee"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-110 shadow-lg"
          >
            <FaChevronRight className="text-sm sm:text-base ml-1" />
          </button>

          <div
            ref={initRef}
            onScroll={onScroll}
            className="carousel carousel-center rounded-box w-full items-center space-x-4 p-4"
          >
            {loopedItems.map((sc, i) => (
              <div className="carousel-item" key={i}>
                <AwardSlide sc={sc} />
              </div>
            ))}
          </div>
        </div>

        {/* Important note */}
        <p className="italic text-sm font-thin text-white/35 justify-self-center mt-10 max-w-5xl text-center mx-auto px-6">
          Important: Teams that submit papers on time must present at the Final
          Round and attend the full program, especially the closing ceremony.
          Absence may affect award structure and can lead to cancellation of the
          team's result.
        </p>
      </div>
    </section>
  );
};

export default Awards;
