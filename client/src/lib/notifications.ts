// Notification utility — wraps @capacitor/local-notifications with graceful web fallback

async function getCap() {
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    const { Capacitor } = await import("@capacitor/core");
    return Capacitor.isNativePlatform() ? LocalNotifications : null;
  } catch {
    return null;
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  const LN = await getCap();
  if (!LN) {
    // Web — use browser Notification API
    if (!("Notification" in window)) return false;
    const result = await Notification.requestPermission();
    return result === "granted";
  }
  const { display } = await LN.requestPermissions();
  return display === "granted";
}

export async function scheduleWaterReminder(opts: {
  id: number;
  plantName: string;
  daysFromNow: number;
}) {
  const LN = await getCap();
  const fireAt = new Date();
  fireAt.setDate(fireAt.getDate() + opts.daysFromNow);
  fireAt.setHours(8, 0, 0, 0); // 8 AM on the due day

  if (LN) {
    await LN.schedule({
      notifications: [{
        id: opts.id,
        title: "Time to water! 💧",
        body: `${opts.plantName} needs watering today. Don't let it dry out!`,
        schedule: { at: fireAt, allowWhileIdle: true },
        sound: "default",
        smallIcon: "ic_launcher",
        iconColor: "#22c55e",
        extra: { plantId: opts.id },
      }],
    });
  } else if (Notification.permission === "granted") {
    // Web fallback — show immediately with delay note
    new Notification("FloraIQ Water Reminder 💧", {
      body: `${opts.plantName} needs watering in ${opts.daysFromNow} day${opts.daysFromNow !== 1 ? "s" : ""}.`,
      icon: "/assets/logo/icon-192.png",
    });
  }
}

export async function cancelNotification(id: number) {
  const LN = await getCap();
  if (LN) {
    await LN.cancel({ notifications: [{ id }] });
  }
}

export async function cancelAllNotifications() {
  const LN = await getCap();
  if (LN) {
    const pending = await LN.getPending();
    if (pending.notifications.length) {
      await LN.cancel({ notifications: pending.notifications });
    }
  }
}

export async function sendImmediateNotification(title: string, body: string) {
  const LN = await getCap();
  if (LN) {
    await LN.schedule({
      notifications: [{
        id: Math.floor(Math.random() * 999999),
        title,
        body,
        schedule: { at: new Date(Date.now() + 1000) },
        sound: "default",
        smallIcon: "ic_launcher",
        iconColor: "#22c55e",
      }],
    });
  } else if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body, icon: "/assets/logo/icon-192.png" });
  }
}
