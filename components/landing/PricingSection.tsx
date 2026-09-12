"use client";

import React, { useState } from "react";
import {
  Check,
  Sparkles,
  ArrowRight,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface PricingSectionProps {
  onOpenDemoModal: () => void;
}

export function PricingSection({ onOpenDemoModal }: PricingSectionProps) {
  const [annualBilling, setAnnualBilling] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plans = [
    {
      name: "Starter Academy",
      target: "Ideal for single independent schools & day academies up to 500 students.",
      monthlyPrice: "$1.25",
      annualPrice: "$1.00",
      popular: false,
      buttonText: "Start 14-Day Free Trial",
      features: [
        "Up to 500 active students included",
        "Core Student Information System (SIS)",
        "Daily attendance roll-call & SMS alerts",
        "Basic fee collection & digital receipts",
        "Parent & student web portal",
        "Standard report card generation",
        "Email & knowledge base support",
      ],
    },
    {
      name: "Professional School",
      target: "For growing academies requiring automated timetabling, exams & multi-branch.",
      monthlyPrice: "$2.50",
      annualPrice: "$1.95",
      popular: true,
      buttonText: "Launch Pro Sandbox",
      features: [
        "Up to 2,500 active students",
        "Everything in Starter, plus:",
        "Multi-branch & campus governance",
        "AI timetable & conflict-free scheduler",
        "Dynamic gradebook & IB/Cambridge rubrics",
        "RFID gate & biometric attendance sync",
        "Online payment gateway integration",
        "Faculty HR, biometric payroll & leaves",
        "Priority 24/7 chat & phone support",
      ],
    },
    {
      name: "Enterprise Trust",
      target: "For school chains, education ministries, and multi-academy federations.",
      monthlyPrice: "Custom",
      annualPrice: "Volume Rates",
      popular: false,
      buttonText: "Contact Enterprise Team",
      features: [
        "Unlimited campuses & students",
        "Everything in Professional, plus:",
        "Dedicated Solutions Architect & Migration Lead",
        "Custom ERP & accounting webhooks (QuickBooks/SAP)",
        "Private cloud / on-premise deployment option",
        "99.99% financially backed uptime SLA",
        "Custom ministry regulatory report exports",
        "Full staff on-site onboarding & workshops",
      ],
    },
  ];

  const faqs = [
    {
      q: "How does per-student billing adapt when enrollment fluctuates during term?",
      a: "Billing automatically prorates on active registered students at the end of each calendar month. Graduated students or archived alumni records are completely free to retain forever without subscription charges.",
    },
    {
      q: "Is historical student and academic data migration included?",
      a: "Yes! Every institution receives guided automated migration tooling. For Professional and Enterprise schools, our dedicated data migration team assists in mapping and validating your legacy records from Excel, CSV, or older SIS software at zero additional fee.",
    },
    {
      q: "Which payment gateways and currencies does Xenon support?",
      a: "Xenon natively supports Stripe, PayPal, Direct Bank ACH/SEPA debit, and regional gateways like M-Pesa and Flutterwave, allowing parents to settle tuition fees in over 135 local currencies with zero currency friction.",
    },
    {
      q: "How does Xenon handle student data privacy and safety?",
      a: "We adhere strictly to FERPA, GDPR, COPPA, and ISO-27001 data protection standards. All records are secured using AES-256 encryption at rest and TLS 1.3 in transit with automated offsite geographic backups every 6 hours.",
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-white dark:bg-[#0b1322]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
            <Shield className="w-3.5 h-3.5" />
            <span>Clear, Predictable Investment</span>
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Transparent Pricing Designed for Sustainable Education
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            No surprise implementation costs or licensing penalties. Choose the plan that aligns with your school’s current enrollment.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setAnnualBilling(false)}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                !annualBilling
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Billed Monthly
            </button>
            <button
              onClick={() => setAnnualBilling(true)}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
                annualBilling
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <span>Billed Annually</span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-200 ${
                plan.popular
                  ? "bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-800 dark:to-slate-900 border-2 border-blue-600 dark:border-blue-500 shadow-xl shadow-blue-600/10 lg:-translate-y-2"
                  : "bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold tracking-wide shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>MOST CHOSEN BY ACADEMIES</span>
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {plan.name}
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 min-h-[36px]">
                  {plan.target}
                </p>

                <div className="mt-6 flex items-baseline gap-1.5 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {annualBilling ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  {plan.monthlyPrice !== "Custom" && (
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      / student / month
                    </span>
                  )}
                </div>

                <div className="mt-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Included Capabilities
                  </span>
                  <ul className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                    {plan.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6">
                <button
                  onClick={onOpenDemoModal}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 active:scale-98"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
                  }`}
                >
                  <span>{plan.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2">
                  No setup fees • Cancel or adjust anytime
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Accordion Section */}
        <div id="pricing-faq" className="mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Have questions about contracts, onboarding, or custom requirements?
            </p>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-sm sm:text-base font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 py-1"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </button>
                {openFaq === idx && (
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pr-6 animate-in fade-in duration-150">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
