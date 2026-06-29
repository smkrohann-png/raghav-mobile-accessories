"use client";

import { motion } from "framer-motion";
import { Camera, Heart, MessageCircle } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

export default function InstagramGallery() {
  const posts = [
    {
      id: "ig-1",
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&auto=format&fit=crop&q=80",
      likes: "1.2k",
      comments: "42",
    },
    {
      id: "ig-2",
      image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&auto=format&fit=crop&q=80",
      likes: "850",
      comments: "28",
    },
    {
      id: "ig-3",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80",
      likes: "2.4k",
      comments: "115",
    },
    {
      id: "ig-4",
      image: "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?w=400&auto=format&fit=crop&q=80",
      likes: "940",
      comments: "31",
    },
    {
      id: "ig-5",
      image: "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=400&auto=format&fit=crop&q=80",
      likes: "1.8k",
      comments: "58",
    },
    {
      id: "ig-6",
      image: "https://images.unsplash.com/photo-1605152276897-4f618f831968?w=400&auto=format&fit=crop&q=80",
      likes: "1.1k",
      comments: "22",
    },
  ];

  return (
    <section className="section bg-white border-t border-slate-50">
      <div className="container">
        <SectionTitle
          title="Share Your Style"
          subtitle="Tag us on Instagram @RaghavMobileAccessories to get featured on our page. Show off your premium aesthetic."
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              className="group relative aspect-square overflow-hidden rounded-3xl bg-slate-900 shadow-sm cursor-pointer"
            >
              <img
                src={post.image}
                alt="Instagram social grid photo"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Hover overlay details */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={22} className="mb-2 text-white" />
                <div className="flex gap-4 text-xs font-bold mt-1">
                  <span className="flex items-center gap-1">
                    <Heart size={12} fill="currentColor" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={12} fill="currentColor" />
                    {post.comments}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
