import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import StylesPage from "./pages/StylesPage";
import PricesPage from "./pages/PricesPage";
import BookingPage from "./pages/BookingPage";
import ContactPage from "./pages/ContactPage";
import TrackAppointmentPage from "./pages/TrackAppointmentPage";
import NotFound from "./pages/NotFound";
import AdminAuthPage from "./pages/AdminAuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminGalleryPage from "./pages/admin/AdminGalleryPage";
import AdminPricesPage from "./pages/admin/AdminPricesPage";
import AdminAppointmentsPage from "./pages/admin/AdminAppointmentsPage";
import AdminCustomersPage from "./pages/admin/AdminCustomersPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <WhatsAppWidget />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/styles" element={<StylesPage />} />
            <Route path="/prices" element={<PricesPage />} />
            <Route path="/book" element={<BookingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/track-appointment" element={<TrackAppointmentPage />} />
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminAuthPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/gallery" element={<AdminGalleryPage />} />
            <Route path="/admin/prices" element={<AdminPricesPage />} />
            <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
            <Route path="/admin/customers" element={<AdminCustomersPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
