"use client";

import React from "react";
import {
  TrendingUp,
  Clock3,
  DollarSign,
  ShieldCheck,
  Award,
  Users,
  Building2,
  CheckCircle,
  Zap,
} from "lucide-react";

export function MetricsSection() {
  const primaryMetrics = [
    {
      value: "98.4%",
      label: "Attendance Precision",
      highlight: "+34% decrease in unexcused absence",
      description:
        "Automated biometric & RFID gate tracking connected to immediate SMS guardian notifications eliminates proxy check-ins.",
      icon: TrendingUp,
      color: "from-blue-600 to-cyan-500",
      bgLight: "bg-blue-50 dark:bg-blue-950/50",
      borderColor: "border-blue-200 dark:border-blue-900/60",
    },
    {
      value: "4.8 hrs",
      label: "Saved Weekly / Teacher",
      highlight: "Over 210 hours returned per year",
      description:
        "Intelligent rubric grading, auto-populated lesson plans, and single-click PDF report cards allow faculty to focus on teaching.",
      icon: Clock3,
      color: "from-indigo-600 to-purple-500",
      bgLight: "bg-indigo-50 dark:bg-indigo-950/50",
      borderColor: "border-indigo-200 dark:border-indigo-900/60",
    },
    {
      value: "$185k+",
      label: "Annual Tuition Leakage Prevented",
      highlight: "89% reduction in overdue receivables",
      description:
        "Automated recurring billing, flexible installment plans, and zero-fee bank integrations systematically recover lost revenue.",
      icon: DollarSign,
      color: "from-emerald-600 to-teal-500",
      bgLight: "bg-emerald-50 dark:bg-emerald-950/50",
      borderColor: "border-emerald-200 dark:border-emerald-900/60",
    },
    {
      value: "99.99%",
      label: "Enterprise Uptime SLA",
      highlight: "Sub-second global page loads",
      description:
        "Multi-region cloud infrastructure with continuous database replication, automated backups, and bank-grade data encryption.",
      icon: ShieldCheck,
      color: "from-amber-600 to-orange-500",
      bgLight: "bg-amber-50 dark:bg-amber-950/50",
      borderColor: "border-amber-200 dark:border-amber-900/60",
    },
  ];

  const proofPoints = [
    { label: "Active Students & Parents", value: "450,000+" },
    { label: "Accredited Campuses Supported", value: "480+" },
    { label: "Historical Data Migration Time", value: "< 72 Hours" },
    { label: "Annual Client Retention Rate", value: "99.2%" },
  ];

  return (
    <section id="metrics" className="py-20 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Proven Institutional Impact</span>
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Measurable Significance Across Every Department
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Education leadership teams choose Xenon not just for ease of use, but for transformative operational outcomes verified by hundreds of academy audits.
          </p>
        </div>

        {/* Primary Metric Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {primaryMetrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`relative rounded-2xl bg-white dark:bg-slate-800/90 p-6 border ${item.borderColor} shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${item.bgLight} flex items-center justify-center mb-5`}>
                    <Icon className="w-6 h-6 text-slate-800 dark:text-slate-100" />
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                      {item.value}
                    </span>
                  </div>

                  <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                    {item.label}
                  </h3>

                  <div className="mt-2 inline-block px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {item.highlight}
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Audited operational benchmark</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Secondary Trust Strip */}
        <div className="mt-12 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 p-6 lg:p-8 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700">
            {proofPoints.map((point, index) => (
              <div key={index} className={index > 0 ? "pt-4 md:pt-0" : ""}>
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                  {point.value}
                </div>
                <div className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                  {point.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
