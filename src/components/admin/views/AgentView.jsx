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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-red mx-auto mb-4"></div>
          <p>Loading agent information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-text">Agent Management</h2>
        <p className="text-primary-muted">Manage agent profile information and photo</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Profile Photo */}
            <div className="space-y-4">
              <Label>Current Profile Photo</Label>
              {agentInfo?.profilePhoto && (
                <div className="relative w-32 h-40 border rounded-lg overflow-hidden">
                  <Image
                    src={agentInfo.profilePhoto}
                    alt="Agent profile"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <Label htmlFor="profilePhoto">Update Profile Photo</Label>
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
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-accent-red h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-primary-muted">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
              <p className="text-sm text-primary-muted">
                Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
              </p>
            </div>

            {/* Hidden input for profile photo URL */}
            <input
              type="hidden"
              name="profilePhoto"
              value={agentInfo?.profilePhoto || ""}
            />

            {/* Agent Information Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="e.g., Licensed Agent"
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

            <div className="flex justify-end">
              <Button type="submit" disabled={saving || uploading}>
                {saving ? "Saving..." : "Update Agent Information"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

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
