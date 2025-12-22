'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '../../../lib/types';
import { ProductCard } from '../../../components/ProductCard';
import { Button } from '../../components/ui/button';

export default function CategoryPage() {
  const params = useParams();
  const category = Array.isArray(params.category) ? params.category[0] : params.category || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products?category=${encodeURIComponent(category)}&limit=48`);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{category ? category : 'Category'}</h1>
          <p className="text-gray-600">Showing products for {category}</p>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : products.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No products found</h3>
            <p className="text-gray-600">Try another category</p>
            <div className="mt-6">
              <Button onClick={() => window.location.href = '/products'}>View All</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
