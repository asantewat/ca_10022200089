import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '../../../../../lib/dataStore';
import { getCurrentUser } from '../../../../../lib/auth';
import { ApiResponse, Product } from '../../../../../lib/types';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Admin access required',
      }, { status: 403 });
    }

    const { id: productId } = await params;
    const updateData = await request.json();
    
    // Ensure currency is GHS
    if (updateData.price) {
      updateData.currency = 'GHS';
    }
    
    const updatedProduct = dataStore.updateProduct(productId, updateData);
    
    if (!updatedProduct) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Product not found',
      }, { status: 404 });
    }
    
    return NextResponse.json<ApiResponse<Product>>({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    console.error('Admin update product error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to update product',
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Admin access required',
      }, { status: 403 });
    }

    const { id: productId } = await params;
    
    const success = dataStore.deleteProduct(productId);
    
    if (!success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Product not found',
      }, { status: 404 });
    }
    
    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Admin delete product error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to delete product',
    }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Admin access required',
      }, { status: 403 });
    }

    const { id: productId } = await params;
    
    const product = dataStore.getProductById(productId);
    
    if (!product) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Product not found',
      }, { status: 404 });
    }
    
    return NextResponse.json<ApiResponse<Product>>({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Admin get product error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch product',
    }, { status: 500 });
  }
}