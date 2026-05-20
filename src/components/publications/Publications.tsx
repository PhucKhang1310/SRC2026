import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { publicationsData } from "../../data/publicationsData";
import { useCheckMobile } from "../../hook/useCheckMobile";

const Publications = () => {
  const navigate = useNavigate();
  const { isMobile } = useCheckMobile();
  const latestPubs = publicationsData.slice(0, 3);

  return (
    <section
      id="publications"
      className="flex flex-col items-center justify-center px-4 py-16 text-black scroll-mt-24"
    >
      {/* Section header */}
      <div className="mb-12 w-4/5 max-w-5xl text-center">
        <p className="divider divider-neutral text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
          Latest Posts
        </p>
      </div>

      {/* Publication cards */}
      <div className="flex w-4/5 max-w-5xl flex-col gap-16">
        {latestPubs.map((pub, index) => (
          <article
            key={pub.id}
            className={`flex ${isMobile ? "flex-col" : "flex-row"
              } gap-0 ${!isMobile && index % 2 !== 0 ? "flex-row-reverse" : ""
              }`}
          >
            {/* Journal cover image */}
            <div
              className={`${isMobile ? "w-full" : "w-[45%]"
                } shrink-0 overflow-hidden`}
            >
              <img
                src={pub.image}
                alt={pub.journalName}
                className="h-72 w-full object-cover transition-transform duration-500 hover:scale-105 md:h-80"
                loading="lazy"
              />
            </div>

            {/* Content card — overlaps the image slightly on desktop */}
            <div
              className={`relative flex flex-1 flex-col justify-center bg-white px-8 py-8 shadow-lg ${isMobile
                ? "-mt-6 mx-4 rounded-md"
                : index % 2 !== 0
                  ? "-mr-8 rounded-l-md"
                  : "-ml-8 rounded-r-md"
                }`}
              style={
                !isMobile
                  ? { marginTop: "2rem", marginBottom: "2rem" }
                  : undefined
              }
            >
              <span className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">
                Top Pick
              </span>
              <h3 className="mb-3 text-xl font-bold leading-tight text-gray-900 md:text-2xl line-clamp-4">
                {pub.title}
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-gray-600 line-clamp-3">
                {pub.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  {new Date(pub.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <button
                  type="button"
                  className="group flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 transition-colors hover:text-teal-600 cursor-pointer"
                  onClick={() =>
                    navigate(
                      pub.newsId
                        ? `/news-list/${pub.newsId}`
                        : "/news-list"
                    )
                  }
                >
                  Keep Reading
                  <FaArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* View all link */}
      <button
        type="button"
        className="mt-12 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500 transition-colors hover:text-black cursor-pointer"
        onClick={() => navigate("/publications")}
      >
        View all publications
        <FaArrowRight className="size-3.5" />
      </button>
    </section>
  );
};

export default Publications;
