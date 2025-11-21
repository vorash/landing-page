import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logo from "figma:asset/56c1b48946cb3dda8fe48e817c7791c546b7dd92.png";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0a0f]/80 transition-all duration-300 ${isScrolled ? 'border-b border-zinc-800/50' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex-shrink-0 cursor-pointer">
            <img src={logo} alt="Vora" className="h-18" />
          </a>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-zinc-400 hover:text-white transition-colors text-sm cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-zinc-400 hover:text-white transition-colors text-sm cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("technology")}
              className="text-zinc-400 hover:text-white transition-colors text-sm cursor-pointer"
            >
              Technology
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="px-4 py-2 bg-cyan-500 text-black rounded-md hover:bg-cyan-400 transition-colors text-sm cursor-pointer"
            >
              Get Started
            </button>
          </div>

          <button
            className="md:hidden text-zinc-400 hover:text-white cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-zinc-800/50 bg-[#0a0a0f]">
          <div className="px-4 py-4 space-y-2">
            <button
              onClick={() => scrollToSection("home")}
              className="block w-full text-left px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-900/50 rounded-md transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="block w-full text-left px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-900/50 rounded-md transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("technology")}
              className="block w-full text-left px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-900/50 rounded-md transition-colors cursor-pointer"
            >
              Technology
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left px-4 py-2 bg-cyan-500 text-black rounded-md hover:bg-cyan-400 transition-colors cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}