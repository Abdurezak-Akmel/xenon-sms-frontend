"use client";

import React, { useEffect, useState } from "react";
import { Building2, CheckCircle2, ChevronLeft, ChevronRight, GraduationCap, Quote, Star } from "lucide-react";

const partnerSchools = [
  { name: "Bright Future Academy", type: "K-12 Private School Network", location: "Nairobi", focus: "Multi-branch administration", stat: "4 branches synced" },
  { name: "Summit Hills School", type: "Day and Boarding Institution", location: "Kisumu", focus: "Attendance & fee reconciliation", stat: "1,180 active learners" },
  { name: "Green Valley Junior", type: "Primary & Middle School", location: "Mombasa", focus: "Parent communication desk", stat: "62 staff accounts" },
  { name: "North Gate High", type: "Secondary STEM Academy", location: "Eldoret", focus: "Automated report cards", stat: "38 classes organized" },
  { name: "Lakeview International", type: "International Baccalaureate School", location: "Nakuru", focus: "Role-based dashboards", stat: "6 distinct roles" },
  { name: "Cedar Technical Centre", type: "Vocational & Technical Academy", location: "Thika", focus: "Timetables & room allocations", stat: "0 timetable clashes" },
];

const testimonials = [
  {
    quote: "Xenon gave our leadership team a single source of operational truth. We stopped chasing branch spreadsheets and started making confident decisions based on synchronized attendance and fee data.",
    author: "Grace Wanjiku",
    role: "School Director",
    school: "Bright Future Academy",
    impact: "Branch reports prepared 65% faster",
  },
  {
    quote: "The cashier workspace made bank-transfer reconciliation straightforward. Every single receipt, balance, and reference number is auditable in seconds.",
    author: "Peter Mwangi",
    role: "Finance Lead",
    school: "Summit Hills School",
    impact: "Cleaner month-end fee closure",
  },
  {
    quote: "Teachers adopted Xenon within two days because their interface is laser-focused on class attendance and marks entry, completely free of administrative noise.",
    author: "Amina Hassan",
    role: "Academic Head",
    school: "North Gate High",
    impact: "Zero marks entry backlog",
  },
];

export function SchoolsAndTestimonialsSection() {
  const [activeSchool, setActiveSchool] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const school = partnerSchools[activeSchool];
  const testimonial = testimonials[activeTestimonial];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSchool((prev) => (prev + 1) % partnerSchools.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="schools" className="w-full max-w-full overflow-x-clip border-y border-slate-200/80 bg-white py-24 dark:border-white/10 dark:bg-[#07111f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          {/* Left Column: Partner Schools Slider */}
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              <Building2 className="h-3.5 w-3.5 text-cyan-500" />
              <span>Partner Institutions</span>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl leading-tight">
              School models vary. The operating layer stays rock solid.
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              From multi-branch networks to independent academies, schools use Xenon to eliminate operational friction and keep every stakeholder aligned.
            </p>

            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200/90 bg-[#f8fafc] shadow-sm dark:border-white/10 dark:bg-[#091222]">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${activeSchool * 100}%)` }}
              >
                {partnerSchools.map((item) => (
                  <article key={item.name} className="min-w-full p-6 sm:p-8">
                    <div className="grid gap-6 md:grid-cols-[120px_1fr] md:items-center">
                      <div className="grid aspect-square place-items-center rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white shadow-md dark:from-cyan-400 dark:to-teal-400 dark:text-slate-950">
                        <div className="text-center">
                          <GraduationCap className="mx-auto h-8 w-8" />
                          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em]">
                            {item.location}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Active Network Partner
                        </span>
                        <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                          {item.type}
                        </p>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-white/10 dark:bg-[#060c18]">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                              Core Focus
                            </p>
                            <p className="mt-1 text-xs font-bold text-slate-800 dark:text-white">
                              {item.focus}
                            </p>
                          </div>
                          <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-white/10 dark:bg-[#060c18]">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                              Key Metric
                            </p>
                            <p className="mt-1 text-xs font-bold text-slate-800 dark:text-white">
                              {item.stat}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Slider Bottom Bar */}
              <div className="flex items-center justify-between border-t border-slate-200/80 px-6 py-4 dark:border-white/10">
                <button
                  onClick={() => setActiveSchool((prev) => (prev - 1 + partnerSchools.length) % partnerSchools.length)}
                  aria-label="Previous school"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#060c18] dark:text-slate-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex gap-2">
                  {partnerSchools.map((item, index) => (
                    <button
                      key={item.name}
                      onClick={() => setActiveSchool(index)}
                      aria-label={`Show ${item.name}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        activeSchool === index
                          ? "w-8 bg-slate-900 dark:bg-cyan-400"
                          : "w-2 bg-slate-300 dark:bg-white/20"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActiveSchool((prev) => (prev + 1) % partnerSchools.length)}
                  aria-label="Next school"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#060c18] dark:text-slate-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Verified Leadership Testimonial */}
          <div className="rounded-2xl border border-slate-200/90 bg-[#f8fafc] p-6 shadow-sm dark:border-white/10 dark:bg-[#091222] sm:p-8 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Quote className="h-6 w-6" />
              </span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            <p className="mt-6 text-lg sm:text-xl font-medium leading-relaxed text-slate-800 dark:text-slate-100 italic">
              &ldquo;{testimonial.quote}&rdquo;
            </p>

            <div className="mt-8 border-t border-slate-200/80 pt-6 dark:border-white/10">
              <h4 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                {testimonial.author}
              </h4>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {testimonial.role}, {testimonial.school}
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {testimonial.impact}
                </span>
              </div>

              <div className="mt-6 flex gap-2">
                {testimonials.map((item, index) => (
                  <button
                    key={item.author}
                    onClick={() => setActiveTestimonial(index)}
                    aria-label={`Show testimonial from ${item.author}`}
                    className={`grid h-9 w-9 place-items-center rounded-xl text-xs font-bold transition-all ${
                      activeTestimonial === index
                        ? "bg-slate-900 text-white shadow-sm dark:bg-cyan-400 dark:text-slate-950"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-[#060c18] dark:text-slate-300"
                    }`}
                  >
                    0{index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
