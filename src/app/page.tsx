import Navbar from "@/components/pages/landing/Navbar";
import Hero from "@/components/pages/landing/Hero";
import Features from "@/components/pages/landing/Features";
import Footer from "@/components/pages/landing/Footer";

export default function RootPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}