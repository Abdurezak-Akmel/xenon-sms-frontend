"use client";

import React from "react";
import { Banknote, Clock3, FileCheck2, ShieldCheck, TrendingUp } from "lucide-react";

const metrics = [
  {
    value: "6",
    label: "Role Workspaces",
    text: "Super admin, school admin, branch admin, cashier, teacher, and student experiences are isolated by permission.",
    icon: ShieldCheck,
    color: "text-cyan-500 dark:text-cyan-300",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    value: "1",
    label: "Monthly Invoice",
    text: "Each school receives a transparent statement for active users, resource usage, adjustments, and bank transfer details.",
    icon: Banknote,
    color: "text-emerald-500 dark:text-emerald-300",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    value: "72h",
    label: "Guided Import",
    text: "Student, staff, class, guardian, and opening balance records are imported smoothly during guided onboarding.",
    icon: FileCheck2,
    color: "text-amber-500 dark:text-amber-300",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    value: "4+ hrs",
    label: "Saved Weekly",
    text: "Teachers and administrators reclaim valuable hours by eliminating repeated registers and spreadsheet chasing.",
    icon: Clock3,
    color: "text-indigo-500 dark:text-indigo-300",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
];

export function MetricsSection() {
  return (
    <section id="metrics" className="w-full max-w-full overflow-x-clip bg-[#f8fafc] py-24 dark:bg-[#070e1b]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              <TrendingUp className="h-3.5 w-3.5 text-cyan-500" />
              <span>Operating Impact</span>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl leading-tight">
              Designed around the work schools repeat every day.
            </h2>
          </div>
          <p className="min-w-0 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            A good school system should reduce coordination noise. Xenon keeps people in their lane, gives leaders cross-school visibility, and makes billing clear enough for monthly finance review.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <article
                key={metric.label}
                className="group min-w-0 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-xl dark:border-white/10 dark:bg-[#091222] dark:hover:border-cyan-400/40"
              >
                <div className={`inline-grid h-12 w-12 place-items-center rounded-xl border ${metric.bg} transition-transform group-hover:scale-105`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <p className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {metric.value}
                </p>
                <h3 className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-400">
                  {metric.label}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {metric.text}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
