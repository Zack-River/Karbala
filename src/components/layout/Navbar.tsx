"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, NAV_CTA } from "@/constants";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
        
        .custom-navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 72px;
          background: rgba(10,7,5,0.6);
          backdrop-filter: blur(8px);
          z-index: 50;
          direction: rtl;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          transition: background 0.3s ease;
        }

        .custom-navbar.scrolled {
          background: rgba(10,7,5,0.9);
        }

        .nav-logo-container {
          display: flex;
          align-items: center;
        }

        .nav-logo {
          height: 48px;
          width: auto;
          object-fit: contain;
        }

        .nav-center-container {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .nav-links {
          display: flex;
          gap: 32px;
          align-items: center;
        }

        .nav-link {
          font-family: 'Cairo', sans-serif;
          color: #e8dcc8;
          text-decoration: none;
          font-size: 16px;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #c9a96e;
        }

        .nav-cta {
          font-family: 'Cairo', sans-serif;
          border: 1px solid #c9a96e;
          color: #c9a96e;
          border-radius: 999px;
          padding: 8px 20px;
          background: transparent;
          text-decoration: none;
          font-size: 15px;
          transition: background 0.3s ease;
        }

        .nav-cta:hover {
          background: rgba(201,169,110,0.12);
        }

        .mobile-toggle {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          gap: 6px;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .mobile-toggle span {
          display: block;
          width: 24px;
          height: 2px;
          background-color: #c9a96e;
          transition: all 0.3s ease;
        }

        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10,7,5,0.98);
          z-index: 40;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 32px;
        }

        .mobile-link {
          font-family: 'Cairo', sans-serif;
          font-size: 24px;
          color: #e8dcc8;
          text-decoration: none;
        }

        @media (max-width: 768px) {
          .custom-navbar { padding: 0 20px; }
          .nav-center-container { display: none; }
          .desktop-cta { display: none; }
          .mobile-toggle { display: flex; }
        }
      `}} />
      <nav className={`custom-navbar ${isScrolled ? "scrolled" : ""}`}>
        {/* RIGHT side: logo */}
        <Link href="/karbala" className="nav-logo-container" aria-label="الرئيسية">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png?v=2" alt="شعار وعي يمر من كربلاء" className="nav-logo" />
        </Link>

        {/* CENTER: links (Desktop) */}
        <div className="nav-center-container">
          <div className="nav-links">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* LEFT side: CTA (Desktop) & Mobile Toggle */}
        <div className="flex items-center">
          <div className="desktop-cta">
            <Link href={NAV_CTA.href} className="nav-cta">
              {NAV_CTA.label}
            </Link>
          </div>
          
          <button
            className="mobile-toggle"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            <span style={{ transform: isMobileOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none' }} />
            <span style={{ opacity: isMobileOpen ? 0 : 1 }} />
            <span style={{ transform: isMobileOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile Overlay Menu */}
      {isMobileOpen && (
        <div className="mobile-overlay animate-fade-up">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="mobile-link"
              style={{ animationDelay: `${i * 60}ms` }}
              onClick={(e) => {
                setIsMobileOpen(false);
                // Handle same-page hash links (e.g. /karbala#nights when already on /karbala)
                const [linkPath, hash] = link.href.split("#");
                if (hash && (linkPath === pathname || linkPath === pathname + "/")) {
                  e.preventDefault();
                  const target = document.getElementById(hash);
                  if (target) {
                    setTimeout(() => {
                      target.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 100);
                  }
                }
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={NAV_CTA.href}
            className="nav-cta mt-4 text-xl px-8 py-3"
            onClick={(e) => {
              setIsMobileOpen(false);
              const [ctaPath, ctaHash] = NAV_CTA.href.split("#");
              if (ctaHash && (ctaPath === pathname || ctaPath === pathname + "/")) {
                e.preventDefault();
                const target = document.getElementById(ctaHash);
                if (target) {
                  setTimeout(() => {
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 100);
                }
              }
            }}
          >
            {NAV_CTA.label}
          </Link>
        </div>
      )}
    </>
  );
}
