import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export function CTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <section id="contact" className="relative py-32 border-t border-zinc-800/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative p-12 bg-gradient-to-br from-zinc-950/80 to-zinc-900/80 border border-zinc-800/50 rounded-2xl overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
          
          <div className="relative text-center space-y-8">
            <div>
              <h2 className="text-4xl sm:text-5xl tracking-tight mb-4">
                Ready to build the future?
              </h2>
              <p className="text-lg text-zinc-400">
                Join thousands of developers shipping at lightning speed
              </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@company.com"
                  required
                  className="flex-1 px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={submitted}
                  className="px-6 py-3 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-all disabled:bg-green-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {submitted ? (
                    <>
                      <Check className="w-4 h-4" />
                      Sent
                    </>
                  ) : (
                    <>
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-zinc-500 mt-3">
                Start with our free tier. No credit card required.
              </p>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-8 pt-4 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400" />
                <span>Deploy in seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400" />
                <span>Expert support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
