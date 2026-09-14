"use client";

import React from "react";
import {
  Banknote,
  BookOpenCheck,
  Building2,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

const advantages = [
  {
    role: "Super Admin",
    icon: ShieldCheck,
    accent: "border-cyan-500 dark:border-cyan-400",
    badge: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300",
    summary: "Control tenants, schools, branch rollouts, subscription status, resource usage, and global security policy from the system layer.",
    outcomes: ["Clean tenant isolation", "Live usage metrics oversight", "Central permission controls"],
  },
  {
    role: "School Admin",
    icon: Building2,
    accent: "border-blue-500 dark:border-blue-400",
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
    summary: "Keep admissions, branch reports, staff desk, finance summaries, and parent announcements moving from one leadership console.",
    outcomes: ["Faster administrative approvals", "Unified school-wide reports", "Crystal-clear branch visibility"],
  },
  {
    role: "Branch Admin",
    icon: UsersRound,
    accent: "border-emerald-500 dark:border-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    summary: "Run the campus day: class registers, timetable modifications, local incidents, daily roll calls, and branch accountability.",
    outcomes: ["Less manual coordination", "Immediate local accountability", "Fast daily issue resolution"],
  },
  {
    role: "Cashier",
    icon: Banknote,
    accent: "border-amber-500 dark:border-amber-400",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
    summary: "Record bank transfers, receipts, balances, concessions, transfer references, and monthly finance statements with full audit trails.",
    outcomes: ["Cleaner bank reconciliation", "Traceable printed receipts", "Accurate arrears monitoring"],
  },
  {
    role: "Teacher",
    icon: BookOpenCheck,
    accent: "border-violet-500 dark:border-violet-400",
    badge: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
    summary: "Manage lesson plans, registers, gradebooks, assignments, timetables, and guardian notes without seeing unrelated administrative tools.",
    outcomes: ["Faster attendance marking", "Streamlined gradebook updates", "Focused classroom workflow"],
  },
  {
    role: "Student",
    icon: GraduationCap,
    accent: "border-rose-500 dark:border-rose-400",
    badge: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
    summary: "Access timetables, notices, assignments, exam results, attendance logs, and school announcements from an intuitive portal.",
    outcomes: ["Zero missed assignments", "Visible academic progress", "Simple access on mobile devices"],
  },
];

export function RoleAdvantagesSection() {
  return (
    <section id="role-benefits" className="w-full max-w-full overflow-x-clip bg-white py-24 dark:bg-[#07111f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
            <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
            <span>Role Advantages</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl leading-tight">
            The advantage is customized for every user.
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            A cashier should not work inside a teacher screen. A student should not see administration levers. Xenon keeps each workspace useful, fast, and protected.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {advantages.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.role}
                className={`group min-w-0 rounded-2xl border border-slate-200/90 border-t-4 bg-[#fbfcfe] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#091222] ${item.accent}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`grid h-11 w-11 place-items-center rounded-xl ${item.badge} transition-transform group-hover:scale-105`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    {item.role}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.summary}
                </p>
                <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 dark:border-white/5">
                  {item.outcomes.map((outcome) => (
                    <div
                      key={outcome}
                      className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs dark:bg-[#060c18] dark:text-slate-300"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
