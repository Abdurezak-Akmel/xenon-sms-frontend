"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Globe,
  Lock,
  Mail,
  School,
  Sparkles,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export interface RegisterFormProps {
  onSuccess?: (data: any) => void;
  className?: string;
}

export function RegisterForm({ onSuccess, className }: RegisterFormProps) {
  const [currentStep, setCurrentStep] = React.useState<1 | 2 | 3>(1);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  // Form State
  const [formData, setFormData] = React.useState({
    // Step 1: School Info
    schoolName: "",
    schoolCode: "",
    country: "Ethiopia",
    timezone: "Africa/Addis_Ababa",
    currency: "USD ($)",
    // Step 2: Administrator Details
    adminName: "",
    adminEmail: "",
    password: "",
    confirmPassword: "",
    // Step 3: Subscription & Terms
    plan: "professional",
    agreedToTerms: false,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const update = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.schoolName.trim()) errs.schoolName = "School name is required";
    if (!formData.schoolCode.trim()) errs.schoolCode = "School identifier code is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!formData.adminName.trim()) errs.adminName = "Administrator name is required";
    if (!formData.adminEmail.trim()) errs.adminEmail = "Work email is required";
    if (formData.password.length < 8) errs.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      setErrors({ agreedToTerms: "You must accept the institutional terms of service." });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      onSuccess?.(formData);
    }, 900);
  };

  return (
    <Card className={className} variant="default" padding="default">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-(--blue) text-white shadow-sm">
            <Sparkles className="size-4" />
          </div>
          <span className="font-bold text-sm tracking-tight text-(--foreground)">
            Xenon<span className="text-(--blue)">SMS</span> Onboarding
          </span>
        </div>
        <CardTitle className="text-xl">Register New Institution</CardTitle>
        <CardDescription>
          Set up a dedicated multi-tenant school workspace in under two minutes.
        </CardDescription>

        {/* Wizard Steps indicator */}
        {!success && (
          <div className="mt-4 flex items-center justify-between gap-2 border-y border-(--line) py-3">
            {[
              { num: 1, label: "Institution" },
              { num: 2, label: "Admin" },
              { num: 3, label: "Plan & Deploy" },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`flex size-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    currentStep === s.num
                      ? "bg-(--blue) text-white"
                      : currentStep > s.num
                      ? "bg-(--green) text-white"
                      : "bg-(--line) text-(--muted)"
                  }`}
                >
                  {currentStep > s.num ? <Check className="size-3.5" /> : s.num}
                </div>
                <span className="text-xs font-medium text-(--foreground) hidden sm:inline-block">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#e8f6ee] text-(--green)">
              <CheckCircle2 className="size-8" />
            </div>
            <h4 className="text-lg font-bold text-(--foreground)">Institution Provisioned!</h4>
            <p className="text-xs text-(--muted) max-w-sm mx-auto leading-relaxed">
              Your tenant workspace for <strong>{formData.schoolName}</strong> has been created. A verification link has been sent to <strong>{formData.adminEmail}</strong>.
            </p>
            <Link href="/school_admin/branches_crud_ui" className="block pt-2">
              <Button className="w-full">Launch School Admin Workspace</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: School info */}
            {currentStep === 1 && (
              <>
                <Input
                  label="Official School / Academy Name"
                  placeholder="e.g. Northfield Preparatory"
                  required
                  value={formData.schoolName}
                  onChange={(e) => update("schoolName", e.target.value)}
                  error={errors.schoolName}
                  startIcon={<School className="size-4" />}
                />

                <Input
                  label="Unique School Identifier Code"
                  placeholder="e.g. NORTHFIELD"
                  required
                  value={formData.schoolCode}
                  onChange={(e) => update("schoolCode", e.target.value.toUpperCase())}
                  error={errors.schoolCode}
                  helperText="Used for portal subdomains and document IDs"
                  startIcon={<Building2 className="size-4" />}
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-(--foreground) block mb-1">
                      Timezone
                    </label>
                    <select
                      className="w-full rounded-lg border border-(--line) bg-(--card) px-3 py-2 text-xs text-(--foreground) outline-none focus:border-(--blue)"
                      value={formData.timezone}
                      onChange={(e) => update("timezone", e.target.value)}
                    >
                      <option value="Africa/Addis_Ababa">Africa/Addis_Ababa (UTC+3)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-(--foreground) block mb-1">
                      Operating Currency
                    </label>
                    <select
                      className="w-full rounded-lg border border-(--line) bg-(--card) px-3 py-2 text-xs text-(--foreground) outline-none focus:border-(--blue)"
                      value={formData.currency}
                      onChange={(e) => update("currency", e.target.value)}
                    >
                      <option value="USD ($)">USD ($)</option>
                      <option value="ETB (Br)">ETB (Br)</option>
                      <option value="EUR (€)">EUR (€)</option>
                      <option value="GBP (£)">GBP (£)</option>
                    </select>
                  </div>
                </div>

                <Button type="button" onClick={handleNext} className="w-full gap-2 mt-4">
                  <span>Continue to Admin Setup</span>
                  <ArrowRight className="size-4" />
                </Button>
              </>
            )}

            {/* Step 2: Administrator account */}
            {currentStep === 2 && (
              <>
                <Input
                  label="Primary Administrator Full Name"
                  placeholder="e.g. Dr. Jordan Miller"
                  required
                  value={formData.adminName}
                  onChange={(e) => update("adminName", e.target.value)}
                  error={errors.adminName}
                  startIcon={<User className="size-4" />}
                />

                <Input
                  label="Official Institutional Email"
                  type="email"
                  placeholder="admin@northfield.edu"
                  required
                  value={formData.adminEmail}
                  onChange={(e) => update("adminEmail", e.target.value)}
                  error={errors.adminEmail}
                  startIcon={<Mail className="size-4" />}
                />

                <Input
                  label="Master Account Password"
                  type="password"
                  showPasswordToggle
                  placeholder="Minimum 8 characters"
                  required
                  value={formData.password}
                  onChange={(e) => update("password", e.target.value)}
                  error={errors.password}
                  startIcon={<Lock className="size-4" />}
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  showPasswordToggle
                  placeholder="Re-enter password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  error={errors.confirmPassword}
                  startIcon={<Lock className="size-4" />}
                />

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    <ArrowLeft className="size-4 mr-1" /> Back
                  </Button>
                  <Button type="button" onClick={handleNext} className="flex-1 gap-1">
                    Next <ArrowRight className="size-4" />
                  </Button>
                </div>
              </>
            )}

            {/* Step 3: Plan selection & deploy */}
            {currentStep === 3 && (
              <>
                <div>
                  <label className="text-xs font-semibold text-(--foreground) block mb-2">
                    Select Deployment Plan
                  </label>
                  <div className="grid gap-2">
                    {[
                      {
                        id: "starter",
                        name: "Starter Academy",
                        rate: "$1.50 / student",
                        desc: "Core attendance, fee invoicing, student directory",
                      },
                      {
                        id: "professional",
                        name: "Professional (Recommended)",
                        rate: "$2.80 / student",
                        desc: "10+ user roles, multi-branch, timetable automation",
                      },
                      {
                        id: "enterprise",
                        name: "Enterprise Network",
                        rate: "Custom",
                        desc: "Multi-campus clusters, custom SLAs, priority support",
                      },
                    ].map((p) => (
                      <label
                        key={p.id}
                        className={`flex items-start justify-between p-3 rounded-lg border cursor-pointer transition ${
                          formData.plan === p.id
                            ? "border-(--blue) bg-(--blue-soft)"
                            : "border-(--line) hover:bg-(--background)"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="radio"
                            name="plan"
                            checked={formData.plan === p.id}
                            onChange={() => update("plan", p.id)}
                            className="mt-1 text-(--blue)"
                          />
                          <div>
                            <strong className="block text-xs font-bold text-(--foreground)">
                              {p.name}
                            </strong>
                            <span className="block text-[11px] text-(--muted) mt-0.5">
                              {p.desc}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-(--blue)">{p.rate}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2 cursor-pointer text-xs text-(--muted)">
                    <input
                      type="checkbox"
                      checked={formData.agreedToTerms}
                      onChange={(e) => update("agreedToTerms", e.target.checked)}
                      className="rounded border-(--line) text-(--blue) mt-0.5"
                    />
                    <span>
                      I agree to the Institutional Data Processing Terms, FERPA/GDPR compliance policies, and Master Service Agreement.
                    </span>
                  </label>
                  {errors.agreedToTerms && (
                    <p className="text-[11px] text-(--red) mt-1">{errors.agreedToTerms}</p>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1"
                  >
                    <ArrowLeft className="size-4 mr-1" /> Back
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1 gap-1">
                    {loading ? "Provisioning..." : "Complete & Deploy"}
                  </Button>
                </div>
              </>
            )}
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-(--line) text-center text-xs text-(--muted)">
          <span>Already registered? </span>
          <Link href="/auth/login" className="font-semibold text-(--blue) hover:underline">
            Sign in to existing school
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
