export type UserRole = "customer" | "admin";

export type User = {
  id: string;
  username?: string;
  email: string;
  password?: string; // hashed password
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthSession = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
};

export type CartItem = {
  productId: string;
  quantity: number;
  addedAt: Date;
};

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
  updatedAt: Date;
};

export type Address = {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt: Date;
};
