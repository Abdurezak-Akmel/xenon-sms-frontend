"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";

const roles = [
  {
    role: "Super Admin",
    icon: ShieldCheck,
    accent: "cyan",
    title: "Multi-tenant and institutional command",
    summary: "Monitor every school, branch, subscription state, role permission, and monthly usage signal with absolute security.",
    kpis: ["18 schools", "64 branches", "4,820 active accounts"],
    modules: ["Tenant health", "Usage billing", "Global roles", "Audit events"],
    activity: ["New school branch approved", "Resource limit alert reviewed", "Security policy synced"],
  },
  {
    role: "School Admin",
    icon: Building2,
    accent: "blue",
    title: "Whole-school executive leadership",
    summary: "Coordinate school setup, branches, academics, staff desk, parent communication, and consolidated finance summaries.",
    kpis: ["2,840 learners", "136 staff", "7 pending approvals"],
    modules: ["Admissions desk", "Branch overview", "Staff roster", "Term reports"],
    activity: ["Branch term report submitted", "Teacher invite verified", "Term calendar published"],
  },
  {
    role: "Branch Admin",
    icon: LayoutDashboard,
    accent: "emerald",
    title: "Daily campus operations & discipline",
    summary: "Run attendance registers, timetable changes, notices, local student records, and branch accountability.",
    kpis: ["94.8% attendance", "42 classes", "3 active notices"],
    modules: ["Daily register", "Class schedule", "Incident logs", "Branch reports"],
    activity: ["Late arrival follow-up dispatched", "Room assignment updated", "Class roll call completed"],
  },
  {
    role: "Cashier",
    icon: ReceiptText,
    accent: "amber",
    title: "Fee collection & bank transfer matching",
    summary: "Record receipts, confirm bank transfer references, review balances, and prepare reconciled finance statements.",
    kpis: ["83 verified refs", "12 pending", "KSh 4.8M billed"],
    modules: ["Invoices", "Receipts desk", "Bank refs", "Arrears ledger"],
    activity: ["Transfer reference matched", "Official receipt issued", "Concession request filed"],
  },
  {
    role: "Teacher",
    icon: BookOpenCheck,
    accent: "violet",
    title: "Focused classroom & gradebook desk",
    summary: "Handle registers, assignments, marks entry, lesson notes, timetables, and guardian messaging without administrative clutter.",
    kpis: ["6 lessons today", "28 marks due", "4 parent notes"],
    modules: ["Gradebook", "Registers", "Assignments", "Lesson plans"],
    activity: ["Calculus assignment posted", "Term marks updated", "Guardian inquiry resolved"],
  },
  {
    role: "Student",
    icon: GraduationCap,
    accent: "rose",
    title: "Student academic & timetable portal",
    summary: "View timetable, homework assignments, notices, exam results, attendance history, and institutional updates from any device.",
    kpis: ["8 active tasks", "91% attendance", "3 unread notices"],
    modules: ["Timetable", "Results ledger", "Homework tasks", "School notices"],
    activity: ["Physics lab uploaded", "Term assessment published", "Library notice received"],
  },
];

const accents: Record<string, { chip: string; fill: string; text: string; border: string }> = {
  cyan: {
    chip: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30",
    fill: "bg-cyan-400",
    text: "text-cyan-500 dark:text-cyan-300",
    border: "border-cyan-400/40",
  },
  blue: {
    chip: "bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-500/30",
    fill: "bg-blue-400",
    text: "text-blue-500 dark:text-blue-300",
    border: "border-blue-400/40",
  },
  emerald: {
    chip: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30",
    fill: "bg-emerald-400",
    text: "text-emerald-500 dark:text-emerald-300",
    border: "border-emerald-400/40",
  },
  amber: {
    chip: "bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30",
    fill: "bg-amber-400",
    text: "text-amber-500 dark:text-amber-300",
    border: "border-amber-400/40",
  },
  violet: {
    chip: "bg-violet-500/15 text-violet-600 dark:text-violet-300 border border-violet-500/30",
    fill: "bg-violet-400",
    text: "text-violet-500 dark:text-violet-300",
    border: "border-violet-400/40",
  },
  rose: {
    chip: "bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30",
    fill: "bg-rose-400",
    text: "text-rose-500 dark:text-rose-300",
    border: "border-rose-400/40",
  },
};

export function RoleDashboardsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const move = (direction: number) => {
    setActiveIndex((prev) => (prev + direction + roles.length) % roles.length);
  };

  return (
    <section id="dashboards" className="w-full max-w-full overflow-x-clip bg-[#f8fafc] py-24 dark:bg-[#070e1b]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              <LayoutDashboard className="h-3.5 w-3.5 text-cyan-500" />
              <span>Interactive Role Dashboards</span>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl leading-tight">
              Click a role. See their workspace slide into focus.
            </h2>
          </div>
          <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 min-w-0">
            Each user lands in a dashboard shaped specifically around their operational responsibilities. Daily tasks stay clean, and sensitive administrative levers remain guarded.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {roles.map((item, index) => {
            const Icon = item.icon;
            const selected = activeIndex === index;
            const accent = accents[item.accent];
            return (
              <button
                key={item.role}
                onClick={() => setActiveIndex(index)}
                className={`group rounded-2xl border p-4 text-left transition-all duration-200 ${
                  selected
                    ? "border-slate-900 bg-slate-900 text-white shadow-lg dark:border-cyan-400 dark:bg-cyan-400/10"
                    : "border-slate-200/90 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-[#091222] dark:text-slate-300 dark:hover:bg-white/[0.05]"
                }`}
              >
                <div className={`grid h-8 w-8 place-items-center rounded-lg ${selected ? "bg-white/10 text-white dark:text-cyan-300" : "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="mt-4 block text-sm font-bold tracking-tight">
                  {item.role}
                </span>
                <span className={`mt-1 block h-1 w-6 rounded-full transition-all ${selected ? accent.fill : "bg-transparent"}`} />
              </button>
            );
          })}
        </div>

        {/* Sliding Preview Frame */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xl dark:border-white/10 dark:bg-[#091222]">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {roles.map((item) => {
              const Icon = item.icon;
              const accent = accents[item.accent];
              return (
                <div key={item.role} className="min-w-full w-full">
                  <div className="grid gap-0 lg:grid-cols-[380px_1fr]">
                    {/* Left Details Panel */}
                    <div className="min-w-0 border-b border-slate-200 p-6 dark:border-white/10 sm:p-8 lg:border-b-0 lg:border-r">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold ${accent.chip}`}>
                        <Icon className="h-3.5 w-3.5" />
                        {item.role}
                      </span>
                      <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {item.summary}
                      </p>

                      <div className="mt-8 grid gap-2.5">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                          Active Role Metrics
                        </p>
                        {item.kpis.map((kpi) => (
                          <div
                            key={kpi}
                            className="rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-900 dark:border-white/10 dark:bg-[#060c18] dark:text-white"
                          >
                            {kpi}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Simulated Dashboard View */}
                    <div className="min-w-0 bg-slate-50 p-5 sm:p-8 dark:bg-[#060d19]">
                      <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm dark:border-white/10 dark:bg-[#091222]">
                        <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-3.5 dark:border-white/10">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                              Connected Portal
                            </p>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {item.role} Workspace
                            </h4>
                          </div>
                          <span className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold ${accent.chip}`}>
                            <span>Live Sync</span>
                            <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>

                        {/* Simulated Metric Modules */}
                        <div className="grid gap-px bg-slate-100 dark:bg-white/10 md:grid-cols-2">
                          {item.modules.map((module, index) => (
                            <div key={module} className="bg-white p-5 dark:bg-[#091222]">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                  {module}
                                </p>
                                <span className={`h-2 w-2 rounded-full ${accent.fill}`} />
                              </div>
                              <div className="mt-4 space-y-2">
                                <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                                  <div
                                    className={`${accent.fill} h-full rounded-full`}
                                    style={{ width: `${88 - index * 12}%` }}
                                  />
                                </div>
                                <div className="h-2 w-2/3 rounded-full bg-slate-100 dark:bg-white/10" />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Recent Activity Log */}
                        <div className="grid gap-px bg-slate-100 dark:bg-white/10 sm:grid-cols-3">
                          {item.activity.map((act) => (
                            <div
                              key={act}
                              className="bg-white p-4 text-xs font-medium text-slate-600 dark:bg-[#091222] dark:text-slate-300"
                            >
                              <span className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                                Activity Record
                              </span>
                              {act}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Pagination Controls */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => move(-1)}
            aria-label="Previous role dashboard"
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#091222] dark:text-slate-200 dark:hover:bg-white/[0.08]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            {roles.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === idx
                    ? "w-8 bg-slate-900 dark:bg-cyan-400"
                    : "w-2 bg-slate-300 dark:bg-white/20"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => move(1)}
            aria-label="Next role dashboard"
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#091222] dark:text-slate-200 dark:hover:bg-white/[0.08]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
