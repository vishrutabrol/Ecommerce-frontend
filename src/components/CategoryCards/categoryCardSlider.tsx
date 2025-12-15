import React, { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  type: string;
}
const CategoryMarquee: React.FC<Props> = ({ type }) => {
  const [stopScroll, setStopScroll] = useState(false);
  const [cardData, setCardData] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryType = type || "men";
        const res = await axios.get(`${import.meta.env.VITE_API_URL}api/v1/category/list?type=${categoryType}`);
        // take only first 5 records
        setCardData(res.data.data.slice(0, 5));
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, [type]);

  return (
    <>
      <style>{`
        .marquee-inner {
          animation: marqueeScroll linear infinite;
        }
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div
        className="overflow-hidden w-full relative max-w-6xl mx-auto"
        onMouseEnter={() => setStopScroll(true)}
        onMouseLeave={() => setStopScroll(false)}
      >
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
        <div
          className="marquee-inner flex w-fit"
          style={{
            animationPlayState: stopScroll ? "paused" : "running",
            animationDuration: cardData.length * 2500 + "ms",
          }}
        >
          <div className="flex">
            {[...cardData, ...cardData].map((card, index) => (
              <div
                key={index}
                className="w-56 mx-4 h-[20rem] relative group hover:scale-90 transition-all duration-300"
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}${card.images[0]}`}
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
                <div className="flex items-center justify-center px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-0 backdrop-blur-md left-0 w-full h-full bg-black/20">
                  {/* <p className="text-white text-lg font-semibold text-center"> */}
                  <p className="text-white text-lg font-medium uppercase tracking-wide text-center">
                    {card.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
      </div>
    </>
  );
};

export default CategoryMarquee;
