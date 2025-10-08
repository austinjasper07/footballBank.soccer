"use client";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createProduct, updateProduct } from "@/actions/adminActions";

export function ProductDialog({
  open,
  onOpenChange,
  product,
  onSave,
}) {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    image: [],
    featured: false,
    discount: 0,
    sizes: [],
    colors: [],
    stock: 0,
    category: "accessory",
  });

  const [sizesInput, setSizesInput] = useState("");
  const [colorsInput, setColorsInput] = useState("");
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        image: product.image || [],
        featured: product.featured || false,
        discount: product.discount || 0,
        sizes: product.sizes || [],
        colors: product.colors || [],
        stock: product.stock || 0,
        category: product.category || "accessory",
      });

      setSizesInput((product.sizes || []).join(", "));
      setColorsInput((product.colors || []).join(", "));
    }
  }, [product, open]);

  const handleSave = async () => {
    if (!formData.name || !formData.price || formData.stock === undefined || formData.stock === null) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      let uploadedImageUrls = formData.image || [];

      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map((file) => {
          const fileRef = ref(
            storage,
            `product_images/${formData.name}-${Date.now()}-${file.name}`
          );
          return uploadBytes(fileRef, file).then(() => getDownloadURL(fileRef));
        });

        uploadedImageUrls = await Promise.all(uploadPromises);
      }

      const finalData = {
        ...formData,
        image: uploadedImageUrls,
        sizes: sizesInput.split(",").map((s) => s.trim()).filter(Boolean),
        colors: colorsInput.split(",").map((c) => c.trim()).filter(Boolean),
      };

      const res = product?.id
        ? await updateProduct(product.id, finalData)
        : await createProduct(finalData);

      onSave({ ...finalData, id: product?.id });
      onOpenChange(false);

      toast({
        title: "Success",
        description: "Product saved successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong while saving the product.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Price ($)*</Label>
            <Input
              type="number"
              min={0}
              value={formData.price || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: parseFloat(e.target.value),
                })
              }
            />
          </div>

          <div>
            <Label>Stock *</Label>
            <Input
              type="number"
              min={0}
              value={formData.stock || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock: parseInt(e.target.value, 10),
                })
              }
            />
          </div>

          <div>
            <Label>Discount (%)</Label>
            <Input
              type="number"
              min={0}
              value={formData.discount || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discount: parseFloat(e.target.value),
                })
              }
            />
          </div>

          <div>
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  category: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="boots">Boots</SelectItem>
                <SelectItem value="gloves">Gloves</SelectItem>
                <SelectItem value="kits">Kits</SelectItem>
                <SelectItem value="ball">Ball</SelectItem>
                <SelectItem value="accessory">Accessory</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="md:col-span-2">
            <Label>Upload Product Images</Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setImageFiles(e.target.files ? Array.from(e.target.files) : [])
              }
            />
            {Array.isArray(formData.image) && formData.image.length > 0 && (
              <div className="text-sm text-muted-foreground mt-2 space-y-1">
                {formData.image.map((url, idx) => (
                  <p key={idx}>
                    Image {idx + 1}:{" "}
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {url}
                    </a>
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <Label>Sizes (comma separated)</Label>
            <Input
              placeholder="e.g. S, M, L"
              value={sizesInput}
              onChange={(e) => setSizesInput(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Label>Colors (comma separated)</Label>
            <Input
              placeholder="e.g. Red, Blue"
              value={colorsInput}
              onChange={(e) => setColorsInput(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {product ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
