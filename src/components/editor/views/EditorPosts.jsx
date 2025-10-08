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

import { getAllPosts } from "@/actions/publicActions";
import { updatePost, deletePost } from "@/actions/adminActions";

const ITEMS_PER_PAGE = 5;

export default function EditorPosts({ onNavigateToEditor }) {
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Edit className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Posts</p>
                <p className="text-2xl font-bold">{total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Eye className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">{published}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Edit className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold">{drafts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Eye className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{views.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Header */}
      <div className="flex md:items-center justify-between">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <h2 className="text-xl font-semibold text-nowrap">Blog Posts</h2>

          <input
            type="text"
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search posts..."
            className="w-full rounded-md px-3 py-2 pr-10 border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:border-[hsl(var(--primary))]"
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreateNewPost}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Post
          </Button>
        </div>
      </div>

      {/* Blog Posts Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {post.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {post.summary ||
                              post.content
                                .replace(/<[^>]*>/g, "")
                                .substring(0, 100)}
                            ...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {post.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          post.status === "Published" ? "default" : "secondary"
                        }
                      >
                        {post.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {post.views || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
