"use client";

import React, { useState } from "react";
import {
  Briefcase,
  MapPin,
  Clock3,
  DollarSign,
  Search,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export interface JobListing {
  id: string;
  title: string;
  department: "academic" | "admin" | "tech" | "finance";
  school: string;
  location: string;
  type: string;
  salary: string;
  deadline: string;
  tags: string[];
  description: string;
}

interface VacanciesSectionProps {
  onSelectJob: (job: JobListing) => void;
  onPostJob: () => void;
}

export function VacanciesSection({ onSelectJob, onPostJob }: VacanciesSectionProps) {
  const [filterDept, setFilterDept] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const jobs: JobListing[] = [
    {
      id: "job-1",
      title: "Head of Secondary STEM & Robotics",
      department: "academic",
      school: "Oakridge STEM Collegiate",
      location: "Boston, MA (Hybrid)",
      type: "Full-time • Academic Leadership",
      salary: "$78,000 - $94,000 / yr",
      deadline: "Closing in 8 days",
      tags: ["Robotics", "Curriculum Design", "AP/IB Physics"],
      description:
        "Seeking an innovative STEM department head to oversee secondary robotics labs, implement project-based curricula, and mentor faculty across grades 9-12.",
    },
    {
      id: "job-2",
      title: "Dean of Academic Affairs & Accreditation",
      department: "admin",
      school: "Wellington Academy Trust",
      location: "Oxfordshire, UK",
      type: "Permanent • Executive Team",
      salary: "£65,000 - £78,000 / yr",
      deadline: "Immediate Start",
      tags: ["Inspection Prep", "Faculty Development", "Curriculum"],
      description:
        "Lead school-wide academic policy, compliance with national inspection frameworks, and faculty evaluation metrics across three campuses.",
    },
    {
      id: "job-3",
      title: "Director of Finance & Campus Operations",
      department: "finance",
      school: "St. Augustine International",
      location: "Geneva, Switzerland",
      type: "Full-time • Senior Executive",
      salary: "CHF 110,000 - 130,000 / yr",
      deadline: "Closing in 14 days",
      tags: ["Budgeting", "Audit Ledgers", "Procurement"],
      description:
        "Manage institutional budgets, capital expansion investments, endowment accounting, bank-transfer reconciliation, and fee collection policies.",
    },
    {
      id: "job-4",
      title: "Senior EdTech Systems & LMS Administrator",
      department: "tech",
      school: "Beacon Collegiate Network",
      location: "London / Remote Option",
      type: "Full-time • IT Infrastructure",
      salary: "£48,000 - £60,000 / yr",
      deadline: "Open until filled",
      tags: ["Xenon SMS Admin", "SSO/SAML", "Network Security"],
      description:
        "Oversee school IT infrastructure, student RFID check-in hardware, Xenon SIS integrations, and faculty digital learning tool deployment.",
    },
    {
      id: "job-5",
      title: "Lead IB Primary Years Program (PYP) Coordinator",
      department: "academic",
      school: "Greenwood Global Schools",
      location: "Singapore Campus",
      type: "Full-time • Elementary",
      salary: "SGD 85,000 - 105,000 / yr",
      deadline: "Closing in 5 days",
      tags: ["IB PYP", "Inquiry-Based", "Bilingual Program"],
      description:
        "Coordinate inquiry-based learning for elementary grades, guide teachers through IB unit planning, and lead parent workshop forums.",
    },
  ];

  const filteredJobs = jobs.filter((j) => {
    const matchesDept = filterDept === "all" || j.department === filterDept;
    const matchesSearch =
      searchTerm.trim() === "" ||
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <section id="vacancies" className="w-full max-w-full overflow-x-clip border-y border-slate-200/80 bg-[#f8fafc] py-24 dark:border-white/10 dark:bg-[#070e1b]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              <Briefcase className="h-3.5 w-3.5 text-cyan-500" />
              <span>Network Talent Exchange</span>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl leading-tight">
              Open Vacancies Across Partner Schools
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Explore teaching, administrative, and technological careers at premier institutions powered by Xenon SMS.
            </p>
          </div>

          <button
            onClick={onPostJob}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-800 shadow-xs transition-all hover:bg-slate-50 hover:border-cyan-400 dark:border-white/10 dark:bg-[#091222] dark:text-slate-200 dark:hover:bg-white/[0.05]"
          >
            <Building2 className="h-4 w-4 text-cyan-500" />
            <span>School Admins: Post a Vacancy</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-10 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-[#091222] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role title, institution, or location..."
              className="w-full rounded-xl border border-slate-200/80 bg-slate-50 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-cyan-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-400/20 dark:border-white/10 dark:bg-[#060c18] dark:text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: "All Roles" },
              { id: "academic", label: "Teaching & Faculty" },
              { id: "admin", label: "Administration" },
              { id: "finance", label: "Finance Desk" },
              { id: "tech", label: "EdTech & IT" },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setFilterDept(d.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  filterDept === d.id
                    ? "bg-slate-950 text-white shadow-xs dark:bg-cyan-400 dark:text-slate-950"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Job Listings Grid */}
        <div className="mt-6 space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/90 bg-white py-12 text-center shadow-xs dark:border-white/10 dark:bg-[#091222]">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                No open positions found matching &ldquo;{searchTerm}&rdquo;. Try broadening your search or resetting filters.
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:shadow-lg dark:border-white/10 dark:bg-[#091222] flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="flex-1 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-bold text-cyan-700 dark:text-cyan-300">
                      {job.school}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <Clock3 className="h-3.5 w-3.5" />
                      {job.deadline}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-400 transition-colors">
                    {job.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2 max-w-3xl">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                      {job.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {job.tags.map((t, tidx) => (
                      <span
                        key={tidx}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 flex items-center lg:flex-col lg:items-end justify-between gap-3 border-t border-slate-100 pt-4 dark:border-white/5 lg:border-t-0 lg:pt-0">
                  <button
                    onClick={() => onSelectJob(job)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-5 py-2.5 text-xs font-extrabold text-slate-950 shadow-sm shadow-cyan-500/25 transition-all hover:-translate-y-0.5 hover:from-cyan-300 hover:to-teal-300"
                  >
                    <span>View & Apply</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[11px] font-medium text-slate-400">
                    Verified Xenon Partner
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
