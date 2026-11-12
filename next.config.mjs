const googleWebClientId = process.env.GOOGLE_WEB_CLIENT_ID || "";
const userApiUrl =
  process.env.NEXT_PUBLIC_USER_API_URL ||
  process.env.USER_API_URL ||
  "https://dev.user.pintree.co/v1";
const placesApiUrl =
  process.env.NEXT_PUBLIC_PLACES_API_URL ||
  process.env.PLACES_API_URL ||
  "https://api.places.mcabee.in/v1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Google's web client ID is public (it is sent to the browser by GIS).
    // Keep the backend name and also expose the Next public name so the
    // sign-in button still receives it after an env reload.
    GOOGLE_WEB_CLIENT_ID: googleWebClientId,
    NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID: googleWebClientId,
    USER_API_URL: userApiUrl,
    NEXT_PUBLIC_USER_API_URL: userApiUrl,
    PLACES_API_URL: placesApiUrl,
    NEXT_PUBLIC_PLACES_API_URL: placesApiUrl,
  },
};

export default nextConfig;
