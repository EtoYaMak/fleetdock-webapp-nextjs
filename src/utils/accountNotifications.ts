// utils/accountNotifications.js
import { createNotification } from "@/hooks/useNotifications";
import { NotificationTypes } from "@/types/notificationTypes";

export const notifyAccountVerification = async (userId: string) => {
  await createNotification(
    userId,
    NotificationTypes.ACCOUNT_VERIFICATION,
    "Your account has been successfully verified.",
    null,
    null
  );
};

export const notifyPasswordChange = async (userId: string) => {
  await createNotification(
    userId,
    NotificationTypes.PASSWORD_CHANGE,
    "Your password has been changed successfully.",
    null,
    null
  );
};

export const notifyProfileUpdate = async (userId: string) => {
  await createNotification(
    userId,
    NotificationTypes.PROFILE_UPDATE,
    "Your profile information has been updated.",
    null,
    null
  );
};

export const notifySecurityAlert = async (userId: string) => {
  await createNotification(
    userId,
    NotificationTypes.SECURITY_ALERT,
    "Suspicious login attempt detected on your account.",
    null,
    null
  );
};
