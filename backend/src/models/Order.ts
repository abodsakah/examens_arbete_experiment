export interface Order {
  id?: number;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  tracking_number?: string;
  created_at?: Date;
  updated_at?: Date;
  items?: OrderItem[];
}

export interface OrderItem {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: {
    name: string;
    image_url: string;
  };
}

export interface OrderTracking {
  id?: number;
  order_id: number;
  status: 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  location?: string;
  timestamp?: Date;
  details?: string;
}