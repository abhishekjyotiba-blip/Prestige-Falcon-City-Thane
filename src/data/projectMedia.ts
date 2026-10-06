/** Current campaign label, NOT primary-source confirmation of publication identity. */
export const CAMPAIGN_PROJECT_IDENTITY = "Prestige Falcon City Thane";
export const PROJECT_IDENTITY_PUBLICATION_STATUS = "pending_data_owner_verification";

export interface LocalImageVariant {
  readonly src: string;
  readonly width: number;
  readonly height: number;
}

/** Public-safe provenance only. Never include protected URLs or private object keys. */
export interface ProjectMediaRecord {
  readonly id: string;
  readonly kind: "project-image" | "brand" | "illustration";
  readonly projectIdentity: string;
  readonly sourceUrl: string;
  readonly verifiedOn: string;
  readonly sourceProvenance: string;
  readonly projectIdentityVerified: boolean;
  readonly approvalStatus: "approved" | "pending" | "excluded";
  readonly depiction: "photograph" | "render" | "illustration";
  readonly alt: string;
  readonly image: LocalImageVariant;
  readonly variants?: readonly LocalImageVariant[];
}

// Research 2026-10-02 found no verified, approved Thane project photographs/renders.
export const PROJECT_GALLERY_IMAGES: readonly ProjectMediaRecord[] = [];

// Corporate identity is separate from gallery imagery; asset owned by BrandMark.
export const PRESTIGE_BRAND_SOURCE = {
  kind: "brand",
  projectIdentity: "Prestige Group corporate identity",
  sourceUrl: "https://d1t2fddy6amcvs.cloudfront.net/images/logo.svg",
  verifiedOn: "2026-10-02",
  sourceProvenance: "Embedded by https://www.prestigeconstructions.com/",
  approvalStatus: "approved",
} as const;

export const ILLUSTRATIVE_GALLERY_FALLBACK = {
  id: "existing-illustrative-exterior",
  kind: "illustration",
  depiction: "illustration",
  projectIdentityVerified: false,
  approvalStatus: "pending",
  alt: "Illustrative residential architecture; not a rendering of this project",
  label: "Illustrative image · Project imagery pending verification",
  width: 1600,
  height: 779,
} as const;

/** Reviewed offline output only; prompt/job references stay outside the public bundle. */
export interface GeneratedConceptRecord {
  readonly id: string;
  readonly kind: "generated-concept";
  readonly depiction: "ai-illustration";
  readonly approvalStatus: "approved" | "pending" | "excluded";
  readonly generatedOn: string;
  readonly generator: string;
  readonly conceptLabel: string;
  /** Must explicitly identify the scene as illustrative, not actual project imagery. */
  readonly alt: string;
  readonly image: LocalImageVariant;
  readonly variants?: readonly LocalImageVariant[];
}

// No output has been generated/reviewed yet. Add imported optimized local WebP/AVIF
// assets here only after visual review, with actual generation date and generator.
export const PROJECT_CONCEPT_IMAGES: readonly GeneratedConceptRecord[] = [];
export type AmenityCategory = "amenities" | "facilities";
export const AMENITY_CONCEPT_IMAGES: Readonly<Record<AmenityCategory, readonly GeneratedConceptRecord[]>> = {
  amenities: [],
  facilities: [],
};
export const GALLERY_CONCEPT_QUALIFIER = "AI-generated illustrative concept · Not an actual project image";
export const AMENITY_CONCEPT_QUALIFIER = "AI-generated illustrative concept · Not a confirmed project amenity";
