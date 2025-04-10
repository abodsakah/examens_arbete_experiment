export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  featured: boolean;
  rating: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  sortBy?: 'price' | 'rating' | 'name';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}