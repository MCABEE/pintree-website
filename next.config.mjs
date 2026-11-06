const googleWebClientId = process.env.GOOGLE_WEB_CLIENT_ID || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Google's web client ID is public (it is sent to the browser by GIS).
    // Keep the backend name and also expose the Next public name so the
    // sign-in button still receives it after an env reload.
    GOOGLE_WEB_CLIENT_ID: googleWebClientId,
    NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID: googleWebClientId,
  },
};

export default nextConfig;
