"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

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
import { SearchBar } from "@/components/admin/SearchBar";
import { DeleteConfirmationModal } from "@/components/admin/dialogs/DeleteConfirmationModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { getAllPosts } from "@/actions/publicActions";
import { updatePost, deletePost } from "@/actions/adminActions";

const ITEMS_PER_PAGE = 5;

export default function AdminBlogView({ refreshPulse = 0 }) {
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, [refreshPulse]);

  const loadPosts = async () => {
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load posts.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = (post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleViewPost = (post) => {
    const postUrl = `/en/blog/${post.id}`;
    window.open(postUrl, '_blank');
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
    // Redirect to editor dashboard for editing
    window.open(`/editor?edit=${post.id}`, '_blank');
  };

  const countStats = () => {
    const total = posts.length;
    const published = posts.filter((post) => post.status === "Published").length;
    const drafts = posts.filter((post) => post.status === "Draft").length;
    const views = posts.reduce((sum, post) => sum + (post.views || 0), 0);

    return { total, published, drafts, views };
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) =>
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

  const stats = countStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border border-divider bg-primary-card shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-7 items-center justify-center rounded-full bg-primary-action/10">
                <span className="text-xs font-bold text-primary-action">T</span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary-muted">Total Posts</p>
                <p className="font-heading text-xl font-semibold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-divider bg-primary-card shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-7 items-center justify-center rounded-full bg-primary-action/10">
                <span className="text-xs font-bold text-primary-action">P</span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary-muted">Published</p>
                <p className="font-heading text-xl font-semibold">{stats.published}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-divider bg-primary-card shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-7 items-center justify-center rounded-full bg-primary-accent/30">
                <span className="text-xs font-bold text-primary-navy">D</span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary-muted">Drafts</p>
                <p className="font-heading text-xl font-semibold">{stats.drafts}</p>
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
                <p className="font-heading text-xl font-semibold">{stats.views.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search posts..."
            className="w-full sm:w-80"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => window.open('/editor', '_blank')} 
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Eye className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Go to Editor Dashboard</span>
            <span className="sm:hidden">Editor Dashboard</span>
          </Button>
        </div>
      </div>

      {/* Blog Posts Table */}
      <Card className="overflow-hidden border border-divider bg-primary-card shadow-sm"><CardContent className="p-0"><Table><TableHeader><TableRow>
                <TableHead>Title</TableHead><TableHead>Author</TableHead><TableHead>Status</TableHead><TableHead>Views</TableHead><TableHead>Created</TableHead><TableHead>Actions</TableHead>
              </TableRow></TableHeader><TableBody>
              {paginatedPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="max-w-[18rem]">
                    <div className="flex items-center">
                      <div>
                        <div className="truncate text-sm font-semibold text-primary-text" title={post.title}>
                          {post.title.substring(0, 40)}{post.title.length > 40 ? "..." : ""}
                        </div>
                        <div className="max-w-[18rem] truncate text-sm text-primary-muted">
                        {post.summary || post.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                        </div>
                      </div>
                    </div>
                  </TableCell><TableCell>
                    {post.author}
                  </TableCell><TableCell>
                    <Badge
                      variant={post.status === "Published" ? "default" : "secondary"}
                    >
                      {post.status}
                    </Badge>
                  </TableCell><TableCell>
                    {post.views || 0}
                  </TableCell><TableCell className="text-primary-muted">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </TableCell><TableCell>
                    {/* Mobile Layout */}
                    <div className="block sm:hidden">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPost(post)}
                          className="flex-1 text-primary-action hover:text-primary-action-hover"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          <span className="text-xs">View</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPost(post)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          <span className="text-xs">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePost(post)}
                          className="flex-1 text-accent-red hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          <span className="text-xs">Delete</span>
                        </Button>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPost(post)}
                        className="text-primary-action hover:text-primary-action-hover"
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
                        className="text-accent-red hover:border-accent-red hover:bg-accent-red/10 hover:text-accent-red"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody></Table></CardContent></Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
        itemName={postToDelete ? postToDelete.title : ''}
        isLoading={isDeleting}
      />
    </div>
  );
}
