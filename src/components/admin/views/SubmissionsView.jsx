"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, X, Clock, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/admin/SearchBar";
import { SubmissionDetailDialog } from "@/components/admin/dialogs/SubmissionDetailDialog";
import { DeleteConfirmationModal } from "@/components/admin/dialogs/DeleteConfirmationModal";
import { useToast } from "@/hooks/use-toast";
import {
  approveSubmission,
  getAllSubmissions,
  getSubmissionsById,
  rejectSubmission,
  deleteSubmission,
} from "@/actions/adminActions";
import { calculateAge, formatFullDate } from "@/utils/dateHelper";
import LoadingSplash from "@/components/ui/loading-splash";

export default function SubmissionsView() {
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        const response = await getAllSubmissions();
        setSubmissions(response);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const filtered = useMemo(() => {
    const list = Array.isArray(submissions) ? submissions : [];
    return list.filter((s) =>
      [s.firstName, s.lastName, s.country, s.position].some((field) =>
        field.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [submissions, searchQuery]);

  const handleApprove = useCallback(
  async (id) => {

    console.log(id)
    try {
      const data = await approveSubmission(id);
      if (!data) throw new Error("Submission not found or approval failed");

      // ✅ Show toast
      toast({ title: "Approved", description: "Submission approved." });

      // ✅ Refresh submissions
      const updated = await getAllSubmissions();
      setSubmissions(updated);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while approving the submission.",
        variant: "destructive",
      });
    }
  },
  [toast]
);

const handleReject = useCallback(
  async (id) => {
    try {
      const data = await rejectSubmission(id, "Incomplete Submission");

      // ✅ Show toast
      toast({ title: "Rejected", description: data.rejectionReason });

      // ✅ Refresh submissions
      const updated = await getAllSubmissions();
      setSubmissions(updated);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while rejecting the submission.",
        variant: "destructive",
      });
    }
  },
  [toast]
);

const handleDeleteSubmission = useCallback(
  async (id) => {
    const submission = submissions.find(s => s.id === id);
    setSubmissionToDelete(submission);
    setDeleteDialogOpen(true);
  },
  [submissions]
);

const confirmDeleteSubmission = useCallback(
  async () => {
    if (!submissionToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteSubmission(submissionToDelete.id);
      toast({
        title: "Submission Deleted",
        description: "The submission has been removed successfully.",
      });
      const updated = await getAllSubmissions();
      setSubmissions(updated);
      setDeleteDialogOpen(false);
      setSubmissionToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete submission.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  },
  [submissionToDelete, toast]
);


  const handleViewDetails = async (id) => {
    const data = await getSubmissionsById(id);
    setSelectedSubmission(data);
    setDetailDialogOpen(true);
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      const response = await getAllSubmissions();
      setSubmissions(response);
    };
    fetchSubmissions();
  }, [handleApprove, handleReject]);

  const pending = filtered.filter((s) => s.status === "PENDING");
  const approved = filtered.filter((s) => s.status === "APPROVED");
  const rejected = filtered.filter((s) => s.status === "REJECTED");

  if (isLoading) {
    return <LoadingSplash message="Loading submissions..." />;
  }

  return (
    <div className="space-y-6">
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search submissions..."
        className="w-96"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SubmissionColumn
          icon={<Clock className="h-5 w-5 text-yellow-500" />}
          title="Pending Review"
          count={pending.length}
          data={pending}
          onApprove={handleApprove}
          onReject={handleReject}
          onView={handleViewDetails}
          onDelete={handleDeleteSubmission}
          status="pending"
        />
        <SubmissionColumn
          icon={<Check className="h-5 w-5 text-green-500" />}
          title="Approved"
          count={approved.length}
          data={approved}
          status="approved"
        />
        <SubmissionColumn
          icon={<X className="h-5 w-5 text-red-500" />}
          title="Rejected"
          count={rejected.length}
          data={rejected}
          status="rejected"
        />
      </div>

      <SubmissionDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        submission={selectedSubmission}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <DeleteConfirmationModal
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteSubmission}
        title="Delete Submission"
        description="This will permanently remove the submission from the system."
        itemName={submissionToDelete ? `${submissionToDelete.firstName} ${submissionToDelete.lastName}` : ''}
        isLoading={isDeleting}
      />
    </div>
  );
}

function SubmissionColumn({
  title,
  icon,
  count,
  data,
  status,
  onApprove,
  onReject,
  onView,
  onDelete,
}) {
  return (
    <Card className="border-0 shadow-sm ">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon} {title} ({count})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className=" space-y-4">
          {data.length > 0 ? (
            data.slice(0, 3).map((submission) => (
              <div
                key={submission.id}
                className="bg-[hsl(var(--muted))]/50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">
                    {submission.firstName} {submission.lastName}
                  </span>
                  {status === "pending" ? (
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">
                      {formatFullDate(submission.submittedAt)}
                    </span>
                  ) : (
                    <Badge
                      className={
                        status === "approved" ? "bg-green-500" : "bg-red-500"
                      }
                      variant={
                        status === "rejected" ? "destructive" : "default"
                      }
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">
                  {submission.country} • {submission.position} • Age{" "}
                  {calculateAge(submission.dob)}
                </p>

                {status === "rejected" && submission.rejectionReason && (
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    Reason: {submission.rejectionReason}
                  </p>
                )}

                {status === "pending" && (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onView?.(submission.id)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => onApprove?.(submission.id)}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onReject?.(submission.id)}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDelete?.(submission.id)}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No {status} submissions
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
