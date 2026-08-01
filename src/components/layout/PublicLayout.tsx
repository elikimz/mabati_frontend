import React from "react";
import { Outlet } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "254788873611";

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1" role="main" aria-label="Main content">
        <Outlet />
      </main>
      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${WHATSAPP}?text=Hello MRM Mabati Rolling Mills, I would like to enquire about your roofing products.`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        title="Chat with us on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={26} className="text-white" />
      </a>
    </div>
  );
};
