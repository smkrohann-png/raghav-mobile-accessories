import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db/memory";

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const url = new URL(req.url);
  const range = url.searchParams.get("range") || "all";
  const now = new Date();
  const start = new Date(now);
  if (range === "monthly") start.setMonth(now.getMonth() - 1);
  if (range === "quarterly") start.setMonth(now.getMonth() - 3);
  if (range === "yearly") start.setFullYear(now.getFullYear() - 1);

  const allOrders = await db.getAllOrders();
  const orders = allOrders.filter((order) => range === "all" || new Date(order.date) >= start);
  const rows = [
    ["Order ID", "Customer", "Email", "Phone", "Date", "Amount", "Status", "Payment", "Address", "Products"],
    ...orders.map((order) => [
      order.id,
      order.customerName || order.customer,
      order.customerEmail || "",
      order.phone,
      order.date,
      String(order.amount),
      order.status,
      order.paymentMethod,
      order.address,
      order.products.map((product) => product.name).join(" | "),
    ]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="raghav-orders-${range}.csv"`,
    },
  });
}
