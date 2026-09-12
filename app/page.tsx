"use client";

import React, { useState, useEffect } from "react";
import { LandingNav } from "../components/landing/LandingNav";
import { HeroSection } from "../components/landing/HeroSection";
import { MetricsSection } from "../components/landing/MetricsSection";
import { FeaturesSection } from "../components/landing/FeaturesSection";
import { SchoolsAndTestimonialsSection } from "../components/landing/SchoolsAndTestimonialsSection";
import { PricingSection } from "../components/landing/PricingSection";
import { VacanciesSection, JobListing } from "../components/landing/VacanciesSection";
import { DemoCTASection } from "../components/landing/DemoCTASection";
import { LandingFooter } from "../components/landing/LandingFooter";
import { DemoModal } from "../components/landing/DemoModal";
import { JobApplicationModal } from "../components/landing/JobApplicationModal";

export default function LandingPage() {
  const [isDark, setIsDark] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [isPostingJob, setIsPostingJob] = useState(false);

  // Sync dark class on root document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

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
    <div className={`min-h-screen font-sans selection:bg-blue-500 selection:text-white ${isDark ? "dark bg-[#0b1322] text-slate-100" : "bg-white text-slate-900"}`}>
      {/* Navigation */}
      <LandingNav
        onOpenDemoModal={() => setDemoModalOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* Main Sections */}
      <main id="main-content">
        {/* 1. Hero Section -> Immediate Value Proposition */}
        <HeroSection onOpenDemoModal={() => setDemoModalOpen(true)} />

        {/* 2. Metrics & Significance -> Credibility & ROI */}
        <MetricsSection />

        {/* 3. Features Overview -> What the System Does */}
        <FeaturesSection onOpenDemoModal={() => setDemoModalOpen(true)} />

        {/* 4. Subscribed Schools & Testimonials -> Build Trust */}
        <SchoolsAndTestimonialsSection />

        {/* 5. Pricing -> Clear, Transparent, Flexible */}
        <PricingSection onOpenDemoModal={() => setDemoModalOpen(true)} />

        {/* 6. Vacancies -> Dynamic, Engaging Content */}
        <VacanciesSection
          onSelectJob={handleOpenJob}
          onPostJob={handleOpenPostJob}
        />

        {/* 7. Demo CTA -> Conversion Driver */}
        <DemoCTASection />
      </main>

      {/* 8. Footer -> Navigation & Support */}
      <LandingFooter />

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
