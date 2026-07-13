"use client";

import { FormEvent, useEffect, useState } from "react";
import { Send, Star } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { approvedReviews } from "@/data/reviews";
import type { Review } from "@/data/reviews";

export default function ReviewsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.reviews)) setReviews(data.reviews);
      })
      .catch(() => setReviews([]));
  }, []);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      const formData = new FormData(form);
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          product: "Store Service",
          rating: Number(formData.get("rating") || 5),
          text: formData.get("text"),
        }),
      });
      if (response.ok) {
        form.reset();
        setSubmitted(true);
        alert("Thank you! Your review has been submitted successfully and is pending approval.");
      } else {
        const errData = await response.json();
        alert("Database Error: " + (errData.error || "Please ensure MONGODB_URI is correct."));
      }
    } catch (error: any) {
      alert("Error: " + (error.message || "Unknown error occurred"));
    }
  }

  return (
    <Section muted>
      <Container>
        <SectionTitle
          eyebrow="Reviews"
          title="Customer reviews with admin approval."
          description="Customers review submit kar sakte hain. Backend ke baad review admin panel me approve hone ke baad website par show hoga."
        />
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="grid gap-5">
            {reviews.map((review) => (
              <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" key={`${review.name}-${review.product}-${review.rating}`}>
                <div className="flex gap-1 text-orange-400">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star className="h-4 w-4 fill-current" key={index} />
                  ))}
                </div>
                <p className="mt-4 text-base leading-7 text-slate-700">&ldquo;{review.text}&rdquo;</p>
                <p className="mt-5 font-black text-slate-950">{review.name}</p>
                {review.product !== "Store Service" && (
                  <p className="mt-1 text-sm font-semibold text-slate-500">{review.product}</p>
                )}
              </article>
            ))}
            {!reviews.length && (
               <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                 <p className="text-slate-500 font-semibold">No reviews yet. Be the first to leave one!</p>
               </div>
            )}
          </div>
          <form
            className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            onSubmit={submitReview}
          >
            <h2 className="text-2xl font-black text-slate-950">Write a review</h2>
            <div className="mt-5 grid gap-4">
              <Input name="name" placeholder="Your name" required />
              <select name="rating" className="h-12 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100" defaultValue="5">
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
                <option value="2">2 stars</option>
                <option value="1">1 star</option>
              </select>
              <textarea name="text" className="min-h-36 resize-none rounded-3xl border border-slate-200 p-5 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100" placeholder="Share your experience" required />
            </div>
            <Button className="mt-5 w-full" type="submit">
              <Send className="h-4 w-4" />
              Submit
            </Button>
            {submitted ? (
              <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                Review submitted for approval!
              </p>
            ) : null}
          </form>
        </div>
      </Container>
    </Section>
  );
}
