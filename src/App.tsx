import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCartSync } from "@/hooks/useCartSync";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import About from "./pages/About";
import MentalHealth from "./pages/MentalHealth";
import Philanthropy from "./pages/Philanthropy";
import Campaigns from "./pages/Campaigns";
import Contact from "./pages/Contact";
import Team from "./pages/Team";
import BecomeVolunteer from "./pages/BecomeVolunteer";
import Portfolio from "./pages/Portfolio";
import Partnerships from "./pages/Partnerships";
import Gallery from "./pages/Gallery";
import FAQ from "./pages/FAQ";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import News from "./pages/News";
import Login from "./pages/Login";
import ProfileSettings from "./pages/ProfileSettings";
import MoodTracker from "./pages/MoodTracker";
import Events from "./pages/Events";
import Policies from "./pages/Policies";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useCartSync();
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/mental-health" element={<MentalHealth />} />
          <Route path="/philanthropy" element={<Philanthropy />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/team" element={<Team />} />
          <Route path="/become-volunteer" element={<BecomeVolunteer />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/partnerships" element={<Partnerships />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:handle" element={<ProductDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/mood-tracker" element={<MoodTracker />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
