import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl mb-4"><span className="italic">404</span></h1>
        <p className="text-xl text-muted-foreground mb-4">Nobody's home at this address.</p>
        <a href="/" className="text-primary hover:opacity-80 underline">
          Return to HyperPersona
        </a>
      </div>
    </div>
  );
};

export default NotFound;
