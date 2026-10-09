import { ReactNode } from 'react';

/**
 * Fallback hero. On a normal load of "/" the hero is the static HTML in
 * index.html (it paints before any JS and is never replaced); this component is
 * only rendered after a client-side navigation back to "/", when that static
 * copy has already been removed. Keep the two visually in sync.
 */
const Hero = ({ userSlot }: { userSlot?: ReactNode }) => {
  return (
    <header className="relative overflow-hidden border-b border-border/60">
      <div className="hero-glow absolute inset-0" aria-hidden="true" />
      <div className="container relative mx-auto px-4 py-16 md:py-24 max-w-7xl">
        <div className="flex justify-between items-start mb-4">
          <span className="eyebrow">HyperPersona</span>
          {userSlot}
        </div>
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl leading-[1.05] mb-6">
            Stop <span className="italic">guessing</span><br />
            who you're building for
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed font-light">
            Describe your product, even a half-formed idea, and HyperPersona sketches the customer who'd actually buy it. Ship with a real target, not a hunch.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Hero;
