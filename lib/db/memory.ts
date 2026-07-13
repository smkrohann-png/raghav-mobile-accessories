import fs from "node:fs";
import path from "node:path";
import type { User, Cart, Address, AuthSession } from "@/types/auth";
import type { CustomerOrder } from "@/types/commerce";
import type { Product } from "@/types/product";
import type { Review } from "@/data/reviews";
import { products as seedProducts } from "@/data/storefront";
import { approvedReviews, pendingReviews } from "@/data/reviews";

import {
  isMongoDBConfigured,
  connectToDatabase,
  UserModel,
  SessionModel,
  CartModel,
  AddressModel,
  OrderModel,
  ProductModel,
  ReviewModel,
  AdminRequestModel,
  CouponModel,
  StoreSettingsModel,
} from "./mongodb";

export type AdminRequestKind = "contact" | "support" | "repair";

export type Coupon = {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  isActive: boolean;
  createdAt: string;
};

export type AdminRequest = {
  id: string;
  kind: AdminRequestKind;
  name: string;
  email?: string;
  phone?: string;
  subject: string;
  message: string;
  status: "New" | "In Progress" | "Closed";
  createdAt: string;
  meta?: Record<string, string>;
};

export type StoreSettings = {
  storeName: string;
  email: string;
  phone: string;
  address: string;
  codEnabled: boolean;
  lowStockThreshold: number;
};

type DbSnapshot = {
  users: User[];
  carts: Cart[];
  addresses: Address[];
  orders: CustomerOrder[];
  sessions: AuthSession[];
  products: Product[];
  reviews: Review[];
  requests: AdminRequest[];
  coupons?: Coupon[];
  settings: StoreSettings;
  idCounters: {
    user: number;
    cart: number;
    address: number;
    order: number;
    session: number;
    product: number;
    review: number;
    request: number;
    coupon?: number;
  };
};

const dbFilePath = process.env.FILE_DB_PATH
  ? path.resolve(process.env.FILE_DB_PATH)
  : path.join(process.cwd(), ".data", "raghav-store.json");

export class UnifiedDB {
  private users: Map<string, User> = new Map();
  private carts: Map<string, Cart> = new Map();
  private addresses: Map<string, Address> = new Map();
  private orders: Map<string, CustomerOrder> = new Map();
  private sessions: Map<string, AuthSession> = new Map();
  private products: Map<string, Product> = new Map();
  private reviews: Map<string, Review> = new Map();
  private requests: Map<string, AdminRequest> = new Map();
  private coupons: Map<string, Coupon> = new Map();
  private settings: StoreSettings = {
    storeName: "Raghav Mobile Accessories",
    email: "Raghavmobileaccessories23@gmail.com",
    phone: "+91 7206040798",
    address: "Khera Mohalla, Near New Market, Yamunanagar, Haryana 135001",
    codEnabled: true,
    lowStockThreshold: 10,
  };
  private idCounters = {
    user: 0,
    cart: 0,
    address: 0,
    order: 0,
    session: 0,
    product: 0,
    review: 0,
    request: 0,
    coupon: 0,
  };

  constructor() {
    // Only load local file if not using Mongo
    if (!isMongoDBConfigured()) {
      this.load();
      this.initializeDefaults();
    }
  }

  // Ensure DB is initialized (Mongo or memory)
  public async init(): Promise<void> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      await this.initializeMongoDefaults();
    }
  }

  private async initializeMongoDefaults(): Promise<void> {
    const productsCount = await ProductModel.countDocuments();
    if (productsCount === 0) {
      await ProductModel.insertMany(seedProducts);
    }

    const reviewsCount = await ReviewModel.countDocuments();
    if (reviewsCount === 0) {
      const allReviews = [...approvedReviews, ...pendingReviews].map((r, i) => ({
        ...r,
        id: `review_${i + 1}`,
        createdAt: new Date().toISOString()
      }));
      await ReviewModel.insertMany(allReviews);
    }

    const couponsCount = await CouponModel.countDocuments();
    if (couponsCount === 0) {
      await CouponModel.insertMany([
        { id: "coupon_1", code: "RAGHAV10", discountType: "percentage", discountValue: 10, minOrderAmount: 499, isActive: true, createdAt: new Date().toISOString() },
        { id: "coupon_2", code: "WELCOME50", discountType: "fixed", discountValue: 50, minOrderAmount: 299, isActive: true, createdAt: new Date().toISOString() }
      ]);
    }

    const settingsCount = await StoreSettingsModel.countDocuments();
    if (settingsCount === 0) {
      await StoreSettingsModel.create(this.settings);
    }

    const admin = await UserModel.findOne({ username: "admin" });
    if (!admin) {
      await UserModel.create({
        id: "user_0_admin",
        username: "admin",
        email: "admin@raghav.com",
        password: await this.hashPassword("admin@123"),
        firstName: "Admin",
        lastName: "Panel",
        phone: "9876543210",
        role: "admin",
      });
      console.log("Mongo Admin user created");
    }
  }

  private async initializeDefaults(): Promise<void> {
    if (this.products.size === 0) {
      for (const product of seedProducts) {
        this.products.set(product.id, product);
      }
    }

    if (this.reviews.size === 0) {
      [...approvedReviews, ...pendingReviews].forEach((review, index) => {
        const id = `review_${index + 1}`;
        this.reviews.set(id, {
          ...review,
          id,
          createdAt: new Date().toISOString(),
        });
      });
      this.idCounters.review = Math.max(this.idCounters.review, this.reviews.size);
    }

    if (this.coupons.size === 0) {
      await this.createCoupon({
        code: "RAGHAV10",
        discountType: "percentage",
        discountValue: 10,
        minOrderAmount: 499,
        isActive: true,
      });
      await this.createCoupon({
        code: "WELCOME50",
        discountType: "fixed",
        discountValue: 50,
        minOrderAmount: 299,
        isActive: true,
      });
    }

    const adminExists = await this.getUserByUsername("admin") || await this.getUserByEmail("admin@raghav.com");
    if (!adminExists) {
      const hashedPassword = await this.hashPassword("admin@123");
      await this.createUser({
        username: "admin",
        email: "admin@raghav.com",
        password: hashedPassword,
        firstName: "Admin",
        lastName: "Panel",
        phone: "9876543210",
        role: "admin",
      });
      console.log("Default admin user created: admin / admin@123");
    } else if (adminExists.password !== await this.hashPassword("admin@123") || adminExists.username !== "admin") {
      await this.updateUser(adminExists.id, {
        username: "admin",
        password: await this.hashPassword("admin@123"),
        role: "admin",
      });
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  private load(): void {
    if (!fs.existsSync(dbFilePath)) return;
    try {
      const snapshot = JSON.parse(fs.readFileSync(dbFilePath, "utf8")) as DbSnapshot;
      this.idCounters = {
        ...this.idCounters,
        ...snapshot.idCounters,
        coupon: snapshot.idCounters?.coupon ?? this.idCounters.coupon ?? 0,
      };

      for (const user of snapshot.users ?? []) {
        this.users.set(user.id, user);
        this.users.set(`email_${user.email}`, user);
        if (user.username) this.users.set(`username_${user.username.toLowerCase()}`, user);
      }
      for (const cart of snapshot.carts ?? []) {
        this.carts.set(cart.id, cart);
        this.carts.set(`user_${cart.userId}`, cart);
      }
      for (const address of snapshot.addresses ?? []) {
        this.addresses.set(address.id, address);
      }
      for (const order of snapshot.orders ?? []) {
        this.orders.set(order.id, order);
      }
      for (const session of snapshot.sessions ?? []) {
        this.sessions.set(session.id, session);
        this.sessions.set(`token_${session.token}`, session);
      }
      for (const product of snapshot.products ?? []) {
        this.products.set(product.id, product);
      }
      for (const review of snapshot.reviews ?? []) {
        if (review.id) this.reviews.set(review.id, review);
      }
      for (const request of snapshot.requests ?? []) {
        this.requests.set(request.id, request);
      }
      for (const coupon of snapshot.coupons ?? []) {
        this.coupons.set(coupon.id, coupon);
        this.coupons.set(`code_${coupon.code.toUpperCase()}`, coupon);
      }
      if (snapshot.settings) {
        this.settings = { ...this.settings, ...snapshot.settings };
      }
    } catch (error) {
      console.error("Failed to load file database:", error);
    }
  }

  private persist(): void {
    if (isMongoDBConfigured()) return; // Don't persist to file if using Mongo
    try {
      fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });
      const snapshot: DbSnapshot = {
        users: Array.from(this.users.entries())
          .filter(([key]) => !key.startsWith("email_"))
          .map(([, user]) => user),
        carts: Array.from(this.carts.entries())
          .filter(([key]) => !key.startsWith("user_"))
          .map(([, cart]) => cart),
        addresses: Array.from(this.addresses.values()),
        orders: Array.from(this.orders.values()),
        sessions: Array.from(this.sessions.entries())
          .filter(([key]) => !key.startsWith("token_"))
          .map(([, session]) => session),
        products: Array.from(this.products.values()),
        reviews: Array.from(this.reviews.values()),
        requests: Array.from(this.requests.values()),
        coupons: Array.from(this.coupons.entries())
          .filter(([key]) => !key.startsWith("code_"))
          .map(([, coupon]) => coupon),
        settings: this.settings,
        idCounters: this.idCounters,
      };
      fs.writeFileSync(dbFilePath, JSON.stringify(snapshot, null, 2));
    } catch (error) {
      console.error("Failed to persist file database:", error);
    }
  }

  // ===== USER OPERATIONS =====
  async createUser(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      const id = `user_${Date.now()}`;
      return (await UserModel.create({ ...data, id })).toObject();
    }
    const id = `user_${++this.idCounters.user}`;
    const user: User = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    this.users.set(`email_${data.email}`, user);
    if (data.username) this.users.set(`username_${data.username.toLowerCase()}`, user);
    this.persist();
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return UserModel.findOne({ id }).lean();
    }
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return UserModel.findOne({ email }).lean();
    }
    return this.users.get(`email_${email}`) || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return UserModel.findOne({ username: username.toLowerCase() }).lean();
    }
    return this.users.get(`username_${username.toLowerCase()}`) || null;
  }

  async getUserByIdentifier(identifier: string): Promise<User | null> {
    return (await this.getUserByEmail(identifier)) || (await this.getUserByUsername(identifier));
  }

  async getAllUsers(): Promise<User[]> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return UserModel.find().lean();
    }
    return Array.from(this.users.entries())
      .filter(([key]) => !key.startsWith("email_") && !key.startsWith("username_"))
      .map(([, user]) => user);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      data.updatedAt = new Date();
      return UserModel.findOneAndUpdate({ id }, data, { new: true }).lean();
    }
    const user = this.users.get(id);
    if (!user) return null;
    const updated = { ...user, ...data, updatedAt: new Date() };
    this.users.set(id, updated);
    if (data.email && data.email !== user.email) {
      this.users.delete(`email_${user.email}`);
      this.users.set(`email_${data.email}`, updated);
    }
    if (data.username && data.username !== user.username) {
      if (user.username) this.users.delete(`username_${user.username.toLowerCase()}`);
      this.users.set(`username_${data.username.toLowerCase()}`, updated);
    }
    this.persist();
    return updated;
  }

  // ===== PRODUCT OPERATIONS =====
  async getAllProducts(): Promise<Product[]> {
    if (isMongoDBConfigured()) {
      await this.init();
      return ProductModel.find().lean();
    }
    return Array.from(this.products.values());
  }

  async getProductById(id: string): Promise<Product | null> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return ProductModel.findOne({ id }).lean();
    }
    return this.products.get(id) || null;
  }

  async upsertProduct(product: Product): Promise<Product> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return (await ProductModel.findOneAndUpdate({ id: product.id }, product, { upsert: true, new: true })).toObject();
    }
    this.products.set(product.id, product);
    this.persist();
    return product;
  }

  async createProduct(data: Omit<Product, "id"> & { id?: string }): Promise<Product> {
    const id = data.id || `${data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${++this.idCounters.product}`;
    const product: Product = { ...data, id };
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return (await ProductModel.create(product)).toObject();
    }
    this.products.set(id, product);
    this.persist();
    return product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      const res = await ProductModel.deleteOne({ id });
      return res.deletedCount > 0;
    }
    const deleted = this.products.delete(id);
    if (deleted) this.persist();
    return deleted;
  }

  // ===== REVIEW OPERATIONS =====
  async getAllReviews(): Promise<Review[]> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return ReviewModel.find().lean();
    }
    return Array.from(this.reviews.values());
  }

  async createReview(data: Omit<Review, "id" | "status" | "createdAt">): Promise<Review> {
    const id = `review_${++this.idCounters.review}`;
    const review: Review = { ...data, id, status: "Pending", createdAt: new Date().toISOString() };
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return (await ReviewModel.create(review)).toObject();
    }
    this.reviews.set(id, review);
    this.persist();
    return review;
  }

  async updateReview(id: string, data: Partial<Review>): Promise<Review | null> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return ReviewModel.findOneAndUpdate({ id }, data, { new: true }).lean();
    }
    const review = this.reviews.get(id);
    if (!review) return null;
    const updated = { ...review, ...data };
    this.reviews.set(id, updated);
    this.persist();
    return updated;
  }

  async deleteReview(id: string): Promise<boolean> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      const result = await ReviewModel.deleteOne({ id });
      return result.deletedCount === 1;
    }
    const deleted = this.reviews.delete(id);
    if (deleted) this.persist();
    return deleted;
  }

  // ===== REQUEST OPERATIONS =====
  async createRequest(data: Omit<AdminRequest, "id" | "status" | "createdAt">): Promise<AdminRequest> {
    const id = `request_${++this.idCounters.request}`;
    const request: AdminRequest = { ...data, id, status: "New", createdAt: new Date().toISOString() };
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return (await AdminRequestModel.create(request)).toObject();
    }
    this.requests.set(id, request);
    this.persist();
    return request;
  }

  async getAllRequests(): Promise<AdminRequest[]> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      const reqs = await AdminRequestModel.find().lean();
      return (reqs as AdminRequest[]).sort((a: AdminRequest, b: AdminRequest) => b.createdAt.localeCompare(a.createdAt));
    }
    return Array.from(this.requests.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async updateRequest(id: string, data: Partial<AdminRequest>): Promise<AdminRequest | null> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return AdminRequestModel.findOneAndUpdate({ id }, data, { new: true }).lean();
    }
    const request = this.requests.get(id);
    if (!request) return null;
    const updated = { ...request, ...data };
    this.requests.set(id, updated);
    this.persist();
    return updated;
  }

  // ===== SETTINGS OPERATIONS =====
  async getSettings(): Promise<StoreSettings> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      const settings = await StoreSettingsModel.findOne().lean();
      return settings || this.settings;
    }
    return this.settings;
  }

  async updateSettings(data: Partial<StoreSettings>): Promise<StoreSettings> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      let settings = await StoreSettingsModel.findOne();
      if (!settings) {
        settings = new StoreSettingsModel({ ...this.settings, ...data });
      } else {
        Object.assign(settings, data);
      }
      await settings.save();
      return settings.toObject();
    }
    this.settings = { ...this.settings, ...data };
    this.persist();
    return this.settings;
  }

  // ===== CART OPERATIONS =====
  async createCart(userId: string): Promise<Cart> {
    const id = `cart_${++this.idCounters.cart}`;
    const cart: Cart = {
      id,
      userId,
      items: [],
      updatedAt: new Date(),
    };
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return (await CartModel.create(cart)).toObject();
    }
    this.carts.set(id, cart);
    this.carts.set(`user_${userId}`, cart);
    this.persist();
    return cart;
  }

  async getCartByUserId(userId: string): Promise<Cart | null> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return CartModel.findOne({ userId }).lean();
    }
    return this.carts.get(`user_${userId}`) || null;
  }

  async getCartById(id: string): Promise<Cart | null> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return CartModel.findOne({ id }).lean();
    }
    return this.carts.get(id) || null;
  }

  async updateCart(cartId: string, cart: Cart): Promise<Cart> {
    cart.updatedAt = new Date();
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return (await CartModel.findOneAndUpdate({ id: cartId }, cart, { upsert: true, new: true })).toObject();
    }
    this.carts.set(cartId, cart);
    this.carts.set(`user_${cart.userId}`, cart);
    this.persist();
    return cart;
  }

  // ===== ADDRESS OPERATIONS =====
  async createAddress(data: Omit<Address, "id" | "createdAt">): Promise<Address> {
    const id = `addr_${++this.idCounters.address}`;
    const address: Address = {
      ...data,
      id,
      createdAt: new Date(),
    };
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return (await AddressModel.create(address)).toObject();
    }
    this.addresses.set(id, address);
    this.persist();
    return address;
  }

  async getAddressesByUserId(userId: string): Promise<Address[]> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return AddressModel.find({ userId }).lean();
    }
    return Array.from(this.addresses.values()).filter((a) => a.userId === userId);
  }

  async getAddressById(id: string): Promise<Address | null> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return AddressModel.findOne({ id }).lean();
    }
    return this.addresses.get(id) || null;
  }

  async updateAddress(id: string, data: Partial<Address>): Promise<Address | null> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return AddressModel.findOneAndUpdate({ id }, data, { new: true }).lean();
    }
    const address = this.addresses.get(id);
    if (!address) return null;
    const updated = { ...address, ...data };
    this.addresses.set(id, updated);
    this.persist();
    return updated;
  }

  async deleteAddress(id: string): Promise<boolean> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      const res = await AddressModel.deleteOne({ id });
      return res.deletedCount > 0;
    }
    const deleted = this.addresses.delete(id);
    if (deleted) this.persist();
    return deleted;
  }

  // ===== ORDER OPERATIONS =====
  async createOrder(data: Omit<CustomerOrder, "id">): Promise<CustomerOrder> {
    const id = `order_${++this.idCounters.order}`;
    const order: CustomerOrder = { ...data, id };
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return (await OrderModel.create(order)).toObject();
    }
    this.orders.set(id, order);
    this.persist();
    return order;
  }

  async getOrderById(id: string): Promise<CustomerOrder | null> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return OrderModel.findOne({ id }).lean();
    }
    return this.orders.get(id) || null;
  }

  async getOrdersByUserId(userId: string): Promise<CustomerOrder[]> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return OrderModel.find({ customer: userId }).lean();
    }
    return Array.from(this.orders.values()).filter((o) => o.customer === userId);
  }

  async getAllOrders(): Promise<CustomerOrder[]> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return OrderModel.find().lean();
    }
    return Array.from(this.orders.values());
  }

  async updateOrder(id: string, data: Partial<CustomerOrder>): Promise<CustomerOrder | null> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return OrderModel.findOneAndUpdate({ id }, data, { new: true }).lean();
    }
    const order = this.orders.get(id);
    if (!order) return null;
    const updated = { ...order, ...data };
    this.orders.set(id, updated);
    this.persist();
    return updated;
  }

  // ===== SESSION OPERATIONS =====
  async createSession(userId: string, token: string, expiresAt: Date): Promise<AuthSession> {
    const id = `sess_${++this.idCounters.session}`;
    const session: AuthSession = {
      id,
      userId,
      token,
      expiresAt,
      createdAt: new Date(),
    };
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return (await SessionModel.create(session)).toObject();
    }
    this.sessions.set(id, session);
    this.sessions.set(`token_${token}`, session);
    this.persist();
    return session;
  }

  async getSessionByToken(token: string): Promise<AuthSession | null> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return SessionModel.findOne({ token }).lean();
    }
    return this.sessions.get(`token_${token}`) || null;
  }

  async deleteSession(token: string): Promise<boolean> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      const res = await SessionModel.deleteOne({ token });
      return res.deletedCount > 0;
    }
    const session = this.sessions.get(`token_${token}`);
    if (!session) return false;
    this.sessions.delete(session.id);
    this.sessions.delete(`token_${token}`);
    this.persist();
    return true;
  }

  // ===== COUPON OPERATIONS =====
  async getAllCoupons(): Promise<Coupon[]> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return CouponModel.find().lean();
    }
    return Array.from(this.coupons.entries())
      .filter(([key]) => !key.startsWith("code_"))
      .map(([, coupon]) => coupon);
  }

  async getCouponById(id: string): Promise<Coupon | null> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return CouponModel.findOne({ id }).lean();
    }
    return this.coupons.get(id) || null;
  }

  async getCouponByCode(code: string): Promise<Coupon | null> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return CouponModel.findOne({ code: code.toUpperCase() }).lean();
    }
    return this.coupons.get(`code_${code.toUpperCase()}`) || null;
  }

  async createCoupon(data: Omit<Coupon, "id" | "createdAt">): Promise<Coupon> {
    const id = `coupon_${++this.idCounters.coupon}`;
    const coupon: Coupon = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      return (await CouponModel.create(coupon)).toObject();
    }
    this.coupons.set(id, coupon);
    this.coupons.set(`code_${data.code.toUpperCase()}`, coupon);
    this.persist();
    return coupon;
  }

  async deleteCoupon(id: string): Promise<boolean> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      const res = await CouponModel.deleteOne({ id });
      return res.deletedCount > 0;
    }
    const coupon = this.coupons.get(id);
    if (!coupon) return false;
    this.coupons.delete(id);
    this.coupons.delete(`code_${coupon.code.toUpperCase()}`);
    this.persist();
    return true;
  }

  // ===== DEBUG: Clear all data =====
  async clearAll(): Promise<void> {
    if (isMongoDBConfigured()) {
      await connectToDatabase();
      await Promise.all([
        UserModel.deleteMany({}),
        CartModel.deleteMany({}),
        AddressModel.deleteMany({}),
        OrderModel.deleteMany({}),
        SessionModel.deleteMany({}),
        ProductModel.deleteMany({}),
        ReviewModel.deleteMany({}),
        AdminRequestModel.deleteMany({}),
        CouponModel.deleteMany({}),
      ]);
      return;
    }
    this.users.clear();
    this.carts.clear();
    this.addresses.clear();
    this.orders.clear();
    this.sessions.clear();
    this.products.clear();
    this.reviews.clear();
    this.requests.clear();
    this.coupons.clear();
    this.idCounters = {
      user: 0, cart: 0, address: 0, order: 0, session: 0,
      product: 0, review: 0, request: 0, coupon: 0,
    };
    this.persist();
  }
}

// Singleton instance
export const db = new UnifiedDB();
