import BlurText from "@/components/ui/BlurText";
import workingHuman from "@/assets/svg/workingHuman1.svg";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="mx-auto flex min-h-[80vh] max-w-7xl items-center px-6" id="top">
      <div className="grid w-full items-center gap-12 lg:grid-cols-2">

        {/* Left Side */}
        <div>
          <BlurText
            text="Organize Work. Without the Chaos."
            delay={120}
            animateBy="words"
            direction="top"
            className="mb-6 text-5xl font-bold tracking-tight md:text-7xl"
          />

          <BlurText
            text="Create departments, manage teams, and keep projects moving from a single workspace."
            delay={40}
            animateBy="words"
            direction="top"
            className="max-w-xl text-lg text-zinc-400 md:text-xl"
          />
        </div>

        
        <div className="flex justify-center lg:justify-end">
          <motion.img
            src={workingHuman}
            alt="Working Human"
            initial={{
              opacity: 0,
              filter: "blur(10px)",
              y: -50,
            }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.4,
            }}
            className="w-full max-w-md lg:max-w-xl"
          />
        </div>
      </div>
    </section>
  );
};  