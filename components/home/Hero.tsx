"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-white">

      {/* Background Blur */}

      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-orange-100 blur-3xl" />

      <div className="container relative grid min-h-[88vh] items-center gap-16 py-16 lg:grid-cols-2">

        {/* LEFT */}

        <motion.div
          initial={{ opacity: 0, x: -70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .7 }}
        >

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100 px-4 py-2 text-sm font-medium text-orange-600">

            <Star
              size={16}
              fill="currentColor"
            />

            India's Trusted Mobile Accessories Store

          </div>

          <h1 className="text-5xl font-black leading-tight text-gray-900 md:text-6xl xl:text-7xl">

            Upgrade Your

            <span className="block text-orange-500">
              Mobile Lifestyle
            </span>

          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-gray-600">

            Discover premium mobile accessories including
            chargers, cables, power banks, earbuds,
            mobile covers and much more.

          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <Link
              href="/shop"
              className="flex items-center gap-2 rounded-full bg-orange-500 px-7 py-4 font-semibold text-white transition hover:bg-orange-600"
            >
              Shop Now

              <ArrowRight size={18} />

            </Link>

            <Link
              href="/categories"
              className="rounded-full border border-gray-300 px-7 py-4 font-semibold transition hover:border-orange-500 hover:text-orange-500"
            >
              Browse Categories
            </Link>

          </div>

          <div className="mt-12 flex flex-wrap gap-10">

            <div>

              <h2 className="text-4xl font-bold text-orange-500">
                500+
              </h2>

              <p className="text-gray-500">
                Premium Products
              </p>

            </div>

            <div>

              <h2 className="text-4xl font-bold text-orange-500">
                10K+
              </h2>

              <p className="text-gray-500">
                Happy Customers
              </p>

            </div>

            <div>

              <h2 className="text-4xl font-bold text-orange-500">
                4.9★
              </h2>

              <p className="text-gray-500">
                Customer Rating
              </p>

            </div>

          </div>

        </motion.div>
                {/* RIGHT */}

        <motion.div
          initial={{ opacity: 0, x: 70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex items-center justify-center"
        >

          {/* Main Circle */}

          <div className="absolute h-[520px] w-[520px] rounded-full bg-orange-100 blur-2xl" />

          {/* Main Product */}

          <div className="relative z-10">

            <Image
              src="/images/hero/headphone-png.png"
              alt="Wireless Headphone"
              width={520}
              height={520}
              priority
              className="drop-shadow-2xl"
            />

          </div>

          {/* Discount Card */}

          <motion.div
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
            }}
            className="absolute left-0 top-16 rounded-2xl bg-white p-5 shadow-xl"
          >

            <p className="text-sm text-gray-500">
              Special Offer
            </p>

            <h3 className="mt-1 text-3xl font-black text-orange-500">
              40% OFF
            </h3>

          </motion.div>

          {/* Delivery Card */}

          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
            }}
            className="absolute bottom-10 left-8 rounded-2xl bg-white p-5 shadow-xl"
          >

            <p className="text-lg font-bold">
              🚚 Free Delivery
            </p>

            <span className="text-gray-500">
              Across India
            </span>

          </motion.div>

          {/* Rating Card */}

          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 4.5,
            }}
            className="absolute right-0 top-24 rounded-2xl bg-white p-5 shadow-xl"
          >

            <p className="text-sm text-gray-500">
              Customer Rating
            </p>

            <h3 className="text-2xl font-bold">
              ⭐ 4.9 / 5
            </h3>

          </motion.div>

          {/* Products Card */}

          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
            }}
            className="absolute bottom-0 right-4 rounded-2xl bg-white p-5 shadow-xl"
          >

            <h3 className="text-3xl font-black text-orange-500">
              500+
            </h3>

            <p className="text-gray-500">
              Accessories Available
            </p>

          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}