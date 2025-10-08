"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import AdvancedTextEditor from "@/components/admin/AdvancedTextEditor";
import { createPost, updatePost, getAllPosts } from "@/actions/adminActions";
import { useAuth } from "@/context/NewAuthContext";

export default function EditorEditor({ editingPost, onSave, onCancel }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [postData, setPostData] = useState({
    title: "",
    summary: "",
    content: "",
    author: user?.firstName ? `${user.firstName} ${user.lastName}` : "Editor",
    category: "General",
    status: "Draft",
    featured: false,
    tags: [],
    imageUrl: []
  });

  useEffect(() => {
    if (editingPost) {
      setPostData({
        id: editingPost.id,
        title: editingPost.title || "",
        summary: editingPost.summary || "",
        content: editingPost.content || "",
        author: editingPost.author || (user?.firstName ? `${user.firstName} ${user.lastName}` : "Editor"),
        category: editingPost.category || "General",
        status: editingPost.status || "Draft",
        featured: editingPost.featured || false,
        tags: editingPost.tags || [],
        imageUrl: Array.isArray(editingPost.imageUrl) ? editingPost.imageUrl : (editingPost.imageUrl ? [editingPost.imageUrl] : [])
      });
    } else {
      setPostData({
        title: "",
        summary: "",
        content: "",
        author: user?.firstName ? `${user.firstName} ${user.lastName}` : "Editor",
        category: "General",
        status: "Draft",
        featured: false,
        tags: [],
        imageUrl: []
      });
    }
  }, [editingPost, user]);

  const handleSave = async () => {
    if (!postData.title || !postData.content) {
      toast({
        title: "Missing Fields",
        description: "Please fill in title and content.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (postData.id) {
        await updatePost(postData.id, postData);
        toast({
          title: "Success",
          description: "Post updated successfully.",
        });
      } else {
        await createPost(postData);
        toast({
          title: "Success",
          description: "New post created successfully.",
        });
      }
      
      if (onSave) {
        onSave();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save post.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = (content) => {
    setPostData({ ...postData, content });
  };

  const handleTagAdd = (tag) => {
    if (tag && !postData.tags.includes(tag)) {
      setPostData({ ...postData, tags: [...postData.tags, tag] });
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setPostData({ 
      ...postData, 
      tags: postData.tags.filter(tag => tag !== tagToRemove) 
    });
  };

  const handleImageAdd = (imageUrl) => {
    if (imageUrl.trim() && !postData.imageUrl.includes(imageUrl.trim())) {
      setPostData({ 
        ...postData, 
        imageUrl: [...postData.imageUrl, imageUrl.trim()] 
      });
    }
  };

  const handleImageRemove = (imageToRemove) => {
    setPostData({ 
      ...postData, 
      imageUrl: postData.imageUrl.filter(img => img !== imageToRemove) 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* <div>
          <h2 className="text-2xl font-bold">
            {editingPost ? "Edit Post" : "Create New Post"}
          </h2>
          <p className="text-gray-600">
            {editingPost ? "Update your blog post" : "Write and publish a new blog post"}
          </p>
        </div> */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : editingPost ? 'Update Post' : 'Save Post'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Post Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={postData.title}
                  onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                  placeholder="Enter post title"
                />
              </div>

              <div>
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={postData.summary}
                  onChange={(e) => setPostData({ ...postData, summary: e.target.value })}
                  placeholder="Brief description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={postData.author}
                  onChange={(e) => setPostData({ ...postData, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={postData.category}
                  onValueChange={(value) => setPostData({ ...postData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Football">Football</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Career">Career</SelectItem>
                    <SelectItem value="News">News</SelectItem>
                    <SelectItem value="Tips">Tips</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={postData.status}
                  onValueChange={(value) => setPostData({ ...postData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="imageUrl">Images</Label>
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    placeholder="https://example.com/image.jpg"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleImageAdd(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      handleImageAdd(input.value);
                      input.value = '';
                    }}
                  >
                    Add
                  </Button>
                </div>
                
                <div className="mt-2 space-y-2">
                  {postData.imageUrl.map((image, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                      <img 
                        src={image} 
                        alt={`Image ${index + 1}`}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <span className="flex-1 text-sm text-gray-600 truncate">{image}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleImageRemove(image)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={postData.featured}
                  onChange={(e) => setPostData({ ...postData, featured: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="featured">Featured Post</Label>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleTagAdd(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = e.target.previousElementSibling;
                    handleTagAdd(input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {postData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => handleTagRemove(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <div className="h-[600px]">
                <AdvancedTextEditor
                  content={postData.content}
                  onChange={handleContentChange}
                  placeholder="Start writing your blog post here..."
                  className="h-full"
                  showPreview={false}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
