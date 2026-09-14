"use client";

import React from "react";
import { ArrowRight, CheckCircle2, ClipboardList, Database, GraduationCap, Settings2 } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "1. Institutional Discovery",
    text: "Map branches, academic calendars, fee formulas, role permissions, grading policies, and custom report formats.",
  },
  {
    icon: Database,
    title: "2. Bulk Data Migration",
    text: "Import student rosters, guardians, teachers, classes, historical marks, and opening balances with automated validation.",
  },
  {
    icon: Settings2,
    title: "3. Workspace Customization",
    text: "Configure security rules, cash desk parameters, invoice headers, timetables, and notification channels.",
  },
  {
    icon: GraduationCap,
    title: "4. Staff Induction & Go-Live",
    text: "Conduct focused 30-minute walkthroughs for cashiers, teachers, and admins prior to scheduled cutover.",
  },
];

export function ImplementationSection() {
  return (
    <section className="w-full max-w-full overflow-x-clip bg-[#f8fafc] py-24 dark:bg-[#070e1b]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
            <CheckCircle2 className="h-3.5 w-3.5 text-cyan-500" />
            <span>Rollout Blueprint</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl leading-tight">
            From first setup to daily operations in 4 structured steps.
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            A school operating system succeeds only when adoption is frictionless. Our guided methodology ensures clean records, trained teams, and immediate peace of mind.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article
                key={step.title}
                className="group relative min-w-0 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-xl dark:border-white/10 dark:bg-[#091222]"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-slate-900 text-white shadow-sm dark:bg-cyan-400 dark:text-slate-950 transition-transform group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
                    Phase 0{index + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {step.text}
                </p>

                {index < steps.length - 1 && (
                  <div className="absolute -right-3.5 top-12 z-10 hidden h-7 w-7 place-items-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm dark:border-white/10 dark:bg-[#070e1b] lg:grid">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
