import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesCore } from "@/components/ui/sparkles";
import { PointerHighlight } from "@/components/ui/pointer-highlight";

interface HeroProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  isHidden: boolean;
}

export function Hero({ onSubmit, isLoading, isHidden }: HeroProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Enter a URL to inspect");
      return;
    }

    const urlPattern = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/[\w\-./?%&=]*)?$/i;
    if (!urlPattern.test(url.trim())) {
      setError("Enter a valid URL");
      return;
    }

    onSubmit(url.trim());
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  if (isHidden) return null;

  return (
    <section className="min-h-[calc(100vh-56px)] mt-14 flex items-center justify-center px-6">
      <div className="w-full max-w-2xl mx-auto text-center -mt-20">
        {/* Main Headline */}
        <h1 className="mb-6 flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
          <PointerHighlight
            containerClassName=""
            rectangleClassName="rounded-lg border-foreground/20 bg-muted/30"
            pointerClassName="text-foreground"
          >
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight block relative z-10">
              Open Graph
            </span>
          </PointerHighlight>
          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            previews made simple.
          </span>
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-sm text-muted-foreground mb-10"
        >
          Preview Open Graph tags for any URL. Optimize for social.
        </motion.p>

        {/* Universal Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="w-full max-w-xl mx-auto"
        >
          <div
            className={`
              relative flex items-center gap-3
              rounded-xl border bg-muted
              px-4 py-3
              transition-all duration-200
              cursor-text
              ${isFocused
                ? 'border-foreground/20 ring-1 ring-foreground/10'
                : 'border-border hover:border-foreground/20'
              }
            `}
            onClick={() => document.getElementById("url-input")?.focus()}
          >
            {/* Search Icon */}
            <Search size={16} strokeWidth={1.5} className="text-muted-foreground shrink-0" />

            {/* Input */}
            <div className="flex-1 relative">
              <input
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError("");
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                placeholder="Enter any URL to inspect..."
                disabled={isLoading}
              />
            </div>

            {/* Loading indicator */}
            {isLoading && (
              <Loader2 size={16} className="animate-spin text-muted-foreground shrink-0" />
            )}
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 mt-2 text-red-500 text-xs font-medium"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sparkles */}
          <div className="relative w-full max-w-xl mx-auto mt-1 h-24 overflow-hidden [mask-image:radial-gradient(ellipse_50%_100%_at_50%_0%,black_40%,transparent_100%)]">
            {/* Gradient line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={80}
              particleColor="#FFFFFF"
              className="w-full h-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
