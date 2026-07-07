# Production Handoff

## Code Ready In This Repo

- Real cart, checkout, order tracking and admin order updates are connected to API routes.
- Razorpay order creation and signature verification run server-side.
- Customers see order/payment/status messages in `/orders`.
- Admin can login at `/admin`, view live orders and push customer-visible status messages.
- Local file persistence is enabled at `.data/raghav-store.json` for handoff/demo deployments.

## Outside VS Code Steps

1. Create Razorpay account, complete KYC, and copy live keys.
2. Create `.env.local` from `.env.example`.
3. Set a long `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `NEXT_PUBLIC_RAZORPAY_KEY_ID`.
4. Deploy to Vercel/hosting with the same environment variables.
5. Add your production domain in Razorpay dashboard and run one small live payment test.
6. For serious production traffic, move from file DB to hosted PostgreSQL/MongoDB/Supabase. Current APIs are isolated behind `lib/db/memory.ts`, so migration is localized.

## Final Checks Before Launch

- Run `npm run build`.
- Login once with admin credentials so the admin account is created.
- Register a customer, add a product, place one COD order, then update it from admin.
- Place one Razorpay test order and confirm `/orders` shows `Payment Success`.
