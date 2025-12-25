import { ImageOff } from "lucide-react";
import type { ParsedMetaData } from "../../types/meta";

interface CardProps {
  data: ParsedMetaData;
  siteName: string;
  title: string;
  description?: string;
  image?: string;
}

export const PreviewImage = ({
  image,
  title,
  alt
}: {
  image?: string;
  title: string;
  alt?: string
}) => {
  if (!image) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted">
        <ImageOff size={24} strokeWidth={1} />
        <span className="text-xs">No image</span>
      </div>
    );
  }

  return (
    <>
      <img
        src={image}
        alt={alt || title || "Preview"}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          const placeholder = target.nextElementSibling as HTMLElement;
          if (placeholder) placeholder.style.display = "flex";
        }}
      />
      <div className="hidden absolute inset-0 flex-col items-center justify-center gap-2 text-muted-foreground bg-muted">
        <ImageOff size={24} strokeWidth={1} />
        <span className="text-xs">No image</span>
      </div>
    </>
  );
};

export const FacebookCard = ({ siteName, title, description, image, data }: CardProps) => (
  <div className="rounded-lg overflow-hidden bg-[#242526] border border-[#3a3b3c]">
    <div
      className="relative bg-[#18191a] flex items-center justify-center"
      style={{ aspectRatio: "1.91 / 1" }}
    >
      <PreviewImage image={image} title={title} alt={data.openGraph.imageAlt} />
    </div>
    <div className="p-3 bg-[#242526]">
      <div className="text-[11px] text-[#b0b3b8] uppercase tracking-wide mb-1">
        {siteName}
      </div>
      <div className="text-[15px] font-semibold text-[#e4e6eb] line-clamp-2 leading-tight">
        {title || "No title"}
      </div>
      {description && (
        <div className="text-[13px] text-[#b0b3b8] line-clamp-1 mt-1">
          {description}
        </div>
      )}
    </div>
  </div>
);

export const TwitterCard = ({ siteName, title, description, image, data }: CardProps) => (
  <div className="rounded-2xl overflow-hidden bg-black border border-[#2f3336]">
    <div
      className="relative bg-[#16181c] flex items-center justify-center"
      style={{ aspectRatio: "1.91 / 1" }}
    >
      <PreviewImage image={image} title={title} alt={data.openGraph.imageAlt} />
      <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded text-[13px] text-white">
        {siteName}
      </div>
    </div>
    <div className="p-3 bg-black">
      <div className="text-[15px] text-[#e7e9ea] line-clamp-2 leading-tight">
        {title || "No title"}
      </div>
      {description && (
        <div className="text-[13px] text-[#71767b] line-clamp-2 mt-0.5">
          {description}
        </div>
      )}
    </div>
  </div>
);

export const LinkedInCard = ({ siteName, title, image, data }: CardProps) => (
  <div className="rounded-lg overflow-hidden bg-[#1b1f23] border border-[#38434f]">
    <div
      className="relative bg-[#0d0f11] flex items-center justify-center"
      style={{ aspectRatio: "1.91 / 1" }}
    >
      <PreviewImage image={image} title={title} alt={data.openGraph.imageAlt} />
    </div>
    <div className="p-3 bg-[#1b1f23]">
      <div className="text-[14px] font-semibold text-white line-clamp-2 leading-tight">
        {title || "No title"}
      </div>
      <div className="text-[12px] text-[#ffffff99] mt-1">
        {siteName}
      </div>
    </div>
  </div>
);

export const WhatsAppCard = ({ siteName, title, description, image, data }: CardProps) => (
  <div className="rounded-lg overflow-hidden bg-[#202c33] border border-[#2a3942]">
    <div
      className="relative bg-[#111b21] flex items-center justify-center"
      style={{ aspectRatio: "1.91 / 1" }}
    >
      <PreviewImage image={image} title={title} alt={data.openGraph.imageAlt} />
    </div>
    <div className="p-2.5 bg-[#202c33]">
      <div className="text-[14px] text-[#e9edef] line-clamp-2 leading-tight">
        {title || "No title"}
      </div>
      {description && (
        <div className="text-[12px] text-[#8696a0] line-clamp-2 mt-0.5">
          {description}
        </div>
      )}
      <div className="text-[11px] text-[#8696a0] mt-1 flex items-center gap-1">
        <span>🔗</span> {siteName}
      </div>
    </div>
  </div>
);

export const DiscordCard = ({ siteName, title, description, image, data }: CardProps) => (
  <div className="rounded-lg overflow-hidden bg-[#2b2d31] border-l-4 border-l-[#5865f2] pl-3 py-2 pr-2">
    <div className="text-[12px] text-[#00a8fc] font-medium mb-1">
      {siteName}
    </div>
    <div className="text-[16px] font-semibold text-[#00a8fc] hover:underline line-clamp-1 mb-1">
      {title || "No title"}
    </div>
    {description && (
      <div className="text-[14px] text-[#dbdee1] line-clamp-2 mb-2">
        {description}
      </div>
    )}
    {image && (
      <div
        className="relative bg-[#1e1f22] rounded overflow-hidden flex items-center justify-center mt-2"
        style={{ aspectRatio: "1.91 / 1", maxWidth: "400px" }}
      >
        <PreviewImage image={image} title={title} alt={data.openGraph.imageAlt} />
      </div>
    )}
  </div>
);
