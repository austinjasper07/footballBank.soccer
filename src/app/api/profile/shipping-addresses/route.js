import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/oauth";
import dbConnect from "@/lib/mongodb";
import { User } from "@/lib/schemas";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userDoc = await User.findOne({ email: user.email });
    
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      addresses: userDoc.shippingAddresses || [] 
    });
  } catch (error) {
    console.error("Error fetching shipping addresses:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getAuthUser();
    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, street, city, state, postalCode, country, countryCode, isDefault } = body;

    await dbConnect();
    const userDoc = await User.findOne({ email: user.email });
    
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already has 3 addresses
    if (userDoc.shippingAddresses && userDoc.shippingAddresses.length >= 3) {
      return NextResponse.json({ 
        error: "Maximum of 3 shipping addresses allowed" 
      }, { status: 400 });
    }

    // Generate unique ID for the address
    const addressId = `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newAddress = {
      id: addressId,
      name,
      street,
      city,
      state,
      postalCode,
      country,
      countryCode: countryCode || country, // Use country as fallback if countryCode not provided
      isDefault,
      createdAt: new Date()
    };

    // If this is set as default, unset other defaults
    if (isDefault && userDoc.shippingAddresses) {
      userDoc.shippingAddresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    // If this is the first address, make it default
    if (!userDoc.shippingAddresses || userDoc.shippingAddresses.length === 0) {
      newAddress.isDefault = true;
    }

    userDoc.shippingAddresses = userDoc.shippingAddresses || [];
    userDoc.shippingAddresses.push(newAddress);
    await userDoc.save();

    return NextResponse.json({ 
      message: "Address added successfully",
      address: newAddress 
    });
  } catch (error) {
    console.error("Error adding shipping address:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
