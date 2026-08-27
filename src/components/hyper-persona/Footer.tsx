const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-serif italic text-xl">HyperPersona</div>
          <div className="text-sm text-background/60 font-mono">© 2026 HyperPersona. All rights reserved.</div>
          <div className="text-sm text-right text-background/80">
            <div className="font-medium">A Venture of Adaptive Intelligence</div>
            <div>amber@adptv.xyz</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;