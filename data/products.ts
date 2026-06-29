import { Product } from "@/types";

export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Spigen Ultra Hybrid Clear Case for iPhone 15 Pro",
    slug: "spigen-ultra-hybrid-iphone-15-pro",
    description: "Experience hybrid technology that packs advanced drop protection in a single layer. The Ultra Hybrid combines a shock-absorbing flexible bumper with a rigid back to maximize defensive features. The crystal clear back designed to preserve the original look of the phone without yellowing over time.",
    price: 1499,
    oldPrice: 1999,
    discount: 25,
    images: [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80"
    ],
    category: "covers",
    brand: "Spigen",
    rating: 4.8,
    reviewsCount: 142,
    reviews: [
      { id: "rev-1", userName: "Aniket Sharma", rating: 5, comment: "Absolutely crystal clear and fits like a glove. Worth every rupee!", date: "2026-06-15" },
      { id: "rev-2", userName: "Pooja Patel", rating: 4, comment: "Very sturdy case. Provides great protection, though buttons are a bit stiff initially.", date: "2026-06-10" }
    ],
    featured: true,
    bestSeller: true,
    newArrival: false,
    trending: true,
    stock: 50,
    colors: ["Clear", "Space Crystal", "Matte Black"],
    specifications: {
      Material: "Polycarbonate, TPU",
      "Drop Protection": "Military Grade Certified",
      Compatibility: "iPhone 15 Pro",
      Weight: "32g",
    }
  },
  {
    id: "prod-2",
    name: "Apple 20W USB-C Power Adapter",
    slug: "apple-20w-usbc-power-adapter",
    description: "The Apple 20W USB-C Power Adapter offers fast, efficient charging at home, in the office, or on the go. While the power adapter is compatible with any USB-C-enabled device, Apple recommends pairing it with the iPad Pro and iPad Air for optimal charging performance. You can also pair it with iPhone 8 or later to take advantage of the fast-charging feature.",
    price: 1699,
    oldPrice: 1900,
    discount: 10,
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=600&auto=format&fit=crop&q=80"
    ],
    category: "chargers",
    brand: "Apple",
    rating: 4.9,
    reviewsCount: 320,
    reviews: [
      { id: "rev-3", userName: "Rohit Verma", rating: 5, comment: "Charges my iPhone 14 Pro extremely fast. Original product.", date: "2026-06-20" }
    ],
    featured: true,
    bestSeller: false,
    newArrival: false,
    trending: true,
    stock: 120,
    colors: ["White"],
    specifications: {
      Wattage: "20W",
      "Port Type": "USB-C",
      Compatibility: "iPhone 8 or later, iPad Pro, iPad Air",
      Warranty: "1 Year Apple Warranty",
    }
  },
  {
    id: "prod-3",
    name: "boAt Airdopes 141 ANC Wireless Earbuds",
    slug: "boat-airdopes-141-anc",
    description: "Tune into your playlist and tune out the ambient noise with boAt Airdopes 141 ANC. Boasting up to 32dB Active Noise Cancellation, these earbuds deliver crystal-clear audio even in crowded places. Enjoy an aggregate playback time of up to 42 hours with the pocket-sized charging case.",
    price: 1799,
    oldPrice: 2990,
    discount: 40,
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
    ],
    category: "earbuds",
    brand: "boAt",
    rating: 4.5,
    reviewsCount: 980,
    reviews: [
      { id: "rev-4", userName: "Siddharth Sen", rating: 4, comment: "Great bass and decent ANC for this price range. Battery life is stellar.", date: "2026-06-18" }
    ],
    featured: true,
    bestSeller: true,
    newArrival: true,
    trending: false,
    stock: 85,
    colors: ["Active Black", "Gunmetal Grey", "Cider Cyan"],
    specifications: {
      "ANC Level": "Up to 32dB",
      "Playback Time": "Up to 42 Hours",
      "Driver Size": "10mm x 2",
      "Bluetooth Version": "v5.3",
      "IP Rating": "IPX5 Water Resistant",
    }
  },
  {
    id: "prod-4",
    name: "Ambrane 20000mAh 22.5W Fast Charging Power Bank",
    slug: "ambrane-20000mah-power-bank",
    description: "Ambrane Stylo 20K is a 20000mAh lithium-polymer power bank. It features 22.5W ultra-fast charging output. It is the perfect travel companion to keep your smartphones and tablets powered up throughout the day. Dual USB ports and one Type-C port allow charging three devices simultaneously.",
    price: 1499,
    oldPrice: 2499,
    discount: 40,
    images: [
      "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1605152276897-4f618f831968?w=600&auto=format&fit=crop&q=80"
    ],
    category: "power-banks",
    brand: "Ambrane",
    rating: 4.6,
    reviewsCount: 540,
    reviews: [
      { id: "rev-5", userName: "Meera Nair", rating: 5, comment: "Charges my phone multiple times. Fast charging works perfectly.", date: "2026-06-25" }
    ],
    featured: false,
    bestSeller: true,
    newArrival: false,
    trending: true,
    stock: 200,
    colors: ["Black", "Green", "Blue"],
    specifications: {
      Capacity: "20000 mAh",
      "Max Output": "22.5W Fast Charging",
      "Output Ports": "2 USB-A + 1 USB-C (PD)",
      "Input Ports": "Micro USB, Type-C",
      Weight: "360g",
    }
  },
  {
    id: "prod-5",
    name: "Noise Buds VS104 Max Wireless Earbuds",
    slug: "noise-buds-vs104-max",
    description: "Experience silence like never before with the Noise Buds VS104 Max. Featuring up to 25dB Active Noise Cancellation, these earbuds let you focus solely on your tunes. With up to 45 hours of playtime, Instacharge (10 min charge = 150 min playtime), and Bluetooth 5.3, stay connected seamlessly.",
    price: 1699,
    oldPrice: 3499,
    discount: 51,
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=600&auto=format&fit=crop&q=80"
    ],
    category: "earbuds",
    brand: "Noise",
    rating: 4.4,
    reviewsCount: 215,
    reviews: [
      { id: "rev-6", userName: "Aman Gupta", rating: 4, comment: "Super fast charging. Value for money earbuds.", date: "2026-06-22" }
    ],
    featured: false,
    bestSeller: false,
    newArrival: true,
    trending: true,
    stock: 60,
    colors: ["Jet Black", "Rose Gold", "Silver Grey"],
    specifications: {
      "ANC Level": "Up to 25dB",
      "Playback Time": "Up to 45 Hours",
      "Low Latency": "Up to 50ms",
      Instacharge: "10 mins = 150 mins play",
      Waterproof: "IPX5",
    }
  },
  {
    id: "prod-6",
    name: "Ambrane 3-in-1 Braided Charging Cable",
    slug: "ambrane-3in1-braided-cable",
    description: "A cable designed for ultimate compatibility. The Ambrane 3-in-1 cable features Type-C, Micro-USB, and Lightning connectors. Constructed with high-quality nylon braiding, this cable resists fraying and tangling, ensuring exceptional durability and 3A speed charging.",
    price: 299,
    oldPrice: 599,
    discount: 50,
    images: [
      "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80"
    ],
    category: "cables",
    brand: "Ambrane",
    rating: 4.7,
    reviewsCount: 1540,
    reviews: [
      { id: "rev-7", userName: "Karan Johar", rating: 5, comment: "Super convenient cable. Braiding is very premium and strong.", date: "2026-06-11" }
    ],
    featured: true,
    bestSeller: true,
    newArrival: false,
    trending: false,
    stock: 450,
    colors: ["Black", "Red", "Grey"],
    specifications: {
      "Connector Types": "Type-C, Lightning, Micro USB",
      "Cable Length": "1.2 Meters",
      "Output Current": "3A Max Fast Charging",
      Material: "Nylon Braided + Aluminium Shell",
    }
  },
  {
    id: "prod-7",
    name: "Spigen Glas.tR EZ Fit Screen Protector for iPhone 15 Pro",
    slug: "spigen-glastr-ezfit-iphone-15-pro",
    description: "Less time, guaranteed alignment. The Glas.tR EZ Fit comes with an innovative tray designed to eliminate time wasted to achieve the greatest alignment. Simply place the tray over the phone, press the center and watch the glass adhere in place. Shield the screen with 9H hardness tempered glass.",
    price: 999,
    oldPrice: 1499,
    discount: 33,
    images: [
      "https://images.unsplash.com/photo-1605152276897-4f618f831968?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&auto=format&fit=crop&q=80"
    ],
    category: "tempered-glass",
    brand: "Spigen",
    rating: 4.9,
    reviewsCount: 420,
    reviews: [
      { id: "rev-8", userName: "Aditya Roy", rating: 5, comment: "EZ Fit tray is amazing. Perfect alignment in 10 seconds. Highly recommend.", date: "2026-06-24" }
    ],
    featured: true,
    bestSeller: false,
    newArrival: true,
    trending: true,
    stock: 90,
    colors: ["Clear"],
    specifications: {
      "Glass Hardness": "9H Tempered Glass",
      "Tray Alignment": "Yes, Auto-alignment Tray included",
      Compatibility: "iPhone 15 Pro",
      Pack: "2 Screen Protectors included",
    }
  },
  {
    id: "prod-8",
    name: "OnePlus Warp Charge 65 Power Adapter",
    slug: "oneplus-warp-charge-65",
    description: "The OnePlus Warp Charge 65 Power Adapter is our fastest ever charging solution. It's smart, too. Built-in, dedicated charging circuitry ensures efficient heat management and dissipation to keep your phone cool while charging. Reliable and always fast, Warp Charge 65 also charges compatible laptops and tablets.",
    price: 2499,
    oldPrice: 2999,
    discount: 16,
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=600&auto=format&fit=crop&q=80"
    ],
    category: "chargers",
    brand: "OnePlus",
    rating: 4.8,
    reviewsCount: 310,
    reviews: [
      { id: "rev-9", userName: "Manpreet Singh", rating: 5, comment: "Insanely fast charging. Charges my OnePlus 11 in 30 mins.", date: "2026-06-14" }
    ],
    featured: false,
    bestSeller: false,
    newArrival: true,
    trending: true,
    stock: 45,
    colors: ["White"],
    specifications: {
      Wattage: "65W Max",
      "Port Type": "USB-C",
      Protocol: "Warp Charge, Power Delivery (PD), PPS",
      Warranty: "1 Year Manufacturer Warranty",
    }
  }
];

export const TESTIMONIALS = [
  {
    id: "t-1",
    name: "Vikram Malhotra",
    role: "Tech Enthusiast",
    content: "Raghav Mobile Accessories has become my go-to store. The Spigen cases and screen protectors are 100% original and delivery is super quick across India.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "t-2",
    name: "Sneha Reddy",
    role: "Daily Commuter",
    content: "The Ambrane 20000mAh power bank I ordered works brilliantly. I get free shipping on orders above 499 and the support team was very responsive when I had a tracking query.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "t-3",
    name: "Kabir Mehta",
    role: "Freelance Photographer",
    content: "Love the 3-in-1 braided charging cables. High quality products, robust website checkout flow, and stellar customer dashboard. Recommend Raghav Mobile Accessories!",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  },
];
