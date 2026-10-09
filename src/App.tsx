
import { lazy, Suspense, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import HyperPersona from "./pages/HyperPersona";
import NotFound from "./pages/NotFound";

// Secondary routes are code-split so their dependencies (e.g. framer-motion
// for the slide deck) aren't downloaded by visitors of the main page.
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));

// index.html ships the home hero as static HTML outside React. Drop it when the
// user navigates (client-side) to any other route so it doesn't linger on top.
const StaticHeroGuard = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname !== "/") document.getElementById("static-hero")?.remove();
  }, [pathname]);
  return null;
};

const App = () => (
  <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <Analytics />
      <BrowserRouter>
        <StaticHeroGuard />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HyperPersona />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/slides" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </AuthProvider>
);

export default App;
