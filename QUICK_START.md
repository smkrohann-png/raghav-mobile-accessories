# Quick Start Guide

## 1. Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:3000
```

## 2. Test the Backend

### Test with cURL

**Register a new user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!",
    "firstName": "Test",
    "lastName": "User",
    "phone": "9876543210"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!"
  }' \
  -c cookies.txt
```

**Get user info:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -b cookies.txt
```

**Add to cart:**
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "productId": "aero-magsafe-case",
    "quantity": 1
  }'
```

**Get cart:**
```bash
curl -X GET http://localhost:3000/api/cart \
  -b cookies.txt
```

## 3. Frontend Implementation Examples

### Example 1: Login Component

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login, error, isLoading } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      router.push('/profile');
    } catch (err) {
      console.error('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register('email')}
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-lg"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <input
          {...register('password')}
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg disabled:opacity-50"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Example 2: Add to Cart

```typescript
'use client';

import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AddToCartButtonProps {
  productId: string;
  productName: string;
}

export function AddToCartButton({ productId, productName }: AddToCartButtonProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { addToCart, isLoading, error } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [success, setSuccess] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      await addToCart(productId, quantity);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Add to cart failed');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
          className="w-16 px-2 py-1 border rounded"
        />
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="px-4 py-2 bg-orange-600 text-white rounded disabled:opacity-50"
        >
          {isLoading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">✓ Added to cart!</p>}
    </div>
  );
}
```

### Example 3: Cart Page

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const {
    cart,
    fetchCart,
    removeFromCart,
    updateQuantity,
    isLoading,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated]);

  if (isLoading) return <div>Loading cart...</div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Your cart is empty</p>
        <button
          onClick={() => router.push('/products')}
          className="px-4 py-2 bg-orange-600 text-white rounded"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="col-span-2">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart ({getTotalItems()} items)</h1>

        {cart.items.map((item) => (
          <div key={item.productId} className="flex gap-4 border-b pb-4 mb-4">
            <div className="flex-1">
              <h3 className="font-semibold">{item.product?.name}</h3>
              <p className="text-gray-600">{formatCurrency(item.product?.price || 0)}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="px-2 py-1 border rounded"
              >
                -
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="px-2 py-1 border rounded"
              >
                +
              </button>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                {formatCurrency((item.product?.price || 0) * item.quantity)}
              </p>
              <button
                onClick={() => removeFromCart(item.productId)}
                className="text-red-600 text-sm mt-1"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="border rounded-lg p-6 h-fit">
        <h2 className="font-bold mb-4">Order Summary</h2>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(getTotalPrice())}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>{formatCurrency(100)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>{formatCurrency(getTotalPrice() * 0.18)}</span>
          </div>
        </div>

        <div className="border-t pt-2 mb-4">
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>{formatCurrency(getTotalPrice() + 100 + getTotalPrice() * 0.18)}</span>
          </div>
        </div>

        <button
          onClick={() => router.push('/checkout')}
          className="w-full px-4 py-2 bg-orange-600 text-white rounded font-semibold"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
```

### Example 4: Checkout Flow

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { useProfileStore } from '@/store/profile';
import axios from 'axios';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { cart, getTotalPrice } = useCartStore();
  const { addresses, fetchAddresses } = useProfileStore();
  const [step, setStep] = useState<'address' | 'payment' | 'review'>('address');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!cart || cart.items.length === 0) {
      router.push('/cart');
      return;
    }
    fetchAddresses();
  }, [isAuthenticated]);

  const handleCreateOrder = async () => {
    if (!selectedAddressId) {
      setError('Please select an address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.post('/api/checkout', {
        addressId: selectedAddressId,
        paymentMethod,
      });

      // Redirect to success page
      router.push(`/checkout/success/${response.data.order.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !cart) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex gap-4 mb-8">
        {['address', 'payment', 'review'].map((s, i) => (
          <div
            key={s}
            className={`flex-1 py-2 px-4 text-center rounded ${
              s === step
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200'
            }`}
          >
            Step {i + 1}: {s.charAt(0).toUpperCase() + s.slice(1)}
          </div>
        ))}
      </div>

      {step === 'address' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Select Shipping Address</h2>
          <div className="space-y-2 mb-6">
            {addresses.map((addr) => (
              <label key={addr.id} className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value={addr.id}
                  checked={selectedAddressId === addr.id}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <p className="font-semibold">{addr.fullName}</p>
                  <p className="text-sm text-gray-600">
                    {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  {addr.isDefault && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Default</span>}
                </div>
              </label>
            ))}
          </div>
          <button
            onClick={() => setStep('payment')}
            disabled={!selectedAddressId}
            className="px-6 py-2 bg-orange-600 text-white rounded disabled:opacity-50"
          >
            Next: Payment
          </button>
        </div>
      )}

      {step === 'payment' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Select Payment Method</h2>
          <div className="space-y-2 mb-6">
            {['Cash On Delivery', 'Credit Card', 'UPI'].map((method) => (
              <label key={method} className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <span>{method}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setStep('address')}
              className="px-6 py-2 border border-gray-300 rounded"
            >
              Back
            </button>
            <button
              onClick={() => setStep('review')}
              className="px-6 py-2 bg-orange-600 text-white rounded"
            >
              Review Order
            </button>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Review Order</h2>

          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2">
              <h3 className="font-bold mb-4">Order Items</h3>
              {cart.items.map((item) => (
                <div key={item.productId} className="flex justify-between border-b pb-2 mb-2">
                  <span>{item.product?.name} x {item.quantity}</span>
                  <span>₹{(item.product?.price || 0) * item.quantity}</span>
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-bold mb-4">Summary</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Address:</strong> {addresses.find(a => a.id === selectedAddressId)?.city}</p>
                <p><strong>Payment:</strong> {paymentMethod}</p>
                <p><strong>Total:</strong> ₹{getTotalPrice()}</p>
              </div>
            </div>
          </div>

          {error && <p className="text-red-600 mt-4">{error}</p>}

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setStep('payment')}
              className="px-6 py-2 border border-gray-300 rounded"
            >
              Back
            </button>
            <button
              onClick={handleCreateOrder}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

## 4. Using Zustand Stores in Components

### Pattern: Fetch on Mount

```typescript
'use client';

import { useEffect } from 'react';
import { useProfileStore } from '@/store/profile';

export default function ProfilePage() {
  const { profile, addresses, fetchProfile, isLoading } = useProfileStore();

  useEffect(() => {
    fetchProfile();
  }, []); // Empty dependency array = run once on mount

  if (isLoading) return <div>Loading profile...</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div>
      <h1>{profile.firstName} {profile.lastName}</h1>
      <p>Email: {profile.email}</p>
      <p>Phone: {profile.phone}</p>

      <h2>Addresses</h2>
      {addresses.map(addr => (
        <div key={addr.id}>
          <p>{addr.fullName}</p>
          <p>{addr.street}, {addr.city}</p>
        </div>
      ))}
    </div>
  );
}
```

## 5. Environment Setup

Create `.env.local`:
```env
JWT_SECRET=your-super-secret-key-should-be-random
NODE_ENV=development
```

## 6. Useful Resources

- **Zustand Docs:** https://github.com/pmndrs/zustand
- **React Hook Form:** https://react-hook-form.com/
- **Zod Validation:** https://zod.dev/
- **Next.js API Routes:** https://nextjs.org/docs/pages/building-your-application/routing/api-routes
- **Tailwind CSS:** https://tailwindcss.com/

## 7. Next Steps

1. ✅ Backend is ready - All API endpoints working
2. ⏳ Create Login/Register pages
3. ⏳ Implement Cart UI
4. ⏳ Build Checkout flow
5. ⏳ Create Customer Dashboard
6. ⏳ Build Admin Panel

---

**Happy coding! 🚀**
