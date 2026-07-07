# Frontend Implementation - Complete Guide

## Overview
Your backend is ready! Now you need to connect your UI components to the API endpoints and implement the user-facing flows.

## Phase 1: Authentication Pages (Priority 1)

### 1.1 Login Page (`/app/login/page.tsx`)

**Requirements:**
- Email and password input fields
- Form validation using react-hook-form + zod
- Submit button that calls `useAuthStore().login()`
- Error display for failed logins
- Loading state during login
- Success redirect to `/profile`
- Link to register page
- Link to forgot password

**Key Points:**
- Use `useAuthStore()` from `@/store/auth`
- On successful login, redirect to `/profile`
- Display error messages from API
- Show loading spinner during submission

**Implementation Checklist:**
- [ ] Create form with email and password fields
- [ ] Add form validation with Zod
- [ ] Connect to auth store's login method
- [ ] Handle errors and display them
- [ ] Add redirect after successful login
- [ ] Style consistently with your design

### 1.2 Register Page (`/app/register/page.tsx`)

**Requirements:**
- Email, password, firstName, lastName, phone inputs
- Password strength indicator
- Confirm password field
- Form validation
- Phone number formatting
- Submit to `useAuthStore().register()`
- Error handling
- Success redirect to profile

**Key Points:**
- Password must meet requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- Phone number must be 10 digits
- Email must be unique

**Implementation Checklist:**
- [ ] Create comprehensive form
- [ ] Add password strength validator
- [ ] Format phone number automatically
- [ ] Validate all fields
- [ ] Connect to register API
- [ ] Show success message
- [ ] Redirect to login or auto-login

### 1.3 Forgot Password Page

**Requirements:**
- Email input field
- Submit button
- Success message after submission
- Link to login
- Link to register

**Note:** Backend endpoint needs to be created for password reset. This requires:
- Email sending functionality (will need to add)
- OTP generation
- Reset link handling

---

## Phase 2: Cart & Checkout (Priority 1)

### 2.1 Add to Cart Button

**Where:** ProductCard.tsx, Product Detail Page

**Requirements:**
- Add "Add to Cart" button to products
- Show loading state during request
- Display success/error toast
- Update cart count in navbar
- Allow quantity selection before adding

**Implementation:**
\`\`\`typescript
import { useCartStore } from '@/store/cart';

const { addToCart, isLoading } = useCartStore();

const handleAddToCart = async (productId: string, quantity: number) => {
  try {
    await addToCart(productId, quantity);
    // Show success toast
  } catch (error) {
    // Show error toast
  }
};
\`\`\`

**Implementation Checklist:**
- [ ] Add quantity selector to product card/detail
- [ ] Connect add to cart button to store
- [ ] Show loading spinner
- [ ] Display success/error notifications
- [ ] Update navbar cart count

### 2.2 Cart Page (`/app/cart/page.tsx`)

**Requirements:**
- Display all cart items with:
  - Product image and name
  - Price per unit
  - Quantity with +/- buttons
  - Subtotal per item
  - Delete button
- Cart summary showing:
  - Subtotal
  - Shipping (static for now)
  - Tax (calculated)
  - Total
- "Continue Shopping" button
- "Checkout" button (redirect to checkout page)
- Empty cart message
- Load cart on page mount

**Key Stores:**
- `useCartStore()` for cart data and operations
- `useAuthStore()` to check if logged in

**Implementation Checklist:**
- [ ] Fetch cart on component mount
- [ ] Display all items with product info
- [ ] Implement quantity updater
- [ ] Implement remove item functionality
- [ ] Calculate and display totals
- [ ] Show empty state
- [ ] Add checkout button
- [ ] Require login before checkout

### 2.3 Checkout Page (`/app/checkout/page.tsx`)

**Requirements:**
- Three sections/steps:
  1. **Shipping Address Selection/Creation:**
     - List existing addresses
     - Radio button to select default
     - "Add New Address" button (modal or new section)
     - Show selected address
  
  2. **Payment Method Selection:**
     - Radio buttons for:
       - Cash On Delivery
       - Credit/Debit Card
       - UPI
       - Razorpay (for future)
  
  3. **Order Review:**
     - Cart items preview
     - Shipping address
     - Payment method
     - Order total
     - "Place Order" button

**Key Requirements:**
- Only accessible if user is logged in
- Show error if cart is empty
- Validate address selection before checkout
- Show loading during order creation
- Redirect to success page after order creation
- Handle payment method (integrate later)

**Stores Required:**
- `useAuthStore()` - for user check
- `useCartStore()` - for cart items
- `useProfileStore()` - for addresses

**Implementation Checklist:**
- [ ] Create multi-step checkout flow
- [ ] Fetch user addresses from profile store
- [ ] Allow address selection
- [ ] Implement payment method selection
- [ ] Show order review
- [ ] Call checkout API
- [ ] Redirect to success/failure page
- [ ] Handle errors

---

## Phase 3: Customer Profile (Priority 2)

### 3.1 Profile Page (`/app/profile/page.tsx`)

**Requirements:**
- Display user information:
  - First Name, Last Name
  - Email
  - Phone
  - Member since date
- Edit profile button (modal/form)
- Change password button (modal/form)
- Addresses section (see 3.2)
- Orders section (see 3.3)
- Logout button

**Store:** `useProfileStore()`, `useAuthStore()`

**Implementation Checklist:**
- [ ] Fetch user profile on mount
- [ ] Display user information
- [ ] Create edit profile modal
- [ ] Create change password modal
- [ ] Add logout button
- [ ] Show loading states

### 3.2 Addresses Section

**Requirements:**
- List all saved addresses
- Show default address with badge
- Edit address button for each
- Delete address button for each
- "Add New Address" button
- Address form with:
  - Full Name
  - Phone
  - Street Address
  - City
  - State
  - Pincode
  - Set as default checkbox

**Stores:** `useProfileStore()`

**Implementation Checklist:**
- [ ] Fetch addresses on mount
- [ ] Display all addresses
- [ ] Create address form modal
- [ ] Implement add address
- [ ] Implement edit address
- [ ] Implement delete address
- [ ] Show/hide based on authentication

### 3.3 Orders Section

**Requirements:**
- Display all user orders in a table/list:
  - Order ID
  - Date
  - Total amount
  - Status (with badge color)
  - Order count
  - View details button

- Order detail modal/page showing:
  - Order items with quantities
  - Shipping address
  - Order status timeline
  - Tracking information (if shipped)
  - Cancel button (if cancellable)

**Stores:** `useProfileStore()`

**Implementation Checklist:**
- [ ] Fetch orders on mount
- [ ] Display orders list
- [ ] Add order status badge
- [ ] Create order detail view
- [ ] Show status timeline
- [ ] Implement cancel order
- [ ] Show order products

---

## Phase 4: Admin Panel (Priority 3)

### 4.1 Admin Dashboard (`/app/admin/page.tsx`)

**Requirements:**
- Only accessible to admin users (check `user.role === 'admin'`)
- Display KPIs:
  - Total Orders
  - Total Revenue
  - Pending Orders
  - Completed Orders
  - Average Order Value (calculated)

- Charts (optional, use chart library):
  - Revenue trend
  - Orders by status
  - Top selling products

- Recent orders table:
  - Order ID
  - Customer name
  - Amount
  - Status
  - Date
  - Action buttons

**Store:** `useAdminStore()`

**Implementation Checklist:**
- [ ] Check if user is admin
- [ ] Fetch dashboard data
- [ ] Display KPI cards
- [ ] Show recent orders
- [ ] Add order management access

### 4.2 Admin Orders Management (`/app/admin/orders/page.tsx`)

**Requirements:**
- Full orders list with filters:
  - By status
  - By date range
  - By customer
  - By amount range

- Columns:
  - Order ID
  - Customer
  - Phone
  - Amount
  - Status
  - Date

- Actions for each order:
  - View details
  - Update status (dropdown)
  - Print invoice (future)
  - Send SMS/Email (future)

- Order detail modal showing:
  - Customer info
  - Shipping address
  - Products ordered
  - Order status timeline
  - Status update dropdown
  - Save button

**Store:** `useAdminStore()`

**Implementation Checklist:**
- [ ] Fetch all orders
- [ ] Display orders table
- [ ] Implement filters
- [ ] Create order detail modal
- [ ] Implement status update
- [ ] Add loading/error states
- [ ] Pagination (if many orders)

### 4.3 Admin Users Management (`/app/admin/users/page.tsx`) - Optional

**Requirements:**
- List of customers with:
  - Customer ID
  - Name
  - Email
  - Phone
  - Total Orders
  - Total Spent
  - Registered Date
  - Last Order Date

- Search/filter customers
- View customer's orders
- View customer's addresses

---

## Phase 5: Additional Features (Priority 4)

### 5.1 Navbar Updates

**Requirements:**
- Display cart item count from `useCartStore().getTotalItems()`
- Display user name if logged in
- Show login/register links if not logged in
- Dropdown menu with:
  - Profile link
  - Orders link
  - Logout (if admin, also show admin panel)

**Implementation Checklist:**
- [ ] Get cart count from store
- [ ] Show user status
- [ ] Create user menu dropdown
- [ ] Add logout functionality

### 5.2 Protected Routes

**Requirements:**
- Create a ProtectedRoute component that:
  - Checks if user is authenticated
  - Redirects to login if not
  - Checks role for admin routes

**Implementation:**
\`\`\`typescript
// Create components/auth/ProtectedRoute.tsx
export function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <redirect to="/login" />;
  }
  
  if (requireAdmin && user?.role !== 'admin') {
    return <redirect to="/unauthorized" />;
  }
  
  return children;
}
\`\`\`

### 5.3 Error Handling & Toast Notifications

**Requirements:**
- Create reusable toast/notification component
- Show success messages for actions
- Show error messages from API
- Auto-dismiss after 3-5 seconds

**Implementation Checklist:**
- [ ] Create Toast component
- [ ] Add toast store in Zustand
- [ ] Show toasts on API errors
- [ ] Show toasts on success

### 5.4 Loading States & Skeletons

**Requirements:**
- Show skeleton loaders while fetching data
- Disable buttons during loading
- Show loading spinners

**Implementation Checklist:**
- [ ] Create skeleton components
- [ ] Add loading states to all async operations
- [ ] Disable form submission during loading

---

## Implementation Order

1. **Week 1:**
   - Login/Register pages
   - Cart functionality
   - Checkout flow
   - Basic navbar updates

2. **Week 2:**
   - Customer profile
   - Addresses management
   - Orders display and cancellation
   - Protected routes

3. **Week 3:**
   - Admin dashboard
   - Admin orders management
   - Admin user management
   - Toast notifications

4. **Week 4:**
   - Refinements
   - Bug fixes
   - UI/UX improvements
   - Testing

---

## Common Implementation Patterns

### Pattern 1: Fetch Data on Mount
\`\`\`typescript
'use client';
import { useEffect } from 'react';
import { useProfileStore } from '@/store/profile';

export default function ProfilePage() {
  const { profile, fetchProfile } = useProfileStore();
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  if (!profile) return <div>Loading...</div>;
  
  return <div>{profile.firstName}</div>;
}
\`\`\`

### Pattern 2: Form Submission
\`\`\`typescript
import { useAuthStore } from '@/store/auth';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const { login, isLoading } = useAuthStore();
  
  const onSubmit = async (data) => {
    await login(data.email, data.password);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      <input {...register('password')} type="password" />
      <button disabled={isLoading} type="submit">
        {isLoading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}
\`\`\`

### Pattern 3: Conditional Rendering
\`\`\`typescript
import { useAuthStore } from '@/store/auth';

export function ProtectedComponent() {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }
  
  if (user?.role !== 'admin') {
    return <p>Admin only</p>;
  }
  
  return <div>Admin content</div>;
}
\`\`\`

---

## API Integration Checklist

For each component, ensure:
- [ ] Store is imported and used correctly
- [ ] Data is fetched on mount (useEffect)
- [ ] Loading state is displayed
- [ ] Error messages are shown
- [ ] Forms use proper validation
- [ ] API calls are wrapped in try-catch
- [ ] Success/error toasts are shown
- [ ] Redirects happen after successful actions
- [ ] Unauthorized access is handled

---

## Testing Scenarios

Before marking complete, test:
1. **Login Flow:**
   - Valid credentials work
   - Invalid credentials show error
   - User is redirected to profile

2. **Cart Flow:**
   - Add item to cart (check Zustand store)
   - Update quantity
   - Remove item
   - Checkout only with address selected

3. **Profile Flow:**
   - Edit profile updates display
   - Change password works
   - Add address saves to list
   - View orders shows user's orders

4. **Admin Flow:**
   - Non-admin can't access admin pages
   - Dashboard shows correct stats
   - Can update order status
   - Orders list is filterable

---

## Styling Guidelines

- Use Tailwind CSS (already set up)
- Follow existing component patterns
- Ensure mobile responsiveness
- Use consistent color scheme:
  - Primary: Orange (from existing design)
  - Error: Red
  - Success: Green
  - Warning: Yellow
  - Info: Blue

---

## Environment & Deployment

### Before Going Live:
1. Change JWT_SECRET to a strong random value
2. Enable HTTPS in production
3. Set NODE_ENV=production
4. Update API base URLs if deploying to custom domain
5. Configure CORS if API is on different domain
6. Set up monitoring/logging
7. Enable backup/database persistence

### Vercel Deployment:
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

---

## Next Steps After Frontend Complete

1. **Payment Integration:**
   - Integrate Razorpay for online payments
   - Handle payment webhooks
   - Update order status based on payment

2. **Email Notifications:**
   - Send order confirmation emails
   - Send order status update emails
   - Send password reset emails

3. **SMS Notifications:**
   - Send OTP for phone verification
   - Send order updates via SMS
   - Integration with Twilio/AWS SNS

4. **Database Migration:**
   - Migrate from in-memory to real database
   - Set up backups
   - Add database indexing

5. **Analytics & Monitoring:**
   - Track user actions
   - Monitor API performance
   - Set up error tracking (Sentry)

---

## Important Notes

- ⚠️ In-memory database will lose data on server restart. Plan database migration.
- 🔒 Change JWT_SECRET before production
- 📱 Test on mobile devices
- 🧪 Write unit tests for critical flows
- 📊 Set up analytics tracking
- 🔔 Plan email/SMS integration
