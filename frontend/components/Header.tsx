"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function Header() {
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

      <div className="navbar-start items-center">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content items-stretch bg-base-100 rounded-box z-1 mt-3 max-w-fit p-2 shadow"
          >
            <li><Link href={"/"} className="text-xl font-thin">about</Link></li>
            <li><Link href={"/"} className="text-xl font-thin">contact</Link></li>
          </ul>
        </div>
        <div className={`flex flex-row p-2 bg-transparent  border-base-100 shadow-md
           ${isScrolled ? "border-none" : "backdrop-blur-md rounded-full lg:border-2"}`
        }>
          <Link href={"#"} className="btn btn-primary text-xl">Hackathon</Link>
          <div className="hidden lg:flex">
            <div className="divider divider-horizontal m-0 ml-4"></div>
            <Link href={"#"} className="btn btn-ghost font-thin text-xl">about</Link>
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