/**
 * Android/iOS runtime permissions.
 *
 * Declaring a permission in AndroidManifest.xml is NOT enough — Android 6+
 * requires asking the user at runtime. This requests everything FloraIQ needs
 * so the camera, GPS tagging, and care reminders work in the installed app.
 *
 * Safe on web: every call is a no-op unless running natively.
 */
import { Capacitor } from "@capacitor/core";
import { Camera } from "@capacitor/camera";
import { Geolocation } from "@capacitor/geolocation";
import { LocalNotifications } from "@capacitor/local-notifications";

export interface PermissionReport {
  camera: string;
  photos: string;
  location: string;
  notifications: string;
  microphone: string;
}

/** Ask for one permission without ever throwing. */
async function safe(label: string, fn: () => Promise<string>): Promise<string> {
  try {
    return await fn();
  } catch (e: any) {
    console.warn(`[permissions] ${label} failed:`, e?.message ?? e);
    return "error";
  }
}

/**
 * Request every permission the app needs. Call once on app start (native only).
 * Returns a report so the UI can explain anything the user denied.
 */
export async function requestAllPermissions(): Promise<PermissionReport | null> {
  if (!Capacitor.isNativePlatform()) return null;

  // Camera + photo library (scanning is the core feature)
  const cam = await safe("camera", async () => {
    const status = await Camera.checkPermissions();
    if (status.camera === "granted" && status.photos === "granted") {
      return `${status.camera}/${status.photos}`;
    }
    const req = await Camera.requestPermissions({ permissions: ["camera", "photos"] });
    return `${req.camera}/${req.photos}`;
  });

  // Location — GPS-tags scans, powers nearby species + local weather
  const loc = await safe("location", async () => {
    const status = await Geolocation.checkPermissions();
    if (status.location === "granted") return status.location;
    const req = await Geolocation.requestPermissions({ permissions: ["location"] });
    return req.location;
  });

  // Notifications — watering and care reminders
  const notif = await safe("notifications", async () => {
    const status = await LocalNotifications.checkPermissions();
    if (status.display === "granted") return status.display;
    const req = await LocalNotifications.requestPermissions();
    return req.display;
  });

  // Microphone — Sound ID (bird/insect calls). Uses the web API, which
  // triggers the native prompt inside the WebView.
  const mic = await safe("microphone", async () => {
    if (!navigator.mediaDevices?.getUserMedia) return "unavailable";
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(t => t.stop()); // release immediately
    return "granted";
  });

  const [camera, photos] = cam.includes("/") ? cam.split("/") : [cam, cam];
  const report: PermissionReport = {
    camera,
    photos,
    location: loc,
    notifications: notif,
    microphone: mic,
  };
  console.info("[permissions]", report);
  return report;
}

/** Ask for a single permission on demand (e.g. right before recording audio). */
export async function ensureMicrophone(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(t => t.stop());
    return true;
  } catch {
    return false;
  }
}
