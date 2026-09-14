"use client";

import React from "react";
import { DatabaseBackup, KeyRound, LifeBuoy, LockKeyhole, ShieldCheck, UserCog } from "lucide-react";

const trustItems = [
  {
    icon: KeyRound,
    title: "Granular Role Boundaries",
    text: "Access is strictly split by operational responsibility: finance, teaching, student, cashier, and system desks remain segregated.",
    color: "text-cyan-500 dark:text-cyan-300",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: LockKeyhole,
    title: "Isolated School Tenants",
    text: "Each institution's data resides in isolated schemas, preventing cross-tenant leakage while allowing seamless branch management.",
    color: "text-sky-500 dark:text-sky-300",
    bg: "bg-sky-500/10 border-sky-500/20",
  },
  {
    icon: DatabaseBackup,
    title: "Automated Resilient Backups",
    text: "Continuous replication and point-in-time recovery preserve student transcripts, attendance registries, and fee audit history.",
    color: "text-emerald-500 dark:text-emerald-300",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: UserCog,
    title: "Complete Administrative Audit",
    text: "Every critical modification—such as fee overrides, permission elevation, or grade adjustments—is timestamped with author identity.",
    color: "text-indigo-500 dark:text-indigo-300",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: LifeBuoy,
    title: "Guided Institutional Onboarding",
    text: "A dedicated implementation specialist assists your bursars, principals, and IT staff through CSV imports and branch setup.",
    color: "text-amber-500 dark:text-amber-300",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
];

export function TrustAndSupportSection() {
  return (
    <section className="w-full max-w-full overflow-x-clip bg-white py-24 dark:bg-[#07111f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-500" />
              <span>Institutional Safeguards</span>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl leading-tight">
              Serious school operations demand quiet, reliable infrastructure.
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Xenon is engineered from first principles for multi-tier permission separation, audit traceability, and zero downtime across exam periods.
            </p>
          </div>

          <div className="min-w-0 grid gap-5 sm:grid-cols-2">
            {trustItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className={`min-w-0 rounded-2xl border border-slate-200/90 bg-[#fbfcfe] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-xl dark:border-white/10 dark:bg-[#091222] ${
                    index === 0 ? "sm:col-span-2" : ""
                  }`}
                >
                  <div className={`inline-grid h-11 w-11 place-items-center rounded-xl border ${item.bg}`}>
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
