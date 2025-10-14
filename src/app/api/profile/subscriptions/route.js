import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/oauth';
import { Subscription } from '@/lib/schemas';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    await dbConnect();
    
    // Get authenticated user
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscriptions
    const subscriptions = await Subscription.find({ userId: user.id })
      .sort({ createdAt: -1 });

    console.log('Found subscriptions for user:', user.id, 'Count:', subscriptions.length);

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await dbConnect();
    
    // Get authenticated user
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Raw request body:', body);
    
    const { subscriptionId, isActive } = body;

    console.log('PATCH subscription request:', { subscriptionId, isActive, userId: user.id });

    if (!subscriptionId) {
      console.log('Missing subscriptionId in request');
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 });
    }

    if (typeof isActive !== 'boolean') {
      console.log('Invalid isActive type:', typeof isActive, 'value:', isActive);
      return NextResponse.json({ error: 'isActive must be a boolean' }, { status: 400 });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
      console.log('Invalid ObjectId format:', subscriptionId);
      return NextResponse.json({ error: 'Invalid subscription ID format' }, { status: 400 });
    }

    // Find and update the subscription
    const subscription = await Subscription.findOneAndUpdate(
      { 
        _id: new mongoose.Types.ObjectId(subscriptionId), 
        userId: user.id 
      },
      { isActive },
      { new: true }
    );

    console.log('Database update result:', subscription ? 'Found and updated' : 'Not found');

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    console.log('Subscription updated successfully:', subscription._id, 'isActive:', subscription.isActive);

    return NextResponse.json({ 
      success: true, 
      subscription,
      message: isActive ? 'Subscription reactivated' : 'Subscription cancelled'
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}