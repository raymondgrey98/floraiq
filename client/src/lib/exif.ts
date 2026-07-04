/**
 * Photo metadata extraction for the scan pipeline.
 *
 * When a user uploads a photo from storage (instead of the live camera),
 * the photo's own EXIF record is the truthful provenance: where and when it
 * was actually taken (e.g. a national park visited last week), not where the
 * user happens to be standing now. Using device geolocation for gallery
 * uploads would systematically mislabel observations and bias any dataset
 * built from them.
 *
 * Android note: reading unredacted GPS EXIF from the media store requires
 * the ACCESS_MEDIA_LOCATION permission (declared in AndroidManifest.xml).
 * Without it, Android 10+ strips location from picked images and we fall
 * back to device geolocation.
 */
import exifr from "exifr";

export interface PhotoMeta {
  latitude: number;
  longitude: number;
  takenAt?: string;      // ISO-8601 capture timestamp when present
  source: "photo-exif";
}

export async function extractPhotoMeta(file: Blob): Promise<PhotoMeta | null> {
  try {
    const gps = await exifr.gps(file);
    if (!gps || typeof gps.latitude !== "number" || typeof gps.longitude !== "number") {
      return null;
    }
    // Reject null-island and out-of-range values from broken writers
    if (
      (gps.latitude === 0 && gps.longitude === 0) ||
      Math.abs(gps.latitude) > 90 ||
      Math.abs(gps.longitude) > 180
    ) {
      return null;
    }

    let takenAt: string | undefined;
    try {
      const tags = await exifr.parse(file, ["DateTimeOriginal", "CreateDate"]);
      const stamp: unknown = tags?.DateTimeOriginal ?? tags?.CreateDate;
      if (stamp instanceof Date && !isNaN(stamp.getTime())) {
        takenAt = stamp.toISOString();
      }
    } catch { /* timestamp is optional */ }

    return {
      latitude: gps.latitude,
      longitude: gps.longitude,
      takenAt,
      source: "photo-exif",
    };
  } catch {
    return null; // no EXIF, unsupported format, or redacted by the OS
  }
}
