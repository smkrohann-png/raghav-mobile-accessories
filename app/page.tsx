import Hero from "@/components/home/Hero";
import BrandSection from "@/components/home/BrandSection";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import InstagramGallery from "@/components/home/InstagramGallery";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandSection />
      <Categories />
      <FeaturedProducts />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
      <InstagramGallery />
    </>
  );
}