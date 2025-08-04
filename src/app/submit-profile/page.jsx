"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
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
import SplashScreen from "@/components/SplashScreen";
import { getUserById } from "@/actions/adminActions";

export default function PlayerSubmissionForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [currentPath, setCurrentPath] = useState("");
  const [submittingUser, setSubmittingUser] = useState(null);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    country: "",
    countryCode: "",
    position: "",
    height: "",
    weight: "",
    foot: "",
    email: "",
    phone: "",
    description: "",
    imageUrl: [],
    videoPrimary: "",
    videoAdditional: [],
    cvUrl: "",
  });
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace(`/api/auth/login?post_login_redirect_url=${pathname}`);
      } else {
        setCheckedAuth(true); // allow render after confirmed auth
        const fetchUser = async () => {
          const response = await getUserById(user.id);
          setSubmittingUser(response);
          console.log("User fetched:", response);
        };
        fetchUser();

      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);


  if (isLoading || !checkedAuth) {
    return <SplashScreen />; // or return null
  }

  const isError = (field) => errors.includes(field);

  

  const validateStep1 = () => {
    const required = [
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
    ];
    const errs = required.filter((key) => !formData[key]);
    setErrors(errs);
    return errs.length === 0;
  };

  const validateStep2 = () => {
    const errs = [];
    if (!formData.videoPrimary) errs.push("videoPrimary");
    if (formData.imageUrl.length === 0) errs.push("imageUrl");
    if (!formData.cvUrl) errs.push("cvUrl");
    setErrors(errs);
    return errs.length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) submitForm();
  };

  const prevStep = () => setStep(step - 1);

  const submitForm = async () => {
    try {
      const submissionData = {
        ...formData,
        featured: false,
        playerOfTheWeek: false,
        submittedAt: new Date(),
        userId: submittingUser?.id,
        rejectionReason: "",
      };
      const res = await createSubmission(submissionData);
      if (!res) {
        toast({ title: "Error", description: "Failed to create submission" });
        return;
      }
      setSubmitted(true);
      setStep(3);
      toast({
        title: "Success",
        description: "Profile submitted successfully.",
      });
    } catch {
      toast({
        title: "Error",
        description: "An error occurred while submitting your profile.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      {/* Step Progress */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {["Details", "Uploads", "Complete"].map((label, i) => {
          const s = i + 1;
          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                  step >= s
                    ? "bg-accent-red text-white"
                    : "bg-primary-secondary border border-divider text-primary-muted"
                }`}
              >
                {step > s ? <i className="fa-solid fa-check text-xs" /> : s}
              </div>
              <span
                className={`text-sm ${
                  step >= s ? "text-primary-text" : "text-primary-muted"
                }`}
              >
                {label}
              </span>
              {s < 3 && <div className="w-12 h-px bg-divider" />}
            </div>
          );
        })}
      </div>

      {/* Step 1 – Details */}
      {step === 1 && (
        <div className="bg-white shadow rounded-xl border border-divider p-8">
          <h2 className="text-xl font-semibold mb-6">Personal Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "First Name", name: "firstName" },
              { label: "Last Name", name: "lastName" },
              { label: "Date of Birth", name: "dob", type: "date" },
              { label: "Country", name: "country" },
              { label: "Country Code", name: "countryCode" },
              {
                label: "Position",
                name: "position",
                options: ["Goalkeeper", "Defender", "Midfielder", "Forward"],
              },
              { label: "Height (cm)", name: "height" },
              { label: "Weight (kg)", name: "weight" },
              {
                label: "Preferred Foot",
                name: "foot",
                options: ["Right", "Left", "Both"],
              },
              { label: "Email", name: "email", type: "email" },
              { label: "Phone", name: "phone" },
            ].map(({ label, name, type = "text", options }) => (
              <div key={name}>
                <Label>{label} *</Label>
                {options ? (
                  <Select
                    value={formData[name]}
                    onValueChange={(val) =>
                      setFormData({ ...formData, [name]: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type={type}
                    value={formData[name]}
                    onChange={(e) =>
                      setFormData({ ...formData, [name]: e.target.value })
                    }
                  />
                )}
              </div>
            ))}
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea
                rows={4}
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

      {/* Step 2 – Uploads */}
      {step === 2 && (
        <div className="bg-white shadow rounded-xl border border-divider p-8">
          <h2 className="text-xl font-semibold mb-6">Uploads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Photos */}
            <div>
              <Label>Upload Photos (max 3)</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []).slice(0, 3);
                  const uploaders = files.map((file, i) => {
                    const ref = `players/${formData.email}/images/${file.name}`;
                    return uploadFileWithProgress(ref, file, (p) =>
                      setUploadProgress((prev) => ({
                        ...prev,
                        [`img-${i}`]: p,
                      }))
                    );
                  });
                  Promise.all(uploaders).then((urls) =>
                    setFormData((prev) => ({ ...prev, imageUrl: urls }))
                  );
                }}
              />
              {[0, 1, 2].map(
                (i) =>
                  uploadProgress[`img-${i}`] != null && (
                    <ProgressBar
                      key={i}
                      progress={uploadProgress[`img-${i}`]}
                    />
                  )
              )}
            </div>

            {/* CV Upload */}
            <div>
              <Label>Upload CV</Label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const ref = `players/${formData.email}/cv/${file.name}`;
                  uploadFileWithProgress(ref, file, (p) =>
                    setUploadProgress((prev) => ({ ...prev, cv: p }))
                  ).then((url) =>
                    setFormData((prev) => ({ ...prev, cvUrl: url }))
                  );
                }}
              />
              {uploadProgress.cv != null && (
                <ProgressBar progress={uploadProgress.cv} />
              )}
            </div>

            {/* Primary Video */}
            <div className="md:col-span-2">
              <Label>Primary Video</Label>
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const ref = `players/${formData.email}/videoPrimary/${file.name}`;
                  uploadFileWithProgress(ref, file, (p) =>
                    setUploadProgress((prev) => ({ ...prev, videoPrimary: p }))
                  ).then((url) =>
                    setFormData((prev) => ({ ...prev, videoPrimary: url }))
                  );
                }}
              />
              {uploadProgress.videoPrimary != null && (
                <ProgressBar progress={uploadProgress.videoPrimary} />
              )}
            </div>

            {/* Additional Videos */}
            <div className="md:col-span-2">
              <Label>Additional Videos (max 3)</Label>
              <Input
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []).slice(0, 3);
                  const uploaders = files.map((file, i) => {
                    const ref = `players/${formData.email}/videoAdditional/${file.name}`;
                    return uploadFileWithProgress(ref, file, (p) =>
                      setUploadProgress((prev) => ({
                        ...prev,
                        [`vid-${i}`]: p,
                      }))
                    );
                  });
                  Promise.all(uploaders).then((urls) =>
                    setFormData((prev) => ({ ...prev, videoAdditional: urls }))
                  );
                }}
              />
              {[0, 1, 2].map(
                (i) =>
                  uploadProgress[`vid-${i}`] != null && (
                    <ProgressBar
                      key={i}
                      progress={uploadProgress[`vid-${i}`]}
                    />
                  )
              )}
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep}>Submit</Button>
          </div>
        </div>
      )}

      {/* Step 3 – Confirmation */}
      {step === 3 && submitted && (
        <div className="bg-white shadow rounded-xl border border-divider p-8 text-center">
          <div className="text-3xl text-accent-green mb-4">
            <i className="fa-solid fa-check-circle"></i>
          </div>
          <h2 className="text-2xl font-bold mb-2">Submitted Successfully</h2>
          <p className="text-primary-muted mb-4">
            Our team will contact you shortly.
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
