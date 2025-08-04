"use client";
import { uploadFileWithProgress } from "@/lib/uploadWithProgress";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FeaturedToggle } from "@/components/FeatureToggle";
import { createPlayer, updatePlayer, getAllPlayers } from "@/actions/adminActions";

export function PlayerDialog({ open, onOpenChange, player, onSave }) {
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState({});

  const [formData, setFormData] = useState({
    ...player,
    firstName: player?.firstName || "",
    lastName: player?.lastName || "",
    dob: player?.dob || "",
    country: player?.country || "",
    countryCode: player?.countryCode || "",
    position: player?.position || "",
    height: player?.height || "",
    weight: player?.weight || "",
    foot: player?.foot || "",
    email: player?.email || "",
    phone: player?.phone || "",
    cvUrl: player?.cvUrl || "",
    imageUrl: player?.imageUrl || [""],
    description: player?.description || "",
    videoPrimary: player?.videoPrimary,
    videoAdditional: player?.videoAdditional || [""],
    featured: player?.featured || false,
    playerOfTheWeek: player?.playerOfTheWeek || false,
  });

  useEffect(() => {
    getAllPlayers();
  }, []);

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.position) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const message = player?.id
        ? await updatePlayer(player.id, formData)
        : await createPlayer(formData);

      console.log(message);
      onSave({ ...formData, id: player?.id });
      onOpenChange(false);

      toast({
        title: "Success",
        description: "Player saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while saving the player.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{player ? "Edit Player" : "Add New Player"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              placeholder="e.g. Spain"
            />
          </div>

          <div>
            <Label htmlFor="countryCode">Country Code</Label>
            <Input
              id="countryCode"
              value={formData.countryCode}
              onChange={(e) =>
                setFormData({ ...formData, countryCode: e.target.value })
              }
              placeholder="e.g. ES"
            />
          </div>

          <div>
            <Label htmlFor="position">Position *</Label>
            <Select
              value={formData.position}
              onValueChange={(value) =>
                setFormData({ ...formData, position: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                <SelectItem value="Defender">Defender</SelectItem>
                <SelectItem value="Midfielder">Midfielder</SelectItem>
                <SelectItem value="Forward">Forward</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <FeaturedToggle
              value={formData.featured ?? false}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, featured: val }))
              }
            />
          </div>

          <div>
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              value={formData.height}
              onChange={(e) =>
                setFormData({ ...formData, height: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              value={formData.weight}
              onChange={(e) =>
                setFormData({ ...formData, weight: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="foot">Preferred Foot</Label>
            <Select
              value={formData.foot}
              onValueChange={(value) =>
                setFormData({ ...formData, foot: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select foot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Left">Left</SelectItem>
                <SelectItem value="Right">Right</SelectItem>
                <SelectItem value="Both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="images">Upload Images (max 3)</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []).slice(0, 3);
                const uploadPromises = files.map((file, i) => {
                  const path = `players/${formData.email || Date.now()}/images/${file.name}`;
                  return uploadFileWithProgress(path, file, (p) => {
                    setUploadProgress((prev) => ({
                      ...prev,
                      [`image-${i}`]: p,
                    }));
                  });
                });

                Promise.all(uploadPromises).then((urls) => {
                  setFormData((prev) => ({ ...prev, imageUrl: urls }));
                });
              }}
            />
            {[0, 1, 2].map((i) =>
              uploadProgress[`image-${i}`] != null ? (
                <ProgressBar key={i} progress={uploadProgress[`image-${i}`]} />
              ) : null
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Player Bio</Label>
            <Textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="videoPrimary">Upload Primary Video *</Label>
            <Input
              id="videoPrimary"
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const path = `players/${formData.email || Date.now()}/videoPrimary/${file.name}`;
                uploadFileWithProgress(path, file, (p) => {
                  setUploadProgress((prev) => ({ ...prev, videoPrimary: p }));
                }).then((url) => {
                  setFormData((prev) => ({ ...prev, videoPrimary: url }));
                });
              }}
            />
            {uploadProgress.videoPrimary !== undefined && (
              <ProgressBar progress={uploadProgress.videoPrimary} />
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="videoAdditional">Upload Additional Videos (max 3)</Label>
            <Input
              id="videoAdditional"
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []).slice(0, 3);
                const uploadPromises = files.map((file, i) => {
                  const path = `players/${formData.email || Date.now()}/videoAdditional/${file.name}`;
                  return uploadFileWithProgress(path, file, (p) => {
                    setUploadProgress((prev) => ({
                      ...prev,
                      [`videoAdditional-${i}`]: p,
                    }));
                  });
                });

                Promise.all(uploadPromises).then((urls) => {
                  setFormData((prev) => ({ ...prev, videoAdditional: urls }));
                });
              }}
            />
            {[0, 1, 2].map((i) =>
              uploadProgress[`videoAdditional-${i}`] != null ? (
                <ProgressBar key={i} progress={uploadProgress[`videoAdditional-${i}`]} />
              ) : null
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="cvUpload">Upload CV</Label>
            <Input
              id="cvUpload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const path = `players/${formData.email || Date.now()}/cv/${file.name}`;
                uploadFileWithProgress(path, file, (p) => {
                  setUploadProgress((prev) => ({ ...prev, cv: p }));
                }).then((url) => {
                  setFormData((prev) => ({ ...prev, cvUrl: url }));
                });
              }}
            />
            {uploadProgress.cv !== undefined && (
              <ProgressBar progress={uploadProgress.cv} />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {player ? "Update Player" : "Add Player"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProgressBar({ progress }) {
  return (
    <div className="w-full bg-gray-200 rounded h-2 mt-1">
      <div
        className="bg-blue-500 h-2 rounded transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
