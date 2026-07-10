const PROFILE_IMAGE_CDN_HASH_PATTERN = /^[a-f0-9_]+$/i;
const PROFILE_IMAGE_EXTERNAL_URL_PATTERN = /^https?:\/\//i;
const PROFILE_IMAGE_VIDEO_URL_PATTERN = /\.mp4(\?|$)/i;

export function isProfileImageCdnHash(src: string): boolean {
  return PROFILE_IMAGE_CDN_HASH_PATTERN.test(src);
}

export function isProfileImageExternalUrl(src: string): boolean {
  return PROFILE_IMAGE_EXTERNAL_URL_PATTERN.test(src);
}

export function isProfileImageVideoUrl(url: string): boolean {
  return PROFILE_IMAGE_VIDEO_URL_PATTERN.test(url);
}

export function resolveProfileImageBlockUrl(
  src: string | null | undefined,
  constructCdnUrl: (hash: string, animated: boolean) => string | null
): string | null {
  if (!src) return null;
  if (isProfileImageExternalUrl(src)) return src;
  if (isProfileImageCdnHash(src)) {
    return constructCdnUrl(src, src.startsWith("a_"));
  }
  return constructCdnUrl(src, false);
}

export function resolveGifImageBlockSrc(gif: {
  url: string;
  preview?: string;
}): string {
  const url = gif.url.trim();
  const preview = gif.preview?.trim() ?? "";

  if (isProfileImageVideoUrl(url)) return url;

  if (preview) {
    if (url.includes("klipy.com/gifs/") && !/\.(gif|mp4|webp)/i.test(url)) {
      return preview;
    }
    if (!isProfileImageVideoUrl(preview)) return preview;
  }

  return url;
}

export function resolveFavoriteGifImageBlockSrc(entry: string): string {
  const [primary, preview] = entry.split("|").map((part) => part.trim());
  if (preview) return preview;
  return primary;
}
