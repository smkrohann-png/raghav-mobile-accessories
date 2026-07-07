"use client";

import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  Camera,
  CheckCircle2,
  Headphones,
  ShieldCheck,
  Smartphone,
  Speaker,
  Wrench,
} from "lucide-react";
import { motion } from "framer-motion";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";

const repairServices = [
  {
    title: "Display Replacement",
    description:
      "Cracked or damaged displays replaced with high-quality compatible parts.",
    icon: Smartphone,
  },
  {
    title: "Battery Replacement",
    description:
      "Improve battery backup and charging performance with reliable replacement.",
    icon: BatteryCharging,
  },
  {
    title: "Charging Port Repair",
    description:
      "Fix charging issues, loose ports and connector problems.",
    icon: Wrench,
  },
  {
    title: "Speaker & Mic Repair",
    description:
      "Resolve low sound, microphone and calling related issues.",
    icon: Speaker,
  },
  {
    title: "Camera Repair",
    description:
      "Front and rear camera repair or replacement service.",
    icon: Camera,
  },
  {
    title: "General Diagnosis",
    description:
      "Complete inspection to identify hardware related issues.",
    icon: CheckCircle2,
  },
];

const whyChoose = [
  {
    title: "Experienced Technicians",
    icon: Wrench,
  },
  {
    title: "Quality Parts",
    icon: ShieldCheck,
  },
  {
    title: "Quick Turnaround",
    icon: BatteryCharging,
  },
  {
    title: "Support After Repair",
    icon: Headphones,
  },
];

export default function RepairCentrePage() {
  return (
    <>

            {/* Why Repair With Us */}

      <Section className="bg-slate-50 py-20">
        <Container>

          <SectionTitle
            eyebrow="Why Choose Us"
            title="Reliable Repairs. Honest Service."
            description="We focus on quality workmanship, transparent pricing and a smooth repair experience."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {whyChoose.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: .45,
                    delay: index * .08,
                  }}
                  className="
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    text-center
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:border-orange-200
                    hover:shadow-xl
                  "
                >

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
                    <Icon className="h-6 w-6 text-orange-600" />
                  </div>

                  <h3 className="mt-5 text-lg font-black text-slate-950">
                    {item.title}
                  </h3>

                </motion.div>
              );
            })}

          </div>

        </Container>
      </Section>

      {/* Repair Request */}

      <Section className="bg-white py-20">
  <Container>
    <div id="repair-form">

          <SectionTitle
            eyebrow="Book Repair"
            title="Request a Repair"
            description="Fill in your details and our team will contact you shortly."
          />

          <motion.form
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .55 }}
            className="
              mx-auto
              mt-12
              max-w-4xl
              rounded-[32px]
              border
              border-slate-200
              bg-white
              p-8
              shadow-sm
            "
          >

            <div className="grid gap-5 md:grid-cols-2">

              <input
                placeholder="Full Name"
                className="h-14 rounded-2xl border border-slate-300 px-5 outline-none focus:border-orange-500"
              />

              <input
                placeholder="Phone Number"
                className="h-14 rounded-2xl border border-slate-300 px-5 outline-none focus:border-orange-500"
              />

              <input
                placeholder="Device Brand"
                className="h-14 rounded-2xl border border-slate-300 px-5 outline-none focus:border-orange-500"
              />

              <input
                placeholder="Device Model"
                className="h-14 rounded-2xl border border-slate-300 px-5 outline-none focus:border-orange-500"
              />

            </div>

            <textarea
              rows={5}
              placeholder="Describe the problem..."
              className="mt-5 w-full rounded-2xl border border-slate-300 p-5 outline-none focus:border-orange-500"
            />

            <button
              type="submit"
              className="
                mt-6
                inline-flex
                h-14
                items-center
                justify-center
                rounded-full
                bg-orange-600
                px-8
                font-bold
                text-white
                transition
                hover:bg-orange-500
              "
            >
              Submit Repair Request
            </button>

          </motion.form>
        </div>
        </Container>
      </Section>

      {/* WhatsApp CTA */}

      <Section className="bg-slate-950 py-20">
        <Container>

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .6 }}
            className="mx-auto max-w-3xl text-center"
          >

            <h2 className="text-4xl font-black text-white">
              Need Immediate Assistance?
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Chat with our team on WhatsApp for quick guidance before visiting
              the store.
            </p>

            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-10
                inline-flex
                h-14
                items-center
                rounded-full
                bg-orange-600
                px-8
                font-bold
                text-white
                transition
                hover:bg-orange-500
              "
            >
              Chat on WhatsApp
            </a>

          </motion.div>

        </Container>
      </Section>

    </>
  );
}