"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Roboto } from "next/font/google";
import { useForm } from "react-hook-form";
import { useSearch } from "@/context/SearchContext";
import getContactNumber from "@/services/tour/getContactNumber";
import { FaPhone, FaWhatsapp, FaBars, FaTimes, FaChevronRight, FaChevronDown, FaUser, FaSignOutAlt } from "react-icons/fa";
import { usePagination } from "@/context/usePagination";
import { useRouter } from "next/navigation";
import getTourDestination from "@/services/getTourDestination";
import { Avatar, Dropdown } from "flowbite-react";
import { useUser } from "@/context/UserContext";
import PrimaryButton from "@/utils/PrimaryButton";
import slugify from "@/utils/slugify";

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

const BookMeHeader = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPackageTourOpen, setIsPackageTourOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [contactNumber, setContactNumber] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const { currentPage, handlePageChange } = usePagination();
  const router = useRouter();
  const packageTourRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const userDropdownRef = useRef(null);
  const { user, logoutUser } = useUser();

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) {
      setIsPackageTourOpen(false);
    }
  }, [isMobileMenuOpen]);

  const togglePackageTour = useCallback((e) => {
    e.stopPropagation();
    setIsPackageTourOpen(!isPackageTourOpen);
  }, [isPackageTourOpen]);

  const toggleUserDropdown = useCallback(() => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  }, [isUserDropdownOpen]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contactResult = await getContactNumber();
        setContactNumber(contactResult);

        const destinationsData = await getTourDestination();
        if (destinationsData?.success) {
          setDestinations(destinationsData.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (packageTourRef.current && !packageTourRef.current.contains(event.target)) {
        setIsPackageTourOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
        setIsPackageTourOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onSubmit = (data) => {
    setSearchTerm(data.property);
  };

  const closeAllMenus = useCallback(() => {
    setIsMobileMenuOpen(false);
    setIsPackageTourOpen(false);
    setIsUserDropdownOpen(false);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setIsUserDropdownOpen(false);
    router.push("/");
  };



  // Mobile menu component to separate the logic
  const MobileMenu = () => {
    const [localPackageTourOpen, setLocalPackageTourOpen] = useState(false);

    return (
      <div className="h-full flex flex-col overflow-hidden">
        {/* Menu Header */}
        <div className="flex justify-between p-4 border-b border-gray-200">
          <Link href="/" prefetch onClick={closeAllMenus}>
            <Image
              src="/assets/images/logo.png"
              alt="logo"
              width={150}
              height={50}
              className="changeLogo"
              priority
            />
          </Link>
          <button onClick={closeAllMenus} className="text-gray-500">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            <li>
              <Link
                href="/hotel"
                className="flex items-center justify-between py-3 px-4 text-sm text-[#00026E] hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                onClick={closeAllMenus}
                prefetch
              >
                <span className="font-medium">Hotels</span>
                <FaChevronRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </li>

            {/* Ship Tickets Dropdown - Mobile */}
            <li>
              <div className="flex flex-col">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setLocalPackageTourOpen(!localPackageTourOpen);
                  }}
                  className="flex items-center justify-between py-3 px-4 text-sm text-[#00026E] hover:bg-blue-50 rounded-lg transition-colors duration-200 group w-full text-left"
                >
                  <span className="font-medium">Ship Tickets</span>
                  <FaChevronRight className={`text-blue-400 transition-transform duration-200 ${localPackageTourOpen ? 'rotate-90' : ''}`} />
                </button>

                {localPackageTourOpen && (
                  <div className="pl-4">
                    {destinations.filter((destination) => destination.id !== 4).map((destination) => {
                      const slug = slugify(destination.name);

                      return (
                        <Link
                          key={destination.id}
                          href={`/ships/${slug}/${destination.id}`}
                          className="flex items-center justify-between py-2 px-4 text-sm text-[#00026E] hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                          onClick={closeAllMenus}
                          prefetch
                        >
                          <span className="font-medium">{destination.name}</span>
                          <FaChevronRight className="text-blue-400 opacity-70" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </li>

            <li>
              <Link
                href="/flight"
                className="flex items-center justify-between py-3 px-4 text-sm text-[#00026E] hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                onClick={closeAllMenus}
                prefetch
              >
                <span className="font-medium">Flights</span>
                <FaChevronRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </li>

            <li>
              <Link
                href="/visa"
                className="flex items-center justify-between py-3 px-4 text-sm text-[#00026E] hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                onClick={closeAllMenus}
                prefetch
              >
                <span className="font-medium">Visa</span>
                <FaChevronRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </li>

            <li>
              <Link
                href="/tour/packages"
                className="flex items-center justify-between py-3 px-4 text-sm text-[#00026E] hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                onClick={closeAllMenus}
                prefetch
              >
                <span className="font-medium">Tour Packages</span>
                <FaChevronRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </li>

            <li>
              <Link
                href="/activities"
                className="flex items-center justify-between py-3 px-4 text-sm text-[#00026E] hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                onClick={closeAllMenus}
                prefetch
              >
                <span className="font-medium">Activities</span>
                <FaChevronRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </li>

            <li>
              <Link
                href="/car-rental"
                className="flex items-center justify-between py-3 px-4 text-sm text-[#00026E] hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                onClick={closeAllMenus}
                prefetch
              >
                <span className="font-medium">Car Rental</span>
                <FaChevronRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Section - Mobile */}
        <div className="p-4 border-t border-gray-200">
          {user ? (
            <div className="flex items-center gap-3 mb-4">
              <Avatar rounded />
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name || user.email}</p>
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 mt-1"
                >
                  <FaSignOutAlt className="text-xs" /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <Link
                href="/login"
                onClick={closeAllMenus}
                className="w-full"
              >
                <PrimaryButton className="w-full py-2.5 text-sm">
                  Sign In
                </PrimaryButton>
              </Link>
            </div>
          )}
        </div>

        {/* Contact Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-[#00026E] mb-3">Contact Us</h3>
          <div className="flex items-center space-x-4 mb-4">
            <a
              target="_blank"
              href={`tel:${contactNumber?.Phone}`}
              className="flex items-center justify-center w-12 h-12 bg-[#00026E] rounded-full text-white hover:bg-[#00026E]/90 transition-colors"
            >
              <FaPhone className="text-xl" />
            </a>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={`https://wa.me/${contactNumber?.Phone}`}
              className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full text-white hover:bg-green-600 transition-colors relative"
            >
              <span className="absolute animate-ping opacity-75 inline-flex h-full w-full rounded-full bg-green-400"></span>
              <FaWhatsapp className="text-xl z-10" />
            </Link>
          </div>
          {/* <div>
            <p className="text-sm text-gray-600">Call Anytime</p>
            <a
              href={`tel:${contactNumber?.Phone}`}
              className="text-lg font-semibold text-[#00026E] hover:underline"
            >
              {contactNumber?.Phone}
            </a>
          </div> */}
        </div>
      </div>
    );
  };

  return (
    <header className={`header-area-three ${roboto.className} bg-white`}>
      <div className="main-header fixed w-full z-50 bg-white shadow-md shadow-slate-500">
        <div className="header-bottom text-[#00026E]">
          <div className="container w-[95%] lg:w-[85%] mx-auto">
            <div className="flex justify-between items-center py-2">
              <div className="logo">
                <Link href={"/"} prefetch className="cursor-pointer">
                  <Image
                    src="/assets/images/logo.png"
                    alt="logo"
                    width={130}
                    height={50}
                    className="changeLogo"
                    priority
                  />
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-6">
                <Link
                  href="/hotel"
                  className="text-sm text-[#00026E] hover:text-blue-600 font-medium transition-colors duration-200"
                  prefetch
                >
                  HOTELS
                </Link>

                {/* Ship Tickets Dropdown */}
                <div className="relative group" ref={packageTourRef}>
                  <button
                    onClick={togglePackageTour}
                    className="text-sm text-[#00026E] hover:text-blue-600 font-medium transition-colors duration-200 flex items-center gap-1"
                  >
                    SHIP TICKETS
                    <FaChevronDown className={`text-xs transition-transform duration-200 ${isPackageTourOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isPackageTourOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30">
                      {destinations
                        .filter((destination) => destination.id !== 4)
                        .map((destination) => {
                          const slug = slugify(destination.name);

                          return (
                            <Link
                              key={destination.id}
                              href={`/ships/${slug}/${destination.id}`}
                              className="block px-4 py-2 text-sm text-[#00026E] hover:bg-blue-50"
                              onClick={() => {
                                setIsPackageTourOpen(false);
                              }}
                              prefetch
                            >
                              {destination.name}
                            </Link>
                          );
                        })}
                    </div>
                  )}
                </div>

                <Link
                  href="/flight"
                  className="text-sm text-[#00026E] hover:text-blue-600 font-medium transition-colors duration-200"
                  prefetch
                >
                  FLIGHTS
                </Link>

                <Link
                  href="/visa"
                  className="text-sm text-[#00026E] hover:text-blue-600 font-medium transition-colors duration-200"
                  prefetch
                >
                  VISA
                </Link>

                <Link
                  href="/tour/packages"
                  className="text-sm text-[#00026E] hover:text-blue-600 font-medium transition-colors duration-200"
                  prefetch
                >
                  TOUR PACKAGES
                </Link>

                <Link
                  href="/activities"
                  className="text-sm text-[#00026E] hover:text-blue-600 font-medium transition-colors duration-200"
                  prefetch
                >
                  ACTIVITIES
                </Link>

                <Link
                  href="/car-rental"
                  className="text-sm text-[#00026E] hover:text-blue-600 font-medium transition-colors duration-200"
                  prefetch
                >
                  CAR RENTAL
                </Link>
              </div>

              {/* Desktop Contact Info and User Section */}
              <div className="ml-3 hidden lg:flex items-center justify-center gap-4">
                <div className="flex items-center">
                  <div className="flex items-center mr-5">
                    <a target="_blank" href={`tel:${contactNumber?.Phone}`} className="w-[38px] h-[38px] -mr-4">
                      <div className="phone-call-nav md:w-[40px] md:h-[40px] w-[36px] h-[36px] ">
                        <FaPhone className="md:ml-[12px] md:mt-[12px] mt-[9px] ml-[10px]" />
                      </div>
                    </a>
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://wa.me/${contactNumber?.Phone}`}
                      className="w-[38px] h-[38px] mx-[20px] "
                    >
                      <span className="btn-whatsapp-pulse btn-whatsapp-pulse-border-nav md:w-[40px] md:h-[40px] w-[36px] h-[36px] ml-[15px]">
                        <FaWhatsapp className="w-[25px] h-[25px] text-white" />
                      </span>
                    </Link>
                  </div>

                  {/* <div>
                    <p className="text-sm text-gray-900">Call Anytime</p>
                    <h4 className="text-lg font-semibold">
                      <a href="#" className="text-gray-800">
                        {contactNumber?.Phone?.slice(3)}
                      </a>
                    </h4>
                  </div> */}
                </div>

                {/* User Section - Desktop */}
                <div className="relative" ref={userDropdownRef}>
                  {user ? (
                    <>
                      <button
                        onClick={toggleUserDropdown}
                        className="flex items-center gap-2 p-2 rounded-full border border-gray-300 hover:bg-blue-100 transition-all duration-200"
                      >
                        {/* SVG Avatar Icon */}
                        <div className="relative">
                          <svg
                            className="w-7 h-7 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"
                            />
                          </svg>

                          {/* Optional online status dot */}
                          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></span>
                        </div>

                        {/* Dropdown arrow */}
                        <svg
                          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''
                            }`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>


                      {isUserDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30 border border-gray-200">
                          <div
                           
                            className="flex mb-2 items-center gap-2 mt-2 p-2 rounded-full  transition-colors"
                          >
                            <Avatar className="h-5 " rounded />
                            <span className="text-sm font-medium  text-gray-700">{user.name || user.email}</span>

                          </div>
                          <hr />
                          {/* <Link
                            href="/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            Dashboard
                          </Link>
                          <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            Profile
                          </Link>
                          <Link
                            href="/bookings"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            My Bookings
                          </Link> */}
                          <hr className="my-1" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <FaSignOutAlt className="text-xs" /> Sign Out
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link href="/login">
                      <PrimaryButton className="py-2 px-4 text-sm">
                        Sign In
                      </PrimaryButton>
                    </Link>
                  )}
                </div>
              </div>

              {/* Mobile Menu Button and Icons */}
              <div className="lg:hidden flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <a target="_blank" href={`tel:${contactNumber?.Phone}`} className="w-[38px] h-[38px]">
                    <div className="phone-call w-[36px] h-[36px]">
                      <FaPhone className="mt-[9px] ml-[10px]" />
                    </div>
                  </a>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://wa.me/${contactNumber?.Phone}`}
                    className="w-[38px] h-[38px]"
                  >
                    <span className="btn-whatsapp-pulse btn-whatsapp-pulse-border w-[36px] h-[36px]">
                      <FaWhatsapp className="w-[20px] h-[20px] text-white mt-[0px] ml-[0px]" />
                    </span>
                  </Link>
                </div>

                <button
                  onClick={toggleMobileMenu}
                  className="text-[#00026E] focus:outline-none"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <FaTimes className="w-6 h-6" />
                  ) : (
                    <FaBars className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-20">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={closeAllMenus}
            ></div>

            {/* Menu Content */}
            <div
              ref={mobileMenuRef}
              className="absolute top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
            >
              <MobileMenu />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default BookMeHeader;