"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Mail,
  Globe,
  Lock,
  Phone,
} from "lucide-react";

export function LandingFooter() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Column (2 cols wide on LG) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Xenon SMS
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pr-6">
              The unified cloud operating system designed for modern schools, academy groups, and education trusts. Elevating institutional governance, academic rigor, and parent trust.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 text-xs font-semibold border border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </span>
              <span className="text-xs text-slate-500">v3.0.4 Enterprise</span>
            </div>

            <div className="pt-2 text-xs text-slate-400 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>FERPA, GDPR, SOC2 Type II Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>Isolated Regional Cloud Hosting (US, EU, UK)</span>
              </div>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Platform
            </h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-white transition-colors">Multi-Branch Governance</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">AI Master Timetabling</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Automated Fee Recovery</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Smart RFID Gate Attendance</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Dynamic Gradebooks</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Guardian Mobile App</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Faculty HR & Payroll</a></li>
            </ul>
          </div>

          {/* Column 2: Solutions */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Institutions
            </h4>
            <ul className="space-y-2">
              <li><a href="#schools" className="hover:text-white transition-colors">K-12 Independent Day Schools</a></li>
              <li><a href="#schools" className="hover:text-white transition-colors">Multi-Academy Trusts</a></li>
              <li><a href="#schools" className="hover:text-white transition-colors">Boarding & Residential Prep</a></li>
              <li><a href="#schools" className="hover:text-white transition-colors">STEM & Technical Institutes</a></li>
              <li><a href="#schools" className="hover:text-white transition-colors">Montessori Networks</a></li>
              <li><a href="#vacancies" className="hover:text-white transition-colors flex items-center gap-1">
                Careers & Vacancies <span className="text-[9px] bg-blue-900 text-blue-300 px-1 rounded">Open</span>
              </a></li>
            </ul>
          </div>

          {/* Column 3: Portal & Auth */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Access & Auth
            </h4>
            <ul className="space-y-2">
              <li><Link href="/auth/login" className="hover:text-white font-semibold text-blue-400 transition-colors">Sign In to Command Center</Link></li>
              <li><Link href="/auth/register" className="hover:text-white transition-colors">Register New School Tenant</Link></li>
              <li><Link href="/auth/forgot_password" className="hover:text-white transition-colors">Reset Account Password</Link></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing & Plans</a></li>
              <li><a href="#demo" className="hover:text-white transition-colors">Request Guided Demo</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter / Support */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              EdTech Dispatch
            </h4>
            <p className="text-slate-400 text-xs">
              Quarterly school leadership insights, regulatory updates, and software release notes.
            </p>

            {subscribed ? (
              <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Subscribed! Check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="headmaster@school.org"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="pt-2 text-[11px] text-slate-500 flex flex-col gap-1">
              <span>Support Desk: support@xenonsms.com</span>
              <span>Emergency 24/7 SLA Hotline for Principals</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Xenon School Management System. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#security" className="hover:text-slate-400 transition-colors">Security & Trust Center</a>
            <a href="#cookies" className="hover:text-slate-400 transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
