import BlurText from "@/components/ui/BlurText";
import workingHuman from "@/assets/svg/workingHuman.svg";

export const Hero = () => {
  return (
    <section className="mx-auto flex min-h-[80vh] max-w-7xl items-center px-6">
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
          <img
            src={workingHuman}
            alt="Working Human"
            className="w-full max-w-md lg:max-w-xl"
          />
        </div>

      </div>
    </section>
  );
};  