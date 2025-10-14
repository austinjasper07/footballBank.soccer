import { NextResponse } from 'next/server';
import { Product } from '@/lib/schemas';
import dbConnect from '@/lib/mongodb';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      productId: product._id,
      name: product.name,
      stock: product.stock,
      hasVariations: product.hasVariations,
      variations: product.variations?.map(v => ({
        id: v._id,
        attributes: v.attributes,
        stock: v.stock
      })) || []
    });
  } catch (error) {
    console.error('Error fetching product stock:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
