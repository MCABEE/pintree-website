"use client";

import { useEffect, useState } from "react";

export function resolveProfileImageUrl(source) {
  if (!source) return "";
  if (typeof source === "string") return source.trim();

  const candidates = [
    source.profileImageUrl,
    source.profileImage,
    source.profilePic,
    source.profilePicture,
    source.avatarUrl,
    source.avatar,
    source.photoUrl,
    source.photo,
    source.imageUrl,
    source.image,
    source.media?.url,
    source.profileMedia?.url,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export function getUserInitial(name) {
  const text = String(name || "").trim();
  if (!text) return "P";
  return text.charAt(0).toUpperCase();
}

/**
 * Shows user initial/icon first; swaps to API photo when it loads successfully.
 */
export default function UserAvatar({
  name = "",
  src = "",
  profile = null,
  sizeClass = "w-16 h-16",
  textClass = "text-[22px]",
  alt,
  className = "",
}) {
  const imageSrc = src || resolveProfileImageUrl(profile);
  const initial = getUserInitial(name);
  const [loadedSrc, setLoadedSrc] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoadedSrc("");
    setFailed(false);
    if (!imageSrc) return;

    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setLoadedSrc(imageSrc);
    };
    img.onerror = () => {
      if (!cancelled) setFailed(true);
    };
    img.src = imageSrc;

    return () => {
      cancelled = true;
    };
  }, [imageSrc]);

  const showPhoto = Boolean(loadedSrc) && !failed;

  return (
    <div
      className={`relative ${sizeClass} rounded-full overflow-hidden border border-[#e4e2e1] flex-shrink-0 bg-[#f6f3f2] flex items-center justify-center ${className}`}
    >
      <span
        className={`${textClass} font-semibold text-[#444748] select-none`}
        aria-hidden={showPhoto}
      >
        {initial}
      </span>
      {showPhoto ? (
        <img
          alt={alt || name || "User avatar"}
          src={loadedSrc}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
    </div>
  );
}
