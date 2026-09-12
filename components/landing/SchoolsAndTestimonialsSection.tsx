"use client";

import React, { useState } from "react";
import {
  Star,
  Quote,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";

export function SchoolsAndTestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const partnerSchools = [
    { name: "St. Augustine International", type: "K-12 Academy", location: "London / Geneva" },
    { name: "Oakridge STEM Collegiate", type: "Technical Prep", location: "Toronto / Boston" },
    { name: "Greenwood Global Schools", type: "Multi-Campus Trust", location: "Singapore / Dubai" },
    { name: "Beacon Collegiate Network", type: "Private Academies", location: "Nairobi / Cape Town" },
    { name: "Horizon Montessori Group", type: "Early Learning Network", location: "San Francisco" },
    { name: "Wellington Academy Trust", type: "Co-Ed Boarding School", location: "Oxfordshire" },
  ];

  const testimonials = [
    {
      id: 1,
      quote:
        "Switching to Xenon was the single best operational decision in our academy’s 25-year history. Our tuition collection cycle dropped from 38 days to under 48 hours, and our teachers completed term report cards in a single afternoon rather than two stressful weeks.",
      author: "Dr. Helena Vance",
      role: "Executive Director & Superintendent",
      school: "Wellington Academy Group",
      metrics: "3 Campuses • 2,400 Students",
      impact: "82% faster fee recovery",
      avatarInitials: "HV",
      avatarColor: "bg-blue-600",
    },
    {
      id: 2,
      quote:
        "The multi-branch governance model is astonishingly robust. As CIO overseeing 14 campuses across two countries, I can enforce unified academic rubrics and audit financial ledgers with zero manual spreadsheet consolidation. It just works.",
      author: "Marcus Sterling",
      role: "Chief Information & Operations Officer",
      school: "Greenwood Global School Trust",
      metrics: "14 Campuses • 8,900 Students",
      impact: "100% regulatory audit compliance",
      avatarInitials: "MS",
      avatarColor: "bg-indigo-600",
    },
    {
      id: 3,
      quote:
        "Parents rave about the mobile portal. They receive instant notifications when their child boards the bus and when exam marks are released. Unexcused absences plummeted by 42% in our first semester using the RFID gate sync.",
      author: "Clara Osei-Mensah",
      role: "Head of School",
      school: "Beacon STEM Collegiate",
      metrics: "1 Campus • 1,150 Students",
      impact: "42% drop in unexcused absence",
      avatarInitials: "CO",
      avatarColor: "bg-emerald-600",
    },
    {
      id: 4,
      quote:
        "Xenon’s timetabling engine solved classroom and lab conflicts that had frustrated our administration for years. We migrated five years of legacy student data in 48 hours without a single record lost. Their engineering support is world class.",
      author: "Julian Thorne",
      role: "Academic Dean",
      school: "Oakridge Technical Institute",
      metrics: "2 Campuses • 1,600 Students",
      impact: "Zero scheduling conflicts",
      avatarInitials: "JT",
      avatarColor: "bg-purple-600",
    },
  ];

  const current = testimonials[activeTestimonial];

  return (
    <section id="schools" className="py-24 bg-slate-50/70 dark:bg-[#0c1527] border-y border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Trusted Institutional Network</span>
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Subscribed Schools & Administrator Reviews
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Over 450 progressive schools rely on Xenon daily to elevate educational excellence, protect tuition revenue, and delight parents.
          </p>
        </div>

        {/* Partner School Badges Marquee / Grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {partnerSchools.map((sch, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/70 shadow-xs flex flex-col items-center text-center justify-center hover:border-blue-400 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                {sch.name}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-400 mt-0.5">
                {sch.type}
              </span>
            </div>
          ))}
        </div>

        {/* Featured Testimonial Highlight Card */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="relative rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 p-8 sm:p-12 shadow-xl shadow-blue-950/5">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-6 flex-1">
                {/* Rating stars & Impact badge */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Outcome: {current.impact}
                  </span>
                </div>

                {/* Quote text */}
                <p className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed italic">
                  &ldquo;{current.quote}&rdquo;
                </p>

                {/* Author Details */}
                <div className="flex items-center gap-4 pt-2">
                  <div
                    className={`w-12 h-12 rounded-full ${current.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-md`}
                  >
                    {current.avatarInitials}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {current.author}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {current.role} • <strong className="text-slate-700 dark:text-slate-300 font-semibold">{current.school}</strong>
                    </p>
                    <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                      {current.metrics}
                    </span>
                  </div>
                </div>
              </div>

              {/* Testimonial Selectors & Controls */}
              <div className="lg:w-72 w-full lg:border-l lg:border-slate-100 lg:dark:border-slate-700 lg:pl-8 flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Case Study
                </span>
                <div className="space-y-2">
                  {testimonials.map((t, idx) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTestimonial(idx)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                        activeTestimonial === idx
                          ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-750"
                      }`}
                    >
                      <span className="truncate">{t.school}</span>
                      {activeTestimonial === idx && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                    </button>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <button
                    onClick={() =>
                      setActiveTestimonial((prev) =>
                        prev === 0 ? testimonials.length - 1 : prev - 1
                      )
                    }
                    aria-label="Previous review"
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-slate-400">
                    {activeTestimonial + 1} of {testimonials.length}
                  </span>
                  <button
                    onClick={() =>
                      setActiveTestimonial((prev) =>
                        prev === testimonials.length - 1 ? 0 : prev + 1
                      )
                    }
                    aria-label="Next review"
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
