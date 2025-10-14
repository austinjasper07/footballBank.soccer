import { NextResponse } from 'next/server';
import { Product } from '@/lib/schemas';
import dbConnect from '@/lib/mongodb';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { productId, quantity } = await request.json();
    
    if (!productId || !quantity) {
      return NextResponse.json({ error: 'Product ID and quantity are required' }, { status: 400 });
    }

    const product = await Product.findById(productId);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const oldStock = product.stock;
    const newStock = Math.max(0, oldStock - quantity);
    product.stock = newStock;
    
    await product.save();

    return NextResponse.json({
      success: true,
      productId: product._id,
      name: product.name,
      oldStock,
      newStock,
      quantityReduced: quantity
    });
  } catch (error) {
    console.error('Error updating product stock:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
