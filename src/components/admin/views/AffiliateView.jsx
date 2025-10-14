"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/admin/SearchBar";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  getAffiliateProducts,
  deleteAffiliateProduct,
} from "@/actions/adminActions";
import AffiliateDialog from "@/components/admin/dialogs/AffiliateDialog";
import { DeleteConfirmationModal } from "@/components/admin/dialogs/DeleteConfirmationModal";
import LoadingSplash from "@/components/ui/loading-splash";

const ITEMS_PER_PAGE = 5;

export function AffiliateView() {
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await getAffiliateProducts();
        setProducts(res);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to load affiliate products.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  // 📌 Get unique categories
  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category));
    return ["all", ...Array.from(unique)];
  }, [products]);

  // 🔎 Search + Filter
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const search = searchQuery.toLowerCase();
      const description = product.description?.toLowerCase() || "";
      const category = product.category?.toLowerCase() || "";

      return (
        (description.includes(search) || category.includes(search)) &&
        (categoryFilter === "all" || category === categoryFilter.toLowerCase())
      );
    });
  }, [products, searchQuery, categoryFilter]);

  // 📑 Pagination
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // 🗑 Delete
  const handleDelete = async (id) => {
    const product = products.find(p => p.id === id);
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteAffiliateProduct(String(productToDelete.id));
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      toast({
        title: "Deleted",
        description: "Affiliate product deleted successfully.",
      });
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // ✏️ Edit
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  // ➕ Add
  const handleAdd = () => {
    setSelectedProduct(null);
    setDialogOpen(true);
  };

  if (isLoading) {
    return <LoadingSplash message="Loading affiliate products..." />;
  }

  return (
    <div className="space-y-6">
      {/* 🔍 Search + Filter + Add */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search products..."
            className="w-40 md:w-80"
          />

          {/* 🏷 Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1); // reset pagination
            }}
            className="border rounded-md px-4 py-2 text-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <Button onClick={handleAdd} className="bg-blue-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* 📊 Table */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[hsl(var(--muted))]/50">
                <tr>
                  <th className="text-left p-4 font-medium">Product</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-border hover:bg-[hsl(var(--muted))]/50"
                  >
                    {/* Product */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={product.image}
                          alt={product.description}
                          width={60}
                          height={60}
                          className="w-14 h-14 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-medium">{product.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            As an Amazon Associate I earn from qualifying
                            purchases.
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <Badge variant="secondary">{product.category}</Badge>
                    </td>

                    {/* Price */}
                    <td className="p-4 text-primary font-semibold">
                      ${product.price.toFixed(2)}
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(product.url, "_blank")}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {paginatedProducts.length === 0 && (
                  <tr key="no-products">
                    <td
                      colSpan={4}
                      className="p-6 text-center text-muted-foreground"
                    >
                      No affiliate products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 📄 Pagination */}
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
              <PaginationItem key={`affiliate-page-${i + 1}`}>
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

      {/* ➕ Add/Edit Dialog */}
      <AffiliateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={selectedProduct}
        onSave={(newProduct) => {
          if (selectedProduct) {
            setProducts((prev) =>
              prev.map((p) => (p.id === newProduct.id ? newProduct : p))
            );
          } else {
            setProducts((prev) => [newProduct, ...prev]);
          }
        }}
      />

      <DeleteConfirmationModal
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteProduct}
        title="Delete Affiliate Product"
        description="This will permanently remove the affiliate product from the system."
        itemName={productToDelete ? productToDelete.description : ''}
        isLoading={isDeleting}
      />
    </div>
  );
}
