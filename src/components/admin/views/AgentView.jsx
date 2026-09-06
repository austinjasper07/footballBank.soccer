"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { uploadFileWithProgress } from "@/lib/uploadWithProgress";
import { UpdateConfirmationModal } from "@/components/admin/dialogs/UpdateConfirmationModal";
import Image from "next/image";

export default function AgentView() {
  const [agentInfo, setAgentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAgentInfo();
  }, []);

  const fetchAgentInfo = async () => {
    try {
      const response = await fetch('/api/admin/agent');
      const data = await response.json();
      setAgentInfo(data);
    } catch (error) {
      console.error('Error fetching agent info:', error);
      toast({
        title: "Error",
        description: "Failed to fetch agent information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size must not exceed 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const imageUrl = await uploadFileWithProgress(
        'agent_profile_photo',
        file,
        (progress) => setUploadProgress(progress)
      );

      setAgentInfo(prev => ({
        ...prev,
        profilePhoto: imageUrl
      }));

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setFormData(formData);
    setUpdateDialogOpen(true);
  };

  const confirmUpdate = async () => {
    if (!formData) return;
    
    setSaving(true);
    setUpdateDialogOpen(false);

    try {
      const response = await fetch('/api/admin/agent', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const updatedAgent = await response.json();
        setAgentInfo(updatedAgent);
        toast({
          title: "Success",
          description: "Agent information updated successfully",
        });
      } else {
        throw new Error('Failed to update agent information');
      }
    } catch (error) {
      console.error('Error updating agent info:', error);
      toast({
        title: "Error",
        description: "Failed to update agent information",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
      setFormData(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-action mx-auto mb-4"></div>
          <p>Loading agent information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-action">Public representative</p><h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight">Agent profile</h2><p className="mt-2 max-w-xl text-sm leading-6 text-primary-muted">Shape the public representative profile shown across FootballBank International.</p></div> */}

      <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
      <Card className="overflow-hidden border-0 bg-primary-navy text-primary-text-inverse shadow-lg">
        <CardContent className="p-6 sm:p-8">
          <div className="relative mx-auto aspect-4/5 max-w-xs overflow-hidden bg-primary-text-inverse/10">
            {agentInfo?.profilePhoto && <Image src={agentInfo.profilePhoto} alt="Agent profile" fill className="object-cover" />}
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-primary-accent">FootballBank International</p>
          <h3 className="mt-3 font-heading text-3xl font-semibold">{agentInfo?.name || "Your agent"}</h3>
          <p className="mt-2 text-sm text-primary-text-inverse/65">{agentInfo?.credentials || "Professional representative"}</p>
          <div className="mt-6 border-t border-primary-text-inverse/15 pt-5 text-sm text-primary-text-inverse/70">{agentInfo?.location || "United States"}</div>
        </CardContent>
      </Card>

      <Card className="border border-divider bg-primary-card shadow-sm">
        <CardHeader className="border-b border-divider px-6 py-5 sm:px-8"><CardTitle className="font-heading text-2xl">Profile details</CardTitle></CardHeader>
        <CardContent className="px-6 py-6 sm:px-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Profile Photo */}
            <div className="space-y-4">
              <Label htmlFor="profilePhoto">Profile photo</Label>
              <Input
                id="profilePhoto"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                disabled={uploading}
                className="cursor-pointer"
              />
              {uploading && (
                <div className="space-y-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary-bg-alt">
                    <div
                      className="bg-primary-action h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-primary-muted">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
              <p className="text-xs text-primary-muted">Maximum 5MB · JPG, PNG, or GIF</p>
            </div>

            {/* Hidden input for profile photo URL */}
            <input
              type="hidden"
              name="profilePhoto"
              value={agentInfo?.profilePhoto || ""}
            />

            {/* Agent Information Fields */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Agent Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={agentInfo?.name || ""}
                  placeholder="Enter agent name"
                  required
                />
              </div>


              <div>
                <Label htmlFor="credentials">Credentials</Label>
                <Input
                  id="credentials"
                  name="credentials"
                  defaultValue={agentInfo?.credentials || ""}
                  placeholder="e.g., Licenced Agent"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={agentInfo?.location || ""}
                  placeholder="e.g., United States"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={agentInfo?.bio || ""}
                placeholder="Enter agent bio"
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="flex justify-end border-t border-divider pt-5">
              <Button type="submit" variant="action" disabled={saving || uploading}>
                {saving ? "Saving..." : "Update Agent Information"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>

      <UpdateConfirmationModal
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        onConfirm={confirmUpdate}
        title="Update Agent Information"
        description="Please confirm that you want to update the agent information."
        itemName={agentInfo?.name || "agent information"}
        isLoading={saving}
      />
    </div>
  );
}
