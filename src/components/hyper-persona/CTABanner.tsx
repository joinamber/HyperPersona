import { useState, FormEvent } from 'react';
import { useToast } from '@/hooks/use-toast';

const CONTACT_EMAIL = 'amber@adptv.xyz';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CTABanner = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!EMAIL_PATTERN.test(email.trim())) {
      toast({
        title: 'That email doesn\'t look right',
        description: 'Enter a valid address so we know how to reach you.',
        variant: 'destructive',
      });
      return;
    }

    const subject = encodeURIComponent('Let\'s talk about HyperPersona');
    const body = encodeURIComponent(
      `Hi Amber,\n\nI'd like to get in touch about HyperPersona.\n\nReply-to: ${email.trim()}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    toast({
      title: 'Opening your email client…',
      description: `Send the message to reach us at ${CONTACT_EMAIL}.`,
    });
  };

  return (
    <div className="bg-primary py-16 md:py-20 mt-4">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl text-primary-foreground mb-4">Ready to meet your customers?</h2>
        <p className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto font-light mb-10">
          Join the makers and small teams using HyperPersona to understand who they're building for — before writing a line of code, or a line of ad copy.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-md items-center gap-1 rounded-full border border-primary-foreground/25 bg-gradient-to-r from-primary-foreground/20 to-primary-foreground/5 p-1.5 backdrop-blur-sm"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            aria-label="Your email"
            className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-primary-foreground px-5 py-2.5 text-sm font-medium text-primary transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            Contact Us
          </button>
        </form>
      </div>
    </div>
  );
};

export default CTABanner;
