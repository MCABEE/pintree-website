export function getDeviceInfo() {
  if (typeof window === "undefined") {
    return {
      deviceId: "web-client",
      deviceName: "Web Browser",
      platform: "web",
      osVersion: "1.0",
      appVersion: "1.0.0",
      fcmToken: "web",
    };
  }

  let deviceId = "web-client";
  try {
    deviceId = localStorage.getItem("pintree_device_id") || "";
    if (!deviceId) {
      deviceId =
        "web-" +
        Math.random().toString(36).substring(2, 11) +
        Date.now().toString(36);
      localStorage.setItem("pintree_device_id", deviceId);
    }
  } catch {
    deviceId = "web-" + Date.now();
  }

  return {
    deviceId,
    deviceName: navigator.userAgent.includes("Chrome")
      ? "Chrome Browser"
      : navigator.userAgent.includes("Safari")
        ? "Safari Browser"
        : navigator.userAgent.includes("Firefox")
          ? "Firefox Browser"
          : "Web Browser",
    platform: "web",
    osVersion: navigator.platform || "Web",
    appVersion: "1.0.0",
    fcmToken: "web",
  };
}
