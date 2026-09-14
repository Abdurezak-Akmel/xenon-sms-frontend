"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, Moon, School, Sun, UserPlus, X } from "lucide-react";

interface LandingNavProps {
  onOpenDemoModal: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const navLinks = [
  { label: "Product", href: "#features" },
  { label: "Dashboards", href: "#dashboards" },
  { label: "Roles", href: "#role-benefits" },
  { label: "Pricing", href: "#pricing" },
  { label: "Schools", href: "#schools" },
  { label: "Vacancies", href: "#vacancies" },
  { label: "FAQ", href: "#faq" },
];

export function LandingNav({
  onOpenDemoModal,
  isDark,
  onToggleTheme,
}: LandingNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full max-w-full transition-all duration-300 ${
        scrolled ? "px-3 py-2.5 sm:px-6" : "px-3 py-4 sm:px-6"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl px-3 transition-all duration-300 sm:px-5 lg:px-6 ${
          scrolled
            ? "border border-slate-200/80 bg-white/85 py-2 shadow-lg shadow-slate-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-[#07111f]/85"
            : "border border-transparent bg-transparent py-1.5"
        }`}
      >
        {/* Brand Identity */}
        <Link href="/" className="flex min-w-0 items-center gap-3 group">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/25 transition-transform group-hover:scale-105">
            <School className="h-5 w-5 text-slate-950" />
          </span>
          <span className="min-w-0">
            <span className="block text-base font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-lg">
              Xenon SMS
            </span>
            <span className="block truncate text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
              School OS
            </span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="hidden items-center gap-2.5 md:flex">
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-700 transition-colors hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-300" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
          <Link
            href="/auth/login"
            className="rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white/90 px-3.5 py-2 text-xs font-bold text-slate-900 shadow-xs transition-all hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Sign Up</span>
          </Link>
          <button
            onClick={onOpenDemoModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-4 py-2 text-xs font-extrabold text-slate-950 shadow-sm shadow-cyan-500/25 transition-all hover:-translate-y-0.5 hover:from-cyan-300 hover:to-teal-300"
          >
            <span>Demo</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-300" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mt-2.5 rounded-2xl border border-slate-200/90 bg-white/95 px-4 pb-5 pt-3 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#07111f]/95 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-200/80 pt-3 dark:border-white/10">
            <Link
              href="/auth/login"
              className="rounded-xl bg-slate-100 px-3 py-2.5 text-center text-xs font-bold text-slate-900 dark:bg-white/10 dark:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-3 py-2.5 text-center text-xs font-bold text-slate-950"
            >
              Sign Up
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemoModal();
              }}
              className="col-span-2 rounded-xl border border-slate-200 px-4 py-2.5 text-center text-xs font-bold text-slate-800 dark:border-white/10 dark:text-slate-100"
            >
              Book 15-Min Walkthrough
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
