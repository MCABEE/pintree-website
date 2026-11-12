/**
 * Central API configuration module.
 * Sourced from environment variables with production defaults.
 */

export const USER_API_BASE =
  process.env.NEXT_PUBLIC_USER_API_URL ||
  process.env.USER_API_URL ||
  "https://dev.user.pintree.co/v1";

export const PLACES_API_BASE =
  process.env.NEXT_PUBLIC_PLACES_API_URL ||
  process.env.PLACES_API_URL ||
  "https://api.places.mcabee.in/v1";

