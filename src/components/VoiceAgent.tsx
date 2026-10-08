import { useState, useCallback } from "react";
import { useConversation } from "@elevenlabs/react";
import { MicOff, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import receptionistAvatar from "@/assets/receptionist-avatar.jpg";

const AGENT_ID = "agent_3201kjfzeyyafnk97gvv3v75nfz5";

interface VoiceAgentProps {
  variant?: "button" | "inline" | "icon";
  className?: string;
}

const SpeakingWaves = ({ isSpeaking }: { isSpeaking: boolean }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border-2 border-primary/40"
        initial={{ width: 80, height: 80, opacity: 0 }}
        animate={
          isSpeaking
            ? {
                width: [80, 110 + i * 20],
                height: [80, 110 + i * 20],
                opacity: [0.6, 0],
              }
            : {
                width: [80, 100 + i * 14],
                height: [80, 100 + i * 14],
                opacity: [0.3, 0],
              }
        }
        transition={{
          duration: isSpeaking ? 1.2 : 2,
          repeat: Infinity,
          delay: i * 0.3,
          ease: "easeOut",
        }}
      />
    ))}
  </div>
);

const VoiceAgent = ({ variant = "button", className = "" }: VoiceAgentProps) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const conversation = useConversation({
    onConnect: () => console.log("Connected to World Changers AI Agent"),
    onDisconnect: () => console.log("Disconnected from AI Agent"),
    onError: (error) => console.error("Voice Agent Error:", error),
    clientTools: {
      cal_get_2: async (params: { email?: string; phone?: string }) => {
        try {
          if (!params.email && !params.phone) return "Please provide an email or phone number to look up bookings.";
          const { data, error } = await (supabase as any).rpc("voice_get_bookings", {
            p_email: params.email ?? null,
            p_phone: params.phone ?? null,
          });
          if (error) throw error;
          if (!data || data.length === 0) return "No upcoming bookings found for this caller.";
          return JSON.stringify(data.map((b: any) => ({
            id: b.id, name: b.full_name, provider: b.provider_name,
            date: b.session_date, time: b.session_time, type: b.session_type, mode: b.session_mode,
          })));
        } catch (err: any) {
          return `Error retrieving bookings: ${err.message}`;
        }
      },
      cal_availability_2: async (params: { provider_name: string; date: string }) => {
        try {
          const { data: booked, error } = await (supabase as any).rpc("voice_check_availability", {
            p_provider: params.provider_name,
            p_date: params.date,
          });
          if (error) throw error;
          const bookedTimes = (booked || []).map((b: any) => b.session_time);
          const allTimes = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
          const available = allTimes.filter(t => !bookedTimes.includes(t));
          if (available.length === 0) return `No available slots for ${params.provider_name} on ${params.date}.`;
          return `Available times for ${params.provider_name} on ${params.date}: ${available.join(", ")}`;
        } catch (err: any) {
          return `Error checking availability: ${err.message}`;
        }
      },
      cal_book_2: async (params: {
        full_name: string; email: string; phone: string;
        provider_name: string; session_type: string;
        session_date: string; session_time: string;
        reason?: string; session_mode?: string;
      }) => {
        try {
          const { error } = await supabase.from("bookings").insert({
            full_name: params.full_name,
            email: params.email,
            phone: params.phone,
            provider_name: params.provider_name,
            session_type: params.session_type,
            session_date: params.session_date,
            session_time: params.session_time,
            reason: params.reason || null,
            session_mode: params.session_mode || "Virtual",
            status: "upcoming",
          });
          if (error) throw error;
          supabase.functions.invoke("send-booking-confirmation", {
            body: {
              full_name: params.full_name,
              email: "info@worldchangersmh.org",
              provider_name: params.provider_name,
              session_type: params.session_type,
              session_date: params.session_date,
              session_time: params.session_time,
              session_mode: params.session_mode || "Virtual",
            },
          });
          toast.success("Session booked via AI agent!");
          return `Booking confirmed for ${params.full_name} with ${params.provider_name} on ${params.session_date} at ${params.session_time}.`;
        } catch (err: any) {
          return `Error booking session: ${err.message}`;
        }
      },
      cal_cancel_2: async (params: { booking_id?: string; email?: string; session_date?: string }) => {
        try {
          if (params.booking_id && params.email) {
            const { data, error } = await (supabase as any).rpc("voice_cancel_booking", {
              p_booking_id: params.booking_id,
              p_email: params.email,
            });
            if (error) throw error;
            if (!data) return "No matching upcoming booking found to cancel.";
            toast.info("Booking cancelled via AI agent.");
            return "Booking has been cancelled successfully.";
          }
          if (params.email && params.session_date) {
            const { data, error } = await (supabase as any).rpc("voice_cancel_booking_by_email", {
              p_email: params.email,
              p_session_date: params.session_date,
            });
            if (error) throw error;
            if (!data) return "No matching upcoming booking found to cancel.";
            toast.info("Booking cancelled via AI agent.");
            return "Booking has been cancelled successfully.";
          }
          return "Please provide a booking ID + email, or email + date to cancel.";
        } catch (err: any) {
          return `Error cancelling booking: ${err.message}`;
        }
      },
      cal_reschedule_2: async (params: {
        booking_id?: string; email?: string; original_date?: string;
        new_date: string; new_time: string;
      }) => {
        try {
          if (!params.email) return "Please provide the caller's email to reschedule.";
          if (params.booking_id) {
            const { data, error } = await (supabase as any).rpc("voice_reschedule_booking", {
              p_booking_id: params.booking_id,
              p_email: params.email,
              p_new_date: params.new_date,
              p_new_time: params.new_time,
            });
            if (error) throw error;
            if (!data) return "No matching upcoming booking found to reschedule.";
            toast.success("Booking rescheduled via AI agent!");
            return `Booking rescheduled to ${params.new_date} at ${params.new_time}.`;
          }
          if (params.original_date) {
            const { data, error } = await (supabase as any).rpc("voice_reschedule_booking_by_email", {
              p_email: params.email,
              p_original_date: params.original_date,
              p_new_date: params.new_date,
              p_new_time: params.new_time,
            });
            if (error) throw error;
            if (!data) return "No matching upcoming booking found to reschedule.";
            toast.success("Booking rescheduled via AI agent!");
            return `Booking rescheduled to ${params.new_date} at ${params.new_time}.`;
          }
          return "Please provide a booking ID or original date to reschedule.";
        } catch (err: any) {
          return `Error rescheduling booking: ${err.message}`;
        }
      },
    },
  });

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: AGENT_ID,
        connectionType: "webrtc",
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    } finally {
      setIsConnecting(false);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const isActive = conversation.status === "connected";

  if (variant === "icon") {
    return (
      <div className={`flex flex-col items-start gap-3 ${className}`}>
        <button
          onClick={isActive ? stopConversation : startConversation}
          disabled={isConnecting}
          aria-label={isActive ? "End reception call" : "Call the Reception now"}
          className="inline-flex items-center justify-center gap-2 px-5 h-11 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50 font-semibold text-sm"
          title={isActive ? "End call" : "Call the Reception"}
        >
          <Phone className="w-4 h-4" />
          {isActive ? "End Call" : isConnecting ? "Connecting..." : "Call Now"}
        </button>
        <button
          onClick={isActive ? stopConversation : startConversation}
          disabled={isConnecting}
          className="relative flex items-center gap-3 group"
          title={isActive ? "End call" : "Call now"}
        >
          <div className="relative flex items-center justify-center" style={{ width: 56, height: 56 }}>
            {isActive && <SpeakingWaves isSpeaking={conversation.isSpeaking} />}
            <img
              src={receptionistAvatar}
              alt="AI Receptionist"
              className={`w-12 h-12 rounded-full object-cover border-2 relative z-10 transition-all ${
                isActive ? "border-primary shadow-lg" : "border-border group-hover:border-primary/50"
              }`}
            />
            {isActive && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-card z-20" />
            )}
          </div>
          <div className="text-left">
            <span className="text-xs text-muted-foreground block">
              {isActive ? "On call" : "The Reception"}
            </span>
            <span className="font-semibold text-sm text-foreground">
              {isActive
                ? conversation.isSpeaking
                  ? "Agent speaking..."
                  : "Listening..."
                : "AI Receptionist"}
            </span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {isActive ? (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-card border border-border shadow-card"
          >
            <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
              <SpeakingWaves isSpeaking={conversation.isSpeaking} />
              <img
                src={receptionistAvatar}
                alt="AI Receptionist"
                className="w-20 h-20 rounded-full object-cover border-3 border-primary shadow-lg relative z-10"
              />
              <span className="absolute top-4 right-4 w-4 h-4 bg-accent rounded-full border-2 border-card z-20" />
            </div>
            <div className="text-center">
              <p className="font-heading font-semibold text-foreground">
                {conversation.isSpeaking ? "Agent is speaking..." : "Listening to you..."}
              </p>
              <p className="text-sm text-muted-foreground mt-1">World Changers AI Receptionist</p>
            </div>
            <Button
              onClick={stopConversation}
              variant="destructive"
              size="lg"
              className="w-full"
            >
              <MicOff className="w-4 h-4 mr-2" /> End Call
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="inactive"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center gap-4"
          >
            <button
              onClick={startConversation}
              disabled={isConnecting}
              aria-label="Call the Reception now"
              className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50 font-semibold text-sm w-full max-w-xs"
              title="Call the Reception"
            >
              <Phone className="w-4 h-4" />
              {isConnecting ? "Connecting..." : "Call Now"}
            </button>
            <button
              onClick={startConversation}
              disabled={isConnecting}
              className="group flex flex-col items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
                <motion.div
                  className="absolute rounded-full border-2 border-primary/20"
                  animate={{ width: [80, 96], height: [80, 96], opacity: [0.4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
                <img
                  src={receptionistAvatar}
                  alt="AI Receptionist"
                  className="w-20 h-20 rounded-full object-cover border-2 border-border group-hover:border-primary transition-all shadow-md relative z-10"
                />
              </div>
              <span className="text-xs text-muted-foreground">The Reception · AI Receptionist</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceAgent;
