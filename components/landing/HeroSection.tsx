"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  ShieldCheck,
  Zap,
  GraduationCap,
  Users,
  CreditCard,
  CalendarDays,
  TrendingUp,
  Clock3,
  Bell,
  Check,
  Laptop,
  Building2,
  ChevronRight,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";

interface HeroSectionProps {
  onOpenDemoModal: () => void;
}

export function HeroSection({ onOpenDemoModal }: HeroSectionProps) {
  const [activeTab, setActiveTab] = useState<"academics" | "attendance" | "finance" | "comms">("academics");

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/10 to-cyan-400/10 blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-purple-500/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Announcement Pill */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-700 dark:text-blue-300 shadow-sm hover:border-blue-300 transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Next-Gen Xenon 3.0 Released</span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <a href="#features" className="underline hover:text-blue-800 dark:hover:text-blue-200 flex items-center gap-0.5">
              Explore capabilities <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="mt-7 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            The Unified Operating System for{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
              Modern Schools & Academy Groups
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-3xl mx-auto">
            Say goodbye to fragmented spreadsheets, disconnected portals, and manual billing.
            Xenon delivers effortless attendance, automated fee recovery, intelligent timetables, and unified parent communications in a single, lightning-fast platform.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenDemoModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 active:scale-[0.98] transition-all duration-150"
            >
              <span>Schedule 15-Min Live Demo</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <a
              href="#preview"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm transition-all"
            >
              <Play className="w-4 h-4 text-blue-600 dark:text-blue-400 fill-blue-600 dark:fill-blue-400" />
              <span>Interactive Platform Tour</span>
            </a>
          </div>

          {/* Quick trust metrics */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 14-Day fully guided sandbox
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free historical data migration
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-500" /> FERPA & GDPR compliant
            </span>
          </div>
        </div>

        {/* Interactive Showcase Preview Window */}
        <div id="preview" className="mt-14 sm:mt-18 relative max-w-6xl mx-auto">
          {/* Glass frame container */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-2xl shadow-blue-900/10 overflow-hidden backdrop-blur-xl">
            {/* Window header */}
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/90" />
                <div className="w-3 h-3 rounded-full bg-amber-400/90" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/90" />
                <span className="ml-3 text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:inline-block">
                  Xenon Command Center • Adams Hill Academy (Multi-Branch)
                </span>
              </div>

              {/* Module Tab Switcher */}
              <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800/80 p-1 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setActiveTab("academics")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === "academics"
                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Academics & Timetable
                </button>
                <button
                  onClick={() => setActiveTab("attendance")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === "attendance"
                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Attendance & RFID
                </button>
                <button
                  onClick={() => setActiveTab("finance")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === "finance"
                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Finance & Invoicing
                </button>
                <button
                  onClick={() => setActiveTab("comms")}
                  className={`px-3 py-1 rounded-md transition-all hidden sm:block ${
                    activeTab === "comms"
                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Parent Feed
                </button>
              </div>
            </div>

            {/* Showcase Dynamic Content Area */}
            <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/50 dark:bg-[#0c1424]/60">
              {activeTab === "academics" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Stats Bar */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/70 shadow-xs">
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                        <span>Active Classes</span>
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">128 Sections</p>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" /> 0 Schedule Conflicts
                      </span>
                    </div>

                    <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/70 shadow-xs">
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                        <span>Curriculum Progress</span>
                        <CalendarDays className="w-4 h-4 text-indigo-600" />
                      </div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">84.2%</p>
                      <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 mt-1">
                        +5% ahead of term milestone
                      </span>
                    </div>

                    <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/70 shadow-xs">
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                        <span>Teacher Fill Rate</span>
                        <Users className="w-4 h-4 text-emerald-600" />
                      </div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">99.1%</p>
                      <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                        Auto-substitutes assigned: 3
                      </span>
                    </div>

                    <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/70 shadow-xs">
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
                        <span>Report Cards Ready</span>
                        <BarChart3 className="w-4 h-4 text-amber-600" />
                      </div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">1,248 / 1,248</p>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
                        100% digital signatures verified
                      </span>
                    </div>
                  </div>

                  {/* Schedule Timetable Snapshot */}
                  <div className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200/80 dark:border-slate-700 p-5 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          Live Master Schedule • Grade 10-A (STEM Track)
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Automated conflict solver powered by Xenon Engine
                        </p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                        Live Room Sync Active
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
                      <div className="p-3 rounded-lg border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                          08:30 - 09:45 AM
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Advanced Physics II</h5>
                        <p className="text-[11px] text-slate-500">Dr. Aris Vance • Lab 301</p>
                      </div>

                      <div className="p-3 rounded-lg border-l-4 border-l-emerald-500 bg-emerald-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                          10:00 - 11:15 AM
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Calculus & Modeling</h5>
                        <p className="text-[11px] text-slate-500">Prof. Elena Rostova • Hall B</p>
                      </div>

                      <div className="p-3 rounded-lg border-l-4 border-l-purple-500 bg-purple-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                          11:30 - 12:45 PM
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Computer Science Principles</h5>
                        <p className="text-[11px] text-slate-500">K. Thompson • Innovation Suite</p>
                      </div>

                      <div className="p-3 rounded-lg border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                          01:30 - 02:45 PM
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Global Literature & Rhetoric</h5>
                        <p className="text-[11px] text-slate-500">M. Sterling • Humanities 104</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "attendance" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-800/90 p-5 rounded-xl border border-slate-200/80 dark:border-slate-700">
                      <span className="text-xs font-semibold text-slate-500">Campus Attendance Rate</span>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-extrabold text-slate-900 dark:text-white">96.8%</span>
                        <span className="text-xs font-semibold text-emerald-600">+3.1% vs last month</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full w-[96.8%]" />
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800/90 p-5 rounded-xl border border-slate-200/80 dark:border-slate-700">
                      <span className="text-xs font-semibold text-slate-500">RFID Gate Scans Today</span>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-extrabold text-slate-900 dark:text-white">1,214</span>
                        <span className="text-xs font-semibold text-blue-600">98% on-time check-in</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Auto SMS dispatched to 34 guardians of late arrivals</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800/90 p-5 rounded-xl border border-slate-200/80 dark:border-slate-700">
                      <span className="text-xs font-semibold text-slate-500">Staff Present</span>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-extrabold text-slate-900 dark:text-white">94 / 96</span>
                        <span className="text-xs font-semibold text-emerald-600">2 Approved Leaves</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">All classroom coverage covered without disruption</p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200/80 dark:border-slate-700 p-4">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                      Real-time Gate Activity Log (Live Stream)
                    </h5>
                    <div className="divide-y divide-slate-100 dark:divide-slate-700 text-xs">
                      <div className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-[10px]">
                            SK
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">Sophia King (Grade 11B)</span>
                            <span className="text-slate-400 ml-2">• Turnstile North 2</span>
                          </div>
                        </div>
                        <span className="text-emerald-600 font-medium">Checked In (08:12 AM)</span>
                      </div>
                      <div className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-[10px]">
                            JW
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">James Walker (Grade 9A)</span>
                            <span className="text-slate-400 ml-2">• Bus Route 14 GPS Sensor</span>
                          </div>
                        </div>
                        <span className="text-emerald-600 font-medium">Boarded Bus (07:44 AM)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "finance" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-800/90 p-5 rounded-xl border border-slate-200/80 dark:border-slate-700">
                      <span className="text-xs font-semibold text-slate-500">Term 1 Fees Collected</span>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-extrabold text-slate-900 dark:text-white">$482,900</span>
                        <span className="text-xs font-semibold text-emerald-600">92.4% settled</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Recovered $38,400 previously delinquent balances</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800/90 p-5 rounded-xl border border-slate-200/80 dark:border-slate-700">
                      <span className="text-xs font-semibold text-slate-500">Auto Recurring Invoices</span>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-extrabold text-slate-900 dark:text-white">986</span>
                        <span className="text-xs font-semibold text-blue-600">Active Direct Debits</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Zero reconciliation errors across 4 bank gateways</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800/90 p-5 rounded-xl border border-slate-200/80 dark:border-slate-700">
                      <span className="text-xs font-semibold text-slate-500">Scholarships & Grants</span>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-extrabold text-slate-900 dark:text-white">$64,000</span>
                        <span className="text-xs font-semibold text-purple-600">52 recipients</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Audited endowment fund disbursement tracking</p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200/80 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Recent Instant Invoices & Multi-Gateway Transactions
                      </h5>
                      <span className="text-[11px] text-blue-600 font-semibold cursor-pointer hover:underline">
                        Export Audit Ledger (.CSV/.XLS)
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="text-slate-400 border-b border-slate-200 dark:border-slate-700">
                            <th className="pb-2">Invoice #</th>
                            <th className="pb-2">Student</th>
                            <th className="pb-2">Amount</th>
                            <th className="pb-2">Method</th>
                            <th className="pb-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          <tr>
                            <td className="py-2.5 font-semibold">INV-2026-0891</td>
                            <td>Liam Gallagher (Grade 7B)</td>
                            <td className="font-bold text-slate-900 dark:text-white">$1,450.00</td>
                            <td>Stripe / Visa</td>
                            <td><span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold text-[10px]">Instant Cleared</span></td>
                          </tr>
                          <tr>
                            <td className="py-2.5 font-semibold">INV-2026-0890</td>
                            <td>Aaliyah Patel (Grade 12A)</td>
                            <td className="font-bold text-slate-900 dark:text-white">$2,100.00</td>
                            <td>Bank Transfer ACH</td>
                            <td><span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold text-[10px]">Instant Cleared</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "comms" && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-800/90 p-5 rounded-xl border border-slate-200/80 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                            Parent Portal App Engagement
                          </h5>
                          <p className="text-[11px] text-slate-500">97.6% active parent mobile app adoption</p>
                        </div>
                      </div>
                      <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 text-xs">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          Broadcast: &quot;Science Fair Timetable & Lab Safety Protocol&quot;
                        </p>
                        <p className="text-slate-500 mt-1">Delivered to 1,248 guardians • 99.2% read confirmation rate</p>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800/90 p-5 rounded-xl border border-slate-200/80 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                            Direct 1-on-1 Parent & Teacher Chat
                          </h5>
                          <p className="text-[11px] text-slate-500">End-to-end monitored school compliance messaging</p>
                        </div>
                      </div>
                      <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 text-xs">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          Mrs. Diaz (Math Dept): &quot;Homework feedback updated for Mia&quot;
                        </p>
                        <p className="text-slate-500 mt-1">Guardian viewed attachment • 4 min response time</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
