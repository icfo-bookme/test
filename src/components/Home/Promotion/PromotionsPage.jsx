
'use client';
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, FreeMode } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { Roboto } from "next/font/google";
import LoadingSpinner from "@/utils/LoadingSpinner";

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

export default function PromotionsPage({ promotions = [] }) {
  const [isMobile, setIsMobile] = useState(false);
  const swiperRef = useRef(null);
  const touchTimeoutRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (promotions && promotions.length > 0) {
      setLoading(false);
    }
  }, [promotions]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    };
  }, []);

  const stopAutoplay = () => {
    if (swiperRef.current?.swiper?.autoplay?.running) {
      swiperRef.current.swiper.autoplay.stop();
    }
  };

  const startAutoplay = () => {
    if (swiperRef.current?.swiper && !swiperRef.current.swiper.autoplay.running) {
      swiperRef.current.swiper.autoplay.start();
    }
  };

  const handleTouchStart = () => {
    if (isMobile) {
      stopAutoplay();
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    }
  };

  const handleTouchEnd = () => {
    if (isMobile) {
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = setTimeout(() => {
        startAutoplay();
      }, 5000);
    }
  };

  return (
    <div className={`${roboto.className} bg-blue-50 w-full mx-auto max-w-7xl`}>
      <div className="w-full text-center mb-5">
        <h1 className="text-xl md:text-2xl font-bold text-blue-800 mb-2">
          Hot Package Deals
        </h1>
        <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <LoadingSpinner height="60" width="60" color="#0678B4" ariaLabel="loading" />
        </div>
      ) : promotions && promotions.length > 0 ? (
        <div className="relative">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination, Autoplay, FreeMode]}
            spaceBetween={16}
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            initialSlide={1}
            speed={isMobile ? 1000 : 1000}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              nextEl: '.promo-swiper-button-next',
              prevEl: '.promo-swiper-button-prev',
            }}
            resistanceRatio={0.5}
            touchStartPreventDefault={false}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onSliderMove={handleTouchStart}
            onTransitionEnd={handleTouchEnd}
            breakpoints={{
              320: {
                slidesPerView: 1.2,
                centeredSlides: true,
                speed: 300,
                freeMode: {
                  enabled: true,
                  momentum: true,
                  momentumRatio: 2,
                  velocityRatio: 5.5,
                  sticky: false
                },
              },
              640: {
                slidesPerView: 1.5,
                centeredSlides: true,
                speed: 400,
                freeMode: {
                  enabled: true,
                  momentum: true,
                  momentumRatio: 0.2,
                  velocityRatio: 1.5,
                  sticky: false
                },
              },
              768: {
                slidesPerView: 2,
                centeredSlides: false,
                speed: 500,
                freeMode: false,
              },
              1024: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                speed: 700,
                freeMode: false,
              },
              1280: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                speed: 800,
                freeMode: false,
              }
            }}
            className="w-full md:w-[90%] lg:w-[89%] mx-auto"
          >
            {promotions.slice(0, 12).map((promo) => (
              <SwiperSlide key={promo.id} className="h-auto">
                <div className="relative rounded-xl overflow-hidden shadow-lg h-72 group">
                  <div className="absolute inset-0">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/${promo.image}`}
                      alt={promo.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      priority={promo.id < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  </div>
                  <div className="relative h-full flex flex-col justify-between p-6">
                    <div>
                      {promo.discounts && (
                        <span className="inline-block bg-white text-red-600 font-bold text-xs px-2 py-1 rounded-md mb-2">
                          {promo.discounts}% OFF
                        </span>
                      )}
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{promo.title}</h3>
                      <p className="text-gray-200 text-sm md:text-base line-clamp-2">{promo.subtitle}</p>
                    </div>
                    <div className="mt-4">
                      <Link aria-label="package booking button"
                        href={promo.btn_link || "/contact"}
                        className="inline-block bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-6 rounded-full text-sm sm:text-base text-center transition-all duration-300 transform hover:scale-[1.03] shadow-md hover:shadow-lg"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button className="promo-swiper-button-prev hidden sm:flex absolute left-0 md:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5 md:w-6 md:h-6 text-gray-700">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="promo-swiper-button-next hidden sm:flex absolute right-0 md:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5 md:w-6 md:h-6 text-gray-700">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[200px]">
          <p className="text-gray-600 text-base sm:text-lg">No promotions available at the moment.</p>
        </div>
      )}
    </div>
  );
}