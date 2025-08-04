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
import { SearchBar } from "@/components/admin/SearchBar";
import { BlogPostDialog } from "@/components/admin/dialogs/BlogPostDialog";

import { getAllPosts } from "@/actions/publicActions";
import { updatePost, deletePost } from "@/actions/adminActions";

const ITEMS_PER_PAGE = 5;

export default function BlogView() {
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getAllPosts();
        setPosts(response);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        (post.author || "").toLowerCase().includes(query) ||
        (post.summary || "").toLowerCase().includes(query)
    );
  }, [posts, searchQuery]);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPosts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);

  const handleDeletePost = async (id) => {
    try {
      await deletePost(id);
      toast({
        title: "Post Deleted",
        description: "The blog post has been removed successfully.",
      });
      const updated = await getAllPosts();
      setPosts(updated);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete post.",
        variant: "destructive",
      });
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setPostDialogOpen(true);
  };

  const handleAddOrUpdatePost = async (data) => {
    if (!data.id) {
      toast({
        title: "Error",
        description: "New post creation not implemented yet.",
        variant: "destructive",
      });
      return;
    }

    await updatePost(data.id, data);
    const updated = await getAllPosts();
    setPosts(updated);
    toast({
      title: "Success",
      description: "Post updated successfully.",
    });
  };

  const countStats = () => {
    const total = posts.length;
    const published = posts.filter((p) => p.featured).length;
    const drafts = posts.filter((p) => !p.featured).length;
    const views = posts.reduce((acc, p) => acc + (p.views || 0), 0);
    return { total, published, drafts, views };
  };

  const { total, published, drafts, views } = countStats();

  return (
    <div className="space-y-6">
      {/* Blog Stats */}
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
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search posts..."
            className="w-50 md:w-80"
          />
        </div>
        <Button onClick={() => setPostDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Blog Posts Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Title</th>
                  <th className="text-left p-4 font-medium">Summary</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Views</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPosts.map((post) => (
                  <tr key={post.id} className="border-t hover:bg-muted/40">
                    <td className="p-4 font-medium">{post.title}</td>
                    <td className="p-4 text-muted-foreground line-clamp-2 max-w-[300px]">
                      {post.summary}
                    </td>
                    <td className="p-4">
                      <Badge
                        className={
                          post.featured
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        }
                      >
                        {post.featured ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {post.views || 0}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPost(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Blog Post Dialog */}
      <BlogPostDialog
        open={postDialogOpen}
        onOpenChange={(open) => {
          setPostDialogOpen(open);
          if (!open) setEditingPost(null);
        }}
        post={editingPost || undefined}
        onSave={handleAddOrUpdatePost}
      />
    </div>
  );
}
