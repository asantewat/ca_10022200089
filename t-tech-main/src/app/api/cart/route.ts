import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '../../../lib/dataStore';
import { getCurrentUser } from '../../../lib/auth';
import { ApiResponse, CartItem, Product } from '../../../lib/types';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Authentication required',
      }, { status: 401 });
    }

    const cartItems = dataStore.getCartByUserId(user.id);
    
    // Enhance cart items with product details
    const enhancedCartItems = cartItems.map(item => {
      const product = dataStore.getProductById(item.productId);
      return {
        ...item,
        product,
      };
    }).filter(item => item.product) as (CartItem & { product: Product })[]; // Type assertion after filtering

    return NextResponse.json<ApiResponse<{ items: (CartItem & { product: Product })[] }>>({
      success: true,
      data: { items: enhancedCartItems },
    });

  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Authentication required',
      }, { status: 401 });
    }

    const { productId, quantity } = await request.json();

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Product ID and valid quantity are required',
      }, { status: 400 });
    }

    // Check if product exists
    const product = dataStore.getProductById(productId);
    if (!product) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Product not found',
      }, { status: 404 });
    }

    // Check stock availability
    if (quantity > product.countInStock) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: `Only ${product.countInStock} items available in stock`,
      }, { status: 400 });
    }

    const cartItem = dataStore.addToCart(user.id, productId, quantity);

    return NextResponse.json<ApiResponse<CartItem>>({
      success: true,
      message: 'Item added to cart',
      data: cartItem,
    }, { status: 201 });

  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Authentication required',
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      // Clear entire cart
      dataStore.clearCart(user.id);
      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Cart cleared successfully',
      });
    }

    // Remove specific product from cart
    const success = dataStore.removeFromCart(user.id, productId);
    
    if (!success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Item not found in cart',
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Item removed from cart',
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}