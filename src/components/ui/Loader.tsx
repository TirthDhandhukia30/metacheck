import { motion } from "framer-motion";

export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative w-12 h-12">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 flex justify-center"
            style={{ transform: `rotate(${i * 30}deg)` }}
          >
            <motion.div
              className="w-[8%] h-[28%] bg-foreground rounded-full mt-[2%]"
              animate={{ opacity: [1, 0.25] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "linear",
                delay: -1.2 + i * 0.1,
              }}
            />
          </div>
        ))}
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
