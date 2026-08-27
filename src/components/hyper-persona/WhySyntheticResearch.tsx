import { Zap, LineChart, DollarSign } from 'lucide-react';

const WhySyntheticResearch = () => {
  return (
    <div className="mb-20 md:mb-28">
      <div className="max-w-2xl mb-12">
        <span className="eyebrow">Why HyperPersona</span>
        <h2 className="text-3xl md:text-4xl mt-3">Research that keeps up with you</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-8 rounded-2xl border border-border/60">
          <Zap size={28} strokeWidth={1.5} className="text-primary mb-5" />
          <h3 className="text-xl mb-2">Hours, not weeks</h3>
          <p className="text-muted-foreground leading-relaxed">
            Skip the recruiting, scheduling, and no-shows. Detailed personas appear in about the time it takes to make coffee.
          </p>
        </div>

        <div className="bg-card p-8 rounded-2xl border border-border/60">
          <LineChart size={28} strokeWidth={1.5} className="text-primary mb-5" />
          <h3 className="text-xl mb-2">As many voices as you need</h3>
          <p className="text-muted-foreground leading-relaxed">
            Model hundreds of micro-segments for a new feature, or just the one persona that's been keeping you up at night.
          </p>
        </div>

        <div className="bg-card p-8 rounded-2xl border border-border/60">
          <DollarSign size={28} strokeWidth={1.5} className="text-primary mb-5" />
          <h3 className="text-xl mb-2">Startup-friendly cost</h3>
          <p className="text-muted-foreground leading-relaxed">
            Get agency-grade research clarity without the agency-grade invoice — useful from the napkin-sketch stage onward.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhySyntheticResearch;
