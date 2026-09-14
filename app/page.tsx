"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { LandingNav } from "../components/landing/LandingNav";
import { HeroSection } from "../components/landing/HeroSection";
import { MetricsSection } from "../components/landing/MetricsSection";
import { FeaturesSection } from "../components/landing/FeaturesSection";
import { RoleDashboardsSection } from "../components/landing/RoleDashboardsSection";
import { RoleAdvantagesSection } from "../components/landing/RoleAdvantagesSection";
import { SchoolsAndTestimonialsSection } from "../components/landing/SchoolsAndTestimonialsSection";
import { PricingSection } from "../components/landing/PricingSection";
import { TrustAndSupportSection } from "../components/landing/TrustAndSupportSection";
import { ImplementationSection } from "../components/landing/ImplementationSection";
import { FAQSection } from "../components/landing/FAQSection";
import {
  VacanciesSection,
  JobListing,
} from "../components/landing/VacanciesSection";
import { DemoCTASection } from "../components/landing/DemoCTASection";
import { LandingFooter } from "../components/landing/LandingFooter";
import { DemoModal } from "../components/landing/DemoModal";
import { JobApplicationModal } from "../components/landing/JobApplicationModal";

export default function LandingPage() {
  const [isDark, setIsDark] = useState(true);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [isPostingJob, setIsPostingJob] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Load initial theme preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem("xenon_theme");
      if (saved !== null) {
        setIsDark(saved === "dark");
      }
    } catch {
      // ignore in restricted environments
    }
  }, []);

  // Sync dark class on root document and remember choice
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("xenon_theme", "dark");
      } catch {}
    } else {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("xenon_theme", "light");
      } catch {}
    }
  }, [isDark]);

  // Track scroll position for Back-to-Top trigger
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenJob = (job: JobListing) => {
    setSelectedJob(job);
    setIsPostingJob(false);
    setJobModalOpen(true);
  };

  const handleOpenPostJob = () => {
    setSelectedJob(null);
    setIsPostingJob(true);
    setJobModalOpen(true);
  };

  return (
    <div
      className={`landing-page min-h-screen w-full max-w-full overflow-x-clip font-sans antialiased selection:bg-cyan-400 selection:text-slate-950 transition-colors duration-300 ${
        isDark ? "dark bg-[#07111f] text-slate-100" : "bg-[#f8fafc] text-slate-900"
      }`}
    >
      {/* Skip to Main Content Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-xl focus:bg-cyan-400 focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-slate-950 focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Navigation Bar */}
      <LandingNav
        onOpenDemoModal={() => setDemoModalOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* Main Sections */}
      <main id="main-content" className="w-full max-w-full overflow-x-clip">
        {/* 1. Hero Section -> Immediate Value Proposition & Interactive Mockup */}
        <HeroSection onOpenDemoModal={() => setDemoModalOpen(true)} />

        {/* 2. Metrics & Significance -> Credibility & Institutional Impact */}
        <MetricsSection />

        {/* 3. Features Overview -> Interactive Workflow Modules */}
        <FeaturesSection onOpenDemoModal={() => setDemoModalOpen(true)} />

        {/* 4. Role Dashboards -> Persona-specific sliding workspace */}
        <RoleDashboardsSection />

        {/* 5. Role Advantages -> Deep value proposition by stakeholder */}
        <RoleAdvantagesSection />

        {/* 6. Partner Schools & Testimonials -> Social Proof & Director Quotes */}
        <SchoolsAndTestimonialsSection />

        {/* 7. Pricing -> Custom per-school usage billing & bank transfer terms */}
        <PricingSection onOpenDemoModal={() => setDemoModalOpen(true)} />

        {/* 8. Trust, Support, and Operational Safeguards */}
        <TrustAndSupportSection />

        {/* 9. Structured 4-Step Rollout Process */}
        <ImplementationSection />

        {/* 10. FAQ -> Common operational, pricing, and onboarding queries */}
        <FAQSection />

        {/* 11. Vacancies -> Dynamic Institution Talent Exchange */}
        <VacanciesSection
          onSelectJob={handleOpenJob}
          onPostJob={handleOpenPostJob}
        />

        {/* 12. Demo CTA -> Conversion & Sandbox Access */}
        <DemoCTASection />
      </main>

      {/* Footer -> Directory, Governance, & Newsletter */}
      <LandingFooter />

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-6 z-40 grid h-11 w-11 place-items-center rounded-2xl border border-slate-200/80 bg-white/90 text-slate-800 shadow-xl backdrop-blur-md transition-all hover:-translate-y-1 hover:border-cyan-400 hover:text-cyan-500 dark:border-white/10 dark:bg-[#091222]/90 dark:text-slate-200 dark:hover:text-cyan-300"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}

      {/* Interactive Modals */}
      <DemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />

      <JobApplicationModal
        isOpen={jobModalOpen}
        job={selectedJob}
        isPostingJob={isPostingJob}
        onClose={() => setJobModalOpen(false)}
      />
    </div>
  );
}
