import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '../../../../lib/dataStore';
import { getCurrentUser } from '../../../../lib/auth';
import { ApiResponse, Product } from '../../../../lib/types';

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Admin access required',
      }, { status: 403 });
    }

    const productData = await request.json();
    
    // Validate required fields
    if (!productData.name || !productData.price || !productData.category) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Name, price, and category are required',
      }, { status: 400 });
    }

    // Ensure currency is GHS
    const product = dataStore.createProduct({
      ...productData,
      currency: 'GHS' as const,
      rating: productData.rating || 4.0,
      numReviews: productData.numReviews || 0,
      countInStock: productData.countInStock || 0,
    });
    
    return NextResponse.json<ApiResponse<Product>>({
      success: true,
      message: 'Product created successfully',
      data: product,
    }, { status: 201 });
  } catch (error) {
    console.error('Admin create product error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to create product',
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Admin access required',
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Get all products from data store
    let allProducts = dataStore.getAllProducts();

    // Filter by category
    if (category && category !== 'all') {
      allProducts = allProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search term
    if (search) {
      const searchTerm = search.toLowerCase();
      allProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    // Sort by creation date (newest first)
    allProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Implement pagination
    const total = allProducts.length;
    const skip = (page - 1) * limit;
    const products = allProducts.slice(skip, skip + limit);

    return NextResponse.json<ApiResponse<{
      products: Product[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>>({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Admin get products error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch products',
    }, { status: 500 });
  }
}