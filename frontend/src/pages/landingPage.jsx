import { Navbar } from "@/components/landing-page/Navbar";
import { theme } from "@/lib/theme";
import { Hero } from "@/components/landing-page/Hero";

const LandingPage = () => {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
      }}
    >
      <Navbar />
      <Hero/>
    </div>
  );
};

export default LandingPage;