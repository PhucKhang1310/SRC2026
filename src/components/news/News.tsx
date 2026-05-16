import { newsData } from "../../data/newsData";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import fptLogo from "../../assets/fpt_logo.jpg";
import { useCheckMobile } from "../../hook/useCheckMobile";

const loopedNews = [...newsData, ...newsData, ...newsData];

const News = () => {
  const { isMobile } = useCheckMobile();
  const navigate = useNavigate();

  const topStory = loopedNews[0];

  return (
    <section
      id="news"
      className="flex flex-col items-center justify-center p-4 rounded-lg text-black scroll-mt-24 mt-10"
    >
      <div className="mb-10 text-center w-4/5">
        <h2 className="text-4xl font-bold text-black lg:text-5xl">News</h2>
        <div className="mt-3 font-thin text-sm text-black/70 lg:text-base">
          <p className="divider divider-neutral">Latest news about SRC2026</p>
        </div>
      </div>

      {isMobile ? (
        <div className="w-4/5 max-w-xl">
          <p className="text-xl font-semibold text-black mb-4">Top stories</p>

          <button
            type="button"
            onClick={() => navigate(`/news/${topStory.id}`)}
            className="w-full text-left"
          >
            <img
              src={fptLogo}
              alt="Top story"
              className="w-full h-64 object-cover"
            />
          </button>

          <div className="mt-6 space-y-4">
            {loopedNews.slice(1, 6).map((newsItem, index) => (
              <button
                key={`mobile-news-${index}-${newsItem.id}`}
                type="button"
                onClick={() => navigate(`/news/${newsItem.id}`)}
                className="w-full text-left flex gap-4 items-start"
              >
                <img
                  src={fptLogo}
                  alt="News thumbnail"
                  className="w-28 h-20 object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs text-blue-600 font-medium">SRC 2026</p>
                  <p className="mt-1 font-semibold text-black line-clamp-2">
                    {newsItem.title}
                  </p>
                </div>
              </button>
            ))}
            <button
              className="self-end w-45 hover:underline px-4 py-2 rounded cursor-pointer"
              onClick={() => navigate("/news-list")}
            >
              Read all news
              <FaArrowRight className="inline-block ml-2" />
            </button>
            <button
              className="self-end w-45 hover:underline px-4 py-2 rounded cursor-pointer"
              onClick={() => navigate("/news-list")}
            >
              Read all news
              <FaArrowRight className="inline-block ml-2" />
            </button>
          </div>

          <button
            type="button"
            className="mt-6 w-full text-blue-600 px-4 py-2 rounded cursor-pointer text-left"
            onClick={() => navigate("/news-list")}
          >
            Read all news
            <FaArrowRight className="inline-block ml-2" />
          </button>
        </div>
      ) : (
        <div className="relative w-2/3 mx-auto">
          <div className="flex w-full gap-4 items-stretch">
            <a href={`/news-list/${topStory.id}`} className="flex-1 flex flex-col p-2 pt-0">
              <img src={fptLogo} alt="Special News Image" className="w-full object-cover flex-1" />
              <span className="block mt-4 font-semibold text-lg">
                {topStory.title}
              </span>
              <p className="mt-2 line-clamp-2 text-md text-gray-500">
                {topStory.description}
              </p>
            </a>

            <div className="flex-1 flex flex-col p-2 pt-0 justify-between">
              {newsData.slice(0, 3).map((newsItem, index) => (
                <a
                  key={`news-item-${index}-${newsItem.id}`}
                  href={`/news-list/${newsItem.id}`}
                  className="flex gap-4"
                >
                  <img
                    src={fptLogo}
                    alt="News Image"
                    className="w-55 h-35 object-cover shrink-0"
                  />
                  <div className="flex flex-col justify-start gap-1">
                    <span className="font-semibold line-clamp-3">
                      {newsItem.title}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm">{newsItem.author}</span>
                      <span className="font-thin">
                        {new Date(newsItem.date).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
              <button
                className="self-end hover:underline px-4 py-2 rounded cursor-pointer"
                onClick={() => navigate("/news-list")}
              >
                Read all news
                <FaArrowRight className="inline-block ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default News;
