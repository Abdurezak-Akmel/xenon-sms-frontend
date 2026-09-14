"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  School,
  Mail,
} from "lucide-react";

export function DemoCTASection() {
  const [schoolName, setSchoolName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Principal / Head of School");
  const [students, setStudents] = useState("500 - 1,500 students");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName || !email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section id="demo" className="relative w-full max-w-full overflow-x-clip bg-white py-24 dark:bg-[#07111f]">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-radial-gradient dark:bg-radial-dark pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#060e1b] via-[#09172c] to-[#040810] p-8 sm:p-12 lg:p-16 text-white shadow-2xl">
          {/* Subtle decorative glow orbs */}
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Copy Column */}
            <div className="min-w-0 lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Experience The Future of School Ops</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Transform your school operations starting this term.
              </h2>

              <p className="text-base sm:text-lg leading-relaxed text-slate-300 max-w-xl">
                See how Xenon eliminates paperwork, accelerates fee collection, and connects teachers, students, and parents into one calm ecosystem.
              </p>

              <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-200">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-400" />
                  <span>Personalized 1-on-1 walkthrough with an Institutional Specialist</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-400" />
                  <span>Instant 14-day sandbox environment pre-loaded with demo academy data</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-400" />
                  <span>Complimentary legacy spreadsheet audit & migration blueprint</span>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-cyan-400" /> 15-Minute focused demo
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-cyan-400" /> Zero obligation
                </span>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/40 sm:p-8">
                {submitted ? (
                  <div className="space-y-4 py-8 text-center animate-in fade-in duration-300">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Walkthrough Scheduled!</h3>
                    <p className="mx-auto max-w-sm text-xs sm:text-sm leading-relaxed text-slate-200">
                      Thank you, <strong className="text-white">{schoolName}</strong>. We&apos;ve dispatched your sandbox invitation and calendar link to <strong className="text-white">{email}</strong>.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setSchoolName("");
                        setEmail("");
                      }}
                      className="mt-4 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/20"
                    >
                      Book another walkthrough
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-200">
                        School or Academy Name
                      </label>
                      <div className="relative">
                        <School className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={schoolName}
                          onChange={(e) => setSchoolName(e.target.value)}
                          placeholder="e.g. St. Jude International School"
                          className="w-full rounded-xl border border-white/20 bg-white/10 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-400/30"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-200">
                        Work / Administrator Email
                      </label>
                      <div className="relative">
                        <Mail className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="admin@schooldomain.edu"
                          className="w-full rounded-xl border border-white/20 bg-white/10 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-400/30"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-200">
                          Your Role
                        </label>
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full rounded-xl border border-white/20 bg-slate-900/90 px-3 py-2.5 text-xs sm:text-sm text-white focus:border-cyan-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-400/30"
                        >
                          <option value="Principal / Head of School">Principal / Head of School</option>
                          <option value="Superintendent / CEO">Superintendent / Trust CEO</option>
                          <option value="Bursar / Finance Director">Bursar / Finance Director</option>
                          <option value="IT Director / EdTech Lead">IT Director / EdTech Lead</option>
                          <option value="Teacher / Faculty Leader">Teacher / Faculty Leader</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-200">
                          Student Enrollment
                        </label>
                        <select
                          value={students}
                          onChange={(e) => setStudents(e.target.value)}
                          className="w-full rounded-xl border border-white/20 bg-slate-900/90 px-3 py-2.5 text-xs sm:text-sm text-white focus:border-cyan-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-400/30"
                        >
                          <option value="Under 500 students">Under 500 students</option>
                          <option value="500 - 1,500 students">500 - 1,500 students</option>
                          <option value="1,500 - 5,000 students">1,500 - 5,000 students</option>
                          <option value="5,000+ students (Multi-Branch)">5,000+ students (Multi-Branch)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:from-cyan-300 hover:to-teal-300 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Reserving Demo Slot...</span>
                      ) : (
                        <>
                          <span>Confirm 15-Min Demo & Sandbox</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <p className="pt-1 text-center text-[11px] text-slate-400">
                      By submitting, you agree to our terms of service and institutional data privacy charter.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
