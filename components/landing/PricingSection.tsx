"use client";

import React from "react";
import { ArrowRight, Banknote, Check, Database, FileText, ServerCog, Sparkles, UsersRound } from "lucide-react";

interface PricingSectionProps {
  onOpenDemoModal: () => void;
}

const formula = [
  {
    label: "Active Users",
    icon: UsersRound,
    text: "Admins, cashiers, teachers, students, and enabled staff accounts measured during the monthly cycle.",
    color: "text-cyan-500 dark:text-cyan-300",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    label: "Resource Volume",
    icon: ServerCog,
    text: "Document storage, audit ledgers, automated background jobs, term reports, and network bandwidth.",
    color: "text-sky-500 dark:text-sky-300",
    bg: "bg-sky-500/10 border-sky-500/20",
  },
  {
    label: "Institutional Scope",
    icon: FileText,
    text: "Agreed support SLA, data migration assistance, multi-branch limits, and negotiated rate concessions.",
    color: "text-emerald-500 dark:text-emerald-300",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
];

const invoiceRows = [
  { item: "Active User Subscription", basis: "Measured Monthly", tag: "Metered", note: "Agreed rate per active account" },
  { item: "Cloud Infrastructure & Storage", basis: "Usage Volume", tag: "Scaled", note: "Database records, attachments & traffic" },
  { item: "Service Tier & Legacy Migration", basis: "Fixed Term", tag: "Agreement", note: "Priority SLA hotline & training desk" },
  { item: "Settlement Method", basis: "Bank Transfer", tag: "Direct", note: "Reconciliation code printed on invoice" },
];

const included = [
  "No rigid public tier forced on your school",
  "Tailored per-user rate matching institution size",
  "Itemized monthly usage statement for bursars",
  "Direct bank transfer instructions & reference",
  "Cashier reconciliation audit workflow",
  "Automated budget threshold & usage alerts",
];

export function PricingSection({ onOpenDemoModal }: PricingSectionProps) {
  return (
    <section id="pricing" className="w-full max-w-full overflow-x-clip bg-[#f8fafc] py-24 dark:bg-[#070e1b]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* Left Summary */}
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              <Database className="h-3.5 w-3.5 text-cyan-500" />
              <span>Transparent Monthly Billing</span>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl leading-tight">
              Each school gets its own transparent billing rate.
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Pricing is calculated based on active users and measured system resources used per month. Xenon issues a transparent monthly invoice, and the school settles directly via bank transfer.
            </p>

            {/* Formula Pill Box */}
            <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.04] p-5 backdrop-blur-xs">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
                Formula Blueprint
              </p>
              <p className="mt-2 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Monthly Invoice = Active Accounts + Resource Tier + Institutional Terms
              </p>
            </div>

            <div className="mt-8">
              <button
                onClick={onOpenDemoModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:-translate-y-0.5 hover:from-cyan-300 hover:to-teal-300"
              >
                <span>Discuss Your School Rate</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right 3 Formula Cards */}
          <div className="grid gap-4 sm:grid-cols-3 min-w-0">
            {formula.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.label}
                  className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-lg dark:border-white/10 dark:bg-[#091222]"
                >
                  <div className={`inline-grid h-10 w-10 place-items-center rounded-xl border ${item.bg}`}>
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        {/* Invoice Structure & Inclusions Grid */}
        <div className="mt-14 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Sample Invoice Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs dark:border-white/10 dark:bg-[#091222] min-w-0">
            <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4 dark:border-white/10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Sample Invoice Breakdown
                </p>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  100% Itemized Before Settlement
                </h3>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Banknote className="h-5 w-5" />
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[550px] text-left">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:bg-white/[0.02]">
                  <tr>
                    <th className="px-6 py-3">Line Item</th>
                    <th className="px-6 py-3">Basis</th>
                    <th className="px-6 py-3">Audit Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs dark:divide-white/5">
                  {invoiceRows.map((row) => (
                    <tr key={row.item}>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        {row.item}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-300">
                          {row.basis}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {row.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Included Privileges Box */}
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-[#0a182e] to-[#07111f] p-6 text-white shadow-xl sm:p-8 min-w-0">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                Guaranteed In Every Plan
              </p>
            </div>
            <div className="mt-5 space-y-2.5">
              {included.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.04] px-3.5 py-2.5 text-xs font-semibold text-slate-200"
                >
                  <Check className="h-4 w-4 shrink-0 text-cyan-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs leading-relaxed text-slate-400 border-t border-white/10 pt-4">
              Direct settlement via bank wire or EFT. No gateway transaction surcharges or hidden per-student processing penalties.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
