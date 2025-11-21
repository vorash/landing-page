import { Zap, Lock, Cpu, GitBranch, Layers, Gauge } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for speed with intelligent caching and edge deployment.',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'Zero-trust architecture with end-to-end encryption by default.',
  },
  {
    icon: Cpu,
    title: 'AI-Powered Automation',
    description: 'Intelligent workflows that learn and adapt to your patterns.',
  },
  {
    icon: GitBranch,
    title: 'Version Control',
    description: 'Built-in versioning and rollback for every deployment.',
  },
  {
    icon: Layers,
    title: 'Modular Architecture',
    description: 'Composable components that scale with your needs.',
  },
  {
    icon: Gauge,
    title: 'Real-time Monitoring',
    description: 'Comprehensive observability with microsecond precision.',
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-32 border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-sm text-cyan-400 mb-4">
            Features
          </div>
          <h2 className="text-4xl sm:text-5xl tracking-tight mb-4">
            Built for <span className="text-cyan-400">performance</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Every feature designed with developer experience and system efficiency in mind
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-6 bg-zinc-950/50 border border-zinc-800/50 rounded-lg hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                <div className="relative">
                  <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center mb-4 group-hover:border-cyan-500/50 transition-colors">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-lg mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          <div className="p-6 bg-zinc-950/50 border border-zinc-800/50 rounded-lg text-center">
            <div className="text-3xl text-cyan-400 mb-2">99.99%</div>
            <div className="text-sm text-zinc-400">Uptime SLA</div>
          </div>
          <div className="p-6 bg-zinc-950/50 border border-zinc-800/50 rounded-lg text-center">
            <div className="text-3xl text-cyan-400 mb-2">{'<'}10ms</div>
            <div className="text-sm text-zinc-400">Avg Latency</div>
          </div>
          <div className="p-6 bg-zinc-950/50 border border-zinc-800/50 rounded-lg text-center">
            <div className="text-3xl text-cyan-400 mb-2">10k+</div>
            <div className="text-sm text-zinc-400">Deployments/Day</div>
          </div>
          <div className="p-6 bg-zinc-950/50 border border-zinc-800/50 rounded-lg text-center">
            <div className="text-3xl text-cyan-400 mb-2">24/7</div>
            <div className="text-sm text-zinc-400">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}