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
import { uploadFileWithProgress } from "@/lib/uploadWithProgress";
import { createSubmission } from "@/actions/protectedAction";
import { getUserById } from "@/actions/adminActions";
import { countries } from "@/data/countries&code"; // Adjust import path as needed

export default function PlayerSubmissionForm() {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, loading: isLoading } = useAuth();

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [submittingUser, setSubmittingUser] = useState(null);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [checkingSubscription, setCheckingSubscription] = useState(false);

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

  const checkSubscription = async () => {
    try {
      setCheckingSubscription(true);
      const response = await fetch("/api/subscriptions/check");
      const data = await response.json();

      if (data.subscription) {
        setSubscription(data.subscription);

        // Check if user has reached submission limit
        if (
          data.subscription.usedSubmissions >= data.subscription.maxSubmissions
        ) {
          // Redirect to subscription page
          router.push("/pricing?limit_reached=true");
          return false;
        } else {
          return true;
        }
      } else {
        // No active subscription, redirect to subscription page
        router.push("/pricing?required=true");
        return false;
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      // On error, redirect to subscription page
      router.push("/pricing?error=true");
      return false;
    } finally {
      setCheckingSubscription(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to our custom login page with redirect parameter
        router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      } else {
        setCheckedAuth(true);
        getUserById(user.id).then(setSubmittingUser);
      }
    }
  }, [isLoading, isAuthenticated, pathname, router]);

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
      // if (!formData.videoPrimary) errs.push("videoPrimary");
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
    const canSubmit = await checkSubscription();
    if (canSubmit) {
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
          "Failed to submit profile. Subscribe to a plan and try again",
        variant: "destructive",
      });
    }
  };

  const updateClub = (i, f, v) => {
    const arr = [...formData.clubHistory];
    arr[i][f] = v;
    setFormData((prev) => ({ ...prev, clubHistory: arr }));
  };
  const addClub = () =>
    setFormData((prev) => ({
      ...prev,
      clubHistory: [
        ...prev.clubHistory,
        { clubName: "", startDate: "", endDate: "", position: "" },
      ],
    }));

  const multiUpload = (files, field) => {
    Array.from(files)
      .slice(0, 3)
      .forEach((file, i) => {
        const ref = `players/${formData.email || Date.now()}/${field}/${file.name}`;
        uploadFileWithProgress(ref, file, (p) =>
          setUploadProgress((prev) => ({ ...prev, [`${field}-${i}`]: p }))
        ).then((url) =>
          setFormData((prev) => ({
            ...prev,
            [field]: [...(prev[field] || []), url],
          }))
        );
      });
  };

  const singleUpload = (file, field) => {
    const ref = `players/${formData.email || Date.now()}/${field}/${file.name}`;
    uploadFileWithProgress(ref, file, (p) =>
      setUploadProgress((prev) => ({ ...prev, [field]: p }))
    ).then((url) => setFormData((prev) => ({ ...prev, [field]: url })));
  };

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

      {/* Step 1: Details */}
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
            {/* country select */}
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
            {/* position */}
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
            {/* foot */}
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
            {/* availability */}
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
            <InputField
              label="Contract Status"
              value={formData.contractStatus}
              onChange={(val) =>
                setFormData({ ...formData, contractStatus: val })
              }
            />
            <InputField
              label="Available From"
              type="date"
              value={formData.availableFrom}
              onChange={(val) =>
                setFormData({ ...formData, availableFrom: val })
              }
            />
            <InputField
              label="Preferred Leagues"
              value={formData.preferredLeagues}
              onChange={(val) =>
                setFormData({ ...formData, preferredLeagues: val })
              }
            />
            <InputField
              label="Salary Expectation"
              value={formData.salaryExpectation}
              onChange={(val) =>
                setFormData({ ...formData, salaryExpectation: val })
              }
            />
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

      {/* Step 2 */}
      {step === 2 && (
        <div className="bg-white p-8 rounded-xl">
          <h2 className="text-xl font-semibold mb-6">Stats & Club History</h2>
          {Object.entries(formData.stats).map(([grp, val]) => (
            <div key={grp} className="mb-6">
              <h4 className="font-semibold capitalize">{grp}</h4>
              <div className="grid md:grid-cols-4 gap-4">
                {Object.entries(val).map(([k, v]) => (
                  <div key={k}>
                    <Label>{k}</Label>
                    <Input
                      type="number"
                      value={v}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          stats: {
                            ...prev.stats,
                            [grp]: { ...prev.stats[grp], [k]: e.target.value },
                          },
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="mb-6">
            <h4 className="font-semibold">Club History</h4>
            {formData.clubHistory.map((c, i) => (
              <div key={i} className="grid md:grid-cols-4 gap-4 mb-2">
                {["clubName", "startDate", "endDate", "position"].map(
                  (field) =>
                    typeof field === "string" && field === "position" ? (
                      <div>
                        <Label>Position</Label>
                        <Select
                          value={c.position}
                          onValueChange={(val) => updateClub(i, field, val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Goalkeeper">
                              Goalkeeper
                            </SelectItem>
                            <SelectItem value="Defender">Defender</SelectItem>
                            <SelectItem value="Midfielder">
                              Midfielder
                            </SelectItem>
                            <SelectItem value="Forward">Forward</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div key={field}>
                        <Label>{field.replace(/([A-Z])/g, " $1")}</Label>
                        <Input
                          type={field.includes("Date") ? "date" : "text"}
                          value={c[field]}
                          onChange={(e) => updateClub(i, field, e.target.value)}
                        />
                      </div>
                    )
                )}
              </div>
            ))}
            <Button variant="outline" onClick={addClub}>
              + Add Club
            </Button>
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep}>Next</Button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="bg-white p-8 rounded-xl">
          <h2 className="text-xl font-semibold mb-6">Uploads</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Photos */}
            <div>
              <Label>Photos (max 3)</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => multiUpload(e.target.files, "imageUrl")}
              />
              {[0, 1, 2].map(
                (i) =>
                  uploadProgress[`imageUrl-${i}`] != null && (
                    <ProgressBar
                      key={i}
                      progress={uploadProgress[`imageUrl-${i}`]}
                    />
                  )
              )}
            </div>

            {/* CV */}
            <div>
              <Label>CV (PDF/DOC)</Label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  singleUpload(e.target.files[0], "cvUrl")
                }
              />
              {uploadProgress.cvUrl != null && (
                <ProgressBar progress={uploadProgress.cvUrl} />
              )}
            </div>

            {/* Primary Video */}
            <div className="md:col-span-2">
              <Label>Primary Video *</Label>
              <Input
                type="file"
                accept="video/*"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  singleUpload(e.target.files[0], "videoPrimary")
                }
              />
              {uploadProgress.videoPrimary != null && (
                <ProgressBar progress={uploadProgress.videoPrimary} />
              )}
            </div>

            {/* Additional Videos */}
            <div className="md:col-span-2">
              <Label>Additional Videos (max 3)</Label>
              <Input
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => multiUpload(e.target.files, "videoAdditional")}
              />
              {[0, 1, 2].map(
                (i) =>
                  uploadProgress[`videoAdditional-${i}`] != null && (
                    <ProgressBar
                      key={i}
                      progress={uploadProgress[`videoAdditional-${i}`]}
                    />
                  )
              )}
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button
              onClick={submitForm}
              disabled={uploading}
              title={uploading ? "Uploads in progress" : ""}
            >
              {uploading ? "Uploading..." : "Submit"}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && submitted && (
        <div className="bg-white p-8 rounded-xl text-center">
          <div className="text-3xl text-accent-green mb-4">✔</div>
          <h2 className="text-2xl font-bold mb-2">Submitted Successfully</h2>
          <p className="text-primary-muted mb-4">
            Thank you! We will review and contact you shortly.
          </p>
          <Button onClick={() => window.location.reload()}>
            Submit Another
          </Button>
        </div>
      )}
    </section>
  );
}

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

// InputField helper
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
