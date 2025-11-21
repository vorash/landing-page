import { ArrowRight, Terminal } from "lucide-react";
import logo from "figma:asset/56c1b48946cb3dda8fe48e817c7791c546b7dd92.png";

export function Hero() {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-16"
    >
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272f_1px,transparent_1px),linear-gradient(to_bottom,#27272f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-full text-sm text-zinc-400">
            <Terminal className="w-3.5 h-3.5 text-cyan-500" />
            <span>Cloud-Native Engineering Platform</span>
          </div>

          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight">
              <span className="block text-white">Build at</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent pb-2">
                lightning speed
              </span>
            </h1>
          </div>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-400 leading-relaxed">
            High-performance engineering tools for modern
            developers. <br />
            Deploy intelligent automation to vora.sh with
            precision and confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={scrollToContact}
              className="group px-6 py-3 bg-cyan-500 text-black rounded-md hover:bg-cyan-400 transition-all flex items-center gap-2 cursor-pointer"
            >
              Start Building
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-6 py-3 border border-zinc-800 text-white rounded-md hover:bg-zinc-900/50 transition-all cursor-pointer"
            >
              View Features
            </button>
          </div>

          {/* Logo showcase */}
          <div className="pt-16">
            <div className="inline-block p-8 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-zinc-800/50 rounded-xl backdrop-blur-sm">
              <img
                src={logo}
                alt="vora"
                className="h-20 sm:h-24"
              />
            </div>
          </div>

          {/* Code snippet preview */}
          <div className="pt-8 max-w-3xl mx-auto">
            <div className="p-6 bg-zinc-950/50 border border-zinc-800/50 rounded-lg text-left">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <pre className="text-sm overflow-x-auto">
                <code className="text-zinc-400">
                  <span className="text-cyan-400">
                    curl -sL vora.sh | bash
                  </span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}