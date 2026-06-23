import BlurText from "@/components/ui/BlurText";

export const Hero = () => {
  return (
    <section className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="max-w-5xl text-center">
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
          className="mx-auto max-w-2xl text-lg text-zinc-400 md:text-xl"
        />
      </div>
    </section>
  );
};