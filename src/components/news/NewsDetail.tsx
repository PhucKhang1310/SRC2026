import { Link, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { newsData } from "../../data/newsData";
import Navbar from "../navbar/NavBar";
import fptLogo from "../../assets/fpt_logo.jpg";
import Footer from "../footer/Footer";
import { useCheckMobile } from "../../hook/useCheckMobile";

const NewsDetail = () => {
    const { isMobile } = useCheckMobile();

    const { id } = useParams<{ id: string }>();

    const newsItem = newsData.find(item => item.id === Number(id));
    const filteredNewsData = newsData.filter(item => item.id !== Number(id));

    const handleBack = () => {
        window.history.back();
    }

    return (
        <main className="bg-black min-h-screen text-amber-50 p-6">
            <Navbar />
            <section className="pt-28 w-4/5 mx-auto">
                <div>
                    <button
                        onClick={handleBack}
                        className="text-md flex items-center mt-2 ml-1 gap-2 cursor-pointer">
                        <FaArrowLeft size={16} />
                        Back
                    </button>
                </div>

                {newsItem ? (
                    <>
                        {isMobile && (
                            <img
                                src={fptLogo}
                                alt="FPT Logo"
                                className="mt-6 w-full max-h-105 object-cover rounded-lg"
                            />
                        )}

                        <div className="mt-6">
                            <h2
                                className="text-3xl font-bold mb-4 text-[#f27255]"
                            >
                                {newsItem.title}
                            </h2>

                            {!isMobile && (
                                <img
                                    src={fptLogo}
                                    alt="FPT Logo"
                                    className="w-full max-h-105 object-cover rounded-lg"
                                />
                            )}

                            <p className="mt-4 text-amber-50/90 leading-7">{newsItem.description}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-3xl font-bold text-[#f27255] mt-6">News not found</h2>
                        <p className="mt-4 text-amber-50/90">Something went wrong.</p>
                    </>
                )}
            </section>

            <div className="w-3/4 mx-auto">
                <h3 className="text-2xl font-bold mt-10">Related News</h3>
                <div className=" mx-auto pb-20">
                    <div className="mt-6 grid grid-cols-12 gap-8">
                        {filteredNewsData
                            .filter(item => item.id !== Number(id))
                            .slice(0, 3)
                            .map((item) => (
                                <Link
                                    key={item.id}
                                    to={`/news/${item.id}`}
                                    className={
                                        isMobile
                                            ? "col-span-12"
                                            : "col-span-12 md:col-span-6 lg:col-span-4"
                                    }
                                >
                                    <img
                                        src={fptLogo}
                                        alt={item.title}
                                        className={
                                            isMobile
                                                ? "w-full h-56 object-cover"
                                                : "w-full h-56 object-cover"
                                        }
                                        loading="lazy"
                                    />
                                    <h4 className="mt-4 text-xl font-normal text-amber-50 line-clamp-2">
                                        {item.title}
                                    </h4>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

export default NewsDetail;
