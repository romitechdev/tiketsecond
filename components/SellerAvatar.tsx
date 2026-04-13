"use client";

import { useMemo, useState } from "react";

type SellerAvatarProps = {
  name?: string | null;
  image?: string | null;
  className?: string;
};

export default function SellerAvatar({ name, image, className = "" }: SellerAvatarProps) {
  const [hasError, setHasError] = useState(false);

  const sellerName = (name || "Penjual").trim() || "Penjual";
  const sellerInitial = useMemo(() => sellerName.charAt(0).toUpperCase(), [sellerName]);
  const sellerImage = (image || "").trim();

  const isValidUrl =
    sellerImage.startsWith("https://") ||
    sellerImage.startsWith("http://") ||
    sellerImage.startsWith("/");

  if (!isValidUrl || hasError) {
    return (
      <div className={`w-full h-full bg-gray-300 flex items-center justify-center text-xl font-black uppercase tracking-tight ${className}`}>
        {sellerInitial}
      </div>
    );
  }

  return (
    <img
      src={sellerImage}
      alt={`Avatar ${sellerName}`}
      className={`w-full h-full object-cover filter grayscale contrast-125 ${className}`}
      onError={() => setHasError(true)}
    />
  );
}
