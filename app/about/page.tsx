import { Award, PackageCheck, Store, UsersRound } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FeatureCard } from "@/components/storefront/FeatureCard";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <Section>
      <Container>
        <SectionTitle
          eyebrow="About Raghav"
          title="A focused store for better everyday phone gear."
          description="Raghav Mobile Accessories brings premium selection discipline to practical products: clean design, device fit, honest pricing and dependable delivery."
        />
        <div className="grid gap-5 lg:grid-cols-4">
          <FeatureCard title="Curated Range" description="No noisy catalog. Just accessories that solve common phone and setup needs." icon={Store} />
          <FeatureCard title="Verified Fit" description="Cases, glass and cables are checked around exact ports, buttons and camera islands." icon={PackageCheck} />
          <FeatureCard title="Better Finish" description="Matte textures, clean colorways and subtle branding keep the look premium." icon={Award} />
          <FeatureCard title="Human Support" description="Get help choosing compatible accessories before or after checkout." icon={UsersRound} />
        </div>
      </Container>
    </Section>
  );
}
