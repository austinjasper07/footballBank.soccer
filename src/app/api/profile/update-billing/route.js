import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/schemas';

export async function POST(request) {
  try {
    await connectDB();
    
    const { billingAddress } = await request.json();
    const userId = request.headers.get('user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }

    if (!billingAddress) {
      return NextResponse.json({ error: 'Billing address required' }, { status: 400 });
    }

    // Update user's billing address
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        billingAddress,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Billing address updated successfully',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        billingAddress: updatedUser.billingAddress
      }
    });

  } catch (error) {
    console.error('Update billing address error:', error);
    return NextResponse.json(
      { error: 'Failed to update billing address' },
      { status: 500 }
    );
  }
}
