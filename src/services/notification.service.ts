import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTIFICATION_ID_KEY = "@mood_weather:notification_id";
const NOTIFICATION_ENABLED_KEY = "@mood_weather:notifications_enabled";
const NOTIFICATION_TIME_KEY = "@mood_weather:notification_time";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === "granted";
  } catch (error) {
    console.error("Error requesting notification permissions:", error);
    return false;
  }
}

/**
 * Schedule daily mood reminder notification
 */
export async function scheduleDailyNotification(
  hour: number,
  minute: number,
): Promise<string | null> {
  try {
    // Cancel previous notification if exists
    await cancelDailyNotification();

    // Schedule new notification with daily trigger
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "How are you feeling today? 🌤️",
        body: "Time to log your mood!",
        data: {
          screen: "MoodEntry",
          type: "daily_reminder",
        },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hour,
        minute: minute,
        repeats: true,
      } as Notifications.DailyTriggerInput,
    });

    // Save notification ID for later cancellation
    await AsyncStorage.setItem(NOTIFICATION_ID_KEY, notificationId);

    console.log(
      `Notification scheduled for ${hour}:${minute} - ID: ${notificationId}`,
    );
    return notificationId;
  } catch (error) {
    console.error("Error scheduling notification:", error);
    return null;
  }
}

/**
 * Cancel existing daily notification
 */
export async function cancelDailyNotification(): Promise<void> {
  try {
    const notificationId = await AsyncStorage.getItem(NOTIFICATION_ID_KEY);

    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      await AsyncStorage.removeItem(NOTIFICATION_ID_KEY);
      console.log("Notification cancelled");
    }
  } catch (error) {
    console.error("Error cancelling notification:", error);
  }
}

/**
 * Get scheduled notification if exists
 */
export async function getScheduledNotification(): Promise<Notifications.NotificationRequest | null> {
  try {
    const notificationId = await AsyncStorage.getItem(NOTIFICATION_ID_KEY);

    if (notificationId) {
      const allScheduled =
        await Notifications.getAllScheduledNotificationsAsync();
      return allScheduled.find((n) => n.identifier === notificationId) || null;
    }

    return null;
  } catch (error) {
    console.error("Error getting scheduled notification:", error);
    return null;
  }
}

/**
 * Save notification settings
 */
export async function saveNotificationSettings(
  enabled: boolean,
  time: Date,
): Promise<void> {
  try {
    await AsyncStorage.setItem(NOTIFICATION_ENABLED_KEY, enabled.toString());
    await AsyncStorage.setItem(NOTIFICATION_TIME_KEY, time.toISOString());
  } catch (error) {
    console.error("Error saving notification settings:", error);
  }
}

/**
 * Get saved notification settings
 */
export async function getNotificationSettings(): Promise<{
  enabled: boolean;
  time: Date;
}> {
  try {
    const enabled = await AsyncStorage.getItem(NOTIFICATION_ENABLED_KEY);
    const savedTime = await AsyncStorage.getItem(NOTIFICATION_TIME_KEY);

    const time = savedTime ? new Date(savedTime) : new Date();
    // Default to 9:30 AM if no time saved
    if (!savedTime) {
      time.setHours(9, 30, 0, 0);
    }

    return {
      enabled: enabled === "true",
      time,
    };
  } catch (error) {
    console.error("Error getting notification settings:", error);
    const defaultTime = new Date();
    defaultTime.setHours(9, 30, 0, 0);
    return {
      enabled: false,
      time: defaultTime,
    };
  }
}

/**
 * Restore notification schedule on app start
 */
export async function restoreNotificationSettings(): Promise<void> {
  try {
    const settings = await getNotificationSettings();

    if (settings.enabled) {
      // Check if permission is still granted
      const hasPermission = await requestNotificationPermissions();

      if (hasPermission) {
        await scheduleDailyNotification(
          settings.time.getHours(),
          settings.time.getMinutes(),
        );
      } else {
        // Permission revoked, disable notifications
        await saveNotificationSettings(false, settings.time);
      }
    }
  } catch (error) {
    console.error("Error restoring notification settings:", error);
  }
}

/**
 * Send test notification immediately
 */
export async function sendTestNotification(): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification 🌤️",
        body: "Your daily mood reminder is working!",
        data: {
          screen: "MoodEntry",
          type: "test",
        },
        sound: true,
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.error("Error sending test notification:", error);
    throw error;
  }
}
