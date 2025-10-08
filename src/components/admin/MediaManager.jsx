"use client";

import { useState, useCallback } from "react";
import { Upload, Image as ImageIcon, File, X, Search, Grid, List, Trash2, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { uploadFileWithProgress } from "@/lib/uploadWithProgress";

export default function MediaManager({ 
  open, 
  onOpenChange, 
  onSelectImage, 
  onSelectFile,
  selectedType = "image" 
}) {
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedTab, setSelectedTab] = useState(selectedType);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Mock media files - in a real app, these would come from your API
  const mockMediaFiles = [
    {
      id: 1,
      name: "hero-image.jpg",
      type: "image",
      url: "/heroPhotos/WhatsApp Image 2025-10-07 at 23.49.32_5d88ced2.jpg",
      size: "2.3 MB",
      uploadedAt: "2024-01-15",
      dimensions: "1920x1080"
    },
    {
      id: 2,
      name: "logo.png",
      type: "image", 
      url: "/logo.png",
      size: "45 KB",
      uploadedAt: "2024-01-14",
      dimensions: "512x512"
    },
    {
      id: 3,
      name: "document.pdf",
      type: "document",
      url: "/documents/document.pdf",
      size: "1.2 MB",
      uploadedAt: "2024-01-13"
    }
  ];

  const handleFileUpload = useCallback(async (files) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        const path = `media/${Date.now()}-${file.name}`;
        const url = await uploadFileWithProgress(path, file, (progress) => {
          setUploadProgress(progress);
        });
        
        return {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'document',
          url,
          size: formatFileSize(file.size),
          uploadedAt: new Date().toISOString().split('T')[0],
          dimensions: file.type.startsWith('image/') ? 'Unknown' : undefined
        };
      } catch (error) {
        console.error('Upload failed:', error);
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        });
        return null;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean);
      
      if (successfulUploads.length > 0) {
        setMediaFiles(prev => [...successfulUploads, ...prev]);
        toast({
          title: "Upload Successful",
          description: `${successfulUploads.length} file(s) uploaded successfully.`,
        });
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  }, [toast]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  }, [handleFileUpload]);

  const handleFileInput = useCallback((e) => {
    const files = e.target.files;
    handleFileUpload(files);
  }, [handleFileUpload]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = mockMediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedTab === "all" || file.type === selectedTab;
    return matchesSearch && matchesType;
  });

  const handleSelectFile = (file) => {
    if (file.type === "image") {
      onSelectImage?.(file.url);
    } else {
      onSelectFile?.(file.url);
    }
    onOpenChange(false);
  };

  const handleDeleteFile = (fileId) => {
    setMediaFiles(prev => prev.filter(file => file.id !== fileId));
    toast({
      title: "File Deleted",
      description: "File has been removed from media library.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Upload Area */}
          <div className="mb-6">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Files</h3>
              <p className="text-gray-600 mb-4">
                Drag and drop files here, or click to browse
              </p>
              <div className="flex gap-2 justify-center">
                <Button asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </label>
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            </div>
            
            {uploadProgress !== null && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Uploading...</span>
                  <span className="text-sm text-gray-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Media Library */}
          <div className="flex-1 flex flex-col">
            {/* Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search media..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="image">Images</TabsTrigger>
                    <TabsTrigger value="document">Documents</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Media Grid/List */}
            <div className="flex-1 overflow-y-auto">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredFiles.map((file) => (
                    <Card key={file.id} className="group hover:shadow-lg transition-shadow">
                      <CardContent className="p-2">
                        <div className="aspect-square relative overflow-hidden rounded-lg mb-2">
                          {file.type === "image" ? (
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <File className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                          
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleSelectFile(file)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteFile(file.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-xs">
                          <p className="font-medium truncate" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-gray-500">{file.size}</p>
                          {file.dimensions && (
                            <p className="text-gray-500">{file.dimensions}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFiles.map((file) => (
                    <Card key={file.id} className="group hover:bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 flex-shrink-0">
                            {file.type === "image" ? (
                              <img
                                src={file.url}
                                alt={file.name}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                                <File className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{file.name}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>{file.size}</span>
                              {file.dimensions && <span>• {file.dimensions}</span>}
                              <span>• {file.uploadedAt}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSelectFile(file)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Select
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteFile(file.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
