'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '../../../lib/types';
import { ProductCard } from '../../../components/ProductCard';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { Button } from '../../components/ui/button';
import Link from 'next/link';

export default function CategoryPage() {
  const params = useParams();
  // Decode and trim the category parameter from URL
  const rawCategory = Array.isArray(params.category) ? params.category[0] : params.category || '';
  const category = rawCategory ? decodeURIComponent(rawCategory).trim() : '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Ensure category is properly encoded for the API call
      const encodedCategory = encodeURIComponent(category);
      const res = await fetch(`/api/products?category=${encodedCategory}&limit=48`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.success && data.data ? data.data.products : []);
      }
    } catch (err) {
      console.error('Failed to load category products', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Get category label from value (decode URL-encoded category)
  const getCategoryLabel = (value: string) => {
    // Decode the category value in case it's URL-encoded
    const decoded = decodeURIComponent(value);
    // Return the decoded value as-is since categories now match product categories
    return decoded;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {getCategoryLabel(category)}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our selection of {getCategoryLabel(category).toLowerCase()}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-md animate-pulse">
                  <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
              <p className="text-gray-500 mb-6">We couldn't find any products in this category.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button variant="outline">
                    View All Products
                  </Button>
                </Link>
                <Link href="/">
                  <Button>
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {products && products.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/products">
                <Button size="lg" className="px-8">
                  View All Products
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
