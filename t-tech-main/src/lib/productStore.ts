import { initialProducts } from './mockData';

// Shared in-memory storage for demo purposes
// In production, this would be replaced with a database
class ProductStore {
  private products = [...initialProducts];

  getAll() {
    return [...this.products];
  }

  getById(id: string) {
    return this.products.find(product => product.id === id);
  }

  create(productData: any) {
    const newProduct = {
      _id: Date.now().toString(),
      ...productData,
      createdAt: new Date().toISOString(),
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  update(id: string, updateData: any) {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) return null;
    
    this.products[index] = {
      ...this.products[index],
      ...updateData,
    };
    return this.products[index];
  }

  delete(id: string) {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) return null;
    
    return this.products.splice(index, 1)[0];
  }

  filter(filters: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    let filtered = [...this.products];

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    // Calculate pagination
    const total = filtered.length;
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;
    const paginated = filtered.slice(skip, skip + limit);

    return {
      products: paginated,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

// Export singleton instance
export const productStore = new ProductStore();