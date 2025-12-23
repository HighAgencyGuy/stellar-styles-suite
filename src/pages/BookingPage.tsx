import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Phone, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const services = [
  "Box Braids",
  "Knotless Braids",
  "Cornrows",
  "Passion Twists",
  "Faux Locs",
  "Natural Hair Styling",
  "Wash & Condition",
  "Wig Installation",
  "Weave Installation",
  "Bridal Hair",
  "Special Occasion",
  "Other",
];

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

export default function BookingPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    service: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.date || !formData.time || !formData.service) {
      toast.error("Please fill in all required fields");
      return;
    }

    // In a real app, this would send to a backend
    console.log("Booking submitted:", formData);
    setIsSubmitted(true);
    toast.success("Booking request submitted successfully!");
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  if (isSubmitted) {
    return (
      <Layout>
        <section className="section-padding min-h-[60vh] flex items-center">
          <div className="container-salon max-w-lg mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Booking Request Received!
            </h1>
            <p className="text-muted-foreground mb-8">
              Thank you, <strong>{formData.name}</strong>! We've received your appointment request for{" "}
              <strong>{formData.service}</strong> on <strong>{formData.date}</strong> at{" "}
              <strong>{formData.time}</strong>.
            </p>
            <p className="text-muted-foreground mb-8">
              We'll confirm your appointment via WhatsApp shortly.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="whatsapp" className="gap-2">
                  <Phone className="w-5 h-5" />
                  Chat on WhatsApp
                </Button>
              </a>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: "",
                    phone: "",
                    date: "",
                    time: "",
                    service: "",
                    notes: "",
                  });
                }}
              >
                Book Another
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-secondary/30">
        <div className="container-salon">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              Book an Appointment
            </h1>
            <div className="divider-gold mt-4 mb-6" />
            <p className="text-lg text-muted-foreground">
              Reserve your spot and skip the wait. We'll confirm your appointment via WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="section-padding">
        <div className="container-salon max-w-xl mx-auto">
          <div className="card-elegant p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="input-elegant"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (WhatsApp) *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g., 0801 234 5678"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="input-elegant"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Preferred Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    min={today}
                    value={formData.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    className="input-elegant"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Preferred Time *</Label>
                  <Select
                    value={formData.time}
                    onValueChange={(value) => handleChange("time", value)}
                  >
                    <SelectTrigger className="input-elegant">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Hair Service *</Label>
                <Select
                  value={formData.service}
                  onValueChange={(value) => handleChange("service", value)}
                >
                  <SelectTrigger className="input-elegant">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requests or information we should know?"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  className="input-elegant min-h-[100px]"
                />
              </div>

              <Button type="submit" size="lg" className="w-full gap-2">
                <Calendar className="w-5 h-5" />
                Submit Booking Request
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Prefer to chat? 
            <a
              href="https://wa.me/2348000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline ml-1"
            >
              Contact us on WhatsApp
            </a>
          </p>
        </div>
      </section>
    </Layout>
  );
}
