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
    hasVariations: false,
    variations: [],
    variationAttributes: []
  });

  const [sizesInput, setSizesInput] = useState("");
  const [colorsInput, setColorsInput] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [variationAttributes, setVariationAttributes] = useState([]);
  const [variations, setVariations] = useState([]);
  const [showAttributeForm, setShowAttributeForm] = useState(false);
  const [showVariationForm, setShowVariationForm] = useState(false);
  const [selectedAttributeForVariation, setSelectedAttributeForVariation] = useState('');
  const [newAttribute, setNewAttribute] = useState({ name: '', type: 'text', required: false });
  const [newVariation, setNewVariation] = useState({ value: '', price: '', stock: '', sku: '' });
  const [editingAttributeIndex, setEditingAttributeIndex] = useState(null);
  const [editingVariationIndex, setEditingVariationIndex] = useState(null);

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
        hasVariations: product.hasVariations || false,
        variations: product.variations || [],
        variationAttributes: product.variationAttributes || []
      });

      setSizesInput((product.sizes || []).join(", "));
      setColorsInput((product.colors || []).join(", "));
      setVariationAttributes(product.variationAttributes || []);
      setVariations(product.variations || []);
    } else {
      // Reset form when creating new product
      setFormData({
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
        hasVariations: false,
        variations: [],
        variationAttributes: []
      });
      setSizesInput("");
      setColorsInput("");
      setVariationAttributes([]);
      setVariations([]);
    }
  }, [product, open]);

  // Attribute management functions
  const handleAddAttribute = () => {
    if (!newAttribute.name.trim()) return;
    
    const attribute = {
      name: newAttribute.name.trim(),
      type: newAttribute.type,
      required: newAttribute.required
    };
    
    if (editingAttributeIndex !== null) {
      // Update existing attribute
      const updated = [...variationAttributes];
      updated[editingAttributeIndex] = attribute;
      setVariationAttributes(updated);
      setEditingAttributeIndex(null);
    } else {
      // Add new attribute
      setVariationAttributes([...variationAttributes, attribute]);
    }
    
    setNewAttribute({ name: '', type: 'text', required: false });
    setShowAttributeForm(false);
  };

  const handleEditAttribute = (index) => {
    const attribute = variationAttributes[index];
    setNewAttribute({
      name: attribute.name,
      type: attribute.type,
      required: attribute.required
    });
    setShowAttributeForm(true);
    // Store the index being edited
    setEditingAttributeIndex(index);
  };

  const handleDeleteAttribute = (index) => {
    const attribute = variationAttributes[index];
    // Remove attribute and all its variations
    setVariationAttributes(variationAttributes.filter((_, i) => i !== index));
    setVariations(variations.filter(variation => variation.attributeName !== attribute.name));
  };

  // Variation management functions
  const handleAddVariation = () => {
    if (!selectedAttributeForVariation || !newVariation.value.trim()) return;
    
    const variation = {
      attributeName: selectedAttributeForVariation,
      value: newVariation.value.trim(),
      price: parseFloat(newVariation.price) || 0,
      stock: parseInt(newVariation.stock) || 0,
      sku: newVariation.sku
    };
    
    if (editingVariationIndex !== null) {
      // Update existing variation
      const updated = [...variations];
      updated[editingVariationIndex] = variation;
      setVariations(updated);
      setEditingVariationIndex(null);
    } else {
      // Add new variation
      setVariations([...variations, variation]);
    }
    
    setNewVariation({ value: '', price: '', stock: '', sku: '' });
    setShowVariationForm(false);
    setSelectedAttributeForVariation('');
  };

  const handleEditVariation = (index) => {
    const variation = variations[index];
    setNewVariation({
      value: variation.value,
      price: variation.price.toString(),
      stock: variation.stock.toString(),
      sku: variation.sku
    });
    setSelectedAttributeForVariation(variation.attributeName);
    setShowVariationForm(true);
    // Store the index being edited
    setEditingVariationIndex(index);
  };

  const handleDeleteVariation = (index) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  // Get variations for a specific attribute
  const getVariationsForAttribute = (attributeName) => {
    return variations.filter(variation => variation.attributeName === attributeName);
  };

  // Check if variation form is valid
  const isVariationFormValid = () => {
    return selectedAttributeForVariation && 
           newVariation.value.trim() && 
           newVariation.price && 
           newVariation.stock;
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || formData.stock === undefined || formData.stock === null) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate variations if enabled
    if (formData.hasVariations) {
      if (variationAttributes.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one variation attribute.",
          variant: "destructive",
        });
        return;
      }

      if (variations.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one variation.",
          variant: "destructive",
        });
        return;
      }

      // Validate that all variations have required attributes
      for (const variation of variations) {
        for (const attr of variationAttributes) {
          if (attr.required && !variation.attributes[attr.name]) {
            toast({
              title: "Error",
              description: `Please fill in the required attribute: ${attr.name}`,
              variant: "destructive",
            });
            return;
          }
        }
      }
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

      // Format variations for database storage
      const formatVariationsForDB = () => {
        if (!formData.hasVariations) return [];
        
        // Group variations by attribute combinations
        const variationMap = new Map();
        
        variations.forEach(variation => {
          if (!variation.value) return;
          
          const key = `${variation.attributeName}:${variation.value}`;
          
          if (!variationMap.has(key)) {
            variationMap.set(key, {
              attributes: {},
              price: variation.price,
              stock: variation.stock,
              sku: variation.sku
            });
          }
          
          variationMap.get(key).attributes[variation.attributeName] = variation.value;
        });
        
        return Array.from(variationMap.values());
      };

      const finalData = {
        ...formData,
        image: uploadedImageUrls,
        sizes: sizesInput.split(",").map((s) => s.trim()).filter(Boolean),
        colors: colorsInput.split(",").map((c) => c.trim()).filter(Boolean),
        variationAttributes: variationAttributes.filter(attr => attr.name.trim() !== ""),
        variations: formatVariationsForDB()
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

          {/* Product Variations Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="hasVariations"
                checked={formData.hasVariations}
                onChange={(e) => setFormData({ ...formData, hasVariations: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="hasVariations" className="text-sm font-medium">
                This product has variations (different colors, sizes, memory, etc.)
              </Label>
            </div>

            {formData.hasVariations && (
              <div className="space-y-6 border-t pt-6">
                {/* Variation Attributes */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold">Variation Attributes</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAttributeForm(true)}
                    >
                      Add Attribute
                    </Button>
                  </div>
                  
                  {/* Add Attribute Form */}
                  {showAttributeForm && (
                    <div className="p-4 border rounded-lg bg-gray-50 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Attribute Name</Label>
                          <Input
                            value={newAttribute.name}
                            onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
                            placeholder="e.g. Color, Size, Memory"
                          />
                        </div>
                        
                        <div>
                          <Label>Type</Label>
                          <Select
                            value={newAttribute.type}
                            onValueChange={(value) => setNewAttribute({ ...newAttribute, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="color">Color</SelectItem>
                              <SelectItem value="size">Size</SelectItem>
                              <SelectItem value="select">Select</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowAttributeForm(false);
                            setNewAttribute({ name: '', type: 'text', required: false });
                            setEditingAttributeIndex(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddAttribute}
                        >
                          Add Attribute
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Added Attributes */}
                  <div className="space-y-1">
                    {variationAttributes.map((attr, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{attr.name}</span>
                          <span className="text-xs text-gray-500">({attr.type})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAttribute(index)}
                          >
                            <i className="fa-solid fa-edit text-xs"></i>
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteAttribute(index)}
                          >
                            <i className="fa-solid fa-trash text-xs"></i>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Demarcation Line */}
                <div className="border-t border-gray-300 my-6"></div>

                {/* Product Variations */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold">Product Variations</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowVariationForm(true)}
                      disabled={variationAttributes.length === 0}
                    >
                      Add Variation
                    </Button>
                  </div>
                  
                  {/* Add Variation Form */}
                  {showVariationForm && (
                    <div className="p-4 border rounded-lg bg-gray-50 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Select Attribute</Label>
                          <Select
                            value={selectedAttributeForVariation}
                            onValueChange={setSelectedAttributeForVariation}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select attribute" />
                            </SelectTrigger>
                            <SelectContent>
                              {variationAttributes.map((attr) => (
                                <SelectItem key={attr.name} value={attr.name}>
                                  {attr.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {selectedAttributeForVariation && (
                          <>
                            <div>
                              <Label>Value</Label>
                              <Input
                                value={newVariation.value}
                                onChange={(e) => setNewVariation({ ...newVariation, value: e.target.value })}
                                placeholder={`Enter ${selectedAttributeForVariation} value`}
                              />
                            </div>
                            
                            <div>
                              <Label>Price *</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={newVariation.price}
                                onChange={(e) => setNewVariation({ ...newVariation, price: e.target.value })}
                                placeholder="0.00"
                              />
                            </div>
                            
                            <div>
                              <Label>Stock *</Label>
                              <Input
                                type="number"
                                value={newVariation.stock}
                                onChange={(e) => setNewVariation({ ...newVariation, stock: e.target.value })}
                                placeholder="0"
                              />
                            </div>
                            
                            <div>
                              <Label>SKU (Optional)</Label>
                              <Input
                                value={newVariation.sku}
                                onChange={(e) => setNewVariation({ ...newVariation, sku: e.target.value })}
                                placeholder="Product SKU"
                              />
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowVariationForm(false);
                            setSelectedAttributeForVariation('');
                            setNewVariation({ value: '', price: '', stock: '', sku: '' });
                            setEditingVariationIndex(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddVariation}
                          disabled={!isVariationFormValid()}
                        >
                          Add Variation
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Added Variations */}
                  <div className="space-y-1">
                    {variations.map((variation, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium">{variation.attributeName}: {variation.value}</span>
                          <span className="text-xs text-gray-500">${variation.price}</span>
                          <span className="text-xs text-gray-500">Stock: {variation.stock}</span>
                          {variation.sku && <span className="text-xs text-gray-500">SKU: {variation.sku}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditVariation(index)}
                          >
                            <i className="fa-solid fa-edit text-xs"></i>
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteVariation(index)}
                          >
                            <i className="fa-solid fa-trash text-xs"></i>
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {variations.length === 0 && (
                      <div className="text-center py-8 text-sm text-gray-500">
                        No variations added yet. Click "Add Variation" to get started.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
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
