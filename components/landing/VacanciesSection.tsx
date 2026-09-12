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
  Filter,
  Sparkles,
  CheckCircle2,
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
        "Manage institutional fiscal budget, capital expansion investments, endowment accounting, and multi-gateway fee collection policies.",
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
    <section id="vacancies" className="py-24 bg-slate-50/70 dark:bg-[#0c1527] border-y border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Network Talent Exchange</span>
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Open Vacancies Across Partner Schools
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
              Explore dynamic teaching, leadership, and operational roles at leading institutions powered by Xenon.
            </p>
          </div>

          {/* Post a vacancy prompt */}
          <button
            onClick={onPostJob}
            className="shrink-0 px-4 py-2.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-50 dark:hover:bg-slate-750 transition-all shadow-xs flex items-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            <span>School Admins: Post a Vacancy</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-10 p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role title, school name, or location..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: "All Roles" },
              { id: "academic", label: "Teaching & Faculty" },
              { id: "admin", label: "Administration" },
              { id: "finance", label: "Finance & Operations" },
              { id: "tech", label: "EdTech & IT" },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setFilterDept(d.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterDept === d.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
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
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <p className="text-sm font-semibold text-slate-500">
                No open vacancies found matching &ldquo;{searchTerm}&rdquo;. Try clearing filters.
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-800/90 p-5 sm:p-6 shadow-xs hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-md border border-blue-100 dark:border-blue-900">
                      {job.school}
                    </span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Clock3 className="w-3 h-3" /> {job.deadline}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {job.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 max-w-3xl">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" /> {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {job.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {job.tags.map((t, tidx) => (
                      <span
                        key={tidx}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 flex items-center lg:flex-col lg:items-end justify-between gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => onSelectJob(job)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>View & Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-slate-400 text-right">
                    Verified Xenon Institution
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
