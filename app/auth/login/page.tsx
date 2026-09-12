"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

import { Button } from "../../../components/ui/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormMessage,
} from "../../../components/layout/Form";

type RegisterForm = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type RegisterErrors = Partial<Record<keyof RegisterForm | "terms", string>>;

const initialForm: RegisterForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const inputClass =
  "w-full rounded-xl border border-(--line) bg-white/80 px-3.5 py-3 text-sm text-(--foreground) outline-none transition placeholder:text-slate-400 focus:border-(--blue) focus:ring-4 focus:ring-(--blue)/10";

function PasswordHint({ password }: { password: string }) {
  const checks = [
    { label: "8 or more characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One number", valid: /\d/.test(password) },
  ];

  return (
    <div className="mt-2 grid gap-1.5 text-xs text-slate-500">
      {checks.map((check) => (
        <span
          key={check.label}
          className={check.valid ? "text-emerald-700" : undefined}
        >
          <Check size={12} className="mr-1 inline-block" />
          {check.label}
        </span>
      ))}
    </div>
  );
}

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function updateForm<Key extends keyof RegisterForm>(
    key: Key,
    value: RegisterForm[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function validate() {
    const nextErrors: RegisterErrors = {};
    if (!form.firstName.trim())
      nextErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      nextErrors.email = "Enter a valid email address.";
    if (form.phone && !/^[+\d][\d\s().-]{6,}$/.test(form.phone))
      nextErrors.phone = "Enter a valid phone number.";
    if (
      form.password.length < 8 ||
      !/[A-Z]/.test(form.password) ||
      !/\d/.test(form.password)
    )
      nextErrors.password =
        "Use a stronger password that meets all requirements.";
    if (form.password !== form.confirmPassword)
      nextErrors.confirmPassword = "Passwords do not match.";
    if (!termsAccepted) nextErrors.terms = "Accept the terms to continue.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (validate()) setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#f4f7fb] px-5 py-8 text-(--foreground) sm:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
          <section className="w-full max-w-lg rounded-3xl border border-(--line) bg-white p-8 text-center shadow-[0_24px_70px_rgba(38,64,103,0.10)] sm:p-12">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Check size={30} />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-(--blue)">
              Registration ready
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Welcome to Xenon, {form.firstName}.
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Your account details are valid and ready to be sent to the Xenon
              users service.
            </p>
            <div className="mt-8 rounded-2xl bg-[#f5f8fc] p-4 text-left text-sm">
              <span className="text-xs text-slate-500">Account email</span>
              <strong className="mt-1 block">{form.email}</strong>
            </div>
            <Button
              className="mt-8 w-full"
              onClick={() => {
                setSubmitted(false);
                setForm(initialForm);
                setTermsAccepted(false);
              }}
            >
              Create another account <ArrowRight size={16} />
            </Button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f7fb] text-(--foreground)">
      <div className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden overflow-hidden bg-[#162a4a] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute -right-24 -top-24 size-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-40 -left-24 size-96 rounded-full border border-white/10" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-[#79a7ff] text-[#162a4a]">
                <Sparkles size={20} />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                Xenon
              </span>
            </div>
            <div className="mt-24 max-w-md xl:mt-32">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9fc0ff]">
                School operations, connected
              </p>
              <h2 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight xl:text-5xl">
                Give your school a clearer next step.
              </h2>
              <p className="mt-6 max-w-sm text-sm leading-7 text-blue-100/75">
                One calm command center for people, academics, attendance,
                communication, and finance.
              </p>
            </div>
          </div>
          <div className="relative flex items-center gap-3 text-xs text-blue-100/65">
            <div className="size-2 rounded-full bg-emerald-300" />
            Built for focused school teams
          </div>
        </aside>

        <section className="flex items-center justify-center px-5 py-8 sm:px-10 lg:px-14 xl:px-20">
          <div className="w-full max-w-2xl">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="grid size-9 place-items-center rounded-xl bg-(--blue) text-white">
                <Sparkles size={18} />
              </div>
              <span className="text-lg font-semibold">Xenon</span>
            </div>
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--blue)">
                Create your account
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Start with the essentials.
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500">
                Set up your secure administrator profile to begin organizing
                your school in Xenon.
              </p>
            </div>

            <Form onSubmit={submit} className="gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="First name"
                  htmlFor="first-name"
                  error={errors.firstName}
                >
                  <FormControl>
                    <input
                      id="first-name"
                      className={inputClass}
                      value={form.firstName}
                      onChange={(event) =>
                        updateForm("firstName", event.target.value)
                      }
                      placeholder="Jordan"
                      autoComplete="given-name"
                    />
                  </FormControl>
                </FormField>
                <FormField label="Middle name" htmlFor="middle-name">
                  <FormControl>
                    <input
                      id="middle-name"
                      className={inputClass}
                      value={form.middleName}
                      onChange={(event) =>
                        updateForm("middleName", event.target.value)
                      }
                      placeholder="Optional"
                      autoComplete="additional-name"
                    />
                  </FormControl>
                </FormField>
                <FormField
                  label="Last name"
                  htmlFor="last-name"
                  error={errors.lastName}
                >
                  <FormControl>
                    <input
                      id="last-name"
                      className={inputClass}
                      value={form.lastName}
                      onChange={(event) =>
                        updateForm("lastName", event.target.value)
                      }
                      placeholder="Miller"
                      autoComplete="family-name"
                    />
                  </FormControl>
                </FormField>
                <FormField label="Phone" htmlFor="phone" error={errors.phone}>
                  <FormControl>
                    <input
                      id="phone"
                      type="tel"
                      className={inputClass}
                      value={form.phone}
                      onChange={(event) =>
                        updateForm("phone", event.target.value)
                      }
                      placeholder="+251 ..."
                      autoComplete="tel"
                    />
                  </FormControl>
                </FormField>
              </div>

              <FormField
                label="Work email"
                htmlFor="email"
                error={errors.email}
                description="Use an email address you check regularly."
              >
                <FormControl>
                  <input
                    id="email"
                    type="email"
                    className={inputClass}
                    value={form.email}
                    onChange={(event) =>
                      updateForm("email", event.target.value)
                    }
                    placeholder="you@school.edu"
                    autoComplete="email"
                  />
                </FormControl>
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Password"
                  htmlFor="password"
                  error={errors.password}
                >
                  <FormControl>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className={`${inputClass} pr-11`}
                        value={form.password}
                        onChange={(event) =>
                          updateForm("password", event.target.value)
                        }
                        placeholder="Create a password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                    <PasswordHint password={form.password} />
                  </FormControl>
                </FormField>
                <FormField
                  label="Confirm password"
                  htmlFor="confirm-password"
                  error={errors.confirmPassword}
                >
                  <FormControl>
                    <div className="relative">
                      <input
                        id="confirm-password"
                        type={showConfirmation ? "text" : "password"}
                        className={`${inputClass} pr-11`}
                        value={form.confirmPassword}
                        onChange={(event) =>
                          updateForm("confirmPassword", event.target.value)
                        }
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        onClick={() =>
                          setShowConfirmation((current) => !current)
                        }
                        aria-label={
                          showConfirmation
                            ? "Hide confirmation"
                            : "Show confirmation"
                        }
                      >
                        {showConfirmation ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                </FormField>
              </div>

              <label className="flex items-start gap-3 text-sm text-slate-500">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(event) => {
                    setTermsAccepted(event.target.checked);
                    setErrors((current) => ({ ...current, terms: undefined }));
                  }}
                  className="mt-0.5 size-4 accent-(--blue)"
                />
                <span>
                  I agree to the Xenon{" "}
                  <a
                    href="#terms"
                    className="font-medium text-(--blue) hover:underline"
                  >
                    terms of service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#privacy"
                    className="font-medium text-(--blue) hover:underline"
                  >
                    privacy policy
                  </a>
                  .
                </span>
              </label>
              {errors.terms && <FormMessage>{errors.terms}</FormMessage>}
              <Button type="submit" className="h-11 w-full text-sm">
                Create account <ArrowRight size={17} />
              </Button>
              <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-500">
                <LockKeyhole size={13} /> Your password is securely protected.
              </p>
            </Form>
          </div>
        </section>
      </div>
    </main>
  );
}
