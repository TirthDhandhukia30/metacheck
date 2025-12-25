import { ArrowLeft, RotateCw, ExternalLink, Globe } from "lucide-react";

interface ResultsHeaderProps {
  onReset: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  hostname: string;
  finalUrl: string;
}

export function ResultsHeader({
  onReset,
  onRefresh,
  isRefreshing,
  hostname,
  finalUrl,
}: ResultsHeaderProps) {
  return (
    <div className="mb-10">
      <div className="bg-background/80 backdrop-blur-md p-2 rounded-2xl border border-border/50 shadow-sm grid grid-cols-[auto_1fr_auto] sm:grid-cols-3 items-center gap-4">
        {/* Left: Back Button */}
        <div className="flex justify-start">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span className="hidden sm:inline">Check another</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>

        {/* Center: Hostname */}
        <div className="flex justify-center min-w-0">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-lg border border-border/50 max-w-full">
            <Globe size={14} className="text-muted-foreground shrink-0" />
            <span className="text-xs font-medium text-foreground truncate">{hostname}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex justify-end items-center gap-1 sm:gap-2">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all disabled:opacity-50"
            title="Refresh analysis"
          >
            <RotateCw size={16} strokeWidth={2} className={isRefreshing ? "animate-spin" : ""} />
          </button>
          <a
            href={finalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
            title="Open URL"
          >
            <ExternalLink size={16} strokeWidth={2} />
          </a>
        </div>
      </div>
    </div>
  );
}
