"use client";

import { useState, useEffect } from "react";
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
import { createAffiliateProduct, updateAffiliateProduct } from "@/actions/adminActions";

export default function AffiliateDialog({ open, onOpenChange, product, onSave }) {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    image: "",
    url: "",
    category: "clothing",
    description: "",
    price: 0,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        image: product.image || "",
        url: product.url || "",
        category: product.category || "boots",
        description: product.description || "",
        price: product.price || 0,
      });
    }
  }, [product, open]);

  const handleSave = async () => {
    if (!formData.image || !formData.description || !formData.price || !formData.url) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = product?.id
        ? await updateAffiliateProduct(product.id, formData)
        : await createAffiliateProduct(formData);

      onSave({ ...formData, id: product?.id });
      setFormData({
        image: "",
        url: "",
        category: "clothing",
        description: "",
        price: 0,
      });
      onOpenChange(false);

      toast({
        title: "Success",
        description: "Affiliate product saved successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Affiliate Product" : "Add Affiliate Product"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Image URL *</Label>
            <Input
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              placeholder="https://..."
            />
          </div>
          <div>
            <Label>Affiliate URL *</Label>
            <Input
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              placeholder="https://..."
            />
          </div>

          <div>
            <Label>Price ($)*</Label>
            <Input
              type="number"
              min={0}
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: parseFloat(e.target.value),
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
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="shoes">Shoes</SelectItem>
                <SelectItem value="bags">Bags</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="jewelry">Jewelry</SelectItem>
                <SelectItem value="watches">Watches</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="home">Home & Garden</SelectItem>
                <SelectItem value="sports">Sports & Fitness</SelectItem>
                <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                <SelectItem value="books">Books & Media</SelectItem>
                <SelectItem value="toys">Toys & Games</SelectItem>
                <SelectItem value="automotive">Automotive</SelectItem>
                <SelectItem value="health">Health & Wellness</SelectItem>
                <SelectItem value="office">Office Supplies</SelectItem>
                <SelectItem value="travel">Travel & Luggage</SelectItem>
                <SelectItem value="food">Food & Beverages</SelectItem>
                <SelectItem value="pets">Pet Supplies</SelectItem>
                <SelectItem value="baby">Baby & Kids</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
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
