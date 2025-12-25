import { motion } from "framer-motion";

export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Outer rotating square */}
        <motion.div
          className="absolute inset-0 border-2 border-foreground/20 rounded-2xl"
          animate={{
            rotate: 180,
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Inner reverse rotating circle */}
        <motion.div
          className="absolute inset-3 border-2 border-foreground/60 rounded-full border-t-transparent"
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        {/* Center dot */}
        <motion.div
          className="w-2 h-2 bg-foreground rounded-full"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-medium text-foreground tracking-tight">
          Analyzing content
        </p>
        <p className="text-xs text-muted-foreground">
          Fetching metadata and previews...
        </p>
      </div>
    </div>
  );
}
