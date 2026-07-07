export type Review = {
  id?: string;
  name: string;
  rating: number;
  product: string;
  text: string;
  status: "Approved" | "Pending" | "Rejected";
  createdAt?: string;
};

export const approvedReviews: Review[] = [
  {
    name: "Aarav Mehta",
    rating: 5,
    product: "Aero MagSafe Case",
    text: "Fit exact hai, buttons crisp hain aur case premium feel deta hai.",
    status: "Approved",
  },
  {
    name: "Nisha Rao",
    rating: 5,
    product: "CrystalGuard Pro",
    text: "Screen guard tray se installation kaafi easy ho gaya.",
    status: "Approved",
  },
  {
    name: "Kabir Sethi",
    rating: 4,
    product: "Nova 65W GaN Charger",
    text: "Compact charger hai aur phone fast charge hota hai.",
    status: "Approved",
  },
];

export const pendingReviews: Review[] = [
  {
    name: "Demo Customer",
    rating: 5,
    product: "VoltPack 10000",
    text: "Power bank travel ke liye practical hai. Admin approval ke baad show hoga.",
    status: "Pending",
  },
];
