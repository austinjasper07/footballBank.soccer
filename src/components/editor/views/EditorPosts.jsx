"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search } from "lucide-react";
import { DeleteConfirmationModal } from "@/components/admin/dialogs/DeleteConfirmationModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LoadingSplash from "@/components/ui/loading-splash";

import { getAllPosts } from "@/actions/publicActions";
import { updatePost, deletePost } from "@/actions/adminActions";

const ITEMS_PER_PAGE = 5;

// Utility function to truncate text to 100 characters for mobile
const truncateText = (text, maxLength = 100) => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export default function EditorPosts({ onNavigateToEditor }) {
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const data = await getAllPosts();
      setPosts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load posts.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = (post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleViewPost = (post) => {
    const postUrl = `/en/blog/${post.id}`;
    window.open(postUrl, "_blank");
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;

    setIsDeleting(true);
    try {
      await deletePost(postToDelete.id);
      toast({
        title: "Success",
        description: "Post deleted successfully.",
      });
      const updated = await getAllPosts();
      setPosts(updated);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete post.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditPost = (post) => {
    onNavigateToEditor(post);
  };

  const handleCreateNewPost = () => {
    onNavigateToEditor();
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);

  const countStats = () => {
    const total = posts.length;
    const published = posts.filter((p) => p.status === "Published").length;
    const drafts = posts.filter((p) => p.status === "Draft").length;
    const views = posts.reduce((sum, p) => sum + (p.views || 0), 0);
    return { total, published, drafts, views };
  };

  const { total, published, drafts, views } = countStats();

  if (isLoading) {
    return <LoadingSplash message="Loading posts..." />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="border border-divider bg-primary-card shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <Edit className="size-7 text-primary-action" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary-muted">Total Posts</p>
                <p className="font-heading text-xl font-semibold">{total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-divider bg-primary-card shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <Eye className="size-7 text-primary-action" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary-muted">Published</p>
                <p className="font-heading text-xl font-semibold">{published}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-divider bg-primary-card shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <Edit className="size-7 text-primary-navy" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary-muted">Drafts</p>
                <p className="font-heading text-xl font-semibold">{drafts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-divider bg-primary-card shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <Eye className="size-7 text-primary-action" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary-muted">Total Views</p>
                <p className="font-heading text-xl font-semibold">{views.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Header */}
      <div className="flex md:items-center justify-between">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <h2 className="text-xl font-semibold text-nowrap">Blog Posts</h2>

          <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search posts..."
            className="w-full rounded-md border border-divider bg-primary-card px-3 py-2 pr-10 text-sm outline-none focus:border-primary-action focus:ring-2 focus:ring-primary-action/20"
          />
          <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-primary-muted" />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open('/blog', '_blank')}>
            View Posts
          </Button>
          <Button onClick={handleCreateNewPost}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Post
          </Button>
        </div>
      </div>

      {/* Blog Posts Table */}
      <Card className="overflow-hidden border border-divider bg-primary-card shadow-sm">
        <CardContent className="p-0">
          <Table><TableHeader><TableRow>
                  <TableHead>Title</TableHead><TableHead>Author</TableHead><TableHead>Status</TableHead><TableHead>Views</TableHead><TableHead>Created</TableHead><TableHead>Actions</TableHead>
              </TableRow></TableHeader><TableBody>
                {paginatedPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="max-w-[18rem]">
                      <div className="max-w-[18rem]"><div className="truncate text-sm font-semibold text-primary-text" title={post.title}>{post.title}</div><div className="truncate text-sm text-primary-muted">{post.summary || post.content.replace(/<[^>]*>/g, "").substring(0, 100)}...</div></div>
                    </TableCell>
                    <TableCell className="max-w-40 truncate" title={post.author}>{post.author}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          post.status === "Published" ? "default" : "secondary"
                        }
                      >
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {post.views || 0}
                    </TableCell>
                    <TableCell className="text-primary-muted">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPost(post)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPost(post)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePost(post)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <DeleteConfirmationModal
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeletePost}
        title="Delete Blog Post"
        description="This will permanently remove the blog post from the system."
        itemName={postToDelete ? postToDelete.title : ""}
        isLoading={isDeleting}
      />
    </div>
  );
}
