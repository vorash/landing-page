import { ImageWithFallback } from './figma/ImageWithFallback';

const techStack = [
  { name: 'Kubernetes', category: 'Orchestration' },
  { name: 'WebAssembly', category: 'Runtime' },
  { name: 'GraphQL', category: 'API Layer' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Redis', category: 'Cache' },
  { name: 'Terraform', category: 'IaC' },
];

export function Technology() {
  return (
    <section id="technology" className="relative py-32 border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-400 mb-4">
            Technology
          </div>
          <h2 className="text-4xl sm:text-5xl tracking-tight mb-4">
            Powered by <span className="text-purple-400">modern infrastructure</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Built on battle-tested technologies that scale from prototype to production
          </p>
        </div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Tech stack */}
          <div className="space-y-4">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-lg hover:border-purple-500/50 transition-colors"
              >
                <div>
                  <div className="text-white">{tech.name}</div>
                  <div className="text-sm text-zinc-500">{tech.category}</div>
                </div>
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
              </div>
            ))}

            <div className="pt-6">
              <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-lg">
                <p className="text-sm text-zinc-300">
                  <span className="text-cyan-400">→</span> Full API documentation and SDK available for all major languages
                </p>
              </div>
            </div>
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative rounded-lg overflow-hidden h-64 border border-zinc-800/50">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1658806300183-342fe517d68f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwdGVjaG5vbG9neSUyMGFic3RyYWN0fGVufDF8fHx8MTc2MzY1NTM4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Digital technology"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
            </div>
            <div className="relative rounded-lg overflow-hidden h-64 border border-zinc-800/50 translate-y-8">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1640552421163-5a8e34827550?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXJjdWl0JTIwYm9hcmQlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MzYzNDc1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Circuit board"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
            </div>
            <div className="relative rounded-lg overflow-hidden h-48 border border-zinc-800/50 col-span-2">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1651955784685-f969100bfc25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkYXRhJTIwY2VudGVyfGVufDF8fHx8MTc2MzY1NTM5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Data center"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
