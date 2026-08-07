import { 
  BrandStrip, 
  CategoriesSection, 
  FeaturedProductsSection, 
  TestimonialSection, 
  WhyChooseRaghav 
} from "@/components/sections/HomeSections";
import { Hero } from "@/components/sections/Hero";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandStrip />
      <CategoriesSection />
      <FeaturedProductsSection />
      <WhyChooseRaghav />
      <TestimonialSection />
    </>
  );
}