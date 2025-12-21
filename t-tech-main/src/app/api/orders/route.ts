import { NextRequest, NextResponse } from 'next/server';
import { dataStore, formatCurrency } from '../../../lib/dataStore';
import { getCurrentUser } from '../../../lib/auth';
import { ApiResponse, Order, OrderItem } from '../../../lib/types';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Authentication required',
      }, { status: 401 });
    }

    let orders: Order[];
    
    if (user.role === 'admin') {
      // Admin can see all orders
      orders = dataStore.getAllOrders();
    } else {
      // Regular users can only see their own orders
      orders = dataStore.getOrdersByUserId(user.id);
    }

    // Sort orders by creation date (newest first)
    orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json<ApiResponse<{ orders: Order[] }>>({
      success: true,
      data: { orders },
    });

  } catch (error) {
    console.error('Get orders error:', error);
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

    const { shippingAddress, paymentMethod } = await request.json();

    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Shipping address and payment method are required',
      }, { status: 400 });
    }

    // Validate shipping address
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.country) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Complete shipping address is required',
      }, { status: 400 });
    }

    // Get user's cart items
    const cartItems = dataStore.getCartByUserId(user.id);
    
    if (cartItems.length === 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Cart is empty',
      }, { status: 400 });
    }

    // Build order items and calculate totals
    const orderItems: OrderItem[] = [];
    let itemsPrice = 0;

    for (const cartItem of cartItems) {
      const product = dataStore.getProductById(cartItem.productId);
      if (!product) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: `Product ${cartItem.productId} no longer exists`,
        }, { status: 400 });
      }

      // Check stock availability
      if (cartItem.quantity > product.countInStock) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: `Only ${product.countInStock} ${product.name} available in stock`,
        }, { status: 400 });
      }

      const orderItem: OrderItem = {
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: cartItem.quantity,
      };

      orderItems.push(orderItem);
      itemsPrice += product.price * cartItem.quantity;
    }

    // Calculate additional charges (in Ghana cedis)
    const taxRate = 0.125; // 12.5% VAT in Ghana
    const taxPrice = itemsPrice * taxRate;
    const shippingPrice = itemsPrice > 500 ? 0 : 25; // Free shipping over GHS 500
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    // Create order
    const order = dataStore.createOrder({
      userId: user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: false,
      isDelivered: false,
      status: 'pending',
    });

    // Update product stock counts
    for (const orderItem of orderItems) {
      const product = dataStore.getProductById(orderItem.productId);
      if (product) {
        dataStore.updateProduct(orderItem.productId, {
          countInStock: product.countInStock - orderItem.quantity,
        });
      }
    }

    // Clear user's cart
    dataStore.clearCart(user.id);

    return NextResponse.json<ApiResponse<Order>>({
      success: true,
      message: 'Order created successfully',
      data: order,
    }, { status: 201 });

  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}