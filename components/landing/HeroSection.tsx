"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  BarChart3,
  Bell,
  BookOpenCheck,
  Building2,
  CheckCircle2,
  GraduationCap,
  Lock,
  LogIn,
  School,
  Sparkles,
  UserPlus,
  UsersRound,
} from "lucide-react";

interface HeroSectionProps {
  onOpenDemoModal: () => void;
}

const workspaceTabs = [
  {
    id: "operations",
    label: "Operations",
    icon: Building2,
    headline: "Branch activity is live & synchronized",
    rows: [
      ["Morning attendance", "94.8%", "Synced"],
      ["Pending approvals", "7 items", "Review"],
      ["Open incidents", "2 reports", "Assigned"],
    ],
  },
  {
    id: "finance",
    label: "Finance",
    icon: Banknote,
    headline: "Bank transfers reconciled automatically",
    rows: [
      ["Transfer references", "83 verified", "Posted"],
      ["Monthly invoice", "KSh 184,500", "Draft"],
      ["Resource usage", "72% of cap", "Healthy"],
    ],
  },
  {
    id: "academics",
    label: "Academics",
    icon: BookOpenCheck,
    headline: "Classroom gradebooks are up to date",
    rows: [
      ["Gradebooks", "214 updates", "Ready"],
      ["Timetable conflicts", "0 clashes", "Clear"],
      ["Report cards", "38 pending", "Review"],
    ],
  },
];

const trustItems = [
  "Custom rate per school",
  "Bank transfer billing",
  "Six dedicated role workspaces",
  "Branch-ready hierarchical access",
];

export function HeroSection({ onOpenDemoModal }: HeroSectionProps) {
  const [activeTab, setActiveTab] = useState(workspaceTabs[0]);

  return (
    <section className="relative w-full max-w-full overflow-x-clip bg-gradient-to-b from-slate-50 via-[#f0f5ff]/60 to-white text-slate-900 transition-colors duration-300 dark:from-[#050b14] dark:via-[#07111f] dark:to-[#0a1526] dark:text-white">
      {/* Dynamic ambient lighting & grid mesh */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:36px_36px]" />
      <div className="absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 -z-10 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 md:pb-24 md:pt-40 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 shadow-xs backdrop-blur-md dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300">
              <Sparkles className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-300 animate-pulse" />
              <span>School management without role confusion</span>
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl leading-[1.1]">
              Run every school role from{" "}
              <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-700 bg-clip-text text-transparent dark:from-cyan-300 dark:via-teal-200 dark:to-sky-300">
                one clean operating system.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              Xenon SMS brings school administration, branches, finance,
              teachers, students, academics, attendance, and monthly billing
              into one calm, permission-aware platform.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:-translate-y-0.5 hover:from-cyan-300 hover:to-teal-300"
              >
                <UserPlus className="h-4 w-4" />
                <span>Get Started Free</span>
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-xs transition-all hover:-translate-y-0.5 hover:border-cyan-500/50 hover:bg-slate-50 dark:border-white/20 dark:bg-white/10 dark:text-white dark:backdrop-blur-md dark:hover:border-cyan-400/40 dark:hover:bg-white/15"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
              <button
                onClick={onOpenDemoModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-50/80 px-6 py-3.5 text-sm font-semibold text-cyan-800 transition-all hover:-translate-y-0.5 hover:bg-cyan-100 dark:border-cyan-400/30 dark:bg-cyan-400/5 dark:text-cyan-200 dark:hover:bg-cyan-400/15"
              >
                <span>Discuss Billing</span>
                <ArrowRight className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
              </button>
            </div>

            <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
              {trustItems.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 sm:text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Dashboard Preview */}
          <div id="preview" className="relative min-w-0">
            {/* Pill callout badge */}
            <div className="absolute right-2 -top-3.5 hidden rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xl shadow-cyan-500/20 backdrop-blur-md lg:block">
              Bank transfer billing
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/15 dark:bg-[#091222]/95 dark:shadow-black/60">
              {/* Window Chrome Header */}
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 dark:border-white/10 dark:bg-black/30 dark:text-slate-400">
                  <Lock className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                  <span>xenon.sms/dashboard</span>
                </div>
                <div className="w-12" />
              </div>

              <div className="grid min-h-[500px] lg:grid-cols-[160px_1fr]">
                {/* Mini Side Rail */}
                <aside className="hidden border-r border-slate-200 bg-slate-50/80 p-3 dark:border-white/10 dark:bg-[#060c18]/80 lg:block">
                  <div className="flex items-center gap-2 px-1 py-1">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-cyan-400 text-slate-950 shadow-xs shadow-cyan-400/30">
                      <School className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">Xenon</span>
                  </div>
                  <div className="mt-6 space-y-1">
                    {[
                      "Overview",
                      "Branches",
                      "Finance",
                      "Classes",
                      "Users",
                      "Reports",
                    ].map((item, index) => (
                      <div
                        key={item}
                        className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                          index === 0
                            ? "bg-cyan-500/15 text-cyan-700 font-bold border border-cyan-500/30 dark:bg-cyan-400/15 dark:text-cyan-300 dark:border-cyan-400/30"
                            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </aside>

                {/* Dashboard Main Panel */}
                <div className="p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
                        Executive View
                      </p>
                      <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                        {activeTab.headline}
                      </h2>
                    </div>
                    <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner dark:border-white/10 dark:bg-[#050b14]">
                      {workspaceTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab.id === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                              isActive
                                ? "bg-white text-slate-950 shadow-sm font-bold dark:bg-white dark:text-slate-950"
                                : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">
                              {tab.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Top 3 KPI Cards */}
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {[
                      ["Active users", "4,820", UsersRound, "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20"],
                      ["Branches", "64", Building2, "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"],
                      ["Learners", "38,450", GraduationCap, "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20"],
                    ].map(([label, value, Icon, styleClass]) => {
                      const MetricIcon = Icon as typeof UsersRound;
                      return (
                        <div
                          key={label as string}
                          className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 transition-colors hover:border-cyan-400/40 dark:border-white/10 dark:bg-white/[0.03]"
                        >
                          <div className={`inline-grid h-7 w-7 place-items-center rounded-lg border ${styleClass as string}`}>
                            <MetricIcon className="h-3.5 w-3.5" />
                          </div>
                          <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {value as string}
                          </p>
                          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                            {label as string}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Middle Split Chart & Quick Items */}
                  <div className="mt-4 grid gap-3 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 dark:border-white/10 dark:bg-white/[0.03]">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Monthly Operating Signal
                        </h3>
                        <BarChart3 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <div className="mt-4 flex h-32 items-end gap-2 px-1">
                        {[48, 64, 42, 82, 58, 88, 72, 96].map(
                          (height, index) => (
                            <div
                              key={index}
                              className="flex flex-1 flex-col justify-end"
                            >
                              <div
                                className={`rounded-t transition-all duration-300 hover:brightness-110 ${
                                  index % 3 === 0
                                    ? "bg-cyan-500 dark:bg-cyan-400"
                                    : index % 3 === 1
                                    ? "bg-emerald-500 dark:bg-emerald-400"
                                    : "bg-indigo-500 dark:bg-indigo-400"
                                }`}
                                style={{ height: `${height}%` }}
                              />
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 dark:border-white/10 dark:bg-white/[0.03]">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Today&apos;s Actions
                        </h3>
                        <Bell className="h-4 w-4 text-amber-500 dark:text-amber-300" />
                      </div>
                      <div className="mt-3 space-y-2">
                        {[
                          ["Fee statement draft", "Ready for review"],
                          ["Teacher attendance", "2 leave approvals"],
                          ["Class timetable", "Updated at 08:15"],
                        ].map(([title, meta]) => (
                          <div
                            key={title}
                            className="rounded-lg border border-slate-200 bg-white p-2.5 dark:border-white/5 dark:bg-[#050b14]/70"
                          >
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                              {title}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {meta}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Module Status Table */}
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
                    <table className="w-full min-w-0 text-left">
                      <thead className="bg-slate-100 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:bg-[#050b14] dark:text-slate-400">
                        <tr>
                          <th className="px-3.5 py-2.5">Module</th>
                          <th className="px-3.5 py-2.5">Snapshot</th>
                          <th className="px-3.5 py-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs dark:divide-white/5">
                        {activeTab.rows.map((row) => (
                          <tr key={row[0]}>
                            <td className="px-3.5 py-2 font-semibold text-slate-900 dark:text-white">
                              {row[0]}
                            </td>
                            <td className="px-3.5 py-2 text-slate-600 dark:text-slate-300">
                              {row[1]}
                            </td>
                            <td className="px-3.5 py-2">
                              <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                                {row[2]}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Partner Schools", "18", "Across 6 administrative regions"],
            ["Active Branches", "64", "Synchronized in real time"],
            ["Platform Users", "4,820", "Protected by role boundaries"],
            ["Billing Mode", "Bank Transfer", "Direct transparent monthly terms"],
          ].map(([label, value, sub]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-xs backdrop-blur-md transition-all hover:border-cyan-500/40 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-cyan-400/30"
            >
              <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {value}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">
                {label}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
