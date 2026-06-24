import { Navbar } from "@/components/landing-page/Navbar";
import { theme } from "@/lib/theme";
import { Hero } from "@/components/landing-page/Hero";
import { Info } from "@/components/landing-page/Info";
import { Join } from "@/components/landing-page/Join"
import { Footer } from "@/components/landing-page/Footer"
import { Workflow } from "@/components/landing-page/workFlow.jsx"
import DotField from "@/components/ui/DotField";

const LandingPage = () => {
  return (
    <div
  className="relative min-h-screen"
  style={{
    backgroundColor: theme.background,
    color: theme.text,
  }}
>
<DotField
  dotRadius={1.5}
  dotSpacing={19}
  gradientFrom="rgba(255,255,255,1)"
  gradientTo="rgba(255,255,255,1)"
  className="absolute inset-0 min-h-full"
  glowColor={theme.primary}
  glowRadius={40}
/>

  <div className="relative z-10">
    <Navbar />
    <Hero />
    <Workflow/>
    <Info/>
    <Join/>
    <Footer/>
  </div>
</div>
  );
};

export default LandingPage;