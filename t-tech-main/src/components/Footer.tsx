'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-yellow-300">T-Tech & Appliances</h3>
            <p className="text-gray-300">
              T-Tech & Appliances — trusted tech and home appliances for Ghana. Quality products at competitive prices.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6 text-blue-500 hover:text-blue-400 cursor-pointer" />
              <Twitter className="w-6 h-6 text-blue-400 hover:text-blue-300 cursor-pointer" />
              <Instagram className="w-6 h-6 text-pink-500 hover:text-pink-400 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/products" className="block text-gray-300 hover:text-white transition-colors">
                All Products
              </Link>
              <Link href="/cart" className="block text-gray-300 hover:text-white transition-colors">
                Shopping Cart
              </Link>
              <Link href="/auth/login" className="block text-gray-300 hover:text-white transition-colors">
                My Account
              </Link>
              <Link href="/about" className="block text-gray-300 hover:text-white transition-colors">
                About Us
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Categories</h4>
            <div className="space-y-2">
              <Link href="/products?category=Audio" className="block text-gray-300 hover:text-white transition-colors">
                Audio & Music
              </Link>
              <Link href="/products?category=Computers" className="block text-gray-300 hover:text-white transition-colors">
                Computers & Laptops
              </Link>
              <Link href="/products?category=Mobile" className="block text-gray-300 hover:text-white transition-colors">
                Smartphones
              </Link>
              <Link href="/products?category=Gaming" className="block text-gray-300 hover:text-white transition-colors">
                Gaming
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-yellow-300" />
                <span className="text-gray-300">Accra, Ghana</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-yellow-300" />
                <span className="text-gray-300">+233 XX XXX XXXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-yellow-300" />
                <span className="text-gray-300">info@ttech.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm">
              © 2025 T-Tech & Appliances. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/support" className="text-gray-300 hover:text-white text-sm transition-colors">
                Support
              </Link>
              <Link href="/admin" className="text-yellow-300 hover:text-yellow-200 text-sm transition-colors font-semibold">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}