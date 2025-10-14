import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/oauth';
import { Order } from '@/lib/schemas';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    // Get authenticated user
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    console.log('Looking for order with ID:', id);
    console.log('User ID:', user.id);

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid ObjectId format:', id);
      return NextResponse.json({ error: 'Invalid order ID format' }, { status: 400 });
    }

    // Find the order
    const order = await Order.findOne({ 
      _id: new mongoose.Types.ObjectId(id), 
      userId: user.id 
    }).populate('userId', 'firstName lastName email');

    console.log('Found order:', order ? 'Yes' : 'No');

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
