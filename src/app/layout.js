// checked

import "./globals.css";
import { Inter } from "next/font/google";


import { PaginationProvider } from "@/context/usePagination";
import { SearchProvider } from "@/context/SearchContext";
import HeaderWrapper from "@/components/HeadWrapper/HeaderWrapper";
import { Footer } from "flowbite-react";
import { UserProvider } from "@/context/UserContext";

// Font setup at module scope
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function DashboardLayout({ children }) {
  return (
    <html lang="en" data-theme="white">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Bookme</title>
      </head>
      <body className={inter.className}>
        {/*global search provider*/}
        <PaginationProvider>
          <SearchProvider>
            {" "}
            <div>
              <div className="bg-white">
                <main>
                  <UserProvider>
                  <div className="">
                    <HeaderWrapper />
                  </div>
                  <div className="min-h-[100vh] py-[12px]">{children}</div>
                  <Footer />
                  </UserProvider>
                </main>
              </div>
            </div>
          </SearchProvider>
        </PaginationProvider>

      </body>
    </html>
  );
}