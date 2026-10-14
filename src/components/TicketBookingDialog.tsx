import { useSiteCopy } from "@/i18n/useSiteCopy";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ticket, Minus, Plus, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EventInfo {
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;
  spots: number;
  category: string;
}

interface TicketBookingDialogProps {
  event: EventInfo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TicketBookingDialog = ({ event, open, onOpenChange }: TicketBookingDialogProps) => {
  const tx = useSiteCopy();
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!event) return null;

  const priceNum = event.price === "Free" ? 0 : parseInt(event.price.replace(/[^0-9]/g, ""), 10);
  const totalPrice = priceNum * ticketCount;

  const resetForm = () => {
    setStep("form");
    setFullName("");
    setEmail("");
    setPhone("");
    setTicketCount(1);
    setLoading(false);
  };

  const handleClose = (val: boolean) => {
    if (!val) resetForm();
    onOpenChange(val);
  };

  const handleSubmit = async () => {
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      toast.error(tx("Please fill in all fields"));
      return;
    }
    if (step === "form") {
      setStep("confirm");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("event_tickets").insert({
      event_title: event.title,
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      ticket_count: ticketCount,
      total_price: totalPrice,
    });

    if (error) {
      toast.error(tx("Booking failed. Please try again."));
      setLoading(false);
      return;
    }

    setStep("success");
    setLoading(false);
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const d = new Date(event.date);
  const dateStr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === "success" ? (
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <DialogHeader>
              <DialogTitle className="text-2xl">{tx("Booking Confirmed!")}</DialogTitle>
              <DialogDescription className="mt-2"> {tx("You've booked")} {ticketCount} {tx("ticket")}{ticketCount > 1 ? "s" : ""} {tx("for")} <strong>{tx(event.title)}</strong>{tx(". A confirmation will be sent to")} <strong>{email}</strong>.
              </DialogDescription>
            </DialogHeader>
            <Button className="mt-6 bg-hero-gradient text-primary-foreground" onClick={() => handleClose(false)}> {tx("Done")} </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-primary" />
                {step === "form" ? tx("Book Tickets") : tx("Confirm Booking")}
              </DialogTitle>
              <DialogDescription>
                {tx(event.title)} — {dateStr} {tx("at")} {event.time}
              </DialogDescription>
            </DialogHeader>

            {step === "form" ? (
              <div className="space-y-4 mt-2">
                <div>
                  <Label htmlFor="fullName">{tx("Full Name")}</Label>
                  <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} placeholder={tx("Your full name")} />
                </div>
                <div>
                  <Label htmlFor="email">{tx("Email")}</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div>
                  <Label htmlFor="phone">{tx("Phone")}</Label>
                  <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+27 ..." />
                </div>
                <div>
                  <Label>{tx("Number of Tickets")}</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <Button type="button" variant="outline" size="icon" onClick={() => setTicketCount(Math.max(1, ticketCount - 1))} disabled={ticketCount <= 1}>
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="font-heading text-xl font-bold w-8 text-center">{ticketCount}</span>
                    <Button type="button" variant="outline" size="icon" onClick={() => setTicketCount(Math.min(10, ticketCount + 1))} disabled={ticketCount >= 10}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-sm text-muted-foreground">{tx("Total")}</span>
                  <span className="font-heading text-xl font-bold text-primary">
                    {totalPrice === 0 ? tx("Free") : `R${totalPrice.toLocaleString()}`}
                  </span>
                </div>
                <Button className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90" onClick={handleSubmit}> {tx("Continue to Confirmation")} </Button>
              </div>
            ) : (
              <div className="space-y-4 mt-2">
                <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">{tx("Event")}</span><span className="font-medium text-foreground">{tx(event.title)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{tx("Date")}</span><span className="font-medium text-foreground">{dateStr}, {event.time}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{tx("Location")}</span><span className="font-medium text-foreground">{tx(event.location)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{tx("Name")}</span><span className="font-medium text-foreground">{fullName}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{tx("Email")}</span><span className="font-medium text-foreground">{email}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{tx("Tickets")}</span><span className="font-medium text-foreground">{ticketCount}</span></div>
                  <div className="flex justify-between border-t border-border pt-2">
                    <span className="font-semibold text-foreground">{tx("Total")}</span>
                    <span className="font-bold text-primary">{totalPrice === 0 ? tx("Free") : `R${totalPrice.toLocaleString()}`}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep("form")}>{tx("Back")}</Button>
                  <Button className="flex-1 bg-hero-gradient text-primary-foreground hover:opacity-90" onClick={handleSubmit} disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} {tx("Confirm Booking")} </Button>
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TicketBookingDialog;
