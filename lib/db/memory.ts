import fs from "node:fs";
import path from "node:path";
import type { User, Cart, Address, AuthSession } from "@/types/auth";
import type { CustomerOrder } from "@/types/commerce";
import type { Product } from "@/types/product";
import type { Review } from "@/data/reviews";
import { products as seedProducts } from "@/data/storefront";
import { approvedReviews, pendingReviews } from "@/data/reviews";

export type AdminRequestKind = "contact" | "support" | "repair";

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
  };
};

const dbFilePath = process.env.FILE_DB_PATH
  ? path.resolve(process.env.FILE_DB_PATH)
  : path.join(process.cwd(), ".data", "raghav-store.json");

export class MemoryDB {
  private users: Map<string, User> = new Map();
  private carts: Map<string, Cart> = new Map();
  private addresses: Map<string, Address> = new Map();
  private orders: Map<string, CustomerOrder> = new Map();
  private sessions: Map<string, AuthSession> = new Map();
  private products: Map<string, Product> = new Map();
  private reviews: Map<string, Review> = new Map();
  private requests: Map<string, AdminRequest> = new Map();
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
  };

  constructor() {
    this.load();
    this.initializeDefaults();
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

    // Create admin user if not exists
    const adminExists = this.getUserByUsername("admin") || this.getUserByEmail("admin@raghav.com");
    if (!adminExists) {
      const hashedPassword = await this.hashPassword("admin@123");
      this.createUser({
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
      this.updateUser(adminExists.id, {
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
      this.idCounters = snapshot.idCounters ?? this.idCounters;

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
      if (snapshot.settings) {
        this.settings = { ...this.settings, ...snapshot.settings };
      }
    } catch (error) {
      console.error("Failed to load file database:", error);
    }
  }

  private persist(): void {
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
        settings: this.settings,
        idCounters: this.idCounters,
      };
      fs.writeFileSync(dbFilePath, JSON.stringify(snapshot, null, 2));
    } catch (error) {
      console.error("Failed to persist file database:", error);
    }
  }

  // ===== USER OPERATIONS =====
  createUser(data: Omit<User, "id" | "createdAt" | "updatedAt">): User {
    const id = `user_${++this.idCounters.user}`;
    const user: User = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    this.users.set(`email_${data.email}`, user); // index by email
    if (data.username) this.users.set(`username_${data.username.toLowerCase()}`, user);
    this.persist();
    return user;
  }

  getUserById(id: string): User | null {
    return this.users.get(id) || null;
  }

  getUserByEmail(email: string): User | null {
    return this.users.get(`email_${email}`) || null;
  }

  getUserByUsername(username: string): User | null {
    return this.users.get(`username_${username.toLowerCase()}`) || null;
  }

  getUserByIdentifier(identifier: string): User | null {
    return this.getUserByEmail(identifier) || this.getUserByUsername(identifier);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.entries())
      .filter(([key]) => !key.startsWith("email_") && !key.startsWith("username_"))
      .map(([, user]) => user);
  }

  updateUser(id: string, data: Partial<User>): User | null {
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
  getAllProducts(): Product[] {
    return Array.from(this.products.values());
  }

  getProductById(id: string): Product | null {
    return this.products.get(id) || null;
  }

  upsertProduct(product: Product): Product {
    this.products.set(product.id, product);
    this.persist();
    return product;
  }

  createProduct(data: Omit<Product, "id"> & { id?: string }): Product {
    const id = data.id || `${data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${++this.idCounters.product}`;
    const product: Product = { ...data, id };
    this.products.set(id, product);
    this.persist();
    return product;
  }

  deleteProduct(id: string): boolean {
    const deleted = this.products.delete(id);
    if (deleted) this.persist();
    return deleted;
  }

  // ===== REVIEW OPERATIONS =====
  getAllReviews(): Review[] {
    return Array.from(this.reviews.values());
  }

  createReview(data: Omit<Review, "id" | "status" | "createdAt">): Review {
    const id = `review_${++this.idCounters.review}`;
    const review: Review = { ...data, id, status: "Pending", createdAt: new Date().toISOString() };
    this.reviews.set(id, review);
    this.persist();
    return review;
  }

  updateReview(id: string, data: Partial<Review>): Review | null {
    const review = this.reviews.get(id);
    if (!review) return null;
    const updated = { ...review, ...data };
    this.reviews.set(id, updated);
    this.persist();
    return updated;
  }

  // ===== REQUEST OPERATIONS =====
  createRequest(data: Omit<AdminRequest, "id" | "status" | "createdAt">): AdminRequest {
    const id = `request_${++this.idCounters.request}`;
    const request: AdminRequest = { ...data, id, status: "New", createdAt: new Date().toISOString() };
    this.requests.set(id, request);
    this.persist();
    return request;
  }

  getAllRequests(): AdminRequest[] {
    return Array.from(this.requests.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  updateRequest(id: string, data: Partial<AdminRequest>): AdminRequest | null {
    const request = this.requests.get(id);
    if (!request) return null;
    const updated = { ...request, ...data };
    this.requests.set(id, updated);
    this.persist();
    return updated;
  }

  // ===== SETTINGS OPERATIONS =====
  getSettings(): StoreSettings {
    return this.settings;
  }

  updateSettings(data: Partial<StoreSettings>): StoreSettings {
    this.settings = { ...this.settings, ...data };
    this.persist();
    return this.settings;
  }

  // ===== CART OPERATIONS =====
  createCart(userId: string): Cart {
    const id = `cart_${++this.idCounters.cart}`;
    const cart: Cart = {
      id,
      userId,
      items: [],
      updatedAt: new Date(),
    };
    this.carts.set(id, cart);
    this.carts.set(`user_${userId}`, cart); // index by userId
    this.persist();
    return cart;
  }

  getCartByUserId(userId: string): Cart | null {
    return this.carts.get(`user_${userId}`) || null;
  }

  getCartById(id: string): Cart | null {
    return this.carts.get(id) || null;
  }

  updateCart(cartId: string, cart: Cart): Cart {
    cart.updatedAt = new Date();
    this.carts.set(cartId, cart);
    this.carts.set(`user_${cart.userId}`, cart);
    this.persist();
    return cart;
  }

  // ===== ADDRESS OPERATIONS =====
  createAddress(data: Omit<Address, "id" | "createdAt">): Address {
    const id = `addr_${++this.idCounters.address}`;
    const address: Address = {
      ...data,
      id,
      createdAt: new Date(),
    };
    this.addresses.set(id, address);
    this.persist();
    return address;
  }

  getAddressesByUserId(userId: string): Address[] {
    return Array.from(this.addresses.values()).filter((a) => a.userId === userId);
  }

  getAddressById(id: string): Address | null {
    return this.addresses.get(id) || null;
  }

  updateAddress(id: string, data: Partial<Address>): Address | null {
    const address = this.addresses.get(id);
    if (!address) return null;
    const updated = { ...address, ...data };
    this.addresses.set(id, updated);
    this.persist();
    return updated;
  }

  deleteAddress(id: string): boolean {
    const deleted = this.addresses.delete(id);
    if (deleted) this.persist();
    return deleted;
  }

  // ===== ORDER OPERATIONS =====
  createOrder(data: Omit<CustomerOrder, "id">): CustomerOrder {
    const id = `order_${++this.idCounters.order}`;
    const order: CustomerOrder = { ...data, id };
    this.orders.set(id, order);
    this.persist();
    return order;
  }

  getOrderById(id: string): CustomerOrder | null {
    return this.orders.get(id) || null;
  }

  getOrdersByUserId(userId: string): CustomerOrder[] {
    return Array.from(this.orders.values()).filter((o) => o.customer === userId);
  }

  getAllOrders(): CustomerOrder[] {
    return Array.from(this.orders.values());
  }

  updateOrder(id: string, data: Partial<CustomerOrder>): CustomerOrder | null {
    const order = this.orders.get(id);
    if (!order) return null;
    const updated = { ...order, ...data };
    this.orders.set(id, updated);
    this.persist();
    return updated;
  }

  // ===== SESSION OPERATIONS =====
  createSession(userId: string, token: string, expiresAt: Date): AuthSession {
    const id = `sess_${++this.idCounters.session}`;
    const session: AuthSession = {
      id,
      userId,
      token,
      expiresAt,
      createdAt: new Date(),
    };
    this.sessions.set(id, session);
    this.sessions.set(`token_${token}`, session); // index by token
    this.persist();
    return session;
  }

  getSessionByToken(token: string): AuthSession | null {
    return this.sessions.get(`token_${token}`) || null;
  }

  deleteSession(token: string): boolean {
    const session = this.sessions.get(`token_${token}`);
    if (!session) return false;
    this.sessions.delete(session.id);
    this.sessions.delete(`token_${token}`);
    this.persist();
    return true;
  }

  // ===== DEBUG: Clear all data =====
  clearAll(): void {
    this.users.clear();
    this.carts.clear();
    this.addresses.clear();
    this.orders.clear();
    this.sessions.clear();
    this.products.clear();
    this.reviews.clear();
    this.requests.clear();
    this.idCounters = {
      user: 0,
      cart: 0,
      address: 0,
      order: 0,
      session: 0,
      product: 0,
      review: 0,
      request: 0,
    };
    this.persist();
  }
}

// Singleton instance
export const db = new MemoryDB();
