# 📌 Quick Reference Card

## 🔐 Credentials (KEEP SAFE)

```
ADMIN LOGIN:
Email:    admin@raghav.com
Password: Admin@123456
```

---

## 🚀 Quick Commands

### Start Project
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Open in Browser
```
http://localhost:3000
```

---

## 🎯 URLs Cheat Sheet

### Customer Pages
| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Login | http://localhost:3000/login |
| Register | http://localhost:3000/register |
| Products | http://localhost:3000/products |
| Cart | http://localhost:3000/cart |
| Checkout | http://localhost:3000/checkout |
| Profile | http://localhost:3000/profile |

### Admin Pages
| Page | URL |
|------|-----|
| Admin Dashboard | http://localhost:3000/admin/dashboard |
| Orders Management | http://localhost:3000/admin/orders |
| User Statistics | http://localhost:3000/admin/users |

---

## ✅ Testing Checklist

### Customer Flow
- [ ] Register new account
- [ ] Login with account
- [ ] Browse products
- [ ] Add to cart
- [ ] View cart
- [ ] Checkout
- [ ] Place order
- [ ] View order in profile

### Admin Flow
- [ ] Login as admin
- [ ] View dashboard
- [ ] View all orders
- [ ] Update order status
- [ ] View user stats

---

## 📝 Create Test Account

```
First name: Test
Last name: User
Email: test@example.com
Phone: 9876543210
Password: Test@1234
```

---

## 🔑 Password Requirements

Minimum:
- 8 characters
- Uppercase letter (A-Z)
- Lowercase letter (a-z)  
- Number (0-9)

**Valid Example**: `Admin@123`

---

## 🛠️ Important Files to Know

```
Configuration:
- package.json (dependencies)
- tsconfig.json (TypeScript)
- next.config.ts (Next.js)

API Routes:
/app/api/auth/         ← Login/Register
/app/api/cart/         ← Shopping cart
/app/api/checkout/     ← Checkout
/app/api/orders/       ← Orders
/app/api/admin/        ← Admin features

State Management:
/store/auth.ts         ← Auth state
/store/cart.ts         ← Cart state
/store/profile.ts      ← Profile state
/store/admin.ts        ← Admin state

Database:
/lib/db/memory.ts      ← Database logic
/lib/auth.ts           ← JWT & hashing
```

---

## 🚨 Common Errors

| Error | Solution |
|-------|----------|
| `Cannot find module` | Run `npm install` |
| `Port 3000 in use` | Kill process: `lsof -ti:3000 \| xargs kill -9` |
| `JWT_SECRET not set` | Create `.env` file with `JWT_SECRET=something` |
| `Can't add to cart` | Make sure logged in first |
| `Admin button not showing` | Log in with admin account |

---

## 📊 API Response Codes

```
200  ✅ Success
201  ✅ Created (for POST)
400  ❌ Bad request (check input)
401  ❌ Unauthorized (login first)
403  ❌ Forbidden (admin only)
404  ❌ Not found
409  ❌ Conflict (duplicate email)
500  ❌ Server error
```

---

## 🎨 Branding Colors

| Use | Color | Hex |
|-----|-------|-----|
| Primary | Orange | `#f97316` |
| Dark | Navy | `#111827` |
| Success | Green | `#10b981` |
| Error | Red | `#ef4444` |
| Warning | Yellow | `#f59e0b` |

---

## 📱 Mobile Testing

- Desktop: ✅ Responsive
- Tablet: ✅ Responsive
- Mobile: ✅ Responsive

Test in Chrome DevTools → F12 → Toggle device toolbar

---

## 🔄 Common Tasks

### Add New Admin User
1. Register normally
2. Open database file: `/lib/db/memory.ts`
3. Find the user in `.data/raghav-store.json`
4. Change `"role": "customer"` to `"role": "admin"`
5. Restart server

### Change Product Prices
1. Open `/data/storefront.ts`
2. Update `price` field
3. Restart server

### Add New Product
1. Open `/data/storefront.ts`
2. Add new product object
3. Include: id, name, description, price, image, category
4. Restart server

### Change Shipping Amount
1. Open `/app/cart/page.tsx`
2. Find: `const delivery = subtotal > 0 && subtotal < 3000 ? 99 : 0;`
3. Change `99` to desired amount
4. Change `3000` to minimum free shipping amount

---

## 🚀 Deployment Steps

1. Update JWT_SECRET in `.env`
2. Change database from in-memory to PostgreSQL/MongoDB
3. Set up payment gateway (Razorpay)
4. Configure email service
5. Run `npm run build`
6. Deploy to hosting (Vercel, AWS, DigitalOcean, etc.)

---

## 📞 Help Resources

- **API Docs**: `BACKEND_SETUP.md`
- **Frontend Guide**: `FRONTEND_MANUAL_PROMPT.md`
- **Status**: `PROJECT_STATUS.md`
- **Quick Start**: `QUICK_START.md`
- **Full Handover**: `CLIENT_HANDOVER_GUIDE.md`

---

## 💾 Database

**Current**: In-memory (data lost on restart)
**Production**: Use PostgreSQL or MongoDB
**Backup Plan**: Database snapshot saved to `.data/raghav-store.json`

---

## 🔒 Security Before Production

- [ ] Change `JWT_SECRET`
- [ ] Upgrade password hashing to bcrypt
- [ ] Enable HTTPS
- [ ] Configure CORS
- [ ] Set secure cookie flags
- [ ] Hide sensitive data
- [ ] Rate limiting
- [ ] Input validation

---

## 📈 Monitoring

After deployment, monitor:
- Server uptime
- API response times
- Error rates
- User registrations
- Order volume
- Payment gateway status

---

## 📋 Order Status Flow

```
pending 
   ↓
confirmed 
   ↓
shipped 
   ↓
delivered ✅

OR

cancelled ❌
(only from pending/confirmed)
```

---

**Print this card and keep it handy!** 🚀

For detailed info, read the full `CLIENT_HANDOVER_GUIDE.md`
