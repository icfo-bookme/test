import { Roboto } from "next/font/google";
import { Suspense } from "react";
import nextDynamic from "next/dynamic";

import Banner from "../components/Home/Banner";
import TravelBookingTabs from "../components/SearchBar/SearchBar";
import PromotionsMain from "../components/Home/Promotion/main";
import LazySection from "../components/shared/LazySection";
import LoadingSpinner from "../components/SearchBar/Hotels/LoadingSpinner";

import getServicesData from "@/services/homepage/getServicesData";

// === Dynamic Imports ===
const VisaMain = nextDynamic(() => import("../components/Home/Visa/Main"), { ssr: true });
const HotelMain = nextDynamic(() => import("../components/Home/Hotel/Main"), { ssr: true });
const TangourMain = nextDynamic(() => import("../components/Home/Tangour/Main"), { ssr: true });
const Sundarban = nextDynamic(() => import("../components/Home/sundarban/Main"), { ssr: true });
const SaintMartin = nextDynamic(() => import("../components/Home/Saintmartin/Main"), { ssr: true });
const CTASection = nextDynamic(() => import("../components/Home/CTASection/CTASection"), { ssr: true });
const Faq = nextDynamic(() => import("../components/Faq/Faq"), { ssr: true });
const FlightRoute = nextDynamic(() => import("../components/Home/Flight/FlightRoute"), { ssr: true });
const HomepageBlog = nextDynamic(() => import("../components/pre-footer-content/Homepage"), { ssr: true });

export const dynamic = "force-dynamic"; 

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });



export default async function Home({ searchParams }) {
  // === Fetch & Prepare Services ===
  let servicesData = [];

  try {
    servicesData = await getServicesData();
  } catch (error) {
    console.error("Error fetching services data:", error);
  }

  const sortedServices = servicesData
    .map((service) => ({
      ...service,
      serialno: service.serialno ? parseInt(service.serialno) : Infinity,
    }))
    .sort((a, b) => a.serialno - b.serialno);

  const visibleServices = sortedServices.filter((service) => service.isShow === "yes");

  // === Subcategory Mapping for Ships ===
  const ShipsSubComponents = {
    "Tanguar Haor": TangourMain,
    Sundarban,
    "Saint Martin": SaintMartin,
  };

  // === Main Components Mapping ===
  const mainComponentMap = {
    Visa: VisaMain,
    Hotel: HotelMain,
    Ships: null, 
    Flight: null, 
  };

  return (
    <main className={`${roboto.className} bg-blue-50`}>
      {/* === Hero Section === */}
      <section className="relative w-full min-h-[60vh]">
        {/* Background Banner */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<div className="h-60 bg-gray-200 animate-pulse" />}>
            <Banner />
          </Suspense>
        </div>

        {/* Search Tabs Overlay */}
        <div className="absolute top-28 inset-0 z-10 flex items-center justify-center px-4">
          <div className="w-full max-w-5xl mx-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <TravelBookingTabs searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* === Services Section === */}
      <section className="py-10">
        <div className="max-w-screen-xl mx-auto px-4 space-y-10">
          {servicesData.length === 0 ? (
            <p className="text-center text-red-600 text-lg font-semibold py-12">
              Failed to load services data. Please try again later.
            </p>
          ) : (
            <>
              <PromotionsMain servicesData={servicesData} />

              {visibleServices.map((service) => {
                const { category_name } = service;

                // Ships section with subcategories
                if (category_name === "Ships") {
                  const shipsToShow = sortedServices.filter(
                    (s) => ShipsSubComponents[s.category_name] && s.isShow === "yes"
                  );

                  return shipsToShow.map((subCategory) => {
                    const SubComponent = ShipsSubComponents[subCategory.category_name];
                    return (
                      <LazySection
                        key={subCategory.category_name}
                        placeholder={<div className="h-40 bg-gray-200 animate-pulse rounded-lg" />}
                      >
                        <SubComponent />
                      </LazySection>
                    );
                  });
                }

                // Regular mapped components
                const Component = mainComponentMap[category_name];
                return Component ? (
                  <LazySection
                    key={category_name}
                    placeholder={<div className="h-40 bg-gray-200 animate-pulse rounded-lg" />}
                  >
                    <Component />
                  </LazySection>
                ) : null;
              })}
            </>
          )}
        </div>
      </section>

      {/* === Lazy Loaded Below-the-Fold Sections === */}
      <LazySection placeholder={<div className="h-40 bg-gray-200 animate-pulse" />}>
        <FlightRoute />
      </LazySection>

      <LazySection placeholder={<div className="h-60 bg-gray-200 animate-pulse" />}>
        <CTASection />
      </LazySection>

      <LazySection placeholder={<div className="h-60 bg-gray-200 animate-pulse" />}>
        <Faq />
      </LazySection>

      <LazySection placeholder={<div className="h-60 bg-gray-200 animate-pulse" />}>
        <HomepageBlog />
      </LazySection>
    </main>
  );
}
