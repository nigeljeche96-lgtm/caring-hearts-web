import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Globe, ShieldCheck, ArrowRight, ChevronDown, ExternalLink, Lock, Landmark, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const DONORBOX_SLUG = "international-payments";
const DONORBOX_URL = `https://donorbox.org/${DONORBOX_SLUG}`;


