import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/oauth";
import dbConnect from "@/lib/mongodb";
import { User } from "@/lib/schemas";

export async function PUT(req, { params }) {
  try {
    const user = await getAuthUser();
    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { name, street, city, state, postalCode, country, countryCode, isDefault } = body;

    await dbConnect();
    const userDoc = await User.findOne({ email: user.email });
    
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the address to update
    const addressIndex = userDoc.shippingAddresses.findIndex(addr => addr.id === id);
    if (addressIndex === -1) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      userDoc.shippingAddresses.forEach((addr, index) => {
        if (index !== addressIndex) {
          addr.isDefault = false;
        }
      });
    }

    // Update the address
    userDoc.shippingAddresses[addressIndex] = {
      ...userDoc.shippingAddresses[addressIndex],
      name,
      street,
      city,
      state,
      postalCode,
      country,
      countryCode: countryCode || country, // Use country as fallback if countryCode not provided
      isDefault
    };

    await userDoc.save();

    return NextResponse.json({ 
      message: "Address updated successfully",
      address: userDoc.shippingAddresses[addressIndex] 
    });
  } catch (error) {
    console.error("Error updating shipping address:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await getAuthUser();
    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await dbConnect();
    const userDoc = await User.findOne({ email: user.email });
    
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the address to delete
    const addressIndex = userDoc.shippingAddresses.findIndex(addr => addr.id === id);
    if (addressIndex === -1) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const wasDefault = userDoc.shippingAddresses[addressIndex].isDefault;

    // Remove the address
    userDoc.shippingAddresses.splice(addressIndex, 1);

    // If we deleted the default address and there are other addresses, make the first one default
    if (wasDefault && userDoc.shippingAddresses.length > 0) {
      userDoc.shippingAddresses[0].isDefault = true;
    }

    await userDoc.save();

    return NextResponse.json({ 
      message: "Address deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting shipping address:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
