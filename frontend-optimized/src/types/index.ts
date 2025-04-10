// Common interfaces for the application

// Product interfaces
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  rating: number;
}

// Order interfaces
export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: {
    id: number;
    name: string;
    image_url: string;
  };
}

export interface Order {
  id: number;
  tracking_number: string;
  status: string;
  created_at: string;
  total_amount: number;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  items: OrderItem[];
}

export interface TrackingEvent {
  id: number;
  timestamp: string;
  location: string;
  status: string;
  description: string;
  details: string;
}

export interface OrderTracking {
  order: Order;
  tracking: TrackingEvent[];
  estimated_delivery: string;
  current_status: string;
}

// Chart interfaces
export interface ChartDataPoint {
  date: string;
  quantity: number;
}

export interface ProductReport {
  salesTrend: ChartDataPoint[];
  materialDetails: Record<string, string>;
  specifications: Record<string, string | number>;
  sustainabilityScore: number;
  productionLocation: string;
  carbonFootprint: Record<string, number>;
  shippingOptions: ShippingOption[];
  warrantyInformation: WarrantyInfo;
  reviews: ProductReview[];
}

export interface ShippingOption {
  method: string;
  price: number;
  estimated_days: string;
}

export interface WarrantyInfo {
  basic_coverage: string;
  extended_options: WarrantyOption[];
}

export interface WarrantyOption {
  name: string;
  price: number;
  description: string;
}

export interface ProductReview {
  id: number;
  user: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified_purchase: boolean;
  helpful_votes: number;
}

export interface ShippingOption {
  method: string;
  price: number;
  estimated_days: string;
}

// Banner interface for home page
export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

// Store/Redux interfaces
export interface RootState {
  products: ProductState;
  cart: CartState;
  notifications: NotificationState;
}

export interface ProductState {
  featuredProducts: Product[];
  allProducts: Product[];
  loading: boolean;
  error: string | null;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export interface CartItem {
  product_id: number;
  quantity: number;
  price: number;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface NotificationState {
  notifications: Notification[];
}