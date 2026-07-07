# 🎯 MANUAL FRONTEND IMPLEMENTATION PROMPT

## Your Task

Your backend is 100% complete with all authentication, cart, checkout, and admin features. Now **you need to implement the frontend** by connecting your UI components to the backend API and stores.

---

## Phase 1: Authentication (DO THIS FIRST) ⚡

### Task 1.1: Update Login Page

**File:** `/app/login/page.tsx`

**What to do:**
1. Remove the static `AuthPanel` component or modify it
2. Create a form with email and password fields
3. Import `useAuthStore` from `'@/store/auth'`
4. On form submission, call `login(email, password)`
5. On success, redirect to `/profile`
6. Display error messages if login fails
7. Show loading spinner during submission

**Key Points:**
- Use React Hook Form for form management
- Use Zod for validation
- Handle errors from the store
- User should be redirected automatically if already logged in

### Task 1.2: Update Register Page

**File:** `/app/register/page.tsx`

**What to do:**
1. Create a form with: email, password, confirmPassword, firstName, lastName, phone
2. Import `useAuthStore`
3. Validate:
   - Email format
   - Password strength (8+ chars, uppercase, lowercase, number)
   - Passwords match
   - Phone is 10 digits
4. Call `register(email, password, firstName, lastName, phone)`
5. Show password strength indicator
6. Display validation errors
7. Redirect to login on success

**Validation Rules:**
- Email: Valid email format
- Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number
- Phone: Exactly 10 digits
- First/Last Name: Non-empty

### Task 1.3: Update Forgot Password Page

**File:** `/app/forgot-password/page.tsx`

**Note:** This will require backend OTP generation. For now:
1. Show email input
2. Display message: "Feature coming soon - contact support"
3. Link back to login

---

## Phase 2: Shopping (DO THIS SECOND) ⚡

### Task 2.1: Update ProductCard Component

**File:** `/components/storefront/ProductCard.tsx`

**What to do:**
1. Add an "Add to Cart" button (or update existing one)
2. Show quantity selector (input or +/- buttons)
3. Import `useAuthStore` and `useCartStore`
4. On button click:
   - Check if user is logged in
   - If not, redirect to `/login`
   - If yes, call `addToCart(productId, quantity)`
5. Show loading state while adding
6. Show success/error toast message
7. Disable button if out of stock

**Key Points:**
- Check `useAuthStore().isAuthenticated`
- Handle loading state from `useCartStore().isLoading`
- Show quantity selector before adding

### Task 2.2: Create Cart Page

**File:** `/app/cart/page.tsx`

**What to do:**
1. On component mount, fetch cart using `useCartStore().fetchCart()`
2. Display all cart items in a table/list showing:
   - Product name and image
   - Price per unit
   - Quantity with +/- buttons
   - Subtotal
   - Remove button
3. Show cart summary with:
   - Subtotal
   - Shipping cost (₹100 fixed)
   - Tax (18% of subtotal)
   - Total
4. Add "Continue Shopping" button → `/products`
5. Add "Checkout" button → `/checkout`
6. Show empty cart message if no items
7. Require login (redirect to `/login` if not authenticated)

**Implementation:**
- Use `useCartStore()` to get cart data
- Use `updateQuantity(productId, newQty)` for +/- buttons
- Use `removeFromCart(productId)` for delete
- Use `getTotalPrice()` for calculations

### Task 2.3: Create Checkout Page (Multi-Step)

**File:** `/app/checkout/page.tsx`

**Step 1: Select Shipping Address**
- Fetch user's addresses using `useProfileStore().fetchAddresses()`
- Display all addresses as radio buttons
- Show address details (name, phone, full address)
- Mark default address
- Add "Add New Address" button (open modal)
- Button to proceed to payment method

**Step 2: Select Payment Method**
- Radio buttons for:
  - Cash On Delivery (default)
  - Credit/Debit Card (coming soon)
  - UPI (coming soon)
- Display selected method
- Button to proceed to review

**Step 3: Review & Place Order**
- Show cart items summary
- Show selected address
- Show selected payment method
- Show order total
- "Place Order" button
- Back button to previous step

**On Submit:**
- Call checkout API: `POST /api/checkout`
- Pass: `{ addressId, paymentMethod }`
- On success: Redirect to `/checkout/success?orderId=XXX`
- On error: Show error message

**Implementation Notes:**
- Use multiple states for step management
- Call `useProfileStore().fetchAddresses()` on mount
- Call `useCartStore().fetchCart()` to show items
- Address is required, payment method has default
- Handle loading state during order creation

### Task 2.4: Create Order Success Page

**File:** `/app/checkout/success/page.tsx` (or create as dynamic route)

**What to do:**
1. Show success message: "Order placed successfully!"
2. Show order ID
3. Display expected delivery date
4. Show order tracking link
5. Add "View Order Details" button → `/orders/[orderId]`
6. Add "Continue Shopping" button → `/products`
7. Add "Track Order" button → `/orders`

---

## Phase 3: Customer Dashboard ⏳

### Task 3.1: Create Profile Page

**File:** `/app/profile/page.tsx`

**What to do:**
1. Fetch profile on mount using `useProfileStore().fetchProfile()`
2. Display user information:
   - Name (First + Last)
   - Email
   - Phone
   - Member since date
3. Add "Edit Profile" button → opens modal
4. Add "Change Password" button → opens modal
5. Add "Addresses" section (see 3.2)
6. Add "Orders" section (see 3.3)
7. Add "Logout" button
8. Show loading state while fetching

**Edit Profile Modal:**
- Form to update firstName, lastName, phone, email
- Call `updateProfile(data)`
- Show success message after update

**Change Password Modal:**
- Form with: currentPassword, newPassword, confirmNewPassword
- Validate passwords match
- Call `changePassword(currentPassword, newPassword)`
- Show success message

### Task 3.2: Create Addresses Section

**File:** Part of `/app/profile/page.tsx` or separate component

**What to do:**
1. Display all addresses in a list
2. Show default address with badge
3. For each address show:
   - Full name
   - Phone
   - Street, City, State, Pincode
   - Edit button
   - Delete button
4. Add "Add New Address" button
5. On delete, confirm before deleting

**Add/Edit Address Modal:**
- Form with fields:
  - fullName (required)
  - phone (required, 10 digits)
  - street (required)
  - city (required)
  - state (required)
  - pincode (required, 6 digits)
  - isDefault checkbox
- Call `addAddress(data)` for new
- Call `updateAddress(id, data)` for edit
- Show loading state
- Close modal on success

**Implementation:**
- Use `useProfileStore().addresses`
- Use `addAddress()`, `updateAddress()`, `deleteAddress()`

### Task 3.3: Create Orders Section

**File:** Part of `/app/profile/page.tsx` or separate component

**What to do:**
1. Display all user orders in a table showing:
   - Order ID
   - Date
   - Total amount
   - Status (with color badge)
   - View Details button
2. Sort by date (newest first)
3. Show empty state if no orders

**Order Detail Modal/Page:**
- Show order info:
  - Order ID
  - Date & time
  - Shipping address
  - Items (product name, quantity, price)
  - Total amount
  - Payment method
  - Order status
- Show status timeline:
  - Pending → Confirmed → Packed → Shipped → Delivered
  - Show current status highlighted
  - Show timestamps and messages
- Add "Cancel Order" button (if not shipped/delivered/cancelled)
  - Confirm before cancelling
  - Call `cancelOrder(orderId)`

**Implementation:**
- Use `useProfileStore().orders`
- Use `getOrderDetail(orderId)` for details
- Use `cancelOrder(orderId)` to cancel

---

## Phase 4: Admin Panel ⏳

### Task 4.1: Create Admin Dashboard

**File:** `/app/admin/page.tsx`

**Security Check:**
- Check if `useAuthStore().user?.role === 'admin'`
- Redirect to unauthorized page if not admin

**What to display:**
1. Dashboard KPI cards:
   - Total Orders
   - Total Revenue (₹)
   - Pending Orders (count)
   - Completed Orders (count)

2. Recent Orders table:
   - Order ID
   - Customer name
   - Amount
   - Status
   - Date
   - View Details button

3. Navigation links:
   - View All Orders
   - Manage Users
   - Settings

**Implementation:**
- Use `useAdminStore().fetchDashboard()`
- Display `dashboard.stats`
- Display recent orders from `orders` array

### Task 4.2: Create Admin Orders Page

**File:** `/app/admin/orders/page.tsx`

**What to do:**
1. Fetch all orders using `useAdminStore().fetchAllOrders()`
2. Display orders table with:
   - Order ID
   - Customer name/phone
   - Amount
   - Status
   - Date
   - Action buttons (View, Edit Status)

3. Add filters:
   - By status (dropdown)
   - By date range (from/to)
   - By amount range
   - Search by order ID or customer name

4. Add pagination if many orders

**Order Status Update Modal:**
- Dropdown with status options:
  - Pending
  - Confirmed
  - Packed
  - Shipped
  - Out For Delivery
  - Delivered
  - Cancelled
- Call `updateOrderStatus(orderId, newStatus)`
- Show order timeline in modal

**Implementation:**
- Use `useAdminStore().orders`
- Use `updateOrderStatus(id, status)`
- Implement filters with useState

### Task 4.3: Create Admin Users Page (Optional)

**File:** `/app/admin/users/page.tsx`

**What to display:**
- Total customers count
- Total orders count
- Customer list with:
  - Name, Email, Phone
  - Total orders
  - Total spent
  - Last order date
- View customer details option

---

## Phase 5: General UI Enhancements

### Task 5.1: Update Navbar

**File:** `/components/layout/Navbar.tsx`

**What to add:**
1. Display cart item count from `useCartStore().getTotalItems()`
2. Show user status:
   - If logged in: Show user name + dropdown menu
   - If not logged in: Show "Login" and "Register" buttons
3. User dropdown menu should have:
   - Profile link
   - Orders link
   - Logout button
   - If admin: Admin panel link
4. Cart icon with count badge

### Task 5.2: Create Protected Route Component

**File:** Create `/components/auth/ProtectedRoute.tsx`

**Functionality:**
- Check if user is authenticated
- Redirect to login if not
- Optional: Check if user is admin
- Redirect to unauthorized page if not admin

**Usage:**
```typescript
<ProtectedRoute requireAdmin={true}>
  <AdminPage />
</ProtectedRoute>
```

### Task 5.3: Create Toast Notification System

**File:** Create `/components/ui/Toast.tsx` and `/store/toast.ts`

**Features:**
- Show success messages: "Added to cart", "Profile updated"
- Show error messages from API errors
- Auto-dismiss after 3 seconds
- Support for different types: success, error, info, warning
- Can have multiple toasts

### Task 5.4: Create Loading Skeletons

**Files:** Create skeleton components in `/components/ui/Skeletons/`

**Skeletons needed:**
- ProductCardSkeleton
- CartItemSkeleton
- AddressSkeleton
- OrderSkeleton

---

## Implementation Checklist

### Phase 1: Auth
- [ ] Login page connected to auth store
- [ ] Register page with validation
- [ ] Forgot password page (placeholder)
- [ ] Error messages display
- [ ] Redirect on success
- [ ] Loading states show

### Phase 2: Shopping
- [ ] ProductCard has Add to Cart button
- [ ] Cart page displays items
- [ ] Cart quantities can be updated
- [ ] Cart summary calculates totals
- [ ] Checkout page has 3 steps
- [ ] Address selection works
- [ ] Order creation works
- [ ] Success page shows after checkout

### Phase 3: Profile
- [ ] Profile page displays user info
- [ ] Edit profile modal works
- [ ] Change password modal works
- [ ] Addresses section displays all
- [ ] Can add/edit/delete addresses
- [ ] Orders section displays all
- [ ] Can view order details
- [ ] Can cancel orders (if allowed)

### Phase 4: Admin
- [ ] Admin check before showing panel
- [ ] Dashboard shows stats
- [ ] Orders table displays all
- [ ] Can filter orders
- [ ] Can update order status
- [ ] Status update reflects in table

### Phase 5: UI
- [ ] Navbar shows cart count
- [ ] Navbar shows user menu
- [ ] Protected routes work
- [ ] Toast notifications work
- [ ] Loading skeletons display
- [ ] Error boundaries work
- [ ] Mobile responsive

---

## Testing Scenarios

### Complete User Journey
1. Register new account
2. Login
3. Browse products
4. Add item to cart
5. Update quantity
6. Go to checkout
7. Add new address
8. Select payment method
9. Place order
10. View order in profile
11. Check order status

### Admin Journey
1. Login as admin
2. View dashboard
3. View all orders
4. Filter orders
5. Update order status
6. See changes reflected

### Edge Cases
- Register with existing email (should fail)
- Login with wrong password (should fail)
- Add out of stock item (should fail)
- Checkout without address (should fail)
- Remove all items from cart
- Cancel order as customer
- Update order that doesn't exist

---

## API Integration Reminders

For each feature, remember to:
1. ✅ Import the correct Zustand store
2. ✅ Fetch data on component mount (useEffect)
3. ✅ Handle loading state from store
4. ✅ Handle error state from store
5. ✅ Show loading spinners/skeletons
6. ✅ Display error messages
7. ✅ Show success messages
8. ✅ Redirect on success (if needed)
9. ✅ Disable buttons during loading
10. ✅ Validate form inputs before submit

---

## Styling Notes

- Use Tailwind CSS (already configured)
- Primary color: Orange (existing in your design)
- Secondary color: Slate/Gray
- Status colors:
  - Success: Green
  - Error: Red
  - Warning: Yellow
  - Info: Blue
  - Pending: Orange
- Ensure mobile responsiveness
- Use existing components from `/components/ui/`

---

## File Structure After Completion

```
app/
├── login/page.tsx           ← Connect form to auth store
├── register/page.tsx        ← Connect form to auth store
├── forgot-password/page.tsx ← Placeholder for now
├── profile/page.tsx         ← NEW: User dashboard
├── cart/page.tsx            ← NEW: Cart display
├── checkout/
│   ├── page.tsx             ← NEW: 3-step checkout
│   ├── success/
│   │   └── page.tsx         ← NEW: Order success
│   └── failed/page.tsx       ← Already exists
├── orders/
│   └── [id]/page.tsx        ← NEW: Order details
└── admin/
    ├── page.tsx             ← NEW: Admin dashboard
    ├── orders/page.tsx      ← NEW: Orders management
    └── users/page.tsx       ← NEW: Users management (optional)

components/
├── ui/
│   ├── Toast.tsx            ← NEW: Toast notifications
│   └── Skeletons/           ← NEW: Loading skeletons
└── auth/
    ├── ProtectedRoute.tsx   ← NEW: Route protection
```

---

## Time Estimates

- Auth pages: 2-3 hours
- Shopping flow: 4-5 hours
- Customer dashboard: 3-4 hours
- Admin panel: 3-4 hours
- UI enhancements: 2-3 hours
- Testing & refinement: 2-3 hours

**Total: 16-22 hours of work**

---

## Common Mistakes to Avoid

❌ Don't forget to:
- Check authentication before rendering protected content
- Call fetchCart/fetchProfile on component mount
- Handle loading states from stores
- Display error messages to users
- Redirect after successful actions
- Validate form inputs

❌ Don't:
- Make API calls directly instead of using stores
- Forget useEffect for fetching data
- Ignore error states
- Skip loading indicators
- Test only on desktop (test mobile too)

---

## Next Steps

1. **Start with Login/Register** - These are foundational
2. **Then Cart & Checkout** - Core shopping functionality
3. **Then Dashboard** - Customer features
4. **Then Admin Panel** - Administrative features
5. **Finally Polish** - UI enhancements and testing

---

## Need Help?

Refer to:
1. `QUICK_START.md` - Code examples for common patterns
2. `BACKEND_SETUP.md` - API documentation
3. Store files in `/store/` - See what data/functions available
4. Component examples in `/components/` - Learn existing patterns

---

**Ready to build the frontend? Let's go! 🚀**

Start with `QUICK_START.md` for code examples, then begin with login page.
