"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  ArrowRight,
  School,
  Mail,
  UserCheck,
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
    }, 700);
  };

  return (
    <section id="demo" className="py-24 relative overflow-hidden bg-white dark:bg-[#0b1322]">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-radial-gradient dark:bg-radial-dark pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden border border-blue-800/40">
          {/* Subtle decorative circles */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left copy column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Experience The Future of SMS</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Transform Your School Operations Today
              </h2>

              <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-xl">
                See how Xenon eliminates paperwork, accelerates fee collection, and connects teachers, students, and parents into one seamless ecosystem.
              </p>

              <div className="space-y-3 pt-2 text-xs sm:text-sm text-blue-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Personalized 1-on-1 walkthrough with a Senior EdTech Specialist</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant 14-day full access sandbox pre-loaded with sample academy data</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Complimentary legacy data audit and migration blueprint</span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-6 text-xs text-blue-300/80">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> 15-Minute focused demo
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Zero obligation
                </span>
              </div>
            </div>

            {/* Right form column */}
            <div className="lg:col-span-6">
              <div className="bg-white/10 dark:bg-slate-900/70 border border-white/15 dark:border-slate-700/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
                {submitted ? (
                  <div className="text-center py-8 space-y-4 animate-in fade-in duration-300">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Walkthrough Scheduled!</h3>
                    <p className="text-xs sm:text-sm text-blue-100 max-w-sm mx-auto leading-relaxed">
                      Thank you, <strong className="text-white">{schoolName}</strong>. We&apos;ve dispatched your sandbox invitation and calendar scheduler link to <strong className="text-white">{email}</strong>.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setSchoolName("");
                        setEmail("");
                      }}
                      className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition-all"
                    >
                      Book another walkthrough
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-1.5">
                        School or Academy Name
                      </label>
                      <div className="relative">
                        <School className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300" />
                        <input
                          type="text"
                          required
                          value={schoolName}
                          onChange={(e) => setSchoolName(e.target.value)}
                          placeholder="e.g. St. Jude International School"
                          className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder-blue-300/50 focus:outline-hidden focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-1.5">
                        Work / Administrator Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="admin@schooldomain.edu"
                          className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder-blue-300/50 focus:outline-hidden focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-1.5">
                          Your Role
                        </label>
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-900/80 border border-white/20 rounded-xl text-xs sm:text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-blue-400"
                        >
                          <option value="Principal / Head of School">Principal / Head of School</option>
                          <option value="Superintendent / CEO">Superintendent / Trust CEO</option>
                          <option value="Bursar / Finance Director">Bursar / Finance Director</option>
                          <option value="IT Director / EdTech Lead">IT Director / EdTech Lead</option>
                          <option value="Teacher / Faculty Leader">Teacher / Faculty Leader</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-1.5">
                          Student Body Size
                        </label>
                        <select
                          value={students}
                          onChange={(e) => setStudents(e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-900/80 border border-white/20 rounded-xl text-xs sm:text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-blue-400"
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
                      className="mt-2 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span>Reserving Demo Slot...</span>
                      ) : (
                        <>
                          <span>Confirm 15-Min Demo & Sandbox</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-center text-blue-200/60 pt-1">
                      By submitting, you agree to our terms of service & data privacy charter.
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
