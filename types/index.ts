export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[];
  category: string;
  brand: string;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  trending: boolean;
  stock: number;
  specifications: Record<string, string>;
  colors: string[];
  discount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  description?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Address {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  addresses: Address[];
  phone?: string;
  avatar?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: "cod" | "razorpay";
  paymentStatus: "pending" | "paid" | "failed";
  paymentId?: string;
  shippingMethod: string;
  shippingCharge: number;
  discount: number;
  subtotal: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shiprocketId?: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  value: number;
  minSpend?: number;
  expiryDate: string;
  isActive: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}
