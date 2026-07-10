import mongoose, { Schema } from 'mongoose';
import type { User, Cart, CartItem, Address, AuthSession } from '@/types/auth';
import type { CustomerOrder } from '@/types/commerce';
import type { Product } from '@/types/product';
import type { Review } from '@/data/reviews';
import type { AdminRequest, Coupon, StoreSettings } from './memory';

export const isMongoDBConfigured = () => {
  return !!(process.env.MONGODB_URI || process.env.DATABASE_URL);
};

let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;
  if (!MONGODB_URI) throw new Error("Please define the MONGODB_URI or DATABASE_URL environment variable");

  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

const UserSchema = new Schema<User>({
  id: { type: String, required: true, unique: true },
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const SessionSchema = new Schema<AuthSession>({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

const CartItemSchema = new Schema<CartItem>({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  addedAt: { type: Date, default: Date.now }
});

const CartSchema = new Schema<Cart>({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, unique: true },
  items: [CartItemSchema],
  updatedAt: { type: Date, default: Date.now }
});

const AddressSchema = new Schema<Address>({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const OrderMessageSchema = new Schema({
  status: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: String, required: true }
});

const OrderSchema = new Schema<CustomerOrder>({
  id: { type: String, required: true, unique: true },
  customer: { type: String, required: true },
  customerName: { type: String },
  customerEmail: { type: String },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  date: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  paymentFailureReason: { type: String },
  shippingProvider: { type: String },
  shippingStatus: { type: String },
  shiprocketOrderId: { type: String },
  shiprocketShipmentId: { type: String },
  shiprocketAwbCode: { type: String },
  shippingFailureReason: { type: String },
  products: { type: Schema.Types.Mixed, required: true },
  messages: [OrderMessageSchema]
});

const ProductSchema = new Schema<Product>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  tag: { type: String },
  price: { type: Number, required: true },
  compareAt: { type: Number },
  image: { type: String },
  sku: { type: String },
  connector: { type: String },
  power: { type: String },
  length: { type: String },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  availability: { type: String, required: true },
  compatibleBrands: [String],
  color: { type: String },
  tone: { type: String },
  visual: { type: String },
  description: { type: String },
  features: [String]
});

const ReviewSchema = new Schema<Review>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  product: { type: String, required: true },
  text: { type: String, required: true },
  status: { type: String, enum: ["Approved", "Pending", "Rejected"], default: "Pending" },
  createdAt: { type: String }
});

const AdminRequestSchema = new Schema<AdminRequest>({
  id: { type: String, required: true, unique: true },
  kind: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: String, required: true },
  meta: { type: Schema.Types.Mixed }
});

const CouponSchema = new Schema<Coupon>({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  discountType: { type: String, required: true },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: String, required: true }
});

const StoreSettingsSchema = new Schema<StoreSettings>({
  storeName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  codEnabled: { type: Boolean, default: true },
  lowStockThreshold: { type: Number, default: 10 }
});

export const UserModel = mongoose.models.User || mongoose.model<User>('User', UserSchema);
export const SessionModel = mongoose.models.Session || mongoose.model<AuthSession>('Session', SessionSchema);
export const CartModel = mongoose.models.Cart || mongoose.model<Cart>('Cart', CartSchema);
export const AddressModel = mongoose.models.Address || mongoose.model<Address>('Address', AddressSchema);
export const OrderModel = mongoose.models.Order || mongoose.model<CustomerOrder>('Order', OrderSchema);
export const ProductModel = mongoose.models.Product || mongoose.model<Product>('Product', ProductSchema);
export const ReviewModel = mongoose.models.Review || mongoose.model<Review>('Review', ReviewSchema);
export const AdminRequestModel = mongoose.models.AdminRequest || mongoose.model<AdminRequest>('AdminRequest', AdminRequestSchema);
export const CouponModel = mongoose.models.Coupon || mongoose.model<Coupon>('Coupon', CouponSchema);
export const StoreSettingsModel = mongoose.models.StoreSettings || mongoose.model<StoreSettings>('StoreSettings', StoreSettingsSchema);
