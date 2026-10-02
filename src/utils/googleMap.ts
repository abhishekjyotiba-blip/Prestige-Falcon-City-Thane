export const MAP_PROJECT_IDENTITY = "Prestige Falcon City Thane";

/** Owner-confirmed site and its Google Share -> Embed URL; never a search guess. */
export interface ApprovedGoogleMap {
  projectIdentity: string;
  approvalStatus: "approved";
  verifiedOn: string;
  shareUrl: string;
  embedUrl: string;
}

function publicHttpsUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.port
      ? url
      : null;
  } catch {
    return null;
  }
}

/** Validate the config boundary, not the geographical truth of an unverified link. */
export function getApprovedGoogleMap(
  candidate: ApprovedGoogleMap | null | undefined,
): ApprovedGoogleMap | null {
  if (!candidate || candidate.approvalStatus !== "approved" ||
      candidate.projectIdentity !== MAP_PROJECT_IDENTITY ||
      !Number.isFinite(Date.parse(candidate.verifiedOn))) return null;
  const embed = publicHttpsUrl(candidate.embedUrl);
  const share = publicHttpsUrl(candidate.shareUrl);
  if (!embed || !share ||
      embed.hostname !== "www.google.com" ||
      !/^\/maps\/embed\/?$/.test(embed.pathname) ||
      !embed.searchParams.get("pb")) return null;
  const googleShare = ["www.google.com", "google.com"].includes(share.hostname) &&
    /^\/maps(?:\/|$)/.test(share.pathname);
  const shortShare = share.hostname === "maps.app.goo.gl" && share.pathname.length > 1;
  if (!googleShare && !shortShare) return null;
  return candidate;
}
