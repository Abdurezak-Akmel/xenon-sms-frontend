"use client";

import React, { useState } from "react";
import { X, CheckCircle2, MapPin, DollarSign, Clock, Send } from "lucide-react";
import { JobListing } from "./VacanciesSection";

interface JobApplicationModalProps {
  job: JobListing | null;
  isOpen: boolean;
  isPostingJob?: boolean;
  onClose: () => void;
}

export function JobApplicationModal({
  job,
  isOpen,
  isPostingJob = false,
  onClose,
}: JobApplicationModalProps) {
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePhone, setCandidatePhone] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#091222] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/90 dark:border-white/10">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isPostingJob ? "Vacancy Request Received!" : "Application Submitted!"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              {isPostingJob
                ? "Your institution's vacancy has been routed to the Xenon Talent Network review board. Our coordinator will contact you within 24 hours."
                : `Thank you, ${candidateName}. Your application for "${job?.title}" has been transmitted directly to the leadership team at ${job?.school}.`}
            </p>
            <div className="pt-4">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/25 hover:from-cyan-300 hover:to-teal-300 transition-all"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : isPostingJob ? (
          /* Post a Vacancy Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
                School Recruitment Network
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
                Post an Open Vacancy
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Connect with qualified educators, STEM specialists, and administrative leaders across the verified Xenon network.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  School / Institution Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. St. Jude International Prep"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#060c18] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Head of Mathematics"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#060c18] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <select className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#060c18] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20">
                    <option value="academic">Academic & Teaching</option>
                    <option value="admin">School Administration</option>
                    <option value="finance">Finance & Operations</option>
                    <option value="tech">EdTech & IT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Administrator Contact Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="recruitment@school.edu"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#060c18] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Job Brief & Qualifications
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Outline key teaching responsibilities, required degrees or certifications, and start date..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#060c18] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-3 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/25 transition-all"
            >
              Submit Vacancy for Network Publication
            </button>
          </form>
        ) : (
          /* Job Application Form */
          job && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-slate-100 dark:border-white/10 pb-4">
                <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/80 px-2.5 py-0.5 rounded-md border border-cyan-100 dark:border-cyan-900">
                  {job.school}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
                  {job.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> {job.salary}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {job.deadline}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#060c18] p-3.5 rounded-xl border border-slate-200/80 dark:border-white/10">
                <p className="font-bold text-slate-800 dark:text-slate-100 mb-1">Role Overview:</p>
                <p>{job.description}</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#060c18] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      placeholder="sarah@example.com"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#060c18] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#060c18] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Brief Statement or Relevant Experience
                  </label>
                  <textarea
                    rows={3}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Summarize your teaching qualifications, degrees, or school leadership background..."
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#060c18] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-3 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Submit Candidate Application</span>
              </button>
            </form>
          )
        )}
      </div>
    </div>
  );
}
