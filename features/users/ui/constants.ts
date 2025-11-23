export const MAX_AVATAR_BYTES = 0.5 * 1024 * 1024;

const BYTES_PER_MEGABYTE = 1024 * 1024;

export const MAX_AVATAR_SIZE_LABEL = `${MAX_AVATAR_BYTES / BYTES_PER_MEGABYTE}MB`;
export const AVATAR_SIZE_ERROR_FALLBACK = `Avatar must be no larger than ${MAX_AVATAR_SIZE_LABEL}.`;

export const AVATAR_ACCEPT_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
] as const;

export const AVATAR_ACCEPT_ATTRIBUTE = AVATAR_ACCEPT_MIME_TYPES.join(",");
