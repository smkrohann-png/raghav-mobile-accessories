"use client";
import {
  CheckCircle2,
  MapPin,
  PackageCheck,
  ShoppingBag,
  Truck,
  Quote
} from "lucide-react";
import { categories, products, testimonials } from "@/data/storefront";
import { CategoryCard } from "@/components/storefront/CategoryCard";
import { ProductCard } from "@/components/storefront/ProductCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const deviceMedia = [
  {
    name: "Headphones",
    video:"/videos/headphones.mp4"
  },
  {
    name: "Power Bank",
    video:"/videos/powerbank.m4v"
  },
  {
    name: "Mobile Repair",
    video:"/videos/mobileRepair.mp4"
  },
];

export function BrandStrip() {
  return (
    <section className="bg-white py-10">
      <Container>
        <div className="mb-7 px-[4%] text-left">
          <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-slate-200 bg-white py-3 mb-10">
  <div className="marquee">
    <div className="marquee-content">
      <span>📱 Premium Mobile Accessories</span>
      <span>⚡ Fast Chargers</span>
      <span>🎧 Wireless Earbuds & Headphones</span>
      <span>🔋 Power Banks</span>
      <span>📦 Fast Shipping Across India</span>
      <span>🛡️ 100% Genuine Products</span>
      <span>💵 Cash On Delivery</span>
      <span>🚚 Quick Delivery</span>
      <span>🔄 Easy Replacement</span>
      <span>⭐ Premium Customer Support</span>

      {/* Duplicate for Infinite Loop */}
      <span>📱 Premium Mobile Accessories</span>
      <span>⚡ Fast Chargers</span>
      <span>🎧 Wireless Earbuds & Headphones</span>
      <span>🔋 Power Banks</span>
      <span>📦 Fast Shipping Across India</span>
      <span>🛡️ 100% Genuine Products</span>
      <span>💵 Cash On Delivery</span>
      <span>🚚 Quick Delivery</span>
      <span>🔄 Easy Replacement</span>
      <span>⭐ Premium Customer Support</span>
    </div>
  </div>
</section>

        </div>

        <div className="grid gap-6 px-[4%] sm:grid-cols-2 lg:grid-cols-3">
          {deviceMedia.map((item, index) => (
            <DeviceMediaCard item={item} key={`${item.video}-${index}`} />
          ))}
        </div>
      </Container>
    </section>
    
  );
}

function DeviceMediaCard({
  item,
}: {
  item: {
    name: string;
    video: string;
  };
}) {
  return (
    <article
      className="group transition duration-300 hover:-translate-y-1"
      tabIndex={0}
    >
      <div
  className="
    relative
    aspect-square
    w-full
    overflow-hidden
    rounded-2xl
    border
    border-slate-200
    bg-white
    shadow-sm
    transition-all
    duration-500
    group-hover:-translate-y-2
    group-hover:scale-[1.02]
    group-hover:border-orange-300
    group-hover:shadow-2xl
    group-hover:shadow-orange-100/60
  "
>
       
      <video
  src={item.video}
  autoPlay
  muted
  loop
  playsInline
  controls={false}
  preload="auto"
  className="absolute inset-0 h-full w-full object-cover"
/>
      </div>
      <h3 className="mt-1.5 text-center text-[16px] font-bold text-slate-950">{item.name}</h3>
    </article>
  );
}
const deliverySteps = [
  {
    title: "Order Placed",
    text: "Choose your favourite accessories and complete checkout in just a few clicks.",
    icon: ShoppingBag,
  },
  {
    title: "Order Confirmed",
    text: "Our team verifies your order and prepares it for secure packaging.",
    icon: CheckCircle2,
  },
  {
    title: "Quick Dispatch",
    text: "Orders are packed carefully and shipped through trusted delivery partners.",
    icon: Truck,
  },
  {
    title: "Delivered",
    text: "Receive your products safely at your doorstep with regular order updates.",
    icon: PackageCheck,
  },
];

export function WhyChooseRaghav() {
  return (
    <Section className="bg-slate-50 pt-0 pb-16 lg:pt-0 lg:pb-20">
      <Container>

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex rounded-full bg-orange-100 px-5 py-2 text-xs font-bold uppercase tracking-[0.22em] text-orange-600">
            Why Choose Us
          </span>

          <h2 className="mt-6 text-4xl font-black text-slate-950 lg:text-5xl">
            A Better Shopping
            <br />
            Experience Every Time.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            From genuine accessories to fast delivery and dedicated customer
            support, we focus on making every purchase simple, secure and
            reliable.
          </p>
        </motion.div>

        {/* Top Cards */}

        <div className="mt-16 grid gap-6 md:grid-cols-3">

          {[
            {
              title: "Verified Compatibility",
              text: "Every accessory is selected to deliver reliable performance with supported devices.",
            },
            {
              title: "Premium Build Quality",
              text: "Quality materials and trusted brands ensure durability for everyday use.",
            },
            {
              title: "Customer First",
              text: "Clear communication, transparent pricing and dependable after-sales support.",
            },
          ].map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: .45,
                delay: index * .08,
              }}
              viewport={{ once: true }}
              className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-7
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-orange-200
                hover:shadow-xl
              "
            >
              <CheckCircle2 className="h-10 w-10 text-orange-600" />

              <h3 className="mt-6 text-2xl font-black text-slate-950">
                {item.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                {item.text}
              </p>
            </motion.article>
          ))}

        </div>
      
{/* Store Highlights */}

<section className="relative left-1/2 mt-20 w-screen -translate-x-1/2  bg-slate-900 px-8 py-20 text-white shadow-2xl sm:px-12 lg:px-20">
  <div className="mx-auto max-w-3xl text-center">
    <MapPin className="mx-auto h-16 w-16 text-orange-500" />

    <h3 className="mt-6 text-4xl font-black">
      Store Highlights
    </h3>

    <p className="mt-6 text-lg leading-8 text-slate-300">
      Premium Accessories | Fast Dispatch | Cash On Delivery | WhatsApp Support | Quality Checked Products | India Wide Delivery
    </p>
  </div>
</section>


                {/* Delivery Process */}

        <div className="mt-20">
          <div className="mb-10 text-center">
            <h3 className="text-3xl font-black text-slate-950">
              Simple Order Process
            </h3>

            <p className="mt-3 text-slate-600">
              From checkout to delivery, every order follows a simple and
              transparent journey.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {deliverySteps.map(({ title, text, icon: Icon }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                }}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
                  <Icon className="h-6 w-6 text-orange-600" />
                </div>

                <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-orange-600">
                  Step {index + 1}
                </p>

                <h4 className="mt-2 text-xl font-black text-slate-950">
                  {title}
                </h4>

                <p className="mt-3 leading-7 text-slate-600">
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

</Container>
    </Section>
  );
}
export function CategoriesSection() {
  return (
    <Section className="bg-slate-50 py-16">
      <Container>
        <SectionTitle
          eyebrow="Shop By Category"
          title="Find Exactly What You Need"
          description="Browse our curated collections of premium mobile accessories."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function FeaturedProductsSection() {
  // Let's pick 4 products (e.g., cables and chargers)
  const featured = products.slice(0, 4);
  return (
    <Section className="bg-white py-16">
      <Container>
        <SectionTitle
          eyebrow="Top Picks"
          title="Bestselling Accessories"
          description="Upgrade your daily tech with our most popular and reliable products."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function TestimonialSection() {
  return (
    <Section className="bg-white py-16">
      <Container>
        <SectionTitle
          eyebrow="Customer Reviews"
          title="What People Are Saying"
          description="Don't just take our word for it. Here's what our customers have to say."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/60"
            >
              <Quote className="h-10 w-10 text-orange-400 opacity-50" />
              <p className="mt-6 min-h-24 text-lg font-medium leading-8 text-slate-700">
                "{testimonial.quote}"
              </p>
              <div className="mt-6 flex items-center gap-4 border-t border-slate-200 pt-6">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-orange-100 text-xl font-bold text-orange-600">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-950">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
