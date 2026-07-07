# Backend Setup & Architecture

## Overview
Your ecommerce platform now has a complete backend with:
- **Authentication System** - Login/Register with JWT
- **Cart Management** - Add/update/remove items
- **Checkout & Orders** - Create and manage orders
- **User Profiles** - Customer profiles with addresses
- **Admin Dashboard** - Order management and analytics
- **In-Memory Database** - Ready to migrate to real DB

## Project Structure

```
app/api/
├── auth/
│   ├── register/route.ts      # POST - Register new user
│   ├── login/route.ts         # POST - Login user
│   ├── logout/route.ts        # POST - Logout
│   └── me/route.ts            # GET - Current user info
├── cart/
│   ├── route.ts               # GET cart, POST add item
│   └── [id]/route.ts          # PUT update qty, DELETE remove
├── checkout/
│   └── route.ts               # POST - Create order from cart
├── orders/
│   ├── route.ts               # GET - User's orders
│   └── [id]/route.ts          # GET order, PUT cancel order
├── profile/
│   ├── route.ts               # GET/PUT - User profile
│   ├── change-password/route.ts
│   ├── addresses/
│   │   ├── route.ts           # GET all, POST new address
│   │   └── [id]/route.ts      # PUT/DELETE address
└── admin/
    ├── dashboard/route.ts     # GET - Admin stats
    ├── orders/
    │   ├── route.ts           # GET - All orders
    │   └── [id]/route.ts      # PUT - Update order status
    └── users/route.ts         # GET - User stats

lib/
├── auth.ts                    # JWT, password hashing, validation
├── db/
│   └── memory.ts              # In-memory database

store/
├── auth.ts                    # Zustand - Auth state
├── cart.ts                    # Zustand - Cart state
├── profile.ts                 # Zustand - Profile/Orders state
└── admin.ts                   # Zustand - Admin state

types/
├── auth.ts                    # Auth/Cart/Address types
├── product.ts                 # (Already existed)
└── commerce.ts                # (Already existed)
```

## Installation & Setup

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

This installs:
- **jose** - JWT signing/verification
- Other dependencies (already in package.json)

### 2. Set Environment Variables
Create a `.env.local` file:
\`\`\`env
JWT_SECRET=your-super-secret-key-change-in-production
NODE_ENV=development
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Visit `http://localhost:3000`

## API Endpoints Reference

### Authentication

#### Register
\`\`\`
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "9876543210"
}

Response (201):
{
  "message": "Account created successfully",
  "user": {
    "id": "user_1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "9876543210",
    "role": "customer"
  }
}
\`\`\`

#### Login
\`\`\`
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}

Response (200):
{
  "message": "Logged in successfully",
  "user": { ... }
}
\`\`\`

#### Check Auth Status
\`\`\`
GET /api/auth/me
Authorization: Cookie (automatic)

Response (200):
{
  "user": { ... },
  "isAuthenticated": true
}
\`\`\`

#### Logout
\`\`\`
POST /api/auth/logout

Response (200):
{
  "message": "Logged out successfully"
}
\`\`\`

### Cart

#### Get Cart
\`\`\`
GET /api/cart

Response (200):
{
  "id": "cart_1",
  "userId": "user_1",
  "items": [
    {
      "productId": "aero-magsafe-case",
      "quantity": 2,
      "addedAt": "2024-01-15T10:00:00Z",
      "product": { ... }
    }
  ],
  "updatedAt": "2024-01-15T10:00:00Z"
}
\`\`\`

#### Add to Cart
\`\`\`
POST /api/cart
Content-Type: application/json

{
  "productId": "aero-magsafe-case",
  "quantity": 1
}

Response (200):
{
  "message": "Item added to cart",
  "cart": { ... }
}
\`\`\`

#### Update Quantity
\`\`\`
PUT /api/cart/[productId]
Content-Type: application/json

{
  "quantity": 3
}

Response (200):
{
  "message": "Cart updated",
  "cart": { ... }
}
\`\`\`

#### Remove from Cart
\`\`\`
DELETE /api/cart/[productId]

Response (200):
{
  "message": "Item removed from cart",
  "cart": { ... }
}
\`\`\`

### Checkout

#### Create Order
\`\`\`
POST /api/checkout
Content-Type: application/json

{
  "addressId": "addr_1",
  "paymentMethod": "Cash On Delivery"
}

Response (201):
{
  "message": "Order created successfully",
  "order": {
    "id": "order_1",
    "status": "Pending",
    "amount": 2598,
    "paymentMethod": "Cash On Delivery"
  }
}
\`\`\`

### Profile

#### Get Profile
\`\`\`
GET /api/profile

Response (200):
{
  "user": { ... },
  "addresses": [ ... ],
  "orders": [ ... ],
  "stats": {
    "totalOrders": 5,
    "totalSpent": 12500
  }
}
\`\`\`

#### Update Profile
\`\`\`
PUT /api/profile
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "9876543210",
  "email": "newemail@example.com"
}

Response (200):
{
  "message": "Profile updated successfully",
  "user": { ... }
}
\`\`\`

#### Change Password
\`\`\`
POST /api/profile/change-password
Content-Type: application/json

{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword456!"
}

Response (200):
{
  "message": "Password changed successfully"
}
\`\`\`

### Addresses

#### Get All Addresses
\`\`\`
GET /api/profile/addresses

Response (200):
{
  "addresses": [ ... ]
}
\`\`\`

#### Add Address
\`\`\`
POST /api/profile/addresses
Content-Type: application/json

{
  "fullName": "John Doe",
  "phone": "9876543210",
  "street": "123 Main Street",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001",
  "isDefault": true
}

Response (201):
{
  "message": "Address added successfully",
  "address": { ... }
}
\`\`\`

#### Update Address
\`\`\`
PUT /api/profile/addresses/[id]
Content-Type: application/json

{
  "isDefault": false
}

Response (200):
{
  "message": "Address updated successfully",
  "address": { ... }
}
\`\`\`

#### Delete Address
\`\`\`
DELETE /api/profile/addresses/[id]

Response (200):
{
  "message": "Address deleted successfully"
}
\`\`\`

### Orders

#### Get User's Orders
\`\`\`
GET /api/orders

Response (200):
{
  "orders": [ ... ]
}
\`\`\`

#### Get Order Details
\`\`\`
GET /api/orders/[id]

Response (200):
{
  "order": { ... }
}
\`\`\`

#### Cancel Order
\`\`\`
PUT /api/orders/[id]

Response (200):
{
  "message": "Order cancelled successfully",
  "order": { ... }
}
\`\`\`

### Admin

#### Get Dashboard
\`\`\`
GET /api/admin/dashboard

Response (200):
{
  "stats": {
    "totalOrders": 42,
    "totalRevenue": 125000,
    "pendingOrders": 8,
    "completedOrders": 30
  },
  "recentOrders": [ ... ]
}
\`\`\`

#### Get All Orders
\`\`\`
GET /api/admin/orders

Response (200):
{
  "orders": [ ... ]
}
\`\`\`

#### Update Order Status
\`\`\`
PUT /api/admin/orders/[id]
Content-Type: application/json

{
  "status": "Confirmed"
}

Status options: Pending, Confirmed, Packed, Shipped, Out For Delivery, Delivered, Cancelled

Response (200):
{
  "message": "Order status updated",
  "order": { ... }
}
\`\`\`

## Zustand Stores Usage

### Auth Store
\`\`\`typescript
import { useAuthStore } from '@/store/auth';

const { user, isAuthenticated, login, register, logout } = useAuthStore();

// Login
await login('email@example.com', 'password');

// Register
await register({
  email: 'newuser@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  phone: '9876543210'
});

// Logout
await logout();

// Check auth
const session = await useAuthStore().checkAuth();
\`\`\`

### Cart Store
\`\`\`typescript
import { useCartStore } from '@/store/cart';

const {
  cart,
  addToCart,
  removeFromCart,
  updateQuantity,
  getTotalPrice,
  getTotalItems
} = useCartStore();

// Add item
await addToCart('product-id', 1);

// Update quantity
await updateQuantity('product-id', 3);

// Remove
await removeFromCart('product-id');

// Get totals
const total = getTotalPrice();
const itemCount = getTotalItems();
\`\`\`

### Profile Store
\`\`\`typescript
import { useProfileStore } from '@/store/profile';

const {
  profile,
  addresses,
  orders,
  fetchProfile,
  updateProfile,
  fetchAddresses,
  addAddress,
  fetchOrders,
  cancelOrder
} = useProfileStore();

// Fetch profile
await fetchProfile();

// Update profile
await updateProfile({
  firstName: 'Jane',
  lastName: 'Smith'
});

// Add address
await addAddress({
  fullName: 'Jane Smith',
  phone: '9876543210',
  street: '123 Street',
  city: 'Bangalore',
  state: 'Karnataka',
  pincode: '560001',
  isDefault: true
});

// Fetch orders
await fetchOrders();

// Cancel order
await cancelOrder('order-id');
\`\`\`

### Admin Store
\`\`\`typescript
import { useAdminStore } from '@/store/admin';

const {
  dashboard,
  orders,
  fetchDashboard,
  fetchAllOrders,
  updateOrderStatus
} = useAdminStore();

// Fetch dashboard
await fetchDashboard();

// Fetch all orders
await fetchAllOrders();

// Update order status
await updateOrderStatus('order-id', 'Shipped');
\`\`\`

## Database Migration Guide

The current setup uses an in-memory database. To migrate to a real database:

### Option 1: PostgreSQL (Recommended)
1. Install Prisma: `npm install @prisma/client`
2. Create schema in `prisma/schema.prisma`
3. Replace `lib/db/memory.ts` with Prisma queries

### Option 2: MongoDB
1. Install MongoDB driver
2. Use MongoDB Atlas for hosting
3. Implement similar DB operations with MongoDB methods

### Option 3: Firebase
1. Use Firebase Realtime Database
2. Implement auth with Firebase Authentication
3. Update API routes accordingly

## Security Checklist

- [ ] Change `JWT_SECRET` in production
- [ ] Use HTTPS in production
- [ ] Add rate limiting to APIs
- [ ] Implement CSRF protection
- [ ] Add input validation on frontend
- [ ] Sanitize database inputs
- [ ] Use secure password hashing (bcrypt)
- [ ] Add 2FA for accounts
- [ ] Implement refresh tokens
- [ ] Add audit logging

## Testing the Backend

### Manual Testing with cURL

1. **Register a new user:**
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "password": "Test123456!",
    "firstName": "Test",
    "lastName": "User",
    "phone": "9876543210"
  }'
\`\`\`

2. **Login:**
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "password": "Test123456!"
  }'
\`\`\`

3. **Add to cart:**
\`\`\`bash
curl -X POST http://localhost:3000/api/cart \\
  -H "Content-Type: application/json" \\
  -H "Cookie: auth-token=YOUR_TOKEN" \\
  -d '{
    "productId": "aero-magsafe-case",
    "quantity": 1
  }'
\`\`\`

## Next Steps for Frontend

See `FRONTEND_IMPLEMENTATION_PROMPT.md` for detailed instructions on:
- Connecting UI components to the backend
- Implementing login/register pages
- Building cart functionality
- Creating checkout flow
- Building customer dashboard
- Building admin panel
