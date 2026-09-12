"use client";

import React, { useState } from "react";
import {
  Building2,
  CalendarDays,
  CreditCard,
  GraduationCap,
  ClipboardCheck,
  Smartphone,
  Users2,
  FileBarChart,
  Check,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";

export function FeaturesSection({ onOpenDemoModal }: { onOpenDemoModal: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Capabilities" },
    { id: "governance", label: "Multi-Campus Governance" },
    { id: "academic", label: "Academics & Exams" },
    { id: "finance", label: "Finances & Tuition" },
    { id: "operations", label: "Operations & Safety" },
  ];

  const features = [
    {
      id: "multi-tenant",
      category: "governance",
      icon: Building2,
      title: "Multi-Tenant & Multi-Branch Architecture",
      badge: "Enterprise Ready",
      description:
        "Manage multiple school branches, campuses, and academies from a central executive dashboard while preserving local branch autonomy and data privacy.",
      highlights: [
        "Hierarchical Super Admin, School Admin & Branch roles",
        "Cross-branch analytics and staff transfers",
        "Strict database row-level security per institution",
      ],
      color: "blue",
    },
    {
      id: "timetable",
      category: "academic",
      icon: CalendarDays,
      title: "AI-Assisted Timetabling & Scheduling",
      badge: "Zero Conflicts",
      description:
        "Generate optimized master class schedules in minutes without teacher double-booking, room shortages, or curriculum imbalances.",
      highlights: [
        "Automatic constraint solving for faculty availability",
        "Laboratory, sports facility & room capacity booking",
        "Instant emergency substitute teacher assignment",
      ],
      color: "indigo",
    },
    {
      id: "billing",
      category: "finance",
      icon: CreditCard,
      title: "Automated Tuition Billing & Multi-Gateway Collection",
      badge: "Revenue Recovery",
      description:
        "Eliminate overdue fee chases with recurring direct debits, installment plans, digital receipts, and real-time bank reconciliation.",
      highlights: [
        "Stripe, Bank Transfer, Mobile Money & Cash support",
        "Automated WhatsApp & SMS payment reminders",
        "Instant export to QuickBooks, Xero & ERP systems",
      ],
      color: "emerald",
    },
    {
      id: "academics",
      category: "academic",
      icon: GraduationCap,
      title: "Dynamic Gradebook, Transcripts & Report Cards",
      badge: "Custom Rubrics",
      description:
        "Flexible assessment frameworks supporting national curricula, IB, Cambridge, and custom mastery scales with one-click report card generation.",
      highlights: [
        "Continuous assessment (assignments, quizzes, finals)",
        "Automated GPA, class rank & percentile curves",
        "Tamper-proof digital signatures & QR code verification",
      ],
      color: "violet",
    },
    {
      id: "attendance",
      category: "operations",
      icon: ClipboardCheck,
      title: "Smart Attendance & Biometric Gate Safety",
      badge: "Real-time Alerts",
      description:
        "Track student and staff arrival using RFID badges, classroom mobile roll-calls, or biometric sensors with instant guardian departure updates.",
      highlights: [
        "RFID turnstile integration with sub-second logging",
        "Automated guardian notifications for unexplained absence",
        "GPS school bus route tracking and pickup geofencing",
      ],
      color: "amber",
    },
    {
      id: "portal",
      category: "operations",
      icon: Smartphone,
      title: "Guardian & Student Engagement App",
      badge: "97% Adoption",
      description:
        "A streamlined web and mobile portal where parents check homework, download invoices, monitor daily attendance, and message teachers directly.",
      highlights: [
        "Push notifications for announcements and emergency alerts",
        "Online permissions slips with digital signatures",
        "Direct teacher-parent chat with office hours enforcement",
      ],
      color: "cyan",
    },
    {
      id: "staff",
      category: "governance",
      icon: Users2,
      title: "Faculty HR, Payroll & Performance Records",
      badge: "Workforce",
      description:
        "Centralize teacher employment agreements, biometric clock-in, leave approval workflows, credential expirations, and monthly payroll slips.",
      highlights: [
        "Automated salary slip generation with tax withholdings",
        "Teacher appraisal logs and student feedback tracking",
        "Leave quota balancing and substitute coverage",
      ],
      color: "rose",
    },
    {
      id: "reports",
      category: "governance",
      icon: FileBarChart,
      title: "Accreditation & Ministry Regulatory Reporting",
      badge: "Audit Ready",
      description:
        "Stay fully compliant with Ministry of Education inspections, census reports, and demographic audits without stressful manual paperwork.",
      highlights: [
        "Pre-formatted national census and inspection exports",
        "Cohort academic progression and retention metrics",
        "Immutable audit trails for any sensitive record edit",
      ],
      color: "teal",
    },
  ];

  const filteredFeatures =
    selectedCategory === "all"
      ? features
      : features.filter((f) => f.category === selectedCategory);

  return (
    <section id="features" className="py-24 bg-white dark:bg-[#0b1322]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">
            <Layers className="w-3.5 h-3.5" />
            <span>Comprehensive Platform Architecture</span>
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered for Every Dimension of School Life
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Replace dozens of disparate software tools with one harmonized suite designed specifically for kindergarten, K-12, secondary academies, and collegiate networks.
          </p>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all ${
                  selectedCategory === cat.id
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 p-7 flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>

                  <ul className="mt-5 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {feat.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <button
                    onClick={onOpenDemoModal}
                    className="flex items-center gap-1 hover:underline"
                  >
                    <span>Request feature walkthrough</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Bottom Callout */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h4 className="text-xl sm:text-2xl font-bold">Need custom workflows or integrations for your curriculum?</h4>
            <p className="mt-2 text-blue-100 text-sm">
              Xenon includes dedicated REST APIs, webhook triggers, and tailored SIS import tools to seamlessly bridge with Google Classroom, Canvas LMS, Microsoft 365, and government portals.
            </p>
          </div>
          <button
            onClick={onOpenDemoModal}
            className="shrink-0 px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-md hover:bg-blue-50 active:scale-95 transition-all"
          >
            Consult Our Solutions Architects
          </button>
        </div>
      </div>
    </section>
  );
}
