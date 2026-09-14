"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Banknote,
  BellRing,
  BookOpenCheck,
  Building2,
  CalendarDays,
  Check,
  ClipboardCheck,
  FileBarChart,
  Layers3,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

type Category = "all" | "governance" | "academic" | "finance" | "operations";

const categories: { id: Category; label: string }[] = [
  { id: "all", label: "All Modules" },
  { id: "governance", label: "Governance & Roles" },
  { id: "academic", label: "Academics & Timetables" },
  { id: "finance", label: "Finance & Transfers" },
  { id: "operations", label: "Campus Operations" },
];

const features = [
  {
    category: "governance",
    icon: Building2,
    title: "Multi-school and branch control",
    text: "Manage tenants, schools, branches, roles, approvals, and consolidated leadership reports from one seat.",
    wins: ["Tenant isolation", "Branch hierarchy", "Permission audit"],
    color: "text-cyan-500 dark:text-cyan-300",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    category: "academic",
    icon: CalendarDays,
    title: "Timetables and academic planning",
    text: "Coordinate classes, teachers, rooms, exams, reports, and curriculum progress without spreadsheet drift.",
    wins: ["Class schedules", "Exam periods", "Report cards"],
    color: "text-sky-500 dark:text-sky-300",
    bg: "bg-sky-500/10 border-sky-500/20",
  },
  {
    category: "finance",
    icon: Banknote,
    title: "Bank-transfer finance records",
    text: "Track invoices, transfers, receipts, balances, discounts, and monthly school billing statements cleanly.",
    wins: ["Transfer references", "Cashier receipts", "Arrears reports"],
    color: "text-emerald-500 dark:text-emerald-300",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    category: "academic",
    icon: BookOpenCheck,
    title: "Teacher gradebook workspace",
    text: "Give teachers a focused surface for registers, assessments, assignments, lesson notes, and guardian updates.",
    wins: ["Marks entry", "Attendance registers", "Assignments"],
    color: "text-violet-500 dark:text-violet-300",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    category: "operations",
    icon: ClipboardCheck,
    title: "Attendance and daily registers",
    text: "Keep student and staff attendance current at class, branch, and whole-school level in real time.",
    wins: ["Class roll calls", "Late arrivals", "Absence follow-up"],
    color: "text-amber-500 dark:text-amber-300",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    category: "operations",
    icon: BellRing,
    title: "Announcements and notices",
    text: "Send school, branch, class, teacher, and student notices from the same administrative workflow.",
    wins: ["Targeted notices", "Read tracking", "Parent updates"],
    color: "text-rose-500 dark:text-rose-300",
    bg: "bg-rose-500/10 border-rose-500/20",
  },
  {
    category: "governance",
    icon: UsersRound,
    title: "User lifecycle management",
    text: "Invite, assign, suspend, archive, and review users with rigorous permission boundaries.",
    wins: ["Staff accounts", "Student accounts", "Role switching"],
    color: "text-teal-500 dark:text-teal-300",
    bg: "bg-teal-500/10 border-teal-500/20",
  },
  {
    category: "governance",
    icon: FileBarChart,
    title: "Reports and audit trails",
    text: "Prepare leadership, academic, attendance, billing, and usage reports with traceable record history.",
    wins: ["Usage reports", "Data exports", "Change history"],
    color: "text-indigo-500 dark:text-indigo-300",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
];

export function FeaturesSection({ onOpenDemoModal }: { onOpenDemoModal: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const filteredFeatures =
    selectedCategory === "all" ? features : features.filter((feature) => feature.category === selectedCategory);

  return (
    <section id="features" className="w-full max-w-full overflow-x-clip bg-white py-24 dark:bg-[#07111f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              <Layers3 className="h-3.5 w-3.5 text-cyan-500" />
              <span>Platform Modules</span>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl leading-tight">
              The core school workflows, unified in one system.
            </h2>
          </div>
          <div className="min-w-0">
            <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Xenon keeps operational tools connected, while role permissions keep each workspace focused. Leaders see the whole institution; staff see only what they need.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-slate-950 text-white shadow-md dark:bg-cyan-400 dark:text-slate-950"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {filteredFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="group min-w-0 rounded-2xl border border-slate-200/90 bg-[#fbfcfe] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-xl dark:border-white/10 dark:bg-[#091222] dark:hover:border-cyan-400/40"
              >
                <div className={`inline-grid h-11 w-11 place-items-center rounded-xl border ${feature.bg} transition-transform group-hover:scale-105`}>
                  <Icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {feature.text}
                </p>
                <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4 dark:border-white/5">
                  {feature.wins.map((win) => (
                    <li key={win} className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{win}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        {/* Callout Banner */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950 via-[#0a182e] to-[#07111f] p-6 text-white shadow-xl lg:flex lg:items-center lg:justify-between lg:p-8">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/30">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight text-white">
                Need a school-specific workflow or custom report?
              </h3>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-300">
                Xenon adapts imports, role boundaries, invoice rules, and reporting to match your exact institutional policies prior to rollout.
              </p>
            </div>
          </div>
          <div className="mt-6 shrink-0 lg:mt-0 lg:ml-6">
            <button
              onClick={onOpenDemoModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 shadow-md transition-all hover:bg-cyan-300 hover:-translate-y-0.5"
            >
              <span>Request Walkthrough</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
