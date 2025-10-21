import getAllHotels from '@/services/hotel/getAllHotels';
import HotelHeroSection from '@/components/hotel/Hotel/HotelHeroSection';
import HotelCTA from '@/components/hotel/Hotel/HotelCTA';
import HotelCard from '@/components/hotel/Hotel/HotelCard';
import HotelLoadingSkeleton from '@/components/hotel/Hotel/HotelLoadingSkeleton';

export const metadata = {
  title: "Hotels Booking | Best Deals & Comfortable Stays - BookMe",
  description: "Explore and book hotels in top destinations with BookMe. Compare amenities, read reviews, and find the best deals for families, couples, and solo travelers. Enjoy hassle-free reservations, comfortable stays, and seamless customer support. From luxury resorts to cozy boutique hotels, BookMe makes planning your perfect trip simple, convenient, and memorable."
};

export default async function HotelHome() {
  let hotelData = [];
  let loading = false;
  try {
    loading = true;
    const hotelResult = await getAllHotels();
    hotelData = hotelResult;
    loading = false;
  } catch (error) {
    console.error("Failed to fetch hotel data:", error);
    loading = false;
  }

  if (loading) {
    return <HotelLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen">
      <HotelHeroSection />
      <main className="container mx-auto ">
        <section className="mt-12 ">
          <h2 className="text-xl sm:text-2xl md:text-2xl font-bold text-center mb-2 text-blue-950">
            Best Hotels for Your Next Trip
          </h2>
          <HotelCard hotelData={hotelData} />
          {hotelData.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No hotels found. Please try a different search.
            </div>
          )}
        </section>
        <HotelCTA />
      </main>
    </div>
  );
}