import { OgPreview } from "./OgPreview";
import { MetaDetails } from "./MetaDetails";
import { ResultsHeader } from "./ResultsHeader";
import { getHostname } from "../../lib/utils";
import type { ParsedMetaData } from "../../types/meta";

interface ResultsProps {
  data: ParsedMetaData;
  onReset: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function Results({ data, onReset, onRefresh, isRefreshing }: ResultsProps) {
  const hostname = getHostname(data.finalUrl);

  return (
    <section className="min-h-screen pt-20 pb-20 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-5xl mx-auto">
        <ResultsHeader
          onReset={onReset}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
          hostname={hostname}
          finalUrl={data.finalUrl}
        />

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Visual Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-foreground tracking-tight">Social Preview</h2>
                <p className="text-xs text-muted-foreground">How your content appears on social feeds</p>
              </div>
              <OgPreview data={data} />
            </div>
          </div>

          {/* Right Column: Metadata Details */}
          <div className="lg:col-span-7">
            <div className="bg-card/50 border border-border/50 rounded-2xl p-1 sm:p-2">
              <div className="bg-background rounded-xl border border-border shadow-sm p-6 sm:p-8">
                <h2 className="text-sm font-semibold text-foreground tracking-tight mb-6">Metadata Analysis</h2>
                <MetaDetails data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
