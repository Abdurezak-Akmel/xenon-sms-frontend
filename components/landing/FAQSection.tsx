"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "How is our school subscription rate calculated?",
    a: "Each school receives a transparent monthly invoice based on active user accounts and metered system usage (such as cloud storage and automated reports). The custom per-student or per-user rate is agreed with your bursar prior to activation.",
  },
  {
    q: "Do schools pay through a third-party payment gateway?",
    a: "No. Xenon subscription fees are settled via direct bank transfer or EFT. The monthly invoice includes full bank transfer instructions and a dedicated reconciliation reference code.",
  },
  {
    q: "Can one school tenant manage multiple branches?",
    a: "Yes. Xenon natively supports multi-branch topologies. Central administrators can monitor consolidated performance while branch principals and cashiers view only their assigned campus.",
  },
  {
    q: "How does legacy data migration work?",
    a: "Our onboarding engineers guide your team through bulk CSV/Excel imports for students, guardians, staff records, subjects, timetable structures, and opening balances with built-in validation checks.",
  },
  {
    q: "What happens if our student enrollment surges mid-term?",
    a: "The monthly invoice dynamically scales with active user count. Schools can configure soft alerts or custom billing caps to ensure budget predictability throughout the academic year.",
  },
  {
    q: "Who has permission to provision new user accounts?",
    a: "The registered School Super Administrator manages institutional roles. They can selectively delegate branch-level creation of teachers, cashiers, students, and guardians.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="w-full max-w-full overflow-x-clip bg-white py-24 dark:bg-[#07111f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              <HelpCircle className="h-3.5 w-3.5 text-cyan-500" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl leading-tight">
              Questions leaders ask before rollout.
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Clear answers regarding pricing formulas, bank transfer billing, branch governance, legacy imports, and role boundaries.
            </p>
          </div>

          <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/90 bg-[#f8fafc] shadow-xs dark:border-white/10 dark:bg-[#091222]">
            {faqs.map((faq, index) => (
              <div
                key={faq.q}
                className="border-b border-slate-200/80 last:border-b-0 dark:border-white/10 transition-colors"
              >
                <button
                  onClick={() => setOpen(open === index ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-100/60 dark:hover:bg-white/[0.02]"
                >
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      open === index ? "rotate-180 text-cyan-500" : ""
                    }`}
                  />
                </button>
                {open === index && (
                  <div className="px-6 pb-6 pt-1">
                    <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
