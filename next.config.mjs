/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Google's web client ID is public (it is sent to the browser by GIS).
    // Keep the backend name and inline it for the sign-in button.
    GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID,
  },
};

export default nextConfig;
