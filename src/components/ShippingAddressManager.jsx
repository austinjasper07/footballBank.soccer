"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, MapPin, Check } from "lucide-react";

export default function ShippingAddressManager({ onAddressSelect, selectedAddressId }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    countryCode: "",
    isDefault: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Set default address as selected when addresses are loaded
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find(addr => addr.isDefault);
      if (defaultAddress && onAddressSelect) {
        onAddressSelect(defaultAddress.id);
      }
    }
  }, [addresses, selectedAddressId, onAddressSelect]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/profile/shipping-addresses");
      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (addresses.length >= 3 && !editingAddress) {
      toast({
        title: "Maximum addresses reached",
        description: "You can only store up to 3 shipping addresses.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const url = editingAddress 
        ? `/api/profile/shipping-addresses/${editingAddress.id}`
        : "/api/profile/shipping-addresses";
      
      const method = editingAddress ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: editingAddress ? "Address updated" : "Address added",
          description: "Your shipping address has been saved successfully."
        });
        fetchAddresses();
        resetForm();
        setIsDialogOpen(false);
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to save address",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (addressId) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const response = await fetch(`/api/profile/shipping-addresses/${addressId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        toast({
          title: "Address deleted",
          description: "The shipping address has been removed."
        });
        fetchAddresses();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete address",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      countryCode: address.countryCode,
      isDefault: address.isDefault
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      countryCode: "",
      isDefault: false
    });
    setEditingAddress(null);
  };

  const handleAddressSelect = (addressId) => {
    if (onAddressSelect) {
      onAddressSelect(addressId);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading addresses...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Shipping Addresses</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              disabled={addresses.length >= 3 || submitting}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Address Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Home, Work, Office"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => setFormData({...formData, street: e.target.value})}
                  placeholder="123 Main Street"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="New York"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    placeholder="NY"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                    placeholder="10001"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    placeholder="United States"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="isDefault">Set as default address</Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {editingAddress ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    `${editingAddress ? "Update" : "Add"} Address`
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No shipping addresses saved</p>
            <p className="text-sm text-gray-400">Add your first address to get started</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="space-y-0">
              {addresses.map((address, index) => (
                <div 
                  key={address.id}
                  className={`flex items-center p-4 hover:bg-gray-50 transition-colors ${
                    selectedAddressId === address.id ? "bg-accent-red/5" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <input
                      type="radio"
                      id={`address-${address.id}`}
                      name="shipping-address"
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={() => handleAddressSelect(address.id)}
                      className="w-4 h-4 text-accent-red border-gray-300 focus:ring-accent-red"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <label 
                          htmlFor={`address-${address.id}`}
                          className="font-medium text-gray-900 cursor-pointer"
                        >
                          {address.name}
                        </label>
                        {address.isDefault && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>{address.street}</p>
                        <p>{address.city}, {address.state} {address.postalCode}</p>
                        <p>{address.country}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(address)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(address.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
