import { Request } from 'express';

/**
 * ✅ Extracts API version (e.g., `v1`, `v2`, `v99`) from request URL.
 * ✅ Defaults to `v1` if no version is found.
 */
export const getApiVersionFromRequest = (req: Request): string => {
  const match = req.originalUrl.match(/\/api\/(v\d+)\//);
  return match ? match[1] : 'v1';
};
