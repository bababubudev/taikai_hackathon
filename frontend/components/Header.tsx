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
        ${isScrolled ? "bg-base-100 shadow-md py-2" : "bg-transparent"}`
    }>
      <div className={`navbar-start ${isHomePage ? "ml-0" : "ml-16 lg:ml-0"}`}>
        <div className="dropdown">
          {isHomePage && (
            <>
              <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content items-stretch rounded-box z-1 mt-3 p-2 shadow glass border-2 border-base-100"
              >
                <li><Link href={"/details"} className="text-xl font-thin">details</Link></li>
                <li><Link href={"/"} className="text-xl font-thin">contact</Link></li>
              </ul>
            </>
          )}

        </div>
        <div className={`flex flex-row p-2 bg-base-transparent border-base-100 shadow-md
          ${isScrolled ? "border-none" : "lg:glass rounded-full lg:border-2"}`
        }>
          <Link href={"/"} className="btn btn-primary text-xl">
            <Image
              src="/icons/darklogo.png"
              alt="Zephyr"
              width={150}
              height={50}
              className="object-contain w-8 h-auto rounded-full glass"
            />
            <h3 className="font-extralight">Zephyr</h3>
          </Link>
          <div className="hidden lg:flex">
            <div className="divider divider-horizontal m-0 ml-4"></div>
            <Link href={"/details"} className="btn btn-ghost font-thin text-xl">details</Link>
            <Link href={"#"} className="btn btn-ghost font-thin text-xl">contact</Link>
          </div>
        </div>
      </div>
      <div className="navbar-end">
        <button className="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>
      </div>
    </header>
  );
}

export default Header;