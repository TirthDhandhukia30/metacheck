import { Check, X } from "lucide-react";
import type { ParsedMetaData, MetaSuggestion } from "../../types/meta";

interface MetaDetailsProps {
  data: ParsedMetaData;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 last:mb-0">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
        {title}
      </h3>
      <div className="space-y-0">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value?: string; mono?: boolean }) {
  return (
    <div className="py-2 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 border-b border-border/30 last:border-0">
      <span className="text-xs text-muted-foreground sm:w-32 shrink-0">
        {label}
      </span>
      {value ? (
        <span className={`text-sm text-foreground break-all ${mono ? "font-mono text-xs" : ""}`}>
          {value}
        </span>
      ) : (
        <span className="text-sm text-muted-foreground/40">—</span>
      )}
    </div>
  );
}

function StatusRow({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className="py-2 flex items-center gap-3 border-b border-border/30 last:border-0">
      {passed ? (
        <Check size={14} strokeWidth={2} className="text-foreground" />
      ) : (
        <X size={14} strokeWidth={2} className="text-muted-foreground/40" />
      )}
      <span className={`text-sm ${passed ? "text-foreground" : "text-muted-foreground/40"}`}>
        {label}
      </span>
    </div>
  );
}

function SuggestionRow({ suggestion }: { suggestion: MetaSuggestion }) {
  return (
    <div className="py-3 border-b border-border/30 last:border-0">
      <div className="flex items-start gap-3">
        <span className="text-muted-foreground/40 mt-0.5">•</span>
        <div>
          <p className="text-sm text-foreground">
            <code className="text-xs font-mono text-muted-foreground mr-2">{suggestion.tag}</code>
            {suggestion.message}
          </p>
        </div>
      </div>
    </div>
  );
}

export function MetaDetails({ data }: MetaDetailsProps) {
  return (
    <div className="space-y-8">
      <Section title="Basic">
        <Row label="Title" value={data.meta.title} />
        <Row label="Description" value={data.meta.description} />
      </Section>

      <Section title="Open Graph">
        <Row label="og:title" value={data.openGraph.title} />
        <Row label="og:description" value={data.openGraph.description} />
        <Row label="og:image" value={data.openGraph.image} mono />
        <Row label="og:type" value={data.openGraph.type} mono />
        <Row label="og:site_name" value={data.openGraph.siteName} />
      </Section>

      <Section title="Twitter">
        <Row label="twitter:card" value={data.twitter.card} mono />
        <Row label="twitter:title" value={data.twitter.title} />
        <Row label="twitter:image" value={data.twitter.image} mono />
      </Section>

      <Section title="Technical">
        <StatusRow label="HTTPS" passed={data.technical.isHttps} />
        <StatusRow label="Viewport" passed={!!data.technical.viewport} />
        <StatusRow label="Structured data" passed={data.technical.hasStructuredData} />
      </Section>

      {data.suggestions.length > 0 && (
        <Section title="Issues">
          {data.suggestions.map((s, i) => (
            <SuggestionRow key={i} suggestion={s} />
          ))}
        </Section>
      )}
    </div>
  );
}
