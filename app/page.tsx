import Hero from "@/app/sections/Hero";
import About from "@/app/sections/About";
import Stories from "@/app/sections/Stories";
import Pricing from "@/app/sections/Pricing";
import Services from "@/app/sections/Services";
import Team from "@/app/sections/Team";
import Sponsor from "@/app/sections/Sponsor";
import FAQ from "@/app/sections/FAQ";
import Contact from "@/app/sections/Contact";
import { OrganizationSchema, ServiceSchema, FAQPageSchema } from "@/app/components/StructuredData";


export default function Index() {
  return (
      <>
            <OrganizationSchema />
            <ServiceSchema />
            <FAQPageSchema />
            <div>
                <Hero />
                <Services />
                <Stories />
                <FAQ />
                <Pricing />
                <Sponsor />
                <Contact />
            </div>
      </>
  )
}