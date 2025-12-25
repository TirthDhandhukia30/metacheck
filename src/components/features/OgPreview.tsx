import { useState } from "react";
import { getHostname } from "../../lib/utils";
import type { ParsedMetaData, SocialPlatform } from "../../types/meta";
import { PLATFORM_CONFIGS } from "../../types/meta";
import {
  FacebookIcon,
  TwitterIcon,
  LinkedInIcon,
  WhatsAppIcon,
  DiscordIcon
} from "../ui/social-icons";
import {
  FacebookCard,
  TwitterCard,
  LinkedInCard,
  WhatsAppCard,
  DiscordCard
} from "./SocialCards";

interface OgPreviewProps {
  data: ParsedMetaData;
}

const platforms: { key: SocialPlatform; label: string; icon: React.ReactNode }[] = [
  { key: "facebook", label: "Facebook", icon: <FacebookIcon size={18} /> },
  { key: "twitter", label: "X", icon: <TwitterIcon size={18} /> },
  { key: "linkedin", label: "LinkedIn", icon: <LinkedInIcon size={18} /> },
  { key: "whatsapp", label: "WhatsApp", icon: <WhatsAppIcon size={16} /> },
  { key: "discord", label: "Discord", icon: <DiscordIcon size={16} /> },
];

export function OgPreview({ data }: OgPreviewProps) {
  const [platform, setPlatform] = useState<SocialPlatform>("facebook");

  const config = PLATFORM_CONFIGS[platform];
  const image = data.openGraph.image || data.twitter.image;
  const title = data.openGraph.title || data.twitter.title || data.meta.title;
  const description = data.openGraph.description || data.twitter.description || data.meta.description;
  const siteName = data.openGraph.siteName || getHostname(data.url);

  const cardProps = {
    data,
    siteName,
    title: title || "No title",
    description,
    image
  };

  const renderCard = () => {
    switch (platform) {
      case "facebook": return <FacebookCard {...cardProps} />;
      case "twitter": return <TwitterCard {...cardProps} />;
      case "linkedin": return <LinkedInCard {...cardProps} />;
      case "whatsapp": return <WhatsAppCard {...cardProps} />;
      case "discord": return <DiscordCard {...cardProps} />;
      default: return <FacebookCard {...cardProps} />;
    }
  };

  return (
    <div>
      {/* Platform Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {platforms.map((p) => (
          <button
            key={p.key}
            onClick={() => setPlatform(p.key)}
            title={p.label}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${platform === p.key
                ? "ring-2 ring-foreground/20 bg-muted"
                : "opacity-60 hover:opacity-100 hover:bg-muted"
              }
            `}
          >
            {p.icon}
          </button>
        ))}
      </div>

      {/* Preview Card */}
      {renderCard()}

      <p className="text-xs text-muted-foreground mt-3">
        {config.imageAspect} aspect ratio • {config.name}
      </p>
    </div>
  );
}
