import { useState, useEffect } from "react";
import { Github, Sun, Moon } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

function GitHubStars() {
  const [stars, setStars] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const res = await fetch('https://api.github.com/repos/tirthh18/og');
        if (res.ok) setStars((await res.json()).stargazers_count);
      } catch {
        // Silently fail
      }
    };
    fetchStars();
    const interval = setInterval(fetchStars, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatStars = (count: number) =>
    count >= 1000 ? (count / 1000).toFixed(count >= 10000 ? 0 : 1) + 'k' : count.toString();

  return (
    <div className="relative">
      <a
        href="https://github.com/tirthh18/og"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-all text-foreground"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Github size={14} strokeWidth={1.5} />
        {stars !== null && <span className="text-xs font-medium">{formatStars(stars)}</span>}
      </a>
      {isHovered && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs bg-foreground text-background rounded-md whitespace-nowrap z-50">
          Star on GitHub
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <nav className="mx-auto max-w-3xl px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="text-sm font-semibold text-foreground hover:opacity-70 transition-opacity tracking-tight"
        >
          MetaCheck
        </a>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* GitHub Stars */}
          <GitHubStars />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={16} strokeWidth={1.5} />
            ) : (
              <Moon size={16} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
