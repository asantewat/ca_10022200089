import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            <span className="font-semibold">🔐 Admin Dashboard</span>
            <span className="ml-2 text-blue-200">Manage your store</span>
          </div>
        </div>
        {children}
      </div>
      <Footer />
    </div>
  );
}