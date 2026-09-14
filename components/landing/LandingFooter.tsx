"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Globe,
  School,
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
    <footer className="w-full max-w-full overflow-x-clip border-t border-slate-800 bg-[#040810] pt-16 pb-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 pb-12 border-b border-slate-800 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand Column */}
          <div className="min-w-0 space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/25">
                <School className="h-5 w-5 text-slate-950" />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Xenon SMS
              </span>
            </Link>

            <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-slate-400">
              The unified cloud operating system designed for modern schools, academy groups, and education trusts. Elevating governance, academic rigor, and parent trust.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-800/80 bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </span>
              <span className="text-xs text-slate-500">v3.4 Enterprise</span>
            </div>

            <div className="space-y-1.5 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                <span>FERPA, GDPR, SOC2 Type II Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-cyan-400" />
                <span>Isolated Regional Cloud Tenancy</span>
              </div>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
              Platform
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">Multi-Branch Governance</a></li>
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">Master Timetabling</a></li>
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">Bank-Transfer Finance</a></li>
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">Attendance Registers</a></li>
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">Teacher Gradebooks</a></li>
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">Parent Notices</a></li>
            </ul>
          </div>

          {/* Column 2: Solutions */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
              Institutions
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#schools" className="hover:text-cyan-400 transition-colors">Independent K-12 Schools</a></li>
              <li><a href="#schools" className="hover:text-cyan-400 transition-colors">Multi-Campus Networks</a></li>
              <li><a href="#schools" className="hover:text-cyan-400 transition-colors">Boarding & Day Academies</a></li>
              <li><a href="#schools" className="hover:text-cyan-400 transition-colors">Technical Institutes</a></li>
              <li><a href="#vacancies" className="inline-flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                Careers & Vacancies <span className="rounded-md bg-cyan-500/15 px-1.5 py-0.5 text-[10px] font-bold text-cyan-400">Open</span>
              </a></li>
            </ul>
          </div>

          {/* Column 3: Portal & Auth */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
              Access & Auth
            </h4>
            <ul className="space-y-2.5">
              <li><Link href="/auth/login" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">Sign In to Dashboard</Link></li>
              <li><Link href="/auth/register" className="hover:text-cyan-400 transition-colors">Register School Tenant</Link></li>
              <li><Link href="/auth/forgot_password" className="hover:text-cyan-400 transition-colors">Account Password Reset</Link></li>
              <li><a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing Blueprint</a></li>
              <li><a href="#demo" className="hover:text-cyan-400 transition-colors">Request 15-Min Walkthrough</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
              Leadership Briefing
            </h4>
            <p className="text-xs text-slate-400">
              Quarterly school leadership insights, regulatory updates, and software release notes.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-800 bg-emerald-950/60 p-3 text-xs text-emerald-300">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>Subscribed! Check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="principal@school.edu"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-sm transition-all hover:from-cyan-300 hover:to-teal-300"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            )}

            <div className="pt-2 text-[11px] text-slate-500">
              <span>Support Desk: support@xenonsms.com</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Xenon School Management System. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#security" className="hover:text-slate-300 transition-colors">Security Center</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
