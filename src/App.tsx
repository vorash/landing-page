import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Technology } from './components/Technology';
import { CTA } from './components/CTA';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
      <Navigation />
      <Hero />
      <Features />
      <Technology />
      <CTA />
      <Footer />
    </div>
  );
}
