export interface DecodedToken {
  sub: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/;
const decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-8") : null;

function normalizeBase64Segment(segment: string) {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  if (!BASE64_PATTERN.test(normalized)) {
    return null;
  }

  const paddingRemainder = normalized.length % 4;
  const padding = paddingRemainder === 0 ? "" : "=".repeat(4 - paddingRemainder);
  return normalized + padding;
}

function decodePayload(base64Segment: string) {
  const normalized = normalizeBase64Segment(base64Segment);
  if (!normalized) {
    return null;
  }

  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  if (decoder) {
    return decoder.decode(bytes);
  }

  let fallback = "";
  bytes.forEach((byte) => {
    fallback += String.fromCharCode(byte);
  });
  return fallback;
}

function isValidJsonStructure(value: string) {
  if (!value) {
    return false;
  }

  const sanitized = value
    .replace(/\\["\\\/bfnrtu]/g, "@")
    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
    .replace(/(?:^|:|,)(?:\s*\[)+/g, "");

  return /^[\],:{}\s]*$/.test(sanitized);
}

function isDecodedToken(value: unknown): value is DecodedToken {
  if (!value || typeof value !== "object") {
    return false;
  }

  const token = value as Partial<DecodedToken>;
  return (
    typeof token.sub === "number" &&
    typeof token.email === "string" &&
    typeof token.role === "string" &&
    typeof token.iat === "number" &&
    typeof token.exp === "number"
  );
}

export function decodeToken(token: string): DecodedToken | null {
  if (!token) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  const payload = decodePayload(parts[1]);
  if (!payload || !isValidJsonStructure(payload)) {
    return null;
  }

  const parsed = JSON.parse(payload);
  return isDecodedToken(parsed) ? parsed : null;
}

