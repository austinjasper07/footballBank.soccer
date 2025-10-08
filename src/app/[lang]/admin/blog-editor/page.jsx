"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, EyeOff, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import AdvancedTextEditor from "@/components/admin/AdvancedTextEditor";
import { createPost, updatePost } from "@/actions/adminActions";
import { useAuth } from "@/context/NewAuthContext";

export default function BlogEditorPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, role } = useAuth();
  
  const [postData, setPostData] = useState({
    id: null,
    title: "",
    summary: "",
    content: "",
    author: "Admin",
    status: "Draft",
    featured: false,
    tags: [],
    imageUrl: "",
    category: "General"
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [lastSaved, setLastSaved] = useState(null);

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
        const result = await createPost(postData);
        if (result?.id) {
          setPostData(prev => ({ ...prev, id: result.id }));
        }
        toast({
          title: "Success",
          description: "Post created successfully.",
        });
      }
      setLastSaved(new Date());
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

  const handlePublish = async () => {
    const publishedData = { ...postData, status: "Published", featured: true };
    setPostData(publishedData);
    
    setIsSaving(true);
    try {
      if (postData.id) {
        await updatePost(postData.id, publishedData);
      } else {
        const result = await createPost(publishedData);
        if (result?.id) {
          setPostData(prev => ({ ...prev, id: result.id }));
        }
      }
      toast({
        title: "Success",
        description: "Post published successfully.",
      });
      setLastSaved(new Date());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish post.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = (content) => {
    setPostData(prev => ({ ...prev, content }));
  };

  const handleFieldChange = (field, value) => {
    setPostData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (value) => {
    setTagsInput(value);
    const tags = value.split(",").map(t => t.trim()).filter(Boolean);
    setPostData(prev => ({ ...prev, tags }));
  };

  if (!isAuthenticated || role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You need admin privileges to access this page.</p>
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold">
                {postData.id ? "Edit Blog Post" : "Create New Blog Post"}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {lastSaved && (
                  <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                )}
                {isSaving && (
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    Saving...
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              {isPreviewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {isPreviewMode ? "Edit" : "Preview"}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            
            <Button
              onClick={handlePublish}
              disabled={isSaving}
            >
              Publish
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Editor */}
        <div className={`flex-1 transition-all duration-300 ${showSettings ? "lg:w-2/3" : "w-full"}`}>
          <div className="h-full flex flex-col">
            {/* Title Input */}
            <div className="p-6 border-b border-gray-200">
              <Input
                value={postData.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                placeholder="Enter your blog post title..."
                className="text-2xl font-bold border-0 focus:ring-0 p-0"
              />
            </div>

            {/* Editor */}
            <div className="flex-1 p-6">
              <AdvancedTextEditor
                content={postData.content}
                onChange={handleContentChange}
                placeholder="Start writing your blog post here..."
                className="h-full"
                showPreview={false}
              />
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="w-full lg:w-1/3 border-l border-gray-200 bg-white overflow-y-auto">
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Post Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea
                      id="summary"
                      value={postData.summary}
                      onChange={(e) => handleFieldChange("summary", e.target.value)}
                      placeholder="Brief description of your post..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Select
                      value={postData.author}
                      onValueChange={(value) => handleFieldChange("author", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Editor">Editor</SelectItem>
                        <SelectItem value="Guest Writer">Guest Writer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={postData.category}
                      onValueChange={(value) => handleFieldChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="News">News</SelectItem>
                        <SelectItem value="Tutorials">Tutorials</SelectItem>
                        <SelectItem value="Reviews">Reviews</SelectItem>
                        <SelectItem value="Opinions">Opinions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="image">Featured Image URL</Label>
                    <Input
                      id="image"
                      value={postData.imageUrl}
                      onChange={(e) => handleFieldChange("imageUrl", e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    {postData.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={postData.imageUrl}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      value={tagsInput}
                      onChange={(e) => handleTagsChange(e.target.value)}
                      placeholder="football, news, analysis"
                    />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {postData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={postData.status}
                      onValueChange={(value) => handleFieldChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* SEO Preview */}
              <div>
                <h3 className="text-lg font-semibold mb-4">SEO Preview</h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="text-blue-600 text-sm mb-1">
                    {postData.title || "Your blog post title"}
                  </div>
                  <div className="text-green-600 text-xs mb-2">
                    {typeof window !== 'undefined' ? window.location.origin : 'https://example.com'}/blog/your-post-slug
                  </div>
                  <div className="text-gray-600 text-sm">
                    {postData.summary || "Your blog post summary will appear here..."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
