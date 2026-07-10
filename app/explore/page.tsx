import { WhyChooseRaghav } from "@/components/sections/HomeSections";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore | Raghav Mobile Accessories",
  description: "Learn why we are the best choice for premium mobile accessories, our simple order process, and store highlights.",
};

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-950 sm:text-5xl">Explore Raghav Mobile</h1>
          <p className="mt-4 text-lg text-slate-600">Discover what makes our store the preferred destination for mobile accessories.</p>
        </div>
      </div>
      
      {/* This component contains Why Choose Us, Simple Order Process, and Store Highlights */}
      <WhyChooseRaghav />
    </div>
  );
}