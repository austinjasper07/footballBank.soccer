import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye, Mail, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatFullDate, formatShortDate } from "@/utils/dateHelper";

export function SubmissionDetailDialog({
  open,
  onOpenChange,
  submission,
  onApprove,
  onReject,
}) {
  const { toast } = useToast();

  if (!submission) return null;

  const handleApprove = () => {
    onApprove(submission.id);
    onOpenChange(false);
    toast({
      title: "Submission Approved",
      description: `${submission.firstName} ${submission.lastName}'s submission has been approved`,
    });
  };

  const handleReject = async () => {
    onReject(submission.id, "Incomplete documentation");
    onOpenChange(false);
    toast({
      title: "Submission Rejected",
      description: `${submission.firstName} ${submission.lastName}'s submission has been rejected`,
      variant: "destructive",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Player Submission Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                {submission.firstName} {submission.lastName}
              </h3>
              <p className="text-[hsl(var(--muted-foreground))]">
                {submission.country} • {submission.position} • Age {formatShortDate(submission.dob)}
              </p>
            </div>
            <Badge
              variant={
                submission.status === "PENDING"
                  ? "secondary"
                  : submission.status === "APPROVED"
                  ? "default"
                  : "destructive"
              }
              className={
                submission.status === "PENDING"
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : submission.status === "APPROVED"
                  ? "bg-green-500 hover:bg-green-600"
                  : ""
              }
            >
              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
            </Badge>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Information
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> {submission.email || "Not provided"}</p>
                <p><strong>Phone:</strong> {submission.phone || "Not provided"}</p>
                <p className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <strong>Location:</strong> {submission.country || "Not provided"}
                </p>
                <p className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <strong>Submitted:</strong> {formatFullDate(submission.submittedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Biography */}
          {submission.description && (
            <div>
              <h4 className="font-semibold mb-2">Biography</h4>
              <p className="text-sm leading-relaxed bg-[hsl(var(--muted))]/50 p-3 rounded-lg">
                {submission.description}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        {submission.status === "PENDING" && (
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button onClick={handleApprove} className="bg-green-500 hover:bg-green-600">
              <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
