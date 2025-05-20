"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`navbar fixed top-0 z-50 transition-all duration-150 bg-base-transparent lg:px-16
        ${isScrolled ? "bg-base-100 shadow-md py-2" : "bg-transparent"}`}
      role="banner"
    >
      <div className={`lg:navbar-start ${isHomePage ? "navbar-start" : "navbar-end ml-16 lg:ml-0"}`}>
        <nav aria-label="Main Navigation" className="flex items-center">
          <div className="dropdown">
            {isHomePage && (
              <>
                <button
                  aria-label="Open mobile menu"
                  aria-expanded="false"
                  aria-controls="mobile-menu"
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost lg:hidden"
                >
                  <span className="sr-only">Menu</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                  </svg>
                </button>
                <ul
                  id="mobile-menu"
                  tabIndex={0}
                  className="menu menu-sm dropdown-content items-stretch rounded-box z-1 mt-3 p-2 shadow glass border-2 border-base-100"
                >
                  <li><Link href="/dashboard" className="text-xl font-thin">Dashboard</Link></li>
                  {/* <li><Link href="/air-quality" className="text-xl font-thin">Air Quality</Link></li>
                  <li><Link href="/pollen-tracker" className="text-xl font-thin">Pollen</Link></li> */}
                  <li><Link href="/contact" className="text-xl font-thin">Contact</Link></li>
                </ul>
              </>
            )}
          </div>

          <div className={`flex flex-row p-2 bg-base-transparent border-base-100 shadow-md
            ${isScrolled ? "border-none" : "lg:glass rounded-full lg:border-2"}`}
          >
            <Link href="/" className="btn btn-primary text-xl" aria-label="Zephyr Home">
              <Image
                src="/icons/darklogo.png"
                alt="Zephyr Logo"
                width={150}
                height={50}
                className="object-contain w-8 h-auto rounded-full glass"
              />
              <h2 className="font-extralight">Zephyr</h2>
            </Link>
            <div className="hidden lg:flex">
              <div className="divider divider-horizontal m-0 ml-4" aria-hidden="true"></div>
              <Link
                href="/dashboard"
                className={`btn btn-ghost font-thin text-xl ${pathname === "/dashboard" ? "active" : ""}`}
                aria-current={pathname === "/dashboard" ? "page" : undefined}
              >
                Dashboard
              </Link>
              {/* <Link
                href="/air-quality"
                className={`btn btn-ghost font-thin text-xl ${pathname === "/air-quality" ? "active" : ""}`}
                aria-current={pathname === "/air-quality" ? "page" : undefined}
              >
                Air Quality
              </Link>
              <Link
                href="/pollen-tracker"
                className={`btn btn-ghost font-thin text-xl ${pathname === "/pollen-tracker" ? "active" : ""}`}
                aria-current={pathname === "/pollen-tracker" ? "page" : undefined}
              >
                Pollen
              </Link> */}
              <Link
                href="/contact"
                className={`btn btn-ghost font-thin text-xl ${pathname === "/contact" ? "active" : ""}`}
                aria-current={pathname === "/contact" ? "page" : undefined}
              >
                Contact
              </Link>
            </div>
          </div>
        </nav>
      </div>
      <div className="navbar-end">
        <div aria-label="User tools">
          <button
            className="btn btn-ghost btn-circle"
            aria-label="Search for location"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button
            className="btn btn-ghost btn-circle"
            aria-label="Notifications"
          >
            <div className="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="badge badge-xs badge-primary indicator-item">3</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;