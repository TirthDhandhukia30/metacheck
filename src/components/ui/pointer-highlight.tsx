"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useRef, useEffect, useState } from "react";

export function PointerHighlight({
  children,
  rectangleClassName,
  pointerClassName,
  containerClassName,
}: {
  children: React.ReactNode;
  rectangleClassName?: string;
  pointerClassName?: string;
  containerClassName?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div
      className={cn("relative w-fit", containerClassName)}
      ref={containerRef}
    >
      {children}
      {dimensions.width > 0 && dimensions.height > 0 && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 0.95, originX: 0, originY: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            className={cn(
              "absolute border border-neutral-800 dark:border-neutral-200",
              rectangleClassName,
            )}
            style={{
              top: -4,
              left: -4,
            }}
            initial={{
              width: 0,
              height: 0,
              opacity: 0,
            }}
            whileInView={{
              width: [0, dimensions.width + 8, dimensions.width + 8, dimensions.width + 8],
              height: [0, dimensions.height + 8, dimensions.height + 8, dimensions.height + 8],
              opacity: [0, 1, 1, 0],
            }}
            viewport={{ once: true }}
            transition={{
              duration: 3.5,
              times: [0, 0.2, 0.9, 1],
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="pointer-events-none absolute"
            initial={{ opacity: 0 }}
            whileInView={{
              opacity: [0, 1, 1, 0],
              x: [-4, dimensions.width + 4, dimensions.width + 4, dimensions.width + 4],
              y: [-4, dimensions.height + 4, dimensions.height + 4, dimensions.height + 4],
            }}
            viewport={{ once: true }}
            style={{
              rotate: -90,
            }}
            transition={{
              duration: 3.5,
              times: [0, 0.2, 0.9, 1],
              ease: "easeInOut",
            }}
          >
            <Pointer
              className={cn("h-5 w-5 text-blue-500", pointerClassName)}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

const Pointer = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"></path>
    </svg>
  );
};
