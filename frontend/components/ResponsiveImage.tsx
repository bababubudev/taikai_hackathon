import Image from "next/image";
import { useState } from "react";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

export default function ResponsiveImage({
  src,
  alt,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  className = "",
  width,
  height,
}: ResponsiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${isLoading ? "animate-pulse bg-base-300" : ""}`}>
      <Image
        src={src}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className={`transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"} ${className}`}
        onLoadingComplete={() => setIsLoading(false)}
        fill={!width || !height}
        width={width}
        height={height}
        quality={85}
      />
    </div>
  );
}