"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/NewAuthContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { uploadFileWithProgress } from "@/lib/uploadWithProgress";
import { createSubmission } from "@/actions/protectedAction";
import { getUserById } from "@/actions/adminActions";
import { countries } from "@/data/countries&code";
import { footballLeagues } from "@/data/footballLeagues";

export default function PlayerSubmissionForm() {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, loading: isAuthLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submittingUser, setSubmittingUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    country: "",
    countryCode: "",
    position: "",
    foot: "",
    height: "",
    weight: "",
    email: "",
    phone: "",
    description: "",
    contractStatus: "",
    availableFrom: "",
    preferredLeagues: "",
    salaryExpectation: "",
    stats: {
      career: { Appearances: "", Goals: "", Assists: "", Trophies: "" },
      season: { Appearances: "", Goals: "", Assists: "", Minutes: "" },
      international: { Caps: "", Goals: "", Tournaments: "" },
    },
    clubHistory: [{ clubName: "", startDate: "", endDate: "", position: "" }],
    featured: false,
    playerOfTheWeek: false,
    imageUrl: [],
    videoPrimary: "",
    videoAdditional: [],
    cvUrl: "",
  });

  const uploading = Object.values(uploadProgress).some(
    (p) => p != null && p < 100
  );

  // ✅ Subscription check
  const checkSubscription = async () => {
    try {
      const res = await fetch("/api/subscriptions/check");
      const data = await res.json();

      if (!data.subscription) return false;
      if (data.subscription.usedSubmissions >= data.subscription.maxSubmissions)
        return false;

      setSubscription(data.subscription);
      return true;
    } catch (err) {
      console.error("Error checking subscription:", err);
      return false;
    }
  };

  // ✅ Auth + subscription gate
  useEffect(() => {
    const init = async () => {
      if (isAuthLoading) return; // Wait for auth

      const lang = pathname.split("/")[1] || "en";

      if (!isAuthenticated) {
        router.replace(
          `/${lang}/auth/login?redirect=${encodeURIComponent(pathname)}`
        );
        return;
      }

      const valid = await checkSubscription();
      if (!valid) {
        router.replace(
          `/${lang}/pricing?required=true&redirect=${encodeURIComponent(pathname)}`
        );
        return;
      }

      // Auth + sub okay → fetch user
      const u = await getUserById(user.id);
      setSubmittingUser(u);
      setLoading(false);
    };

    init();
  }, [isAuthLoading, isAuthenticated, pathname, router, user]);

  // ✅ Loading screen before checks complete
  if (loading) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-accent-red mx-auto mb-4" />
          <p className="text-primary-muted">Checking your access...</p>
          <p className="text-primary-muted">
            Please wait while we verify your subscription.
          </p>
        </div>
      </div>
    );
  }

  // ✅ Validation + steps logic
  const validateStep = () => {
    const errs = [];
    if (step === 1) {
      [
        "firstName",
        "lastName",
        "dob",
        "country",
        "position",
        "height",
        "weight",
        "foot",
        "email",
        "phone",
      ].forEach((k) => !formData[k] && errs.push(k));
    }
    if (step === 3) {
      if (!formData.cvUrl) errs.push("cvUrl");
      if (formData.imageUrl.length === 0) errs.push("imageUrl");
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  const submitForm = async () => {
    const valid = await checkSubscription();
    if (valid) {
      try {
        await createSubmission({
          ...formData,
          submittedAt: new Date(),
          userId: submittingUser?.id,
        });
        setSubmitted(true);
        setStep(4);
        toast({
          title: "Success",
          description: "Profile submitted successfully.",
        });
      } catch (error) {
        console.error("Submission error:", error);
        toast({
          title: "Error",
          description: "Failed to submit profile.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description:
          "You need an active subscription to submit your profile.",
        variant: "destructive",
      });
    }
  };

  // ✅ Form content (unchanged except gating)
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      {/* Step indicators */}
      <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
        {["Details", "Stats", "Uploads", "Complete"].map((l, i) => (
          <div key={l} className="grid grid-cols-2 lg:grid-cols-5 gap-1">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                step > i + 1
                  ? "bg-accent-red text-white"
                  : step === i + 1
                    ? "bg-accent-red text-white"
                    : "bg-primary-secondary border border-divider text-primary-muted"
              }`}
            >
              {step > i + 1 ? "✔" : i + 1}
            </div>
            <span
              className={
                step >= i + 1 ? "text-primary-text" : "text-primary-muted"
              }
            >
              {l}
            </span>
            {i < 3 && <div className="w-12 h-px bg-divider" />}
          </div>
        ))}
      </div>

      {/* === STEP 1 === */}
      {step === 1 && (
        <div className="bg-white p-8 rounded-xl">
          <h2 className="text-xl mb-6">Personal & Availability</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: "First Name", field: "firstName" },
              { label: "Last Name", field: "lastName" },
              { label: "Date of Birth", field: "dob", type: "date" },
              { label: "Email", field: "email", type: "email" },
              { label: "Phone", field: "phone" },
            ].map(({ label, field, type }) => (
              <InputField
                key={field}
                label={label}
                value={formData[field]}
                type={type}
                onChange={(val) => setFormData({ ...formData, [field]: val })}
              />
            ))}
            <div>
              <Label>Country *</Label>
              <Select
                value={formData.countryCode}
                onValueChange={(code) => {
                  const country =
                    countries.find((c) => c.code === code)?.name || "";
                  setFormData({ ...formData, countryCode: code, country });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Position *</Label>
              <Select
                value={formData.position}
                onValueChange={(val) =>
                  setFormData({ ...formData, position: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {["Goalkeeper", "Defender", "Midfielder", "Forward"].map(
                    (opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Preferred Foot *</Label>
              <Select
                value={formData.foot}
                onValueChange={(val) => setFormData({ ...formData, foot: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select foot" />
                </SelectTrigger>
                <SelectContent>
                  {["Left", "Right", "Both"].map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <InputField
              label="Height (cm)"
              value={formData.height}
              onChange={(val) => setFormData({ ...formData, height: val })}
            />
            <InputField
              label="Weight (kg)"
              value={formData.weight}
              onChange={(val) => setFormData({ ...formData, weight: val })}
            />
            <div>
              <Label>Contract Status</Label>
              <Select
                value={formData.contractStatus}
                onValueChange={(val) =>
                  setFormData({ ...formData, contractStatus: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contract status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <InputField
              label="Available From"
              type="date"
              value={formData.availableFrom}
              onChange={(val) =>
                setFormData({ ...formData, availableFrom: val })
              }
            />
            <div>
              <Label>Preferred Leagues</Label>
              <Select
                value={formData.preferredLeagues}
                onValueChange={(val) =>
                  setFormData({ ...formData, preferredLeagues: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred league" />
                </SelectTrigger>
                <SelectContent>
                  {footballLeagues.map((league) => (
                    <SelectItem key={league.value} value={league.value}>
                      {league.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Salary Expectation (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-muted">
                  $
                </span>
                <Input
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.salaryExpectation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salaryExpectation: e.target.value,
                    })
                  }
                  className="pl-8"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={nextStep}>Next</Button>
          </div>
        </div>
      )}

      {/* === STEP 2 & STEP 3 & STEP 4 remain unchanged === */}
      {/* (Keep your existing logic for stats, uploads, and confirmation) */}
    </section>
  );
}

// Progress bar component
function ProgressBar({ progress }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded mt-2 overflow-hidden">
      <div
        className="bg-blue-600 h-full transition-all duration-300"
        style={{ width: `${Math.round(progress)}%` }}
      />
    </div>
  );
}

// Reusable input field
function InputField({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
