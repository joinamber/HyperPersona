const Footer = () => {
  return (
    <footer className="bg-indigo-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="font-bold text-xl">HYPERPERSONA</div>
          <div className="text-sm text-indigo-200">© 2025 HyperPersona. All rights reserved.</div>
          <div className="text-sm text-right">
            <div className="font-medium">A Venture of Co.Alt Lab</div>
            <div>hello@coaltlab.com</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;